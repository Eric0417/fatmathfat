from app.config import settings
from app.services.emailer import send_email


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
