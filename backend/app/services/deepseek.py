import json
import re

from openai import OpenAI

from app.config import settings


class DeepSeekError(Exception):
    pass


_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    if _client is None:
        if not settings.DEEPSEEK_API_KEY:
            raise DeepSeekError("DeepSeek API key is not configured.")
        _client = OpenAI(
            api_key=settings.DEEPSEEK_API_KEY,
            base_url=settings.DEEPSEEK_BASE_URL,
            timeout=settings.DEEPSEEK_TIMEOUT_SECONDS,
        )
    return _client


def parse_json_response(raw: str) -> dict:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", raw, re.DOTALL)
    if fence:
        try:
            return json.loads(fence.group(1))
        except json.JSONDecodeError:
            pass

    block = re.search(r"\{.*\}", raw, re.DOTALL)
    if block:
        try:
            return json.loads(block.group(0))
        except json.JSONDecodeError:
            pass

    raise DeepSeekError("DeepSeek returned an invalid JSON response.")


def call_json(system_prompt: str, user_prompt: str) -> dict:
    try:
        client = get_client()
        response = client.chat.completions.create(
            model=settings.DEEPSEEK_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=settings.DEEPSEEK_MAX_TOKENS,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content or ""
        return parse_json_response(raw)
    except DeepSeekError:
        raise
    except Exception as exc:
        raise DeepSeekError(str(exc)) from exc
