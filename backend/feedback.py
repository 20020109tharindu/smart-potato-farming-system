"""
Personalized feedback for seed readiness predictions.
Returns short, farmer-friendly messages based on model outputs (readiness, sprout, shrivel, damage).
"""


def _get_label(d, key, default="unknown"):
    out = d.get(key)
    if not out or not isinstance(out, dict):
        return default
    return (out.get("label") or default).lower().strip()


def generate_seed_readiness_feedback(predictions):
    """
    Build personalized feedback from prediction dict.
    predictions: dict with keys seed_readiness, sprout_length, shrivel_level, damage_level
    each value: { "label", "confidence", ... }
    Returns: dict with "summary", "action_items", "size_note" (optional width/size context).
    """
    if not predictions:
        return {
            "summary": "Unable to analyze. Please upload a clear photo of your potato seed.",
            "action_items": ["Retake the photo in good light.", "Ensure the seed fills most of the frame."],
            "size_note": None,
        }

    readiness = _get_label(predictions, "seed_readiness")
    sprout = _get_label(predictions, "sprout_length")
    shrivel = _get_label(predictions, "shrivel_level")
    damage = _get_label(predictions, "damage_level")

    summary_parts = []
    action_items = []
    size_note = None

    # Readiness summary
    if "ready" in readiness or "suitable" in readiness:
        summary_parts.append("Your seed looks ready for planting.")
        size_note = "Based on sprout and overall condition, this seed is in good planting condition."
    else:
        summary_parts.append("This seed may need more time or care before planting.")
        action_items.append("Check storage conditions (cool, dark, ventilated).")

    # Sprout length → size/development note
    if "long" in sprout or "medium" in sprout:
        summary_parts.append("Sprout development is adequate for planting.")
    elif "short" in sprout or "none" in sprout or "small" in sprout:
        if not size_note:
            size_note = "Sprout is still short; you can wait a bit longer or plant and monitor."
        action_items.append("Consider waiting for slightly longer sprout growth if you have time.")

    # Shrivel
    if "high" in shrivel or "severe" in shrivel:
        summary_parts.append("Shriveling is high — quality may be reduced.")
        action_items.append("Sort out badly shriveled seeds; use the best ones for planting.")
    elif "low" in shrivel or "minimal" in shrivel or "none" in shrivel:
        summary_parts.append("Shrivel level is low; seed appears healthy.")

    # Damage
    if "high" in damage or "severe" in damage or "significant" in damage:
        summary_parts.append("Damage level is high.")
        action_items.append("Avoid planting heavily damaged seeds; they may not germinate well.")
    elif "low" in damage or "minimal" in damage or "none" in damage:
        summary_parts.append("Damage is minimal — good for planting.")

    summary = " ".join(summary_parts) if summary_parts else "Analysis complete. Review the metrics below."
    if not action_items:
        action_items.append("Plant within 1–2 weeks for best results.")

    return {
        "summary": summary,
        "action_items": action_items,
        "size_note": size_note,
    }
