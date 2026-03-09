import os
import pickle
import pandas as pd

# ================================================================
# SOIL MONITORING MODULE v2.0
# Features: pH, EC, N, P, K, Temperature, Moisture, Growth_Stage
# Humidity: EXCLUDED
#
# Supports two PKL formats:
#  - New bundle PKL (from Google Colab v2.0 training code)
#    Keys: version, feature_columns, models (dict), scaler, ...
#  - Old PKL (from PP1)
#    Keys: model, scaler, feature_names, model_type, target
# ================================================================

BUNDLE_PATH = os.path.join(os.path.dirname(__file__), 'model', 'best_soil_model.pkl')
_bundle     = None
_pkl_type   = None   # 'new_bundle' | 'old'


def load_bundle():
    global _bundle, _pkl_type
    if _bundle is None:
        try:
            with open(BUNDLE_PATH, 'rb') as f:
                _bundle = pickle.load(f)

            # Detect PKL type
            if isinstance(_bundle, dict) and 'models' in _bundle and isinstance(_bundle['models'], dict):
                _pkl_type = 'new_bundle'
                print(f"Soil model bundle loaded (new format v{_bundle.get('version','?')}).")
                print(f"Features: {_bundle.get('feature_columns', [])}")
            elif isinstance(_bundle, dict) and 'model' in _bundle:
                _pkl_type = 'old'
                print("Soil model loaded (old PP1 format). NPK/fertilizer predictions will use rule-based fallback.")
            else:
                _pkl_type = 'unknown'
                print("Warning: Unknown PKL format.")

        except Exception as e:
            print(f"Error loading soil model bundle: {e}")
            _bundle   = None
            _pkl_type = None
    return _bundle


# ================================================================
# LABEL MAPS
# ================================================================
SS_LABELS = {0: 'Not Suitable', 1: 'Marginally Suitable', 2: 'Suitable'}
SS_COLORS = {0: 'red',          1: 'orange',              2: 'green'}
SS_DESC   = {
    0: 'Soil conditions are not favorable for potato cultivation. Major corrections are required.',
    1: 'Soil requires amendments before planting. Apply corrections and retest.',
    2: 'Soil conditions are favorable for potato cultivation.',
}
NPK_LABELS = {0: 'Low', 1: 'Adequate', 2: 'High'}

STAGE_NAMES = {
    0: 'Germination',
    1: 'Vegetative Growth',
    2: 'Tuber Initiation',
    3: 'Maturation',
}

STAGE_RANGES = {
    0: {'pH': (5.5, 6.5), 'EC': (0.05, 0.15), 'Temperature': (15.0, 22.0), 'Moisture': (50.0, 70.0)},
    1: {'pH': (5.5, 6.5), 'EC': (0.06, 0.16), 'Temperature': (15.0, 22.0), 'Moisture': (55.0, 72.0)},
    2: {'pH': (5.5, 6.2), 'EC': (0.08, 0.16), 'Temperature': (14.0, 20.0), 'Moisture': (60.0, 75.0)},
    3: {'pH': (5.5, 6.5), 'EC': (0.05, 0.14), 'Temperature': (15.0, 22.0), 'Moisture': (40.0, 60.0)},
}

# Stage- and NPK-status-based fertilizer tables (kg/acre)
UREA_TABLE = {0:{0:6.0,1:3.0,2:0.0}, 1:{0:10.0,1:5.0,2:0.0}, 2:{0:8.0,1:3.0,2:0.0}, 3:{0:4.0,1:0.0,2:0.0}}
TSP_TABLE  = {0:{0:5.0,1:2.0,2:0.0}, 1:{0:6.0,1:2.0,2:0.0},  2:{0:8.0,1:3.0,2:0.0}, 3:{0:4.0,1:0.0,2:0.0}}
MOP_TABLE  = {0:{0:9.0,1:4.0,2:0.0}, 1:{0:10.0,1:5.0,2:0.0}, 2:{0:14.0,1:6.0,2:0.0},3:{0:7.0,1:3.0,2:0.0}}

NPK_THRESHOLDS = {
    # (N_low, N_high, P_low, P_high, K_low, K_high)
    0: (25, 55, 40, 100, 150, 280),
    1: (40, 80, 50, 120, 200, 320),
    2: (20, 50, 30, 100, 220, 350),
    3: (10, 40, 30,  90, 180, 300),
}


