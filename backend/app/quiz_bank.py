from typing import Any


QUIZ_ANSWER_KEYS: dict[str, dict[str, Any]] = {
    "set-01": {
        "answer": "{1, 2, 3, 4}",
        "topic": "set-and-element",
        "grade_level": "S4",
        "mistake_tags": [],
    },
    "membership-02": {
        "answer": "正確",
        "topic": "membership",
        "grade_level": "S4",
        "mistake_tags": ["element-vs-subset"],
    },
    "membership-03": {
        "answer": "1 ∈ A",
        "topic": "membership",
        "grade_level": "S4",
        "mistake_tags": ["element-vs-subset"],
    },
    "representation-01": {
        "answer": "{x | x 是正整數且 x < 5}",
        "topic": "representation",
        "grade_level": "S4",
        "mistake_tags": [],
    },
    "empty-set-01": {
        "answer": "0",
        "topic": "empty-set",
        "grade_level": "S4",
        "mistake_tags": ["empty-set-confusion"],
    },
    "subset-01": {
        "answer": "A ⊆ B 與 A ⊊ B 都正確",
        "topic": "subset",
        "grade_level": "S4",
        "mistake_tags": ["proper-subset-confusion"],
    },
    "intersection-01": {
        "answer": "{3, 4}",
        "topic": "intersection-union",
        "grade_level": "S4",
        "mistake_tags": ["union-intersection-confusion"],
    },
    "union-01": {
        "answer": "{1, 2, 3, 4, 5, 6}",
        "topic": "intersection-union",
        "grade_level": "S4",
        "mistake_tags": ["union-intersection-confusion", "duplicate-elements"],
    },
    "difference-01": {
        "answer": "{1, 2}",
        "topic": "difference",
        "grade_level": "S4",
        "mistake_tags": ["difference-direction"],
    },
    "difference-02": {
        "answer": "{5, 6}",
        "topic": "difference",
        "grade_level": "S4",
        "mistake_tags": ["difference-direction"],
    },
    "complement-01": {
        "answer": "{5, 6, 7, 8}",
        "topic": "complement",
        "grade_level": "S4",
        "mistake_tags": ["forgot-universe"],
    },
    "complement-02": {
        "answer": "因為全集不同",
        "topic": "complement",
        "grade_level": "S4",
        "mistake_tags": ["forgot-universe"],
    },
    "s5-directed-01": {
        "answer": "−5",
        "topic": "s5-directed-segment",
        "grade_level": "S5",
        "mistake_tags": ["directed-length-sign"],
    },
    "s5-section-02": {
        "answer": "(3, 14/3)",
        "topic": "s5-section-point",
        "grade_level": "S5",
        "mistake_tags": ["section-ratio-order"],
    },
    "s5-area-01": {
        "answer": "6",
        "topic": "s5-polygon-area",
        "grade_level": "S5",
        "mistake_tags": [],
    },
    "s5-slope-01": {
        "answer": "2",
        "topic": "s5-slope",
        "grade_level": "S5",
        "mistake_tags": [],
    },
    "s5-slope-04": {
        "answer": "120°",
        "topic": "s5-slope",
        "grade_level": "S5",
        "mistake_tags": ["slope-angle-confusion"],
    },
    "s5-form-01": {
        "answer": "y = 2x − 1",
        "topic": "s5-line-forms",
        "grade_level": "S5",
        "mistake_tags": [],
    },
    "s5-form-03": {
        "answer": "x/3 + y/(−2) = 1",
        "topic": "s5-line-forms",
        "grade_level": "S5",
        "mistake_tags": ["intercept-sign"],
    },
    "s5-relation-01": {
        "answer": "垂直",
        "topic": "s5-line-relations",
        "grade_level": "S5",
        "mistake_tags": ["parallel-perpendicular-condition"],
    },
    "s5-relation-04": {
        "answer": "(1, 1)",
        "topic": "s5-line-relations",
        "grade_level": "S5",
        "mistake_tags": [],
    },
    "s5-distance-01": {
        "answer": "1",
        "topic": "s5-distance-normal",
        "grade_level": "S5",
        "mistake_tags": ["distance-absolute-value"],
    },
    "s5-distance-03": {
        "answer": "3",
        "topic": "s5-distance-normal",
        "grade_level": "S5",
        "mistake_tags": ["distance-absolute-value"],
    },
    "s5-family-02": {
        "answer": "3x − 2y + λ = 0",
        "topic": "s5-line-family",
        "grade_level": "S5",
        "mistake_tags": ["parallel-perpendicular-condition"],
    },
}

QUIZ_QUESTION_IDS = frozenset(QUIZ_ANSWER_KEYS)


def score_quiz_answers(
    answers: dict[str, str],
    grade_level: str = "S4",
) -> dict[str, Any]:
    topic_scores: dict[str, dict[str, int]] = {}
    mistakes: list[dict[str, Any]] = []
    correct = 0
    answer_keys = {
        question_id: answer_key
        for question_id, answer_key in QUIZ_ANSWER_KEYS.items()
        if answer_key.get("grade_level", "S4") == grade_level
    }
    total = len(answer_keys)

    for question_id, answer_key in answer_keys.items():
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
