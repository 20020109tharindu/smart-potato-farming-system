import json
import re
import requests
import os
import time

_GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
]
_GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"


def _get_api_key():
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key or key == "YOUR_KEY_HERE":
        raise ValueError(
            "GEMINI_API_KEY not set. Get a free key from https://aistudio.google.com/apikey "
            "and add it to backend/.env"
        )
    return key


def _safe_json_extract(text: str):
    """
    Extract the FIRST valid JSON object from Gemini output.
    Never crash the API.
    """
    try:
        # Try direct parse first
        return json.loads(text)
    except Exception:
        pass

    # Try regex extraction
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            return json.loads(match.group())
        except Exception:
            pass

    return None


def call_gemini_json(prompt, max_tokens=900):
    api_key = _get_api_key()
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": max_tokens
        }
    }

    last_error = None
    for model_name in _GEMINI_MODELS:
        for attempt in range(2):
            url = f"{_GEMINI_API_BASE}/{model_name}:generateContent?key={api_key}"
            r = requests.post(url, json=body, timeout=40)

            if r.status_code in (403, 404):
                last_error = f"{r.status_code} on {model_name}"
                break
            if r.status_code == 429:
                last_error = f"429 rate limit on {model_name}"
                if attempt < 1:
                    time.sleep(5)
                    continue
                break
            if r.status_code != 200:
                last_error = f"Gemini API error: {r.text}"
                break

            raw_text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

            parsed = _safe_json_extract(raw_text)
            if parsed is None:
                last_error = "Gemini returned invalid JSON"
                break

            return parsed

    raise Exception(f"Gemini API error: {last_error}")


def generate_farmer_explanation(variety, strategy, roi, net_profit):
    prompt = f"""
Return ONLY JSON.

{{
  "farmer_explanation": "Explain in 2 short sentences why this strategy is good for the farmer"
}}

Variety: {variety}
Strategy: {strategy}
ROI: {roi:.1f}%
Profit: LKR {net_profit:,.0f}
"""
    result = call_gemini_json(prompt)
    return result.get("farmer_explanation", "")


def generate_action_plan(variety, strategy):
    prompt = f"""
Create a practical potato farming action plan.

Variety: {variety}
Strategy: {strategy}

Explain week by week:
Week 1–2
Week 3–5
Week 6–9
Week 10–12

Use bullet points.
Farmer language.
No theory.
"""

    try:
        # First try: strict JSON
        json_prompt = f"""
Return ONLY JSON.

{{
  "week_1_2": [],
  "week_3_5": [],
  "week_6_9": [],
  "week_10_12": []
}}

{prompt}
"""
        plan = call_gemini_json(json_prompt)

        return {
            "week_1_2": plan.get("week_1_2", []),
            "week_3_5": plan.get("week_3_5", []),
            "week_6_9": plan.get("week_6_9", []),
            "week_10_12": plan.get("week_10_12", []),
        }

    except Exception:
        # Fallback: plain text → safe structure
        text_body = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 700
            }
        }

        api_key = _get_api_key()
        url = f"{_GEMINI_API_BASE}/{_GEMINI_MODELS[0]}:generateContent?key={api_key}"
        r = requests.post(url, json=text_body, timeout=40)

        raw_text = r.json()["candidates"][0]["content"]["parts"][0]["text"]

        # VERY SAFE fallback
        return {
            "week_1_2": [raw_text.split("\n")[0]],
            "week_3_5": [],
            "week_6_9": [],
            "week_10_12": []
        }
