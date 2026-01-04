import json
import re
import requests
import os

GEMINI_API_KEY = "AIzaSyC51n4mMlk7IWuhTOg4bjuxzHlBhsmy9Rs"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"


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
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": max_tokens
        }
    }

    r = requests.post(
        f"{GEMINI_URL}?key={GEMINI_API_KEY}",
        json=body,
        timeout=40
    )

    if r.status_code != 200:
        raise Exception(f"Gemini API error: {r.text}")

    raw_text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    parsed = _safe_json_extract(raw_text)

    if parsed is None:
        raise ValueError(
            "Gemini did not return valid JSON.\n"
            f"RAW OUTPUT:\n{raw_text}"
        )

    return parsed


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

        r = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=text_body,
            timeout=40
        )

        raw_text = r.json()["candidates"][0]["content"]["parts"][0]["text"]

        # VERY SAFE fallback
        return {
            "week_1_2": [raw_text.split("\n")[0]],
            "week_3_5": [],
            "week_6_9": [],
            "week_10_12": []
        }
