from tests.conftest import auth_headers


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

    quiz = client.post(
        "/api/progress/quiz",
        headers=headers,
        json={
            "score": 80,
            "correct": 8,
            "total": 10,
            "duration_ms": 1000,
            "topic_scores": {
                "set-and-element": {"correct": 1, "total": 1}
            },
            "mistakes": [],
        },
    )
    assert quiz.status_code == 201
    assert quiz.json()["score"] == 80


def test_any_school_domain_email_can_login_as_teacher(client):
    email = "imwong@g.puiching.edu.mo"
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