# ================================================================
# PREDICTION â€” handles new bundle and old PKL formats
# ================================================================
def predict(sensor_data):
    """
    Predict soil suitability and fertilizer recommendations.

    sensor_data (dict):
        pH, EC (mS/cm), N, P, K, Temperature, Moisture, Growth_Stage (int 0-3)
    """
    try:
        bundle = load_bundle()
        if bundle is None:
            return {'error': 'Model bundle could not be loaded. Check backend/model/best_soil_model.pkl'}

        growth_stage = int(float(sensor_data.get('Growth_Stage', 1)))

        # ---- NEW BUNDLE FORMAT ----
        if _pkl_type == 'new_bundle':
            return _predict_new_bundle(bundle, sensor_data, growth_stage)

        # ---- OLD PKL FORMAT ----
        elif _pkl_type == 'old':
            return _predict_old_format(bundle, sensor_data, growth_stage)

        else:
            return {'error': 'Unknown PKL format. Please re-train and replace the PKL file.'}

    except Exception as e:
        return {'error': str(e)}


def _predict_new_bundle(bundle, sensor_data, growth_stage):
    """Prediction using new bundle PKL (v2.0 from Google Colab)."""
    features = bundle['feature_columns']
    scaler   = bundle['scaler']
    models   = bundle['models']

    for f in features:
        if f not in sensor_data:
            return {'error': f'Missing required field: {f}'}

    input_values = [float(sensor_data[f]) for f in features]
    input_df     = pd.DataFrame([input_values], columns=features)
    input_sc     = scaler.transform(input_df)

    ss = int(models['Soil_Suitability'].predict(input_sc)[0])
    ns = int(models['N_Status'].predict(input_sc)[0])
    ps = int(models['P_Status'].predict(input_sc)[0])
    ks = int(models['K_Status'].predict(input_sc)[0])

    urea = max(0.0, float(models['Recommended_Urea'].predict(input_sc)[0]))
    tsp  = max(0.0, float(models['Recommended_TSP'].predict(input_sc)[0]))
    mop  = max(0.0, float(models['Recommended_MOP'].predict(input_sc)[0]))
    org  = max(0.0, float(models['Recommended_Organic'].predict(input_sc)[0]))

    confidence = None
    if hasattr(models['Soil_Suitability'], 'predict_proba'):
        proba      = models['Soil_Suitability'].predict_proba(input_sc)[0]
        confidence = round(float(max(proba)) * 100, 1)

    actions = get_corrective_actions(sensor_data, ns, ps, ks, ss, growth_stage)

    return _build_response(ss, confidence, ns, ps, ks, urea, tsp, mop, org, growth_stage, actions)


def _predict_old_format(bundle, sensor_data, growth_stage):
    """Prediction using old PP1 PKL. Uses rule-based NPK + fertilizer fallback."""
    model        = bundle['model']
    scaler       = bundle.get('scaler')
    feature_names = bundle.get('feature_names', ['pH', 'EC', 'P', 'K', 'Temperature', 'Humidity', 'Moisture', 'N'])
    use_scaling  = bundle.get('use_scaling', True)

    # Build input â€” provide 0.0 for unavailable features (Humidity not in new sensor data)
    input_values = []
    for f in feature_names:
        if f in sensor_data:
            input_values.append(float(sensor_data[f]))
        elif f.lower() == 'humidity':
            input_values.append(75.0)   # Humidity excluded from sensors â€” use neutral default
        else:
            return {'error': f'Missing required feature for old model: {f}'}

    input_df = pd.DataFrame([input_values], columns=feature_names)

    if use_scaling and scaler is not None:
        input_sc = scaler.transform(input_df)
    else:
        input_sc = input_df.values

    ss = int(model.predict(input_sc)[0])

    confidence = None
    if hasattr(model, 'predict_proba'):
        proba      = model.predict_proba(input_sc)[0]
        confidence = round(float(max(proba)) * 100, 1)

    # Rule-based NPK status and fertilizer doses (old model doesn't predict these)
    n, p, k  = float(sensor_data.get('N', 40)), float(sensor_data.get('P', 80)), float(sensor_data.get('K', 250))
    nt       = NPK_THRESHOLDS[growth_stage]
    ns = 0 if n < nt[0] else (1 if n <= nt[1] else 2)
    ps = 0 if p < nt[2] else (1 if p <= nt[3] else 2)
    ks = 0 if k < nt[4] else (1 if k <= nt[5] else 2)

    urea = UREA_TABLE[growth_stage][ns]
    tsp  = TSP_TABLE[growth_stage][ps]
    mop  = MOP_TABLE[growth_stage][ks]
    org  = 1000 if ss == 0 else (600 if ss == 1 else 0)

    actions = get_corrective_actions(sensor_data, ns, ps, ks, ss, growth_stage)

    return _build_response(ss, confidence, ns, ps, ks, urea, tsp, mop, org, growth_stage, actions)


