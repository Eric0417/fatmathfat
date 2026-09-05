from datetime import timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.auth import (
    create_access_token,
    generate_verification_code,
    get_current_user,
    hash_verification_code,
    matches_school_email,
    matches_student_email,
    normalize_email,
    role_for_email,
    utc_now,
)
from app.config import settings
from app.database import get_db
from app.models import AuthCode, TeacherAllowlist, User
from app.rate_limit import global_otp_limiter, ip_otp_limiter, otp_email_limiter
from app.schemas import (
    MessageResponse,
    RequestCodeRequest,
    TokenResponse,
    UserResponse,
    VerifyCodeRequest,
)
from app.services.emailer import send_verification_email

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _allowed_email(db: Session, email: str) -> bool:
    if matches_school_email(email):
        return True
    return (
        db.query(TeacherAllowlist)
        .filter(TeacherAllowlist.email == email)
        .first()
        is not None
    )


@router.post("/request-code", response_model=MessageResponse)
def request_code(
    request: Request,
    body: RequestCodeRequest,
    db: Session = Depends(get_db),
):
    email = normalize_email(body.email)
    client_ip = request.client.host if request.client else "unknown"
    ip_otp_limiter.check_and_record(client_ip)
    global_otp_limiter.check_and_record("global")
    otp_email_limiter.check_and_record(email)

    if not _allowed_email(db, email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="此郵箱不在允許範圍。",
        )

    existing = (
        db.query(AuthCode)
        .filter(AuthCode.email == email)
        .first()
    )
    if existing and existing.last_request_at and (
        utc_now() - existing.last_request_at.replace(tzinfo=utc_now().tzinfo)
    ) < timedelta(seconds=30):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="請稍候再重新寄送驗證碼。",
        )

    code = generate_verification_code()
    salt = secrets.token_hex(16)
    code_hash = hash_verification_code(email, code, salt)
    now = utc_now()
    expires_at = now + timedelta(minutes=5)

    if existing:
        existing.code_hash = code_hash
        existing.salt = salt
        existing.expires_at = expires_at
        existing.attempts = 0
        existing.last_request_at = now
    else:
        db.add(
            AuthCode(
                email=email,
                code_hash=code_hash,
                salt=salt,
                expires_at=expires_at,
                attempts=0,
                last_request_at=now,
            )
        )
    db.commit()

    is_student = matches_student_email(email)
    if not send_verification_email(
        email,
        code,
        plain_only=not is_student,
        sender_email=(
            None if is_student else settings.TEACHER_EMAIL_FROM
        ),
        sender_password=(
            None if is_student else settings.TEACHER_GMAIL_APP_PASSWORD
        ),
    ):
        stored = (
            db.query(AuthCode)
            .filter(AuthCode.email == email)
            .first()
        )
        if stored:
            db.delete(stored)
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="驗證碼郵件暫時無法送出，請稍後再試。",
        )

    return MessageResponse(message="驗證碼已寄出，請檢查郵箱。")


@router.post("/verify-code", response_model=TokenResponse)
def verify_code(body: VerifyCodeRequest, db: Session = Depends(get_db)):
    email = normalize_email(body.email)
    if not _allowed_email(db, email):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="此郵箱不在允許範圍。",
        )

    auth_code = (
        db.query(AuthCode)
        .filter(AuthCode.email == email)
        .first()
    )
    if auth_code is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="請先取得驗證碼。",
        )

    if auth_code.expires_at.replace(tzinfo=utc_now().tzinfo) < utc_now():
        db.delete(auth_code)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="驗證碼已過期，請重新取得。",
        )

    if auth_code.attempts >= 3:
        db.delete(auth_code)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="驗證碼嘗試次數過多，請重新取得。",
        )

    from hmac import compare_digest

    expected = hash_verification_code(email, body.code, auth_code.salt)
    if not compare_digest(expected, auth_code.code_hash):
        auth_code.attempts += 1
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="驗證碼不正確。",
        )

    role = role_for_email(db, email)
    if role is None:
        db.delete(auth_code)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="此郵箱未授權。",
        )

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        user = User(
            email=email,
            role=role,
            student_number=email.split("@")[0] if role == "student" else None,
            last_login_at=utc_now(),
            last_seen_at=utc_now(),
        )
        db.add(user)
    else:
        if user.role == "teacher" and role != "teacher":
            db.delete(auth_code)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="管理員權限已移除。",
            )
        if role == "teacher":
            user.role = "teacher"
        user.last_login_at = utc_now()
        user.last_seen_at = utc_now()

    db.delete(auth_code)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/logout", response_model=MessageResponse)
def logout(_: User = Depends(get_current_user)):
    return MessageResponse(message="已登出。")
