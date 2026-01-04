from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import warnings

from suggetion_service import (
    generate_farmer_explanation,
    generate_action_plan
)

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# =========================
# Load ML artifacts
# =========================
MODE_PATH = "models/"

price_model = pickle.load(open(MODE_PATH + "best_price_model.pkl", "rb"))
yield_model = pickle.load(open(MODE_PATH + "best_yield_model.pkl", "rb"))
scaler = pickle.load(open(MODE_PATH + "scaler.pkl", "rb"))
label_encoders = pickle.load(open(MODE_PATH + "label_encoders.pkl", "rb"))
feature_columns = pickle.load(open(MODE_PATH + "feature_columns.pkl", "rb"))

POTATO_VARIETIES = list(label_encoders["potato_variety"].classes_)


# =========================
# Preprocessing
# =========================
def preprocess_input(data):
    df = pd.DataFrame([data])

    df["total_cost"] = (
        df["seed_cost_lkr"]
        + df["fertilizer_cost_lkr"]
        + df["labor_cost_lkr"]
    )

    for col, enc in label_encoders.items():
        df[col] = enc.transform(df[col])

    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    return scaler.transform(df[feature_columns])


# =========================
# API
# =========================
@app.route("/potato_analyze", methods=["POST"])
def potato_analyze():
    data = request.get_json()
    raw = []

    for variety in POTATO_VARIETIES:
        row = data.copy()
        row["potato_variety"] = variety

        X = preprocess_input(row)

        price = float(price_model.predict(X)[0])
        yield_per_acre = float(yield_model.predict(X)[0])
        total_yield = yield_per_acre * data["field_size_acres"]

        investment = (
            data["seed_cost_lkr"]
            + data["fertilizer_cost_lkr"]
            + data["labor_cost_lkr"]
        )

        revenue = total_yield * price
        net_profit = revenue - investment
        roi = (net_profit / investment) * 100 if investment > 0 else 0

        raw.append({
            "variety": variety,
            "investment": investment,
            "price": price,
            "yield_per_acre": yield_per_acre,
            "total_yield": total_yield,
            "revenue": revenue,
            "net_profit": net_profit,
            "roi": roi
        })

    raw = sorted(raw, key=lambda x: x["net_profit"], reverse=True)
    labels = ["Premium", "Balanced", "Budget"]

    strategies = []

    for i, r in enumerate(raw[:3]):
        strategy_type = labels[i]

        strategies.append({
            "strategy": strategy_type,
            "type": r["variety"],
            "variety_weight": 50,
            "investment_lkr": round(r["investment"], 2),
            "expected_yield_kg": round(r["total_yield"], 1),
            "expected_yield_per_acre": round(r["yield_per_acre"], 1),
            "expected_price_per_kg": round(r["price"], 1),
            "revenue_lkr": round(r["revenue"], 2),
            "net_profit_lkr": round(r["net_profit"], 2),
            "roi_percent": round(r["roi"], 1),
            "farmer_explanation": generate_farmer_explanation(
                r["variety"], strategy_type, r["roi"], r["net_profit"]
            ),
            "action_plan": generate_action_plan(
                r["variety"], strategy_type
            )
        })

    best = strategies[0]

    return jsonify({
        "status": "ok",
        "baseline": {
            "price_lkr_per_kg": best["expected_price_per_kg"],
            "yield_per_acre": best["expected_yield_per_acre"],
            "yield_total": best["expected_yield_kg"]
        },
        "hands_on_money_lkr": data["hands_on_money_lkr"],
        "strategies": strategies,
        "strategies_found": len(strategies)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
