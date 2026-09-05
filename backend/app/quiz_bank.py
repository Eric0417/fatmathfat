from typing import Any


QUIZ_ANSWER_KEYS: dict[str, dict[str, Any]] = {
    "set-01": {
        "answer": "{1, 2, 3, 4}",
        "topic": "set-and-element",
        "mistake_tags": [],
    },
    "membership-02": {
        "answer": "正確",
        "topic": "membership",
        "mistake_tags": ["element-vs-subset"],
    },
    "membership-03": {
        "answer": "1 ∈ A",
        "topic": "membership",
        "mistake_tags": ["element-vs-subset"],
    },
    "representation-01": {
        "answer": "{x | x 是正整數且 x < 5}",
        "topic": "representation",
        "mistake_tags": [],
    },
    "empty-set-01": {
        "answer": "0",
        "topic": "empty-set",
        "mistake_tags": ["empty-set-confusion"],
    },
    "subset-01": {
        "answer": "A ⊆ B 與 A ⊊ B 都正確",
        "topic": "subset",
        "mistake_tags": ["proper-subset-confusion"],
    },
    "intersection-01": {
        "answer": "{3, 4}",
        "topic": "intersection-union",
        "mistake_tags": ["union-intersection-confusion"],
    },
    "union-01": {
        "answer": "{1, 2, 3, 4, 5, 6}",
        "topic": "intersection-union",
        "mistake_tags": ["union-intersection-confusion", "duplicate-elements"],
    },
    "difference-01": {
        "answer": "{1, 2}",
        "topic": "difference",
        "mistake_tags": ["difference-direction"],
    },
    "difference-02": {
        "answer": "{5, 6}",
        "topic": "difference",
        "mistake_tags": ["difference-direction"],
    },
    "complement-01": {
        "answer": "{5, 6, 7, 8}",
        "topic": "complement",
        "mistake_tags": ["forgot-universe"],
    },
    "complement-02": {
        "answer": "因為全集不同",
        "topic": "complement",
        "mistake_tags": ["forgot-universe"],
    },
}

QUIZ_QUESTION_IDS = frozenset(QUIZ_ANSWER_KEYS)


def score_quiz_answers(answers: dict[str, str]) -> dict[str, Any]:
    topic_scores: dict[str, dict[str, int]] = {}
    mistakes: list[dict[str, Any]] = []
    correct = 0
    total = len(QUIZ_ANSWER_KEYS)

    for question_id, answer_key in QUIZ_ANSWER_KEYS.items():
        topic = answer_key["topic"]
        topic_scores.setdefault(topic, {"correct": 0, "total": 0})
        topic_scores[topic]["total"] += 1

        selected = answers.get(question_id, "")
        if selected == answer_key["answer"]:
            topic_scores[topic]["correct"] += 1
            correct += 1
        else:
            mistakes.append(
                {
                    "question_id": question_id,
                    "selected": selected,
                    "answer": answer_key["answer"],
                    "tags": answer_key["mistake_tags"],
                }
            )

    return {
        "score": round((correct / total) * 100),
        "correct": correct,
        "total": total,
        "topic_scores": topic_scores,
        "mistakes": mistakes,
    }
