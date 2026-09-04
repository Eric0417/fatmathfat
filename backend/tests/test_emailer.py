from app.config import settings
from app.services.emailer import send_email


def test_resend_is_used_when_api_key_is_set(monkeypatch):
    class FakeResponse:
        status_code = 200
        text = "ok"

    monkeypatch.setattr(settings, "RESEND_API_KEY", "test-resend-key")
    monkeypatch.setattr("app.services.emailer.httpx.post", lambda *args, **kwargs: FakeResponse())

    assert send_email("student@example.com", "Test", "<p>Test</p>") is True
