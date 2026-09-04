import re
from typing import Any


ALLOWED_TOPICS = {
    "set-and-element",
    "membership",
    "representation",
    "empty-set",
    "subset",
    "intersection-union",
    "difference",
    "complement",
}

ALLOWED_KINDS = {
    "membership",
    "equality",
    "subset",
    "intersection",
    "union",
    "difference",
    "complement",
    "enumeration",
    "set-builder",
    "cardinality",
    "empty-set",
    "venn",
}

ALLOWED_DIFFICULTY = {"basic", "standard", "challenge"}
ALLOWED_TAGS = {
    "union-intersection-confusion",
    "duplicate-elements",
    "element-vs-subset",
    "forgot-universe",
    "difference-direction",
    "proper-subset-confusion",
    "empty-set-confusion",
}


def _parse_set(value: str) -> set[int] | None:
    text = value.strip()
    if text == "∅":
        return set()
    match = re.fullmatch(r"\{([^}]*)\}", text)
    if not match:
        return None
    parts = [part.strip() for part in match.group(1).split(",") if part.strip()]
    try:
        return {int(part) for part in parts}
    except ValueError:
        return None


def _expected_set_answer(question: dict[str, Any]) -> set[int] | None:
    kind = question.get("kind")
    universe = question.get("universe")
    set_a = question.get("setA")
    set_b = question.get("setB")

    if kind == "intersection" and set_a is not None and set_b is not None:
        return set(set_a) & set(set_b)
    if kind == "union" and set_a is not None and set_b is not None:
        return set(set_a) | set(set_b)
    if kind == "difference" and set_a is not None and set_b is not None:
        return set(set_a) - set(set_b)
    if kind == "complement" and universe is not None and set_a is not None:
        return set(universe) - set(set_a)
    return None


def _constants(value: Any) -> set[int]:
    return {int(item) for item in value} if isinstance(value, list) else set()


def validate_generated_question(question: Any) -> list[str]:
    if not isinstance(question, dict):
        return ["Question must be an object."]

    errors: list[str] = []
    if not isinstance(question.get("id"), str) or not question["id"].startswith("ai-"):
        errors.append("ID must start with 'ai-'.")
    if question.get("topic") not in ALLOWED_TOPICS:
        errors.append("Unknown topic.")
    if question.get("kind") not in ALLOWED_KINDS:
        errors.append("Unknown question kind.")
    if question.get("difficulty") not in ALLOWED_DIFFICULTY:
        errors.append("Unknown difficulty.")
    if not isinstance(question.get("prompt"), str) or not question["prompt"].strip():
        errors.append("Prompt is required.")
    if not isinstance(question.get("explanation"), str) or not question["explanation"].strip():
        errors.append("Explanation is required.")

    choices = question.get("choices")
    if not isinstance(choices, list) or len(choices) < 2 or len(choices) > 6:
        errors.append("Choices must contain 2 to 6 items.")
    elif len({str(choice).strip() for choice in choices}) != len(choices):
        errors.append("Choices must be unique.")

    answer = question.get("answer")
    if not isinstance(answer, str) or answer not in choices:
        errors.append("Answer must be one of the choices.")

    tags = question.get("mistakeTags", [])
    if not isinstance(tags, list) or any(tag not in ALLOWED_TAGS for tag in tags):
        errors.append("Unknown mistake tag.")

    for field in ("universe", "setA", "setB"):
        value = question.get(field)
        if value is not None and (
            not isinstance(value, list)
            or any(not isinstance(item, int) for item in value)
        ):
            errors.append(f"{field} must be an integer list.")

    venn = question.get("venn")
    if venn is not None:
        if not isinstance(venn, dict):
            errors.append("Venn state must be an object.")
        else:
            for field in ("universe", "a", "b"):
                value = venn.get(field)
                if not isinstance(value, list) or any(
                    not isinstance(item, int) for item in value
                ):
                    errors.append(f"Venn {field} must be an integer list.")
    if question.get("vennOperation") not in {
        None,
        "intersection",
        "union",
        "difference",
        "reverseDifference",
        "complement",
    }:
        errors.append("Unknown Venn operation.")

    universe = _constants(question.get("universe"))
    if question.get("setA") is not None:
        set_a = _constants(question.get("setA"))
        if universe and not set_a.issubset(universe):
            errors.append("Set A must be inside the universe.")
    if question.get("setB") is not None:
        set_b = _constants(question.get("setB"))
        if universe and not set_b.issubset(universe):
            errors.append("Set B must be inside the universe.")

    expected = _expected_set_answer(question)
    if expected is not None and isinstance(answer, str):
        actual = _parse_set(answer)
        if actual is None or actual != expected:
            errors.append("Set operation answer is incorrect.")

    return errors


def validate_generated_questions(payload: Any) -> list[dict[str, Any]]:
    if not isinstance(payload, dict) or not isinstance(payload.get("questions"), list):
        raise ValueError("DeepSeek must return {'questions': [...]}.")

    questions = payload["questions"]
    if not questions:
        raise ValueError("DeepSeek returned no questions.")

    if any(not isinstance(question, dict) for question in questions):
        raise ValueError("Generated questions must be objects.")
    ids = [question.get("id") for question in questions]
    if any(not isinstance(item, str) for item in ids) or len(set(ids)) != len(ids):
        raise ValueError("Generated question IDs must be unique strings.")

    for question in questions:
        errors = validate_generated_question(question)
        if errors:
            raise ValueError("Generated question failed validation: " + ", ".join(errors))
    return questions
