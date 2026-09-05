from tests.conftest import auth_headers


def test_ai_chat_rejects_quiz_active(client, student_token):
    started = client.post(
        "/api/quiz/start",
        headers=auth_headers(student_token),
    )
    assert started.status_code == 201
    quiz_session_id = started.json()["quiz_session_id"]

    response = client.post(
        "/api/ai/chat",
        headers=auth_headers(student_token),
        json={
            "message": "請告訴我答案",
            "context": {"route": "/quiz", "question_id": "q1"},
            "quiz_session_id": quiz_session_id,
        },
    )
    assert response.status_code == 403


def test_ai_chat_rejects_quiz_question_context_without_session(
    client,
    student_token,
    monkeypatch,
):
    monkeypatch.setattr(
        "app.routers.ai.call_json",
        lambda _system, _user: {"message": "可以繼續問集合概念。"},
    )
    response = client.post(
        "/api/ai/chat",
        headers=auth_headers(student_token),
        json={
            "message": "集合的交集是什麼？",
            "context": {"route": "/quiz", "question_id": "quiz-q1"},
        },
    )
    assert response.status_code == 403


def test_ai_chat_returns_message(client, student_token, monkeypatch):
    monkeypatch.setattr(
        "app.routers.ai.call_json",
        lambda _system, _user: {"message": "先想想交集的意思。"},
    )
    response = client.post(
        "/api/ai/chat",
        headers=auth_headers(student_token),
        json={
            "message": "交集的定義是什麼？",
            "context": {"route": "/lessons/set", "lesson_id": "set"},
        },
    )
    assert response.status_code == 200
    assert response.json()["message"] == "先想想交集的意思。"


def test_ai_generate_questions_validates_response(client, student_token, monkeypatch):
    monkeypatch.setattr(
        "app.routers.ai.call_json",
        lambda _system, _user: {
            "questions": [
                {
                    "id": "ai-test-1",
                    "topic": "intersection-union",
                    "kind": "intersection",
                    "difficulty": "standard",
                    "prompt": "求 A 與 B 的交集。",
                    "universe": [1, 2, 3, 4],
                    "setA": [1, 2],
                    "setB": [2, 3],
                    "choices": ["{2}", "{1, 2, 3}", "{1}", "∅"],
                    "answer": "{2}",
                    "explanation": "共同元素只有 2。",
                    "hint": "找同時屬於 A 和 B 的元素。",
                    "mistakeTags": ["union-intersection-confusion"],
                }
            ]
        }
    )
    response = client.post(
        "/api/ai/generate-practice",
        headers=auth_headers(student_token),
        json={"topics": ["intersection-union"], "difficulty": "standard", "count": 1},
    )
    assert response.status_code == 200
    assert response.json()["questions"][0]["answer"] == "{2}"


def test_ai_generate_rejects_invalid_question(client, student_token, monkeypatch):
    monkeypatch.setattr(
        "app.routers.ai.call_json",
        lambda _system, _user: {
            "questions": [
                {
                    "id": "ai-bad-1",
                    "topic": "not-real",
                    "kind": "not-real",
                    "difficulty": "standard",
                    "prompt": "bad",
                    "choices": ["A", "B"],
                    "answer": "C",
                    "explanation": "bad",
                    "mistakeTags": [],
                }
            ]
        }
    )
    response = client.post(
        "/api/ai/generate-practice",
        headers=auth_headers(student_token),
        json={"topics": ["intersection-union"], "count": 1},
    )
    assert response.status_code == 502
