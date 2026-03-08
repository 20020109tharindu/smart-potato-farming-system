import pandas as pd
import numpy as np
import pickle
import warnings
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, RobustScaler
from sklearn.metrics import r2_score
from sklearn.ensemble import RandomForestRegressor

import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostRegressor

warnings.filterwarnings("ignore")
np.random.seed(42)

MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

print("=====================================================")
print("      ADVANCED COST PREDICTION MODEL TRAINING        ")
print("=====================================================")

# ======================================================
# Load dataset
# ======================================================
df = pd.read_csv("dataset.csv")

# ======================================================
# Required columns check
# ======================================================
required = [
    "season", "district", "soil_type", "crop_quality", "field_size_acres",
    "seed_cost_lkr", "fertilizer_cost_lkr", "labor_cost_lkr"
]
missing = [c for c in required if c not in df.columns]

if missing:
    raise ValueError(f"Dataset missing columns: {missing}")

# ======================================================
# Feature Engineering (High Value)
# ======================================================
df["log_field_size"] = np.log1p(df["field_size_acres"])
df["acre_squared"] = df["field_size_acres"] ** 2
df["season_x_soil"] = df["season"].astype(str) + "_" + df["soil_type"].astype(str)

# categorical engine will encode this later
extra_features = ["log_field_size", "acre_squared"]

features = [
    "season", "district", "soil_type", "crop_quality",
    "field_size_acres",
] + extra_features

targets = [
    "seed_cost_lkr",
    "fertilizer_cost_lkr",
    "labor_cost_lkr",
]

# ======================================================
# Label Encoding
# ======================================================
categorical_cols = ["season", "district", "soil_type", "crop_quality", "season_x_soil"]

label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

features.append("season_x_soil")

# ======================================================
# Split data
# ======================================================
X = df[features]
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)

# ======================================================
# Model trainer
# ======================================================
def train_best_model(y, target_name):
    print(f"\n🔍 Training models for: {target_name}")

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    models = {
        "RandomForest": RandomForestRegressor(
            n_estimators=300, max_depth=18, min_samples_leaf=2, random_state=42
        ),
        "XGBoost": xgb.XGBRegressor(
            n_estimators=450, learning_rate=0.05, max_depth=7,
            subsample=0.8, colsample_bytree=0.8, random_state=42
        ),
        "LightGBM": lgb.LGBMRegressor(
            n_estimators=450, learning_rate=0.05, max_depth=7,
            subsample=0.8, colsample_bytree=0.8, random_state=42
        ),
        "CatBoost": CatBoostRegressor(
            depth=8, learning_rate=0.05, iterations=450,
            loss_function="RMSE", verbose=False, random_seed=42
        ),
    }

    scores = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        score = r2_score(y_test, preds)
        scores[name] = score
        print(f"    {name} R² = {round(score, 4)}")

    best_name = max(scores, key=scores.get)
    best_model = models[best_name]

    print(f"✨ Best model for {target_name}: {best_name} (R² = {round(scores[best_name], 4)})")

    return best_model, scores[best_name]


# ======================================================
# Train and save each model
# ======================================================
cost_models = {}
cost_scores = {}

for i, target in enumerate(targets):
    model, score = train_best_model(df[target], target)
    cost_models[target] = model
    cost_scores[target] = score

    # Save as seed_cost_lkr_model.pkl, fertilizer_cost_lkr_model.pkl, labor_cost_lkr_model.pkl
    out_path = os.path.join(MODELS_DIR, f"{target}_model.pkl")
    with open(out_path, "wb") as f:
        pickle.dump(model, f)

# ======================================================
# Save encoders and scaler
# ======================================================
with open(os.path.join(MODELS_DIR, "cost_label_encoders.pkl"), "wb") as f:
    pickle.dump(label_encoders, f)

with open(os.path.join(MODELS_DIR, "cost_scaler.pkl"), "wb") as f:
    pickle.dump(scaler, f)

with open(os.path.join(MODELS_DIR, "cost_feature_columns.pkl"), "wb") as f:
    pickle.dump(features, f)

print("\n=====================================================")
print("      ALL COST MODELS TRAINED & SAVED SUCCESSFULLY    ")
print("=====================================================")
print("\nFinal R² Scores:")
for k, v in cost_scores.items():
    print(f"  {k}: {round(v, 4)}")
