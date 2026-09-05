import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_mathfatfat.db")
os.environ.setdefault("JWT_SECRET", "test-secret-not-for-production")
os.environ.setdefault("ADMIN_EMAILS", "wongeric1417@gmail.com")
os.environ.setdefault("CORS_ORIGINS", "http://localhost:5173")

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app
from app.rate_limit import global_otp_limiter, ip_otp_limiter, otp_email_limiter


@pytest.fixture
def client(monkeypatch):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    ip_otp_limiter.reset()
    otp_email_limiter.reset()
    global_otp_limiter.reset()
    monkeypatch.setattr(
        "app.routers.auth.send_verification_email",
        lambda _to, _code, plain_only=False, sender_email=None,
        sender_password=None: True,
    )
    monkeypatch.setattr(
        "app.routers.auth.generate_verification_code",
        lambda: "123456",
    )
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def student_token(client):
    email = "1234567-1@g.puiching.edu.mo"
    request = client.post("/api/auth/request-code", json={"email": email})
    assert request.status_code == 200
    response = client.post(
        "/api/auth/verify-code",
        json={"email": email, "code": "123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def teacher_token(client):
    email = "wongeric1417@gmail.com"
    request = client.post("/api/auth/request-code", json={"email": email})
    assert request.status_code == 200
    response = client.post(
        "/api/auth/verify-code",
        json={"email": email, "code": "123456"},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}
