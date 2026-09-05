from datetime import timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user, utc_now
from app.config import settings
from app.database import get_db
from app.models import QuizSession, User
from app.schemas import (
    MessageResponse,
    QuizSessionActionRequest,
    QuizSessionResponse,
    QuizSessionStatusResponse,
)

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


def _session_expired(session: QuizSession, now=None) -> bool:
    now = now or utc_now()
    if session.started_at.tzinfo is None:
        started_at = session.started_at.replace(tzinfo=now.tzinfo)
    else:
        started_at = session.started_at
    return now - started_at > timedelta(
        minutes=settings.QUIZ_SESSION_TTL_MINUTES
    )


def _owned_session(
    db: Session,
    session_id: str,
    user_id: int,
) -> QuizSession:
    session = (
        db.query(QuizSession)
        .filter(QuizSession.id == session_id, QuizSession.user_id == user_id)
        .first()
    )
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="找不到這個測驗 session。",
        )
    return session


@router.post(
    "/start",
    response_model=QuizSessionResponse,
    status_code=201,
)
def start_quiz(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(QuizSession).filter(
        QuizSession.user_id == current_user.id,
        QuizSession.status == "active",
    ).update({"status": "cancelled"}, synchronize_session=False)

    session_id = secrets.token_urlsafe(24)
    db.add(
        QuizSession(
            id=session_id,
            user_id=current_user.id,
            status="active",
            started_at=utc_now(),
        )
    )
    db.commit()
    return QuizSessionResponse(quiz_session_id=session_id)


@router.post("/finish", response_model=MessageResponse)
def finish_quiz(
    body: QuizSessionActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = _owned_session(db, body.quiz_session_id, current_user.id)
    if session.status != "active":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="這個測驗 session 已結束。",
        )
    if _session_expired(session):
        session.status = "cancelled"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="這個測驗 session 已過期。",
        )
    session.status = "finished"
    session.finished_at = utc_now()
    db.commit()
    return MessageResponse(message="測驗 session 已完成。")


@router.post("/cancel", response_model=MessageResponse)
def cancel_quiz(
    body: QuizSessionActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = _owned_session(db, body.quiz_session_id, current_user.id)
    if session.status == "active":
        session.status = "cancelled"
        session.finished_at = utc_now()
        db.commit()
    return MessageResponse(message="測驗 session 已取消。")


@router.get("/active", response_model=QuizSessionStatusResponse | None)
def active_quiz(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(QuizSession)
        .filter(
            QuizSession.user_id == current_user.id,
            QuizSession.status == "active",
        )
        .order_by(QuizSession.started_at.desc())
        .first()
    )
    if session is None:
        return None
    if _session_expired(session):
        session.status = "cancelled"
        db.commit()
        return None
    return QuizSessionStatusResponse(
        quiz_session_id=session.id,
        status=session.status,
    )
