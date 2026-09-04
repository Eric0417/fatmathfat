import smtplib
import ssl
import base64
import logging
import socket
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import httpx

from app.config import settings

logger = logging.getLogger(__name__)
_original_getaddrinfo = socket.getaddrinfo


def _ipv4_getaddrinfo(host, port, *args, **kwargs):
    results = _original_getaddrinfo(host, port, *args, **kwargs)
    ipv4 = [result for result in results if result[0] == socket.AF_INET]
    return ipv4 or results


def _build_message(from_addr: str, to: str, subject: str, html_body: str) -> MIMEMultipart:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))
    return msg


def _get_gmail_access_token() -> str | None:
    if (
        not settings.GOOGLE_CLIENT_ID
        or not settings.GOOGLE_CLIENT_SECRET
        or not settings.GOOGLE_REFRESH_TOKEN
    ):
        return None
    try:
        response = httpx.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "refresh_token": settings.GOOGLE_REFRESH_TOKEN,
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


def _send_via_gmail_api(to: str, subject: str, html_body: str) -> bool:
    from_addr = settings.EMAIL_FROM.strip()
    access_token = _get_gmail_access_token()
    if not from_addr or not access_token:
        return False

    message = _build_message(from_addr, to, subject, html_body)
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


def send_email(to: str, subject: str, html_body: str) -> bool:
    if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
        sent = _send_via_gmail_api(to, subject, html_body)
        if sent:
            return True

    from_addr = settings.EMAIL_FROM.strip()
    app_password = "".join(settings.GMAIL_APP_PASSWORD.split())

    if not from_addr or not app_password:
        return False

    msg = _build_message(from_addr, to, subject, html_body)

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


def send_verification_email(to: str, code: str) -> bool:
    subject = "集合好好學 - 登入驗證碼"
    html = f"""<div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif">
<h2 style="color:#183153">集合好好學</h2>
<p>你的登入驗證碼是：</p>
<div style="background:#f4f7f4;border:2px solid #183153;border-radius:8px;padding:20px;text-align:center;margin:24px 0">
  <span style="font-size:36px;font-weight:bold;color:#183153;letter-spacing:12px">{code}</span>
</div>
<p style="color:#5f6f7e;font-size:14px">驗證碼 5 分鐘後失效。如果這不是你發出的請求，請忽略此郵件。</p>
</div>"""
    return send_email(to, subject, html)
