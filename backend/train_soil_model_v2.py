import pickle
from pathlib import Path

import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent
TRAIN_CSV = BASE_DIR.parent / 'train_soil_v2.csv'
TEST_CSV = BASE_DIR.parent / 'test_soil_v2.csv'
OUTPUT_PKL = BASE_DIR / 'model' / 'best_soil_model.pkl'

FEATURES = ['pH', 'EC', 'N', 'P', 'K', 'Temperature', 'Moisture', 'Growth_Stage']

CLASS_TARGETS = ['Soil_Suitability', 'N_Status', 'P_Status', 'K_Status']
REG_TARGETS = ['Recommended_Urea', 'Recommended_TSP', 'Recommended_MOP', 'Recommended_Organic']


def fit_classifier(x_train, y_train, x_test, y_test, label):
    if label == 'Soil_Suitability':
        model = GradientBoostingClassifier(random_state=42)
    else:
        model = RandomForestClassifier(
            n_estimators=300,
            random_state=42,
            class_weight='balanced',
            n_jobs=-1,
        )
    model.fit(x_train, y_train)
    train_acc = accuracy_score(y_train, model.predict(x_train))
    test_acc = accuracy_score(y_test, model.predict(x_test))
    print(f'{label} accuracy: train={train_acc:.3f} test={test_acc:.3f}')
    return model


def fit_regressor(x_train, y_train, x_test, y_test, label):
    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(x_train, y_train)
    train_pred = model.predict(x_train)
    test_pred = model.predict(x_test)
    train_mae = mean_absolute_error(y_train, train_pred)
    test_mae = mean_absolute_error(y_test, test_pred)
    train_r2 = r2_score(y_train, train_pred)
    test_r2 = r2_score(y_test, test_pred)
    print(f'{label} MAE: train={train_mae:.3f} test={test_mae:.3f} | R2: train={train_r2:.3f} test={test_r2:.3f}')
    return model


def main():
    train_df = pd.read_csv(TRAIN_CSV)
    test_df = pd.read_csv(TEST_CSV)

    x_train = train_df[FEATURES]
    x_test = test_df[FEATURES]

    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)

    models = {}

    print('--- Classification models ---')
    for target in CLASS_TARGETS:
        models[target] = fit_classifier(
            x_train_scaled,
            train_df[target],
            x_test_scaled,
            test_df[target],
            target,
        )

    print('--- Regression models ---')
    for target in REG_TARGETS:
        models[target] = fit_regressor(
            x_train_scaled,
            train_df[target],
            x_test_scaled,
            test_df[target],
            target,
        )

    bundle = {
        'version': '2.2',
        'feature_columns': FEATURES,
        'scaler': scaler,
        'models': models,
    }

    OUTPUT_PKL.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PKL, 'wb') as f:
        pickle.dump(bundle, f)

    print(f'Bundle saved to: {OUTPUT_PKL}')


if __name__ == '__main__':
    main()
