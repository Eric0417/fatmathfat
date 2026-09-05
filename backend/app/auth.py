from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import re
import secrets

from fastapi import Depends, Header, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import TeacherAllowlist, User


ALGORITHM = "HS256"
STUDENT_EMAIL_DOMAIN = "g.puiching.edu.mo"
TEACHER_EMAIL_DOMAIN = "puiching.edu.mo"
SCHOOL_EMAIL_DOMAINS = frozenset({STUDENT_EMAIL_DOMAIN, TEACHER_EMAIL_DOMAIN})


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def matches_student_email(email: str) -> bool:
    local = email.partition("@")[0]
    return (
        email.partition("@")[2] == STUDENT_EMAIL_DOMAIN
        and re.fullmatch(settings.STUDENT_EMAIL_PATTERN, local) is not None
    )


def matches_school_email(email: str) -> bool:
    return email.partition("@")[2] in SCHOOL_EMAIL_DOMAINS


def generate_verification_code() -> str:
    return str(secrets.randbelow(900000) + 100000)


def hash_verification_code(email: str, code: str, salt: str) -> str:
    digest = hmac.new(
        settings.JWT_SECRET.encode("utf-8"),
        f"{email}:{salt}:{code}".encode("utf-8"),
        hashlib.sha256,
    )
    return digest.hexdigest()


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["exp"] = utc_now() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode["iat"] = utc_now()
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return None


def role_for_email(db: Session, email: str) -> str | None:
    if matches_student_email(email):
        return "student"
    if matches_school_email(email):
        return "teacher"
    allowlisted = (
        db.query(TeacherAllowlist)
        .filter(TeacherAllowlist.email == email)
        .first()
    )
    return "teacher" if allowlisted else None


def get_current_user(
    authorization: str = Header(default=""),
    db: Session = Depends(get_db),
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header.",
        )

    payload = decode_access_token(authorization[7:])
    if payload is None or payload.get("sub") is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session.",
        )

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive.",
        )

    user.last_seen_at = utc_now()
    db.commit()
    return user


def get_teacher_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher access required.",
        )
    return current_user
