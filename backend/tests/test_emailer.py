import email

from app.config import settings
from app.services import emailer
from app.services.emailer import _build_plain_message, _get_sender_email, send_email


def test_gmail_api_is_used_when_oauth_is_configured(monkeypatch):
    class FakeTokenResponse:
        status_code = 200

        def json(self):
            return {"access_token": "fake-access-token"}

    class FakeSendResponse:
        status_code = 200
        text = "ok"

    monkeypatch.setattr(settings, "GOOGLE_CLIENT_ID", "fake-client-id")
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_SECRET", "fake-client-secret")
    monkeypatch.setattr(settings, "GOOGLE_REFRESH_TOKEN", "fake-refresh-token")
    monkeypatch.setattr(settings, "EMAIL_FROM", "sender@gmail.com")

    responses = iter([FakeTokenResponse(), FakeSendResponse()])
    monkeypatch.setattr(
        "app.services.emailer.httpx.post",
        lambda *args, **kwargs: next(responses),
    )

    assert send_email("student@example.com", "Test", "<p>Test</p>") is True


def test_gmail_api_uses_stored_account_email_when_env_is_empty(monkeypatch):
    class FakeCredential:
        account_email = "stored-sender@gmail.com"

    class FakeQuery:
        def filter(self, _condition):
            return self

        def first(self):
            return FakeCredential()

    class FakeSession:
        def query(self, _model):
            return FakeQuery()

        def close(self):
            return None

    monkeypatch.setattr(settings, "EMAIL_FROM", "")
    monkeypatch.setattr(emailer, "SessionLocal", lambda: FakeSession())

    assert _get_sender_email() == "stored-sender@gmail.com"


def test_resend_is_used_when_api_key_is_set(monkeypatch):
    class FakeResponse:
        status_code = 200
        text = "ok"

    payload = {}

    def fake_post(*_args, **kwargs):
        payload.update(kwargs)
        return FakeResponse()

    monkeypatch.setattr(settings, "RESEND_API_KEY", "re_test")
    monkeypatch.setattr(settings, "RESEND_FROM", "")
    monkeypatch.setattr("app.services.emailer.httpx.post", fake_post)

    assert send_email("student@example.com", "Test", "<p>Test</p>") is True
    assert payload["json"]["from"] == "onboarding@resend.dev"


def test_gmail_smtp_uses_ssl_when_oauth_secret_is_missing(monkeypatch):
    calls = {}

    class FakeSMTP:
        def __init__(self, *args, **kwargs):
            calls.update({"args": args, "kwargs": kwargs})

        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def login(self, _email, _password):
            return None

        def sendmail(self, _from, _to, _message):
            return None

    monkeypatch.setattr(settings, "RESEND_API_KEY", "")
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_ID", "client-id")
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_SECRET", "")
    monkeypatch.setattr(settings, "EMAIL_FROM", "sender@gmail.com")
    monkeypatch.setattr(
        settings,
        "GMAIL_APP_PASSWORD",
        "abcd efgh ijkl mnop",
    )
    monkeypatch.setattr(emailer.smtplib, "SMTP_SSL", FakeSMTP)
    monkeypatch.setattr(emailer, "_ipv4_getaddrinfo", lambda *args: [])

    assert send_email("student@example.com", "Test", "<p>Test</p>") is True
    assert calls["args"][1] == 465


def test_plain_verification_email_is_single_text_part(monkeypatch):
    calls = {}

    class FakeSMTP:
        def __init__(self, *args, **kwargs):
            calls.update({"args": args, "kwargs": kwargs})

        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def login(self, _email, _password):
            return None

        def sendmail(self, _from, _to, _message):
            calls["message"] = _message
            return None

    monkeypatch.setattr(settings, "RESEND_API_KEY", "")
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_ID", "")
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_SECRET", "")
    monkeypatch.setattr(settings, "EMAIL_FROM", "sender@gmail.com")
    monkeypatch.setattr(
        settings,
        "GMAIL_APP_PASSWORD",
        "abcd efgh ijkl mnop",
    )
    monkeypatch.setattr(emailer.smtplib, "SMTP_SSL", FakeSMTP)
    monkeypatch.setattr(emailer, "_ipv4_getaddrinfo", lambda *args: [])

    assert (
        send_email(
            "teacher@example.com",
            "集合好好學 - 登入驗證碼",
            "",
            "你的登入驗證碼是：123456",
            plain_only=True,
        )
        is True
    )

    message = email.message_from_string(calls["message"])
    assert message.get_content_type() == "text/plain"
    payload = message.get_payload(decode=True).decode("utf-8")
    assert "你的登入驗證碼是：123456" in payload


def test_build_plain_message_uses_email_message():
    message = _build_plain_message(
        "sender@gmail.com",
        "teacher@example.com",
        "測試",
        "內容",
    )
    assert message.get_content_type() == "text/plain"
    assert message["Message-ID"]
    payload = message.get_payload(decode=True).decode("utf-8")
    assert payload.strip() == "內容"


def test_verification_email_uses_plain_text_for_non_student(monkeypatch):
    captured = {}

    def fake_send(
        to,
        subject,
        html_body,
        text_body=None,
        plain_only=False,
    ):
        captured.update(
            {
                "to": to,
                "subject": subject,
                "html_body": html_body,
                "text_body": text_body,
                "plain_only": plain_only,
            }
        )
        return True

    monkeypatch.setattr(emailer, "send_email", fake_send)

    assert (
        emailer.send_verification_email(
            "teacher@example.com",
            "123456",
            plain_only=True,
        )
        is True
    )
    assert captured["to"] == "teacher@example.com"
    assert captured["subject"] == "集合好好學 - 登入驗證碼"
    assert "你的登入驗證碼是：123456" in captured["text_body"]
    assert captured["plain_only"] is True


def test_verification_email_keeps_html_for_student(monkeypatch):
    captured = {}

    def fake_send(
        to,
        subject,
        html_body,
        text_body=None,
        plain_only=False,
    ):
        captured.update(
            {
                "to": to,
                "subject": subject,
                "html_body": html_body,
                "text_body": text_body,
                "plain_only": plain_only,
            }
        )
        return True

    monkeypatch.setattr(emailer, "send_email", fake_send)

    assert emailer.send_verification_email("1234567-1@example.com", "123456") is True
    assert captured["plain_only"] is False
    assert "你的登入驗證碼是：" in captured["html_body"]
    assert "你的登入驗證碼是：123456" in captured["text_body"]
