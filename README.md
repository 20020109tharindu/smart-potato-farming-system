# Smart Potato Farming System — Backend

Overview

- Flask-based backend that analyzes potato planting strategies using pre-trained ML models and returns farmer-friendly explanations and week-by-week action plans.
- Loads model artifacts from the `models/` folder and exposes a single analysis endpoint.

### Architecture

Potato Analysis API Pipeline-2026-01-04-092910.png

Quickstart (Windows)

1. Ensure Python 3.10+ is installed.
2. Create and activate a virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Place trained model artifacts in the `models/` directory. Expected files:

- `best_price_model.pkl`
- `best_yield_model.pkl`
- `scaler.pkl`
- `label_encoders.pkl`
- `feature_columns.pkl`

5. (Important) Configure the Gemini/LLM API key. The project currently contains a hardcoded key in `suggetion_service.py` — for security, set an environment variable instead:

```powershell
setx GEMINI_API_KEY "your_api_key_here"
```

And update `suggetion_service.py` to read `os.environ.get("GEMINI_API_KEY")`.

Run the API

```bash
python app.py
```

API

- POST `/potato_analyze` — body: JSON with at least the following fields:
  - `seed_cost_lkr` (number)
  - `fertilizer_cost_lkr` (number)
  - `labor_cost_lkr` (number)
  - `field_size_acres` (number)
  - `hands_on_money_lkr` (number)

Example request (curl):

```bash
curl -X POST http://localhost:5000/potato_analyze \
  -H "Content-Type: application/json" \
  -d '{
    "seed_cost_lkr": 10000,
    "fertilizer_cost_lkr": 5000,
    "labor_cost_lkr": 8000,
    "field_size_acres": 2,
    "hands_on_money_lkr": 15000
  }'
```

Responses

- Returns JSON with `baseline`, `hands_on_money_lkr`, `strategies` (Premium/Balanced/Budget) including expected yield, revenue, ROI, and two generated fields:
  - `farmer_explanation` — short plain-language rationale
  - `action_plan` — week-by-week bullet plan

Notes & Suggestions

- `suggetion_service.py` currently contains a live API key string. Move keys to environment variables and remove secrets from the repository.
- The variety list is derived from `label_encoders["potato_variety"].classes_` — ensure `label_encoders.pkl` contains this encoder.
- Consider adding input validation and better error handling around model inference and external API calls.
- Add unit tests for `preprocess_input()` and the endpoint behavior (mock ML models and Gemini responses).

Files of interest

- `app.py` — Flask application and main API logic
- `suggetion_service.py` — wrapper that calls Gemini to create farmer-friendly text
- `models/` — pre-trained pickled artifacts used at runtime

License

- No license specified. Add a `LICENSE` if you plan to open-source this repository.
