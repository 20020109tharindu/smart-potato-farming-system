import pandas as pd
import numpy as np
import pickle
import warnings
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler, LabelEncoder
from sklearn.metrics import r2_score, mean_squared_error

from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import lightgbm as lgb

warnings.filterwarnings("ignore")
np.random.seed(42)

MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

print("=" * 80)
print("ADVANCED POTATO PRICE & YIELD TRAINING PIPELINE")
print("=" * 80)

# =========================
# Load dataset
# =========================
df = pd.read_csv("dataset.csv")
print("Dataset shape:", df.shape)

# =========================
# Feature Engineering
# =========================
df["total_cost"] = (
    df["seed_cost_lkr"]
    + df["fertilizer_cost_lkr"]
    + df["labor_cost_lkr"]
)

df["cost_per_acre"] = df["total_cost"] / (df["field_size_acres"] + 1)
df["investment_intensity"] = df["hands_on_money_lkr"] / (df["field_size_acres"] + 1)
df["fertilizer_efficiency"] = df["planned_fertilizer_kg_per_acre"] / (df["total_cost"] + 1)
df["labor_intensity"] = df["labor_cost_lkr"] / (df["field_size_acres"] + 1)
df["seed_fertilizer_ratio"] = df["seed_cost_lkr"] / (df["fertilizer_cost_lkr"] + 1)

print("Feature engineering completed")

# =========================
# Encode categorical features
# =========================
categorical_cols = [
    "season",
    "district",
    "potato_variety",
    "soil_type",
    "crop_quality",
]

label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# =========================
# Define X and y
# =========================
X = df.drop(
    columns=[
        "selling_price_lkr_per_kg",
        "actual_yield_kg_per_acre",
    ]
)

y_price = df["selling_price_lkr_per_kg"]
y_yield = df["actual_yield_kg_per_acre"]

print("X shape:", X.shape)

# =========================
# Train-test split
# =========================
X_train, X_test, y_price_train, y_price_test, y_yield_train, y_yield_test = train_test_split(
    X, y_price, y_yield, test_size=0.2, random_state=42
)

# =========================
# Scaling
# =========================
scaler = RobustScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# =========================
# Model definitions
# =========================
def build_models():
    return {
        "xgb": xgb.XGBRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=7,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
        ),
        "lgb": lgb.LGBMRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=7,
            num_leaves=31,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
        ),
        "rf": RandomForestRegressor(
            n_estimators=250,
            max_depth=18,
            min_samples_leaf=2,
            n_jobs=-1,
            random_state=42,
        ),
    }

price_models = build_models()
yield_models = build_models()

# =========================
# Train models
# =========================
price_scores = {}
yield_scores = {}

print("\nTraining price models...")
for name, model in price_models.items():
    model.fit(X_train_scaled, y_price_train)
    preds = model.predict(X_test_scaled)
    price_scores[name] = r2_score(y_price_test, preds)
    print(f"Price {name} R²:", round(price_scores[name], 4))

print("\nTraining yield models...")
for name, model in yield_models.items():
    model.fit(X_train_scaled, y_yield_train)
    preds = model.predict(X_test_scaled)
    yield_scores[name] = r2_score(y_yield_test, preds)
    print(f"Yield {name} R²:", round(yield_scores[name], 4))

# =========================
# Select best models
# =========================
best_price_model_name = max(price_scores, key=price_scores.get)
best_yield_model_name = max(yield_scores, key=yield_scores.get)

best_price_model = price_models[best_price_model_name]
best_yield_model = yield_models[best_yield_model_name]

print("\nBest price model:", best_price_model_name)
print("Best yield model:", best_yield_model_name)

# =========================
# Save artifacts to models/
# =========================
with open(os.path.join(MODELS_DIR, "best_price_model.pkl"), "wb") as f:
    pickle.dump(best_price_model, f)

with open(os.path.join(MODELS_DIR, "best_yield_model.pkl"), "wb") as f:
    pickle.dump(best_yield_model, f)

with open(os.path.join(MODELS_DIR, "scaler.pkl"), "wb") as f:
    pickle.dump(scaler, f)

with open(os.path.join(MODELS_DIR, "label_encoders.pkl"), "wb") as f:
    pickle.dump(label_encoders, f)

with open(os.path.join(MODELS_DIR, "feature_columns.pkl"), "wb") as f:
    pickle.dump(list(X.columns), f)

print("\nAll models and artifacts saved to", MODELS_DIR)
print("=" * 80)