def _build_response(ss, confidence, ns, ps, ks, urea, tsp, mop, org, growth_stage, actions):
    return {
        'soil_suitability': {
            'value':       ss,
            'label':       SS_LABELS[ss],
            'color':       SS_COLORS[ss],
            'description': SS_DESC[ss],
        },
        'confidence': confidence,
        'growth_stage': {
            'value': growth_stage,
            'label': STAGE_NAMES[growth_stage],
        },
        'npk_status': {
            'n': {'value': ns, 'label': NPK_LABELS[ns]},
            'p': {'value': ps, 'label': NPK_LABELS[ps]},
            'k': {'value': ks, 'label': NPK_LABELS[ks]},
        },
        'fertilizers': {
            'urea':    round(urea, 1),
            'tsp':     round(tsp,  1),
            'mop':     round(mop,  1),
            'organic': round(org,  0),
        },
        'corrective_actions': actions,
    }


# ================================================================
# STAGE-AWARE CORRECTIVE ACTIONS
# ================================================================
def get_corrective_actions(data, ns, ps, ks, ss, stage):
    actions = []
    ranges  = STAGE_RANGES[stage]
    sname   = STAGE_NAMES[stage]

    ph       = float(data.get('pH',          6.0))
    ec       = float(data.get('EC',          0.10))
    temp     = float(data.get('Temperature', 18.0))
    moisture = float(data.get('Moisture',    55.0))

    if ss == 0:
        actions.append({'type': 'critical',
            'message': 'Soil is not suitable for potato cultivation. Major corrections are required before planting.'})
    elif ss == 1:
        actions.append({'type': 'warning',
            'message': f'Soil is marginally suitable during {sname}. Apply amendments and retest before planting.'})

    ph_lo, ph_hi = ranges['pH']
    if ph < ph_lo:
        actions.append({'type': 'warning',
            'message': f'pH {ph} is too low for {sname} (optimal {ph_lo}-{ph_hi}). Apply dolomite lime to raise pH.'})
    elif ph > ph_hi:
        actions.append({'type': 'warning',
            'message': f'pH {ph} is too high for {sname} (optimal {ph_lo}-{ph_hi}). Apply elemental sulfur to lower pH.'})

    ec_lo, ec_hi = ranges['EC']
    if ec < ec_lo:
        actions.append({'type': 'info',
            'message': f'EC {ec:.3f} mS/cm is low for {sname}. Soil may have insufficient nutrients.'})
    elif ec > ec_hi:
        actions.append({'type': 'warning',
            'message': f'EC {ec:.3f} mS/cm is high for {sname}. Risk of salt stress. Irrigate to flush excess salts.'})

    if ns == 0:
        msg = ('Nitrogen is Low during Vegetative Growth. Apply Urea immediately â€” N is critical for leaf and vine development.'
               if stage == 1 else f'Nitrogen is Low during {sname}. Apply the recommended Urea dose.')
        actions.append({'type': 'critical' if stage == 1 else 'warning', 'message': msg})
    elif ns == 2:
        actions.append({'type': 'info',
            'message': f'Nitrogen is High during {sname}. Reduce or skip Urea application.'})

    if ps == 0:
        msg = (f'Phosphorus is Low during {sname}. Apply TSP immediately â€” P is critical for root and tuber development.'
               if stage in [0, 2] else f'Phosphorus is Low during {sname}. Apply the recommended TSP dose.')
        actions.append({'type': 'critical' if stage in [0, 2] else 'warning', 'message': msg})
    elif ps == 2:
        actions.append({'type': 'info',
            'message': f'Phosphorus is High during {sname}. Skip TSP application this cycle.'})

    if ks == 0:
        msg = ('Potassium is Low during Tuber Initiation. Apply MOP urgently â€” K is most critical for tuber quality at this stage.'
               if stage == 2 else f'Potassium is Low during {sname}. Apply the recommended MOP dose.')
        actions.append({'type': 'critical' if stage == 2 else 'warning', 'message': msg})
    elif ks == 2:
        actions.append({'type': 'info',
            'message': f'Potassium is High during {sname}. Reduce MOP application.'})

    t_lo, t_hi = ranges['Temperature']
    if temp < t_lo:
        actions.append({'type': 'info',
            'message': f'Temperature {temp}C is below optimal ({t_lo}-{t_hi}C) for {sname}. Apply mulching to retain soil warmth.'})
    elif temp > t_hi:
        actions.append({'type': 'warning',
            'message': f'Temperature {temp}C is above optimal ({t_lo}-{t_hi}C) for {sname}. Irrigate to cool the soil.'})

    m_lo, m_hi = ranges['Moisture']
    if moisture < m_lo:
        actions.append({'type': 'warning',
            'message': f'Soil moisture {moisture}% is too low for {sname} (optimal {m_lo}-{m_hi}%). Irrigate immediately.'})
    elif moisture > m_hi:
        actions.append({'type': 'warning',
            'message': f'Soil moisture {moisture}% is too high for {sname} (optimal {m_lo}-{m_hi}%). Improve drainage to prevent root rot.'})

    if not actions:
        actions.append({'type': 'success',
            'message': f'All soil parameters are within optimal range for {sname}. Proceed with normal farming practices.'})

    return actions
