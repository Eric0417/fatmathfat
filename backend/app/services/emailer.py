import smtplib
import ssl
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


def send_email(to: str, subject: str, html_body: str) -> bool:
    if settings.RESEND_API_KEY:
        return _send_via_resend(to, subject, html_body)

    from_addr = settings.EMAIL_FROM.strip()
    app_password = "".join(settings.GMAIL_APP_PASSWORD.split())

    if not from_addr or not app_password:
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

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


def _send_via_resend(to: str, subject: str, html_body: str) -> bool:
    api_key = settings.RESEND_API_KEY.strip()
    from_addr = settings.RESEND_FROM.strip() or settings.EMAIL_FROM.strip()
    if not api_key or not from_addr:
        return False

    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_addr,
                "to": [to],
                "subject": subject,
                "html": html_body,
            },
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
