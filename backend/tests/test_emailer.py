import email

from app.config import settings
from app.services import emailer
from app.services.emailer import _build_plain_message, send_email


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


def test_send_email_uses_explicit_teacher_sender(monkeypatch):
    calls = {}

    class FakeSMTP:
        def __init__(self, *args, **kwargs):
            calls["args"] = args

        def __enter__(self):
            return self

        def __exit__(self, *_args):
            return False

        def login(self, _email, _password):
            calls["login"] = (_email, _password)
            return None

        def sendmail(self, _from, _to, _message):
            calls["sendmail"] = (_from, _to, _message)
            return None

    monkeypatch.setattr(settings, "RESEND_API_KEY", "")
    monkeypatch.setattr(settings, "EMAIL_FROM", "bot012223333@gmail.com")
    monkeypatch.setattr(
        settings,
        "GMAIL_APP_PASSWORD",
        "bot-app-password",
    )
    monkeypatch.setattr(emailer.smtplib, "SMTP_SSL", FakeSMTP)
    monkeypatch.setattr(emailer, "_ipv4_getaddrinfo", lambda *args: [])

    assert (
        send_email(
            "teacher@example.com",
            "Test",
            "<p>Test</p>",
            text_body="plain",
            sender_email="wongeric1417@gmail.com",
            sender_password="teacher-app-password",
        )
        is True
    )

    assert calls["login"] == (
        "wongeric1417@gmail.com",
        "teacher-app-password",
    )
    assert calls["sendmail"][0] == "wongeric1417@gmail.com"
    assert "From: wongeric1417@gmail.com" in calls["sendmail"][2]


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
        sender_email=None,
        sender_password=None,
    ):
        captured.update(
            {
                "to": to,
                "subject": subject,
                "html_body": html_body,
                "text_body": text_body,
                "plain_only": plain_only,
                "sender_email": sender_email,
                "sender_password": sender_password,
            }
        )
        return True

    monkeypatch.setattr(emailer, "send_email", fake_send)

    assert (
        emailer.send_verification_email(
            "teacher@example.com",
            "123456",
            plain_only=True,
            sender_email="wongeric1417@gmail.com",
            sender_password="teacher-app-password",
        )
        is True
    )
    assert captured["to"] == "teacher@example.com"
    assert captured["subject"] == "集合好好學 - 登入驗證碼"
    assert "你的登入驗證碼是：123456" in captured["text_body"]
    assert captured["plain_only"] is True
    assert captured["sender_email"] == "wongeric1417@gmail.com"
    assert captured["sender_password"] == "teacher-app-password"


def test_verification_email_keeps_html_for_student(monkeypatch):
    captured = {}

    def fake_send(
        to,
        subject,
        html_body,
        text_body=None,
        plain_only=False,
        sender_email=None,
        sender_password=None,
    ):
        captured.update(
            {
                "to": to,
                "subject": subject,
                "html_body": html_body,
                "text_body": text_body,
                "plain_only": plain_only,
                "sender_email": sender_email,
                "sender_password": sender_password,
            }
        )
        return True

    monkeypatch.setattr(emailer, "send_email", fake_send)

    assert emailer.send_verification_email("1234567-1@example.com", "123456") is True
    assert captured["plain_only"] is False
    assert captured["sender_email"] is None
    assert captured["sender_password"] is None
    assert "你的登入驗證碼是：" in captured["html_body"]
    assert "你的登入驗證碼是：123456" in captured["text_body"]
