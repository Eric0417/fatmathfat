from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user, utc_now
from app.database import get_db
from app.models import (
    LessonProgress,
    PracticeProgress,
    QuizAttempt,
    User,
)
from app.schemas import (
    LessonProgressEntry,
    LessonProgressRequest,
    PracticeProgressRequest,
    PracticeProgressResponse,
    ProgressResponse,
    QuizAttemptCreate,
    QuizAttemptResponse,
    UserResponse,
)

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("", response_model=ProgressResponse)
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    completed = (
        db.query(LessonProgress)
        .filter(LessonProgress.user_id == current_user.id)
        .order_by(LessonProgress.completed_at.desc())
        .all()
    )
    practices = (
        db.query(PracticeProgress)
        .filter(PracticeProgress.user_id == current_user.id)
        .order_by(PracticeProgress.completed_at.desc())
        .all()
    )
    quizzes = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.completed_at.desc())
        .all()
    )
    return ProgressResponse(
        user=UserResponse.model_validate(current_user),
        completed_lessons=[
            LessonProgressEntry(
                lesson_id=item.lesson_id,
                completed_at=item.completed_at,
            )
            for item in completed
        ],
        last_lesson=current_user.last_lesson,
        practice_progress=[
            PracticeProgressResponse.model_validate(item) for item in practices
        ],
        quiz_attempts=[
            QuizAttemptResponse.model_validate(item) for item in quizzes
        ],
    )


@router.post("/lessons", response_model=ProgressResponse)
def save_lesson(
    body: LessonProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    lesson_id = body.lesson_id.strip()
    if not lesson_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lesson ID is required.",
        )

    if body.mark_complete:
        exists = (
            db.query(LessonProgress)
            .filter(
                LessonProgress.user_id == current_user.id,
                LessonProgress.lesson_id == lesson_id,
            )
            .first()
        )
        if exists is None:
            db.add(
                LessonProgress(
                    user_id=current_user.id,
                    lesson_id=lesson_id,
                )
            )

    current_user.last_lesson = lesson_id
    db.commit()
    return get_progress(current_user=current_user, db=db)


@router.post("/practice", response_model=PracticeProgressResponse, status_code=201)
def save_practice(
    body: PracticeProgressRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    practice = PracticeProgress(
        user_id=current_user.id,
        source=body.source,
        topic=body.topic,
        correct=body.correct,
        total=body.total,
        duration_ms=body.duration_ms,
    )
    db.add(practice)
    db.commit()
    db.refresh(practice)
    return practice


@router.post("/quiz", response_model=QuizAttemptResponse, status_code=201)
def save_quiz(
    body: QuizAttemptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    completed_at = body.completed_at or utc_now()
    if isinstance(completed_at, datetime) and completed_at.tzinfo is None:
        completed_at = completed_at.replace(tzinfo=utc_now().tzinfo)

    attempt = QuizAttempt(
        user_id=current_user.id,
        completed_at=completed_at,
        score=body.score,
        correct=body.correct,
        total=body.total,
        duration_ms=body.duration_ms,
        topic_scores=body.topic_scores,
        mistakes=[item.model_dump() for item in body.mistakes],
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt


@router.delete("", response_model=ProgressResponse)
def clear_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(LessonProgress).filter(
        LessonProgress.user_id == current_user.id
    ).delete()
    db.query(PracticeProgress).filter(
        PracticeProgress.user_id == current_user.id
    ).delete()
    db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).delete()
    current_user.last_lesson = None
    db.commit()
    return get_progress(current_user=current_user, db=db)
