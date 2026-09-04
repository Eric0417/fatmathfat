from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_teacher_user
from app.config import settings
from app.database import get_db
from app.models import (
    LessonProgress,
    PracticeProgress,
    QuizAttempt,
    TeacherAllowlist,
    User,
)
from app.schemas import (
    AdminLearningDataResponse,
    AdminStudentResponse,
    MessageResponse,
    TeacherAddRequest,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _latest_quiz(user: User, db: Session) -> dict | None:
    attempt = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user.id)
        .order_by(QuizAttempt.completed_at.desc())
        .first()
    )
    if attempt is None:
        return None
    return {
        "id": attempt.id,
        "completed_at": attempt.completed_at.isoformat(),
        "score": attempt.score,
        "correct": attempt.correct,
        "total": attempt.total,
        "duration_ms": attempt.duration_ms,
        "topic_scores": attempt.topic_scores,
        "mistakes": attempt.mistakes,
    }


def _student_response(user: User, db: Session) -> AdminStudentResponse:
    lessons = [
        item.lesson_id
        for item in db.query(LessonProgress)
        .filter(LessonProgress.user_id == user.id)
        .all()
    ]
    practice_count = (
        db.query(PracticeProgress)
        .filter(PracticeProgress.user_id == user.id)
        .count()
    )
    quiz_count = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user.id)
        .count()
    )
    return AdminStudentResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        last_login_at=user.last_login_at,
        last_seen_at=user.last_seen_at,
        completed_lessons=lessons,
        practice_count=practice_count,
        quiz_count=quiz_count,
        latest_quiz=_latest_quiz(user, db),
    )


@router.get("/students", response_model=AdminLearningDataResponse)
def list_students(
    _admin: User = Depends(get_teacher_user),
    db: Session = Depends(get_db),
):
    users = (
        db.query(User)
        .filter(User.role == "student")
        .order_by(User.created_at.desc())
        .all()
    )
    students = [_student_response(user, db) for user in users]
    return AdminLearningDataResponse(
        students=students,
        total_students=len(students),
    )


@router.get("/learning-data", response_model=AdminLearningDataResponse)
def get_learning_data(
    _admin: User = Depends(get_teacher_user),
    db: Session = Depends(get_db),
):
    return list_students(_admin, db)


@router.get("/teachers", response_model=list[str])
def list_teachers(
    _admin: User = Depends(get_teacher_user),
    db: Session = Depends(get_db),
):
    allowlist = [
        item.email
        for item in db.query(TeacherAllowlist)
        .order_by(TeacherAllowlist.created_at.desc())
        .all()
    ]
    users = [
        item.email
        for item in db.query(User)
        .filter(User.role == "teacher")
        .order_by(User.created_at.desc())
        .all()
    ]
    return list(dict.fromkeys(allowlist + users))


@router.post("/teachers", response_model=MessageResponse, status_code=201)
def add_teacher(
    body: TeacherAddRequest,
    admin: User = Depends(get_teacher_user),
    db: Session = Depends(get_db),
):
    email = body.email.strip().lower()
    exists = (
        db.query(TeacherAllowlist)
        .filter(TeacherAllowlist.email == email)
        .first()
    )
    if exists is None:
        db.add(
            TeacherAllowlist(
                email=email,
                created_by_email=admin.email,
            )
        )
    user = db.query(User).filter(User.email == email).first()
    if user is not None:
        user.role = "teacher"
    db.commit()
    return MessageResponse(message="已加入管理員。")


@router.delete("/teachers/{email:path}", response_model=MessageResponse)
def remove_teacher(
    email: str,
    _admin: User = Depends(get_teacher_user),
    db: Session = Depends(get_db),
):
    email = email.strip().lower()
    if email in settings.admin_email_list:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="預設管理員不可移除。",
        )

    allowlisted = (
        db.query(TeacherAllowlist)
        .filter(TeacherAllowlist.email == email)
        .first()
    )
    if allowlisted:
        db.delete(allowlisted)
    user = db.query(User).filter(User.email == email).first()
    if user is not None and user.role == "teacher":
        user.role = "student"
    db.commit()
    return MessageResponse(message="已移除管理員。")
