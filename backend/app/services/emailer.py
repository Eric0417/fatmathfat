import smtplib
import ssl
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.config import settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html_body: str) -> bool:
    from_addr = settings.EMAIL_FROM.strip()
    app_password = "".join(settings.GMAIL_APP_PASSWORD.split())

    if not from_addr or not app_password:
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            context=context,
            timeout=settings.SMTP_TIMEOUT_SECONDS,
        ) as server:
            server.login(from_addr, app_password)
            server.sendmail(from_addr, to, msg.as_string())
        return True
    except Exception as exc:
        logger.warning("Email send failed for %s: %s", to, exc)
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
