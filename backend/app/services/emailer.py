import smtplib
import ssl
import base64
import logging
import socket
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import make_msgid

import httpx

from app.config import settings
from app.database import SessionLocal
from app.models import EmailCredential

logger = logging.getLogger(__name__)
_original_getaddrinfo = socket.getaddrinfo


def _ipv4_getaddrinfo(host, port, *args, **kwargs):
    results = _original_getaddrinfo(host, port, *args, **kwargs)
    ipv4 = [result for result in results if result[0] == socket.AF_INET]
    return ipv4 or results


def _build_message(
    from_addr: str,
    to: str,
    subject: str,
    html_body: str,
    text_body: str | None = None,
) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    if text_body:
        msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))
    return msg


def _build_plain_message(
    from_addr: str,
    to: str,
    subject: str,
    text_body: str,
) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    msg["Message-ID"] = make_msgid(domain="fatmathfat.onrender.com")
    msg.set_content(text_body)
    return msg


def _get_sender_email() -> str:
    from_addr = settings.EMAIL_FROM.strip()
    if from_addr:
        return from_addr

    db = SessionLocal()
    try:
        credential = (
            db.query(EmailCredential)
            .filter(EmailCredential.id == 1)
            .first()
        )
        return credential.account_email.strip() if credential else ""
    finally:
        db.close()


def _get_gmail_access_token() -> str | None:
    refresh_token = settings.GOOGLE_REFRESH_TOKEN.strip()
    if not refresh_token:
        db = SessionLocal()
        try:
            credential = (
                db.query(EmailCredential)
                .filter(EmailCredential.id == 1)
                .first()
            )
            refresh_token = credential.refresh_token if credential else ""
        finally:
            db.close()

    if (
        not settings.GOOGLE_CLIENT_ID
        or not settings.GOOGLE_CLIENT_SECRET
        or not refresh_token
    ):
        return None
    try:
        response = httpx.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
            timeout=settings.GMAIL_API_TIMEOUT_SECONDS,
        )
        if response.status_code != 200:
            logger.warning(
                "Google OAuth token error: %s %s",
                response.status_code,
                response.text[:300],
            )
            return None
        return str(response.json().get("access_token") or "")
    except Exception as exc:
        logger.warning("Google OAuth token failed: %s", exc)
        return None


def _send_via_gmail_api(
    to: str,
    subject: str,
    html_body: str,
    text_body: str | None = None,
    plain_only: bool = False,
) -> bool:
    from_addr = _get_sender_email()
    access_token = _get_gmail_access_token()
    if not from_addr or not access_token:
        return False

    message = (
        _build_plain_message(from_addr, to, subject, text_body or "")
        if plain_only
        else _build_message(from_addr, to, subject, html_body, text_body)
    )
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("ascii")
    try:
        response = httpx.post(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
            json={"raw": raw_message},
            timeout=settings.GMAIL_API_TIMEOUT_SECONDS,
        )
        if response.status_code not in (200, 201):
            logger.warning(
                "Gmail API error: %s %s",
                response.status_code,
                response.text[:300],
            )
            return False
        return True
    except Exception as exc:
        logger.warning("Gmail API send failed for %s: %s", to, exc)
        return False


def _send_via_resend(
    to: str,
    subject: str,
    html_body: str,
    text_body: str | None = None,
    plain_only: bool = False,
) -> bool:
    api_key = settings.RESEND_API_KEY.strip()
    from_addr = settings.RESEND_FROM.strip() or (
        "onboarding@resend.dev" if api_key else settings.EMAIL_FROM.strip()
    )
    if not api_key or not from_addr:
        return False

    try:
        body = {
            "from": from_addr,
            "to": [to],
            "subject": subject,
        }
        if plain_only:
            body["text"] = text_body
        else:
            body["html"] = html_body
            if text_body:
                body["text"] = text_body
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=body,
            timeout=settings.RESEND_TIMEOUT_SECONDS,
        )
        if response.status_code not in (200, 201):
            logger.warning(
                "Resend API error: %s %s",
                response.status_code,
                response.text[:300],
            )
            return False
        return True
    except Exception as exc:
        logger.warning("Resend send failed for %s: %s", to, exc)
        return False


def send_email(
    to: str,
    subject: str,
    html_body: str,
    text_body: str | None = None,
    plain_only: bool = False,
) -> bool:
    if settings.RESEND_API_KEY:
        sent = _send_via_resend(
            to,
            subject,
            html_body,
            text_body,
            plain_only,
        )
        if sent:
            return True

    if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
        sent = _send_via_gmail_api(
            to,
            subject,
            html_body,
            text_body,
            plain_only,
        )
        if sent:
            return True

    from_addr = settings.EMAIL_FROM.strip()
    app_password = "".join(settings.GMAIL_APP_PASSWORD.split())

    if not from_addr or not app_password:
        return False

    msg = (
        _build_plain_message(from_addr, to, subject, text_body or "")
        if plain_only
        else _build_message(from_addr, to, subject, html_body, text_body)
    )

    original_getaddrinfo = socket.getaddrinfo
    socket.getaddrinfo = _ipv4_getaddrinfo
    try:
        context = ssl.create_default_context()
        addresses = original_getaddrinfo(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            socket.AF_INET,
            socket.SOCK_STREAM,
        )
        logger.info(
            "SMTP IPv4 candidates for %s: %s",
            settings.SMTP_HOST,
            [address[4][0] for address in addresses],
        )
        if settings.SMTP_PORT == 465:
            smtp = smtplib.SMTP_SSL(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                context=context,
                timeout=settings.SMTP_TIMEOUT_SECONDS,
            )
        else:
            smtp = smtplib.SMTP(
                settings.SMTP_HOST,
                settings.SMTP_PORT,
                timeout=settings.SMTP_TIMEOUT_SECONDS,
            )
            smtp.starttls(context=context)
        with smtp as server:
            server.login(from_addr, app_password)
            server.sendmail(from_addr, to, msg.as_string())
        return True
    except Exception as exc:
        logger.warning("Email send failed for %s: %s", to, exc)
        return False
    finally:
        socket.getaddrinfo = original_getaddrinfo


def send_verification_email(
    to: str,
    code: str,
    plain_only: bool = False,
) -> bool:
    subject = "集合好好學 - 登入驗證碼"
    text = f"""集合好好學

你的登入驗證碼是：{code}

驗證碼 5 分鐘後失效。如果這不是你發出的請求，請忽略此郵件。"""
    html = f"""<div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif">
<h2 style="color:#183153">集合好好學</h2>
<p>你的登入驗證碼是：</p>
<div style="background:#f4f7f4;border:2px solid #183153;border-radius:8px;padding:20px;text-align:center;margin:24px 0">
  <span style="font-size:36px;font-weight:bold;color:#183153;letter-spacing:12px">{code}</span>
</div>
<p style="color:#5f6f7e;font-size:14px">驗證碼 5 分鐘後失效。如果這不是你發出的請求，請忽略此郵件。</p>
</div>"""
    return send_email(to, subject, html, text, plain_only=plain_only)
