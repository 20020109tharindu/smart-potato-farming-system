import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../firebase';

// ================================================================
// GROWTH STAGE OPTIONS
// ================================================================
const GROWTH_STAGES = [
  { value: 0, label: 'Germination' },
  { value: 1, label: 'Vegetative Growth' },
  { value: 2, label: 'Tuber Initiation' },
  { value: 3, label: 'Maturation' },
];

// ================================================================
// HELPER — action type styles
// ================================================================
const ACTION_STYLES = {
  critical: 'bg-red-50 border-red-400 text-red-800',
  warning:  'bg-yellow-50 border-yellow-400 text-yellow-800',
  info:     'bg-blue-50 border-blue-400 text-blue-700',
  success:  'bg-green-50 border-green-400 text-green-800',
};

const ACTION_ICONS = {
  critical: '!',
  warning:  '!',
  info:     'i',
  success:  'v',
};

// ================================================================
// MAIN COMPONENT
// ================================================================
export default function SoilHealth() {
  const [activeTab,   setActiveTab]   = useState('live');
  const [liveData,    setLiveData]    = useState(null);
  const [liveStatus,  setLiveStatus]  = useState('connecting');  // connecting | live | error
  const [lastUpdated, setLastUpdated] = useState(null);

  const [growthStage, setGrowthStage] = useState(1);
  const [predicting,  setPredicting]  = useState(false);
  const [prediction,  setPrediction]  = useState(null);
  const [predError,   setPredError]   = useState(null);

  // Manual form (override)
  const [manualForm, setManualForm] = useState({
    pH: '', EC: '', N: '', P: '', K: '', Temperature: '', Moisture: ''
  });

  // ----------------------------------------------------------------
  // Firebase Realtime Database — live sensor data
  // ----------------------------------------------------------------
  useEffect(() => {
    const soilRef = ref(realtimeDb, '/soil');
    const unsubscribe = onValue(
      soilRef,
      (snapshot) => {
        const raw = snapshot.val();
        if (!raw) {
          setLiveStatus('error');
          return;
        }
        // Map Firebase fields → display + model input
        // conductivity from sensor is in uS/cm → convert to mS/cm
        setLiveData({
          pH:          raw.pH          ?? null,
          EC:          raw.conductivity != null ? raw.conductivity / 1000 : null,
          N:           raw.nitrogen     ?? null,
          P:           raw.phosphorus   ?? null,
          K:           raw.potassium    ?? null,
          Temperature: raw.temperature  ?? null,
          Moisture:    raw.moisture     ?? null,
          // raw fields for display cards
          raw_conductivity: raw.conductivity ?? null,
        });
        setLastUpdated(new Date());
        setLiveStatus('live');
      },
      () => setLiveStatus('error')
    );
    return () => unsubscribe();
  }, []);

  // ----------------------------------------------------------------
  // PREDICT using live sensor data
  // ----------------------------------------------------------------
  const handlePredictLive = async () => {
    if (!liveData) return;
    setPredicting(true);
    setPrediction(null);
    setPredError(null);
    await runPrediction({ ...liveData, Growth_Stage: growthStage });
    setPredicting(false);
  };

  // PREDICT using manual form
  const handlePredictManual = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setPrediction(null);
    setPredError(null);
    await runPrediction({
      pH:          parseFloat(manualForm.pH),
      EC:          parseFloat(manualForm.EC),
      N:           parseFloat(manualForm.N),
      P:           parseFloat(manualForm.P),
      K:           parseFloat(manualForm.K),
      Temperature: parseFloat(manualForm.Temperature),
      Moisture:    parseFloat(manualForm.Moisture),
      Growth_Stage: growthStage,
    });
    setPredicting(false);
  };

  const runPrediction = async (payload) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/soil/predict', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        setPredError(data.error);
      } else {
        setPrediction(data);
      }
    } catch {
      setPredError('Cannot connect to backend. Make sure the Flask server is running on port 5000.');
    }
  };

  // ----------------------------------------------------------------
  // RENDER HELPERS
  // ----------------------------------------------------------------
  const SuitabilityBadge = ({ result }) => {
    const colorMap = { green: 'bg-green-100 text-green-800 border-green-300',
                        orange: 'bg-orange-100 text-orange-800 border-orange-300',
                        red:   'bg-red-100 text-red-800 border-red-300' };
    return (
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${colorMap[result.color] || 'bg-gray-100'}`}>
        {result.label}
      </span>
    );
  };

  const NpkBadge = ({ status }) => {
    const map = {
      Low:      'bg-red-100 text-red-700',
      Adequate: 'bg-green-100 text-green-700',
      High:     'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status.label] || 'bg-gray-100'}`}>
        {status.label}
      </span>
    );
  };

  const SensorCard = ({ label, value, unit, optimal }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {value != null ? value : <span className="text-gray-300 text-lg">--</span>}
        {value != null && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
      {optimal && <p className="text-xs text-gray-400">Optimal: {optimal}</p>}
    </div>
  );

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Soil Health Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">
          Real-time IoT sensor data from Firebase — smart potato farming, Badulla District
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'live',   label: 'Live Sensor Data' },
          { key: 'manual', label: 'Manual Input' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPrediction(null); setPredError(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================
          TAB 1 — LIVE SENSOR DATA
          ============================================================ */}
      {activeTab === 'live' && (
        <div className="space-y-5">

          {/* Connection status bar */}
          <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${
            liveStatus === 'live'       ? 'bg-green-50 text-green-700' :
            liveStatus === 'error'      ? 'bg-red-50 text-red-700' :
                                          'bg-yellow-50 text-yellow-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              liveStatus === 'live'  ? 'bg-green-500 animate-pulse' :
              liveStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
            }`} />
            {liveStatus === 'live'  && `Live — last updated: ${lastUpdated?.toLocaleTimeString()}`}
            {liveStatus === 'error' && 'Cannot read sensor data from Firebase. Check database rules and ESP32 connection.'}
            {liveStatus === 'connecting' && 'Connecting to Firebase Realtime Database...'}
          </div>

          {/* Sensor cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <SensorCard label="pH"          value={liveData?.pH}          unit=""       optimal="5.5 – 6.5" />
            <SensorCard label="EC"          value={liveData?.EC?.toFixed(3)} unit="mS/cm" optimal="0.05 – 0.16" />
            <SensorCard label="Nitrogen (N)" value={liveData?.N}           unit="ppm"    optimal="Stage-based" />
            <SensorCard label="Phosphorus (P)" value={liveData?.P}         unit="ppm"    optimal="Stage-based" />
            <SensorCard label="Potassium (K)" value={liveData?.K}          unit="ppm"    optimal="Stage-based" />
            <SensorCard label="Temperature"  value={liveData?.Temperature} unit="°C"     optimal="15 – 22°C" />
            <SensorCard label="Moisture"     value={liveData?.Moisture}    unit="%"      optimal="Stage-based" />
            <SensorCard label="Conductivity (raw)" value={liveData?.raw_conductivity} unit="µS/cm" />
          </div>

          {/* Growth stage selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Current Growth Stage
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Growth stage cannot be detected by sensors — select manually based on the field condition.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GROWTH_STAGES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setGrowthStage(s.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    growthStage === s.value
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Predict button */}
          <button
            onClick={handlePredictLive}
            disabled={!liveData || liveStatus !== 'live' || predicting}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm
                       hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {predicting ? 'Analyzing...' : 'Analyze Soil Suitability'}
          </button>
        </div>
      )}

      {/* ============================================================
          TAB 2 — MANUAL INPUT
          ============================================================ */}
      {activeTab === 'manual' && (
        <form onSubmit={handlePredictManual} className="space-y-5">

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Enter Soil Parameters</h2>
            <p className="text-xs text-gray-500 mb-4">
              Note: Humidity is not required. EC should be in mS/cm (if sensor gives µS/cm, divide by 1000).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { key: 'pH',          label: 'pH',                placeholder: '5.5 – 6.5',  step: '0.01' },
                { key: 'EC',          label: 'EC (mS/cm)',        placeholder: '0.05 – 0.20', step: '0.001' },
                { key: 'N',           label: 'Nitrogen (ppm)',    placeholder: '10 – 80',    step: '0.1' },
                { key: 'P',           label: 'Phosphorus (ppm)',  placeholder: '15 – 155',   step: '0.1' },
                { key: 'K',           label: 'Potassium (ppm)',   placeholder: '140 – 385',  step: '0.1' },
                { key: 'Temperature', label: 'Temperature (°C)',  placeholder: '13 – 28',    step: '0.1' },
                { key: 'Moisture',    label: 'Soil Moisture (%)', placeholder: '32 – 77',    step: '0.1' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input
                    type="number"
                    step={f.step}
                    placeholder={f.placeholder}
                    value={manualForm[f.key]}
                    onChange={(e) => setManualForm({ ...manualForm, [f.key]: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Growth stage */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Growth Stage</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GROWTH_STAGES.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setGrowthStage(s.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    growthStage === s.value
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={predicting}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm
                       hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {predicting ? 'Analyzing...' : 'Analyze Soil Suitability'}
          </button>
        </form>
      )}

      {/* ============================================================
          PREDICTION ERROR
          ============================================================ */}
      {predError && (
        <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl p-4">
          {predError}
        </div>
      )}

      {/* ============================================================
          PREDICTION RESULTS
          ============================================================ */}
      {prediction && (
        <div className="space-y-4">

          {/* Suitability banner */}
          <div className={`rounded-xl p-5 border ${
            prediction.soil_suitability.color === 'green'  ? 'bg-green-50 border-green-300' :
            prediction.soil_suitability.color === 'orange' ? 'bg-orange-50 border-orange-300' :
                                                              'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Soil Suitability — {prediction.growth_stage.label}
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <SuitabilityBadge result={prediction.soil_suitability} />
                  {prediction.confidence != null && (
                    <span className="text-sm text-gray-600">
                      Confidence: <strong>{prediction.confidence}%</strong>
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{prediction.soil_suitability.description}</p>
              </div>
            </div>
          </div>

          {/* NPK Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">NPK Nutrient Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {['n', 'p', 'k'].map((key) => (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    {key === 'n' ? 'Nitrogen (N)' : key === 'p' ? 'Phosphorus (P)' : 'Potassium (K)'}
                  </p>
                  <NpkBadge status={prediction.npk_status[key]} />
                </div>
              ))}
            </div>
          </div>

          {/* Fertilizer Recommendations */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Fertilizer Recommendations (kg/acre)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: 'urea',    label: 'Urea',           desc: 'Nitrogen source' },
                { key: 'tsp',     label: 'TSP',            desc: 'Triple Super Phosphate' },
                { key: 'mop',     label: 'MOP',            desc: 'Muriate of Potash' },
                { key: 'organic', label: 'Organic',        desc: 'Organic fertilizer' },
              ].map((f) => (
                <div key={f.key} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">{f.label}</p>
                  <p className="text-xl font-bold text-green-700 my-1">
                    {prediction.fertilizers[f.key]}
                  </p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Corrective Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Corrective Actions</h3>
            <div className="space-y-2">
              {prediction.corrective_actions.map((action, i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-start text-sm border-l-4 pl-3 py-2 rounded-r-lg ${ACTION_STYLES[action.type] || 'bg-gray-50 border-gray-300'}`}
                >
                  <span className="font-bold text-xs mt-0.5 min-w-[16px]">
                    {ACTION_ICONS[action.type]}
                  </span>
                  <span>{action.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
