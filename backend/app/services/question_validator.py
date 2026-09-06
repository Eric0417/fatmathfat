import math
import re
from typing import Any


S5_KINDS = {
    "coordinate",
    "slope",
    "line-equation",
    "line-relation",
    "distance",
    "angle",
    "area",
}


ALLOWED_TOPICS = {
    "set-and-element",
    "membership",
    "representation",
    "empty-set",
    "subset",
    "intersection-union",
    "difference",
    "complement",
    "s5-directed-segment",
    "s5-section-point",
    "s5-polygon-area",
    "s5-slope",
    "s5-line-forms",
    "s5-line-relations",
    "s5-distance-normal",
    "s5-line-family",
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
    "coordinate",
    "slope",
    "line-equation",
    "line-relation",
    "distance",
    "angle",
    "area",
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
    "directed-length-sign",
    "section-ratio-order",
    "slope-angle-confusion",
    "intercept-sign",
    "parallel-perpendicular-condition",
    "distance-absolute-value",
    "line-form-domain",
    "normal-form-sign",
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


def _numeric_value(value: str) -> float | None:
    text = value.strip().replace("−", "-").replace(" ", "")
    if not text or text in {"不存在", "undefined"}:
        return None
    if "/" in text:
        parts = text.split("/")
        if len(parts) != 2:
            return None
        numerator = _numeric_value(parts[0])
        denominator = _numeric_value(parts[1])
        return None if numerator is None or denominator == 0 else numerator / denominator
    sqrt_match = re.fullmatch(r"(-?)(\d*)?√(\d+)", text)
    if sqrt_match:
        sign = -1 if sqrt_match.group(1) else 1
        coefficient = int(sqrt_match.group(2) or 1)
        return sign * coefficient * math.sqrt(int(sqrt_match.group(3)))
    try:
        return float(text)
    except ValueError:
        return None


def _numbers_close(first: str, second: float | None) -> bool:
    if second is None:
        return first.strip() in {"不存在", "undefined"}
    value = _numeric_value(first)
    return value is not None and math.isclose(value, second, abs_tol=1e-5)


def _point_pairs(text: str) -> list[tuple[float, float]]:
    matches = re.findall(
        r"\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)",
        text,
    )
    return [(float(x), float(y)) for x, y in matches]


def _parse_point_answer(answer: str) -> tuple[float, float] | None:
    match = re.search(
        r"\(\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)\s*,\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)\s*\)",
        answer,
    )
    if not match:
        return None
    x = _numeric_value(match.group(1))
    y = _numeric_value(match.group(2))
    return None if x is None or y is None else (x, y)


def _line_answer(answer: str) -> tuple[float, float] | None:
    match = re.search(
        r"y\s*=\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?(?:\/\d+)?)?",
        answer.replace("−", "-"),
    )
    if not match:
        return None
    slope = _numeric_value(match.group(1))
    intercept = _numeric_value((match.group(2) or "0").replace(" ", ""))
    return None if slope is None or intercept is None else (slope, intercept)


def _line_coefficients_from_prompt(text: str) -> tuple[float, float, float] | None:
    match = re.search(
        r"(-?\d+(?:\.\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?)\s*y\s*([+-]\s*\d+(?:\.\d+)?)?\s*=\s*0",
        text.replace("−", "-"),
    )
    if match:
        a = float(match.group(1))
        b = float(match.group(2).replace(" ", ""))
        c = float((match.group(3) or "+0").replace(" ", ""))
        return a, b, c
    slope_intercept = re.search(
        r"y\s*=\s*(-?\d+(?:\.\d+)?)\s*x\s*([+-]\s*\d+(?:\.\d+)?)?",
        text.replace("−", "-"),
    )
    if slope_intercept:
        slope = float(slope_intercept.group(1))
        intercept = float((slope_intercept.group(2) or "+0").replace(" ", ""))
        return -slope, 1.0, -intercept
    return None


def _relation(slope_a: float | None, slope_b: float | None) -> str | None:
    if slope_a is None or slope_b is None:
        return None
    if math.isclose(slope_a, slope_b):
        return None
    if math.isclose(slope_a * slope_b, -1):
        return "垂直"
    return "相交"


def _distance_from_prompt(prompt: str) -> float | None:
    point = _point_pairs(prompt)
    line = _line_coefficients_from_prompt(prompt)
    if not point or not line:
        return None
    a, b, c = line
    denominator = math.hypot(a, b)
    if denominator < 1e-9:
        return None
    return abs(a * point[0][0] + b * point[0][1] + c) / denominator


def _triangle_area_from_prompt(prompt: str) -> float | None:
    points = _point_pairs(prompt)
    if len(points) < 3:
        return None
    first, second, third = points[:3]
    cross = (
        first[0] * (second[1] - third[1])
        + second[0] * (third[1] - first[1])
        + third[0] * (first[1] - second[1])
    )
    return abs(cross) / 2


def _validate_s5_answer(question: dict[str, Any]) -> str | None:
    prompt = str(question.get("prompt", ""))
    answer = str(question.get("answer", ""))
    kind = question.get("kind")

    slope_points = _point_pairs(prompt)
    if kind == "slope" and len(slope_points) >= 2:
        x1, y1 = slope_points[0]
        x2, y2 = slope_points[1]
        if math.isclose(x1, x2):
            return None if _numbers_close(answer, None) else "Vertical slope answer is incorrect."
        expected = (y2 - y1) / (x2 - x1)
        return None if _numbers_close(answer, expected) else "Slope answer is incorrect."

    if kind == "coordinate" and "λ" in prompt and len(slope_points) >= 2:
        lambda_match = re.search(r"λ\s*=\s*(-?\d+(?:\.\d+)?)", prompt.replace("−", "-"))
        actual = _parse_point_answer(answer)
        if not lambda_match or not actual:
            return "Section point pattern is not verifiable."
        ratio = float(lambda_match.group(1))
        if math.isclose(ratio, -1):
            return "Section point has an undefined ratio."
        expected = (
            (slope_points[0][0] + ratio * slope_points[1][0]) / (1 + ratio),
            (slope_points[0][1] + ratio * slope_points[1][1]) / (1 + ratio),
        )
        return (
            None
            if math.isclose(actual[0], expected[0], abs_tol=1e-5)
            and math.isclose(actual[1], expected[1], abs_tol=1e-5)
            else "Section point answer is incorrect."
        )

    if kind == "area":
        expected = _triangle_area_from_prompt(prompt)
        if expected is None:
            return "Triangle area pattern is not verifiable."
        return None if _numbers_close(answer, expected) else "Triangle area answer is incorrect."

    if kind == "line-equation":
        point_slope = re.search(
            r"經過點\s*\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)\s*且斜率為\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)",
            prompt,
        )
        if point_slope:
            x = float(point_slope.group(1))
            y = float(point_slope.group(2))
            slope_value = _numeric_value(point_slope.group(3))
            actual = _line_answer(answer)
            if slope_value is None or actual is None:
                return "Point-slope equation pattern is not verifiable."
            expected_intercept = y - slope_value * x
            return (
                None
                if math.isclose(actual[0], slope_value, abs_tol=1e-5)
                and math.isclose(actual[1], expected_intercept, abs_tol=1e-5)
                else "Point-slope equation answer is incorrect."
            )
        return "Line equation pattern is not verifiable."

    if kind == "line-relation":
        slope_values = re.findall(
            r"斜率分別為\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)\s*與\s*(-?\d+(?:\.\d+)?(?:\/\d+)?)",
            prompt,
        )
        if slope_values:
            first = _numeric_value(slope_values[0][0])
            second = _numeric_value(slope_values[0][1])
            expected = _relation(first, second)
            if expected is None:
                return "Line relation pattern is not verifiable."
            return None if answer.strip() == expected else "Line relation answer is incorrect."
        return "Line relation pattern is not verifiable."

    if kind == "distance":
        expected = _distance_from_prompt(prompt)
        if expected is None:
            return "Point-line distance pattern is not verifiable."
        return None if _numbers_close(answer, expected) else "Point-line distance answer is incorrect."

    return "S5 question pattern is not verifiable."


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

    if str(question.get("topic", "")).startswith("s5-"):
        if question.get("kind") not in S5_KINDS:
            errors.append("S5 question uses an invalid kind.")
        for field in ("universe", "setA", "setB", "venn", "vennOperation"):
            if question.get(field) is not None:
                errors.append(f"S5 question must not include {field}.")
        answer_error = _validate_s5_answer(question)
        if answer_error:
            errors.append(answer_error)

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
