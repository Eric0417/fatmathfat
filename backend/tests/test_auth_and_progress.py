from tests.conftest import auth_headers
from app.config import settings
from app.quiz_bank import QUIZ_ANSWER_KEYS


def test_student_login_and_progress(client, student_token):
    headers = auth_headers(student_token)
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["role"] == "student"

    progress = client.get("/api/progress", headers=headers)
    assert progress.status_code == 200
    assert progress.json()["completed_lessons"] == []

    lesson = client.post(
        "/api/progress/lessons",
        headers=headers,
        json={"lesson_id": "set", "mark_complete": True},
    )
    assert lesson.status_code == 200
    assert lesson.json()["last_lesson"] == "set"

    started = client.post(
        "/api/quiz/start",
        headers=headers,
    )
    assert started.status_code == 201
    quiz_session_id = started.json()["quiz_session_id"]

    answers = {
        question_id: (
            QUIZ_ANSWER_KEYS[question_id]["answer"]
            if index < 10
            else "wrong-answer"
        )
        for index, question_id in enumerate(QUIZ_ANSWER_KEYS)
    }
    quiz = client.post(
        "/api/progress/quiz",
        headers=headers,
        json={
            "quiz_session_id": quiz_session_id,
            "answers": answers,
            "duration_ms": 1000,
        },
    )
    assert quiz.status_code == 201
    assert quiz.json()["score"] == 83


def test_teacher_request_code_uses_plain_email(client, monkeypatch):
    calls = []

    def fake_send(
        to,
        code,
        plain_only=False,
        sender_email=None,
        sender_password=None,
    ):
        calls.append(
            (to, code, plain_only, sender_email, sender_password)
        )
        return True

    monkeypatch.setattr(settings, "TEACHER_EMAIL_FROM", "wongeric1417@gmail.com")
    monkeypatch.setattr(
        settings,
        "TEACHER_GMAIL_APP_PASSWORD",
        "teacher-app-password",
    )
    monkeypatch.setattr(
        "app.routers.auth.send_verification_email",
        fake_send,
    )

    response = client.post(
        "/api/auth/request-code",
        json={"email": "imwong@g.puiching.edu.mo"},
    )

    assert response.status_code == 200
    assert calls[-1][2] is True
    assert calls[-1][3] == "wongeric1417@gmail.com"
    assert calls[-1][4] == "teacher-app-password"


def test_student_request_code_keeps_html_email(client, monkeypatch):
    calls = []

    def fake_send(
        to,
        code,
        plain_only=False,
        sender_email=None,
        sender_password=None,
    ):
        calls.append(
            (to, code, plain_only, sender_email, sender_password)
        )
        return True

    monkeypatch.setattr(settings, "EMAIL_FROM", "bot012223333@gmail.com")
    monkeypatch.setattr(settings, "GMAIL_APP_PASSWORD", "student-app-password")
    monkeypatch.setattr(
        "app.routers.auth.send_verification_email",
        fake_send,
    )

    response = client.post(
        "/api/auth/request-code",
        json={"email": "1234567-1@g.puiching.edu.mo"},
    )

    assert response.status_code == 200
    assert calls[-1][2] is False
    assert calls[-1][3] is None
    assert calls[-1][4] is None


def test_any_school_domain_email_can_login_as_teacher(client):
    for email in (
        "imwong@g.puiching.edu.mo",
        "kkf@puiching.edu.mo",
    ):
        request = client.post("/api/auth/request-code", json={"email": email})
        assert request.status_code == 200

        response = client.post(
            "/api/auth/verify-code",
            json={"email": email, "code": "123456"},
        )
        assert response.status_code == 200

        me = client.get(
            "/api/auth/me",
            headers=auth_headers(response.json()["access_token"]),
        )
        assert me.status_code == 200
        assert me.json()["role"] == "teacher"

        admin = client.get(
            "/api/admin/students",
            headers=auth_headers(response.json()["access_token"]),
        )
        assert admin.status_code == 200


def test_non_school_email_is_rejected(client):
    response = client.post(
        "/api/auth/request-code",
        json={"email": "teacher.not-allowlisted@example.com"},
    )
    assert response.status_code == 403


def test_google_oauth_endpoints_are_removed(client):
    assert client.get("/api/auth/google/authorize").status_code == 404
    assert client.get("/api/auth/google/callback").status_code == 404


def test_request_code_ip_rate_limit(client):
    for index in range(10):
        email = f"123456{index}-1@g.puiching.edu.mo"
        response = client.post("/api/auth/request-code", json={"email": email})
        assert response.status_code == 200

    blocked = client.post(
        "/api/auth/request-code",
        json={"email": "1234569-1@g.puiching.edu.mo"},
    )
    assert blocked.status_code == 429


def test_admin_login_and_teacher_management(client, teacher_token):
    headers = auth_headers(teacher_token)
    teachers = client.get("/api/admin/teachers", headers=headers)
    assert teachers.status_code == 200
    assert "wongeric1417@gmail.com" in teachers.json()

    added = client.post(
        "/api/admin/teachers",
        headers=headers,
        json={"email": "another.teacher@g.puiching.edu.mo"},
    )
    assert added.status_code == 201
    teachers = client.get("/api/admin/teachers", headers=headers)
    assert "another.teacher@g.puiching.edu.mo" in teachers.json()

    removed = client.delete(
        "/api/admin/teachers/another.teacher@g.puiching.edu.mo",
        headers=headers,
    )
    assert removed.status_code == 200


def test_student_cannot_access_admin(client, student_token):
    response = client.get(
        "/api/admin/students",
        headers=auth_headers(student_token),
    )
    assert response.status_code == 403
