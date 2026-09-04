from app.config import settings
from app.services import emailer
from app.services.emailer import _get_sender_email, send_email


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
