import { useState, useRef } from "react";
import axios from "axios";

const API_URL        = "http://127.0.0.1:5000/api/predict-disease";
const ESP32_API_URL  = "http://127.0.0.1:5000/api/predict-from-esp32";

const CLASS_CONFIG = {
  "Early Blight": {
    icon: "🟠",
    gradient: "from-orange-500 to-amber-400",
    lightBg: "bg-orange-50",
    border: "border-orange-400",
    badge: "bg-orange-100 text-orange-800",
    bar: "bg-gradient-to-r from-orange-400 to-amber-400",
    description: "Fungal disease caused by Alternaria solani. Affects older leaves first with dark concentric spots.",
  },
  "Late Blight": {
    icon: "🔴",
    gradient: "from-red-600 to-rose-500",
    lightBg: "bg-red-50",
    border: "border-red-400",
    badge: "bg-red-100 text-red-800",
    bar: "bg-gradient-to-r from-red-500 to-rose-500",
    description: "Caused by Phytophthora infestans. Spreads rapidly in cool, wet conditions. Can destroy entire crops.",
  },
  Healthy: {
    icon: "🟢",
    gradient: "from-emerald-500 to-green-400",
    lightBg: "bg-emerald-50",
    border: "border-emerald-400",
    badge: "bg-emerald-100 text-emerald-800",
    bar: "bg-gradient-to-r from-emerald-500 to-green-400",
    description: "No disease detected. The leaf appears healthy with no signs of fungal or bacterial infection.",
  },
};

const FERTILIZER_CONFIG = {
  nitrogen:   { label: "Nitrogen (N)",    icon: "🌿", desc: "Leaf & stem growth" },
  phosphorus: { label: "Phosphorus (P)",  icon: "🌱", desc: "Root strength & immunity" },
  potassium:  { label: "Potassium (K)",   icon: "⚡", desc: "Disease resistance" },
};

const LEVEL_BADGE = {
  Low:          "bg-gray-100 text-gray-600",
  Medium:       "bg-yellow-100 text-yellow-700",
  High:         "bg-orange-100 text-orange-700",
  "Very High":  "bg-red-100 text-red-700",
  Maximum:      "bg-red-200 text-red-800 font-bold",
  Standard:     "bg-green-100 text-green-700",
  Balanced:     "bg-green-100 text-green-700",
};

const LEVEL_BAR = {
  Low:         { width: "20%",  color: "bg-gray-400" },
  Medium:      { width: "45%",  color: "bg-yellow-400" },
  High:        { width: "65%",  color: "bg-orange-400" },
  "Very High": { width: "85%",  color: "bg-red-400" },
  Maximum:     { width: "100%", color: "bg-red-600" },
  Standard:    { width: "40%",  color: "bg-green-400" },
  Balanced:    { width: "40%",  color: "bg-green-400" },
};

// ── Disease Area Visualization Panel ─────────────────────────────────────────
const VIZ_COLS = [
  {
    key:    "leaf_area",
    label:  "Leaf Area (Green)",
    border: "border-green-400",
    bg:     "#f0fdf4",
    badge:  "bg-green-100 text-green-700",
    badgeLabel: "Original + Contours",
  },
  {
    key:    "disease_mask",
    label:  "Disease Area (Red)",
    border: "border-rose-400",
    bg:     "#ffffff",
    badge:  "bg-rose-100 text-rose-700",
    badgeLabel: "Isolated Mask",
  },
  {
    key:     "combined",
    label:   "Combined Analysis",
    border:  "border-blue-400",
    bg:      "#f0f9ff",
    badge:   "bg-blue-100 text-blue-700",
    badgeLabel: "Overlay",
  },
];

function DiseaseVizPanel({ viz, predicted }) {
  const isHealthy  = predicted === "Healthy";
  const leafPx     = viz.leaf_pixels    ?? 0;
  const diseasePct = viz.disease_area_pct ?? 0;
  const healthyPct = leafPx > 0 ? Math.max(0, 100 - diseasePct) : 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">🔬</div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Disease Visualization</h3>
          <p className="text-xs text-gray-400">OpenCV image analysis</p>
        </div>
        {!isHealthy && (
          <span className="ml-auto text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">
            {diseasePct}% affected
          </span>
        )}
        {isHealthy && (
          <span className="ml-auto text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
            ✓ No disease areas
          </span>
        )}
      </div>

      {/* 3-column side-by-side images */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {VIZ_COLS.map((col) => (
          <div key={col.key} className="flex flex-col items-center">
            {/* Label + badge */}
            <p className="text-xs font-semibold text-gray-700 mb-1 text-center">{col.label}</p>
            {/* Image */}
            {viz[col.key] ? (
              <img
                src={viz[col.key]}
                alt={col.label}
                className={`w-full rounded-xl object-contain border-2 ${col.border}`}
                style={{ background: col.bg, maxHeight: "180px" }}
              />
            ) : (
              <div
                className={`w-full rounded-xl border-2 ${col.border} flex items-center justify-center`}
                style={{ height: "120px", background: col.bg }}
              >
                <span className="text-gray-400 text-xs">Not available</span>
              </div>
            )}
            <span className={`mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${col.badge}`}>
              {col.badgeLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Pixel stats bar */}
      {!isHealthy && leafPx > 0 && (
        <div className="px-5 pb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>🌿 Healthy tissue</span>
            <span>🔴 Diseased area</span>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 transition-all duration-700"
              style={{ width: `${healthyPct}%` }}
            />
            <div
              className="bg-red-500 transition-all duration-700"
              style={{ width: `${diseasePct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="text-emerald-600 font-semibold">{healthyPct.toFixed(1)}%</span>
            <span className="text-gray-400">{leafPx.toLocaleString()} leaf px total</span>
            <span className="text-red-600 font-semibold">{diseasePct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Severity colour stops for the gauge arc ──────────────────────────────────
function getGaugeColor(confidence, predicted) {
  if (predicted === "Healthy") return ["#10b981", "#34d399"]; // green
  if (predicted === "Late Blight") return ["#ef4444", "#f43f5e"]; // red
  return ["#f97316", "#fbbf24"]; // orange for Early Blight
}

function SeverityGauge({ confidence, predicted, cfg }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 62;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * r;
  // Arc goes from -225° to +45° (270° total sweep, starting bottom-left)
  const sweepAngle = 270;
  const startAngle = -225; // degrees
  const pct = Math.min(Math.max(confidence, 0), 100);
  const filled = (pct / 100) * sweepAngle;

  // Convert angle to path
  function polarToCartesian(angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(startDeg, endDeg) {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackPath = describeArc(startAngle, startAngle + sweepAngle);
  const fillPath = filled > 0 ? describeArc(startAngle, startAngle + filled) : null;
  const [colorA, colorB] = getGaugeColor(confidence, predicted);

  // Severity label
  const severityLabel =
    predicted === "Healthy"
      ? "No Disease"
      : pct >= 90 ? "Very High" : pct >= 70 ? "High" : pct >= 50 ? "Moderate" : "Low";

  const severityColor =
    predicted === "Healthy" ? "text-emerald-600"
    : pct >= 90 ? "text-red-600"
    : pct >= 70 ? "text-orange-600"
    : pct >= 50 ? "text-amber-600"
    : "text-yellow-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Severity Visualization</p>
      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Circular gauge */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorA} />
                <stop offset="100%" stopColor={colorB} />
              </linearGradient>
            </defs>
            {/* Track */}
            <path
              d={trackPath}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Filled arc */}
            {fillPath && (
              <path
                d={fillPath}
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.15))" }}
              />
            )}
          </svg>
          {/* Centre text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-extrabold ${severityColor}`}>{pct}%</span>
            <span className="text-xs text-gray-400 mt-0.5">confidence</span>
          </div>
        </div>

        {/* Right side: severity scale + label */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700">Severity Level</span>
            <span className={`text-sm font-bold ${severityColor}`}>{severityLabel}</span>
          </div>

          {/* Gradient scale bar */}
          <div className="relative h-5 rounded-full overflow-hidden mb-3"
            style={{ background: "linear-gradient(to right, #10b981, #84cc16, #facc15, #f97316, #ef4444)" }}>
            {/* Marker */}
            <div
              className="absolute top-0 h-full w-1.5 bg-white shadow-md rounded-full transition-all duration-700"
              style={{
                left: `calc(${pct}% - 3px)`,
                boxShadow: "0 0 6px rgba(0,0,0,0.35)"
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>Low</span><span>Moderate</span><span>High</span><span>Critical</span>
          </div>

          {/* Mini stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Prediction", value: predicted, color: severityColor },
              { label: "Confidence", value: `${pct}%`, color: severityColor },
              { label: "Risk Level", value: severityLabel, color: severityColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className={`text-xs font-bold truncate ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiseasePredictor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [esp32Ip, setEsp32Ip] = useState("172.20.10.2");
  const [esp32Loading, setEsp32Loading] = useState(false);
  const inputRef = useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError(null);
    setResult(null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyze(e) {
    e?.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(API_URL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      setResult(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err.message ||
          "Connection failed. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function captureFromESP32() {
    setEsp32Loading(true);
    setError(null);
    setResult(null);
    setPreview(null);
    setFile(null);
    try {
      const res = await axios.post(ESP32_API_URL, { esp32_ip: esp32Ip }, { timeout: 30000 });
      setResult(res.data);
      // Show the combined visualization as the preview
      if (res.data?.visualizations?.combined) {
        setPreview(res.data.visualizations.combined);
      }
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err.message ||
          "ESP32 capture failed. Make sure ESP32-CAM is connected to the same WiFi."
      );
    } finally {
      setEsp32Loading(false);
    }
  }

  const cfg = result?.predicted_class ? CLASS_CONFIG[result.predicted_class] : null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top Banner ── */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 px-8 py-6 flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">✓</div>
        <div>
          <h1 className="text-2xl font-bold text-white">Potato Leaf Disease Predictor</h1>
          <p className="text-green-100 text-sm">Advanced AI-powered disease analysis and fertilizer recommendations</p>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">

        {/* ══ LEFT — Upload ══ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 text-lg">🖼</div>
            <div>
              <h2 className="font-semibold text-gray-800">Upload Leaf</h2>
              <p className="text-xs text-gray-500">Select a high-quality image</p>
            </div>
          </div>

          <div className="p-6">
            {/* Drop zone */}
            <div
              className={`rounded-xl overflow-hidden border-2 border-dashed transition-colors cursor-pointer mb-4
                ${preview ? "border-emerald-300 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-300"}`}
              style={{ minHeight: 260 }}
              onClick={() => !preview && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setError(null); setResult(null); }
              }}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Leaf" className="w-full object-contain max-h-72" />
                  <button
                    onClick={(e) => { e.stopPropagation(); clearAll(); }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="text-5xl mb-3">🍃</div>
                  <p className="font-medium text-gray-600">Drag & drop or click to upload</p>
                  <p className="text-xs text-gray-400 mt-1">JPEG / PNG • Max 10 MB</p>
                </div>
              )}
            </div>

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
                <span className="mt-0.5">⚠️</span><span>{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors text-sm"
              >
                📁 Choose Image
              </button>
              <button
                onClick={analyze}
                disabled={!file || loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all
                  ${!file || loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Analyzing...
                  </>
                ) : <>🔍 Analyze Image</>}
              </button>
              {(file || result) && (
                <button onClick={clearAll} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium">
                  ↺ Reset
                </button>
              )}
            </div>

            {/* ── ESP32-CAM section ── */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📷</span>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ESP32-CAM Live Capture</p>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={esp32Ip}
                  onChange={(e) => setEsp32Ip(e.target.value)}
                  placeholder="172.20.10.2"
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300 font-mono"
                />
                <a
                  href={`http://${esp32Ip}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 text-xs rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium whitespace-nowrap"
                >
                  🔴 Live
                </a>
              </div>
              <button
                onClick={captureFromESP32}
                disabled={esp32Loading || loading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all
                  ${ esp32Loading || loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"}`}
              >
                {esp32Loading ? (
                  <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>Capturing...</>
                ) : <>📸 Capture &amp; Analyze from ESP32-CAM</>}
              </button>
            </div>
          </div>

          {/* Detectable conditions (shown when no result) */}
          {!result && !loading && (
            <div className="px-6 pb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Detectable Conditions</p>
              <div className="space-y-2">
                {Object.entries(CLASS_CONFIG).map(([name, c]) => (
                  <div key={name} className={`${c.lightBg} rounded-xl p-3 flex items-start gap-3 border ${c.border}`}>
                    <span className="text-xl mt-0.5">{c.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT — Results ══ */}
        <div className="space-y-5">

          {/* Analysis Results card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-lg">⚡</div>
              <div>
                <h2 className="font-semibold text-gray-800">Analysis Results</h2>
                <p className="text-xs text-gray-500">
                  {result ? "Prediction complete" : loading ? "Processing..." : "Waiting for image"}
                </p>
              </div>
              {result && cfg && (
                <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${cfg.badge}`}>
                  {cfg.icon} {result.predicted_class}
                </span>
              )}
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                <div className="h-4 bg-gray-200 rounded-lg w-full" />
                <div className="h-4 bg-gray-200 rounded-lg w-4/5" />
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !result && (
              <div className="p-10 text-center text-gray-400">
                <div className="text-5xl mb-3">🔬</div>
                <p className="font-medium">No analysis yet</p>
                <p className="text-sm mt-1">Upload a leaf image and click Analyze</p>
              </div>
            )}

            {/* ── PREDICTION ── */}
            {result && cfg && (
              <div className="p-6">
                {/* Big gradient result card */}
                <div className={`rounded-2xl bg-gradient-to-br ${cfg.gradient} p-5 text-white mb-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white/70 text-xs uppercase font-semibold tracking-wider">Detected Disease</p>
                      <h3 className="text-2xl font-bold mt-1">{result.predicted_class}</h3>
                    </div>
                    <div className="text-5xl opacity-80">{cfg.icon}</div>
                  </div>
                  <p className="text-white/80 text-sm mb-4">{cfg.description}</p>
                  <div>
                    <div className="flex justify-between text-xs text-white/70 mb-1">
                      <span>Model Confidence</span>
                      <span className="font-bold text-white">{result.confidence}%</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2.5">
                      <div className="bg-white h-2.5 rounded-full transition-all duration-700" style={{ width: `${result.confidence}%` }} />
                    </div>
                  </div>
                </div>

                {/* ── Severity Gauge ── */}
                <SeverityGauge confidence={result.confidence} predicted={result.predicted_class} cfg={cfg} />

                {/* ── Disease Area Visualization ── */}
                {result.visualizations && (
                  <DiseaseVizPanel viz={result.visualizations} predicted={result.predicted_class} />
                )}

                {/* Class probabilities */}
                {result.class_probabilities?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-3">All Class Probabilities</p>
                    <div className="space-y-3">
                      {result.class_probabilities.map((item) => {
                        const c = CLASS_CONFIG[item.class];
                        const isTop = item.class === result.predicted_class;
                        return (
                          <div
                            key={item.class}
                            className={`rounded-xl p-3 border transition-all ${
                              isTop ? `${c?.lightBg || "bg-gray-50"} ${c?.border || "border-gray-200"}` : "bg-gray-50 border-gray-100"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span>{c?.icon || "⚪"}</span>
                                <span className={`text-sm font-semibold ${isTop ? "text-gray-900" : "text-gray-600"}`}>{item.class}</span>
                                {isTop && (
                                  <span className="text-xs bg-white border border-emerald-300 px-2 py-0.5 rounded-full text-emerald-700 font-medium">
                                    ✓ Predicted
                                  </span>
                                )}
                              </div>
                              <span className={`text-sm font-bold ${isTop ? "text-gray-900" : "text-gray-500"}`}>{item.probability}%</span>
                            </div>
                            <div className="bg-white rounded-full h-2 overflow-hidden">
                              <div className={`h-2 rounded-full transition-all duration-700 ${c?.bar || "bg-gray-400"}`} style={{ width: `${item.probability}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ══ FERTILIZER RECOMMENDATIONS ══ */}
          {result?.recommendation && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 text-lg">🧪</div>
                <div>
                  <h2 className="font-semibold text-gray-800">Fertilizer Recommendations</h2>
                  <p className="text-xs text-gray-500">Based on disease type and plant needs</p>
                </div>
              </div>

              <div className="p-6">
                {/* N-P-K cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {Object.entries(FERTILIZER_CONFIG).map(([key, fc]) => {
                    const level = result.recommendation[key] || "—";
                    const bar = LEVEL_BAR[level] || { width: "30%", color: "bg-gray-400" };
                    const badge = LEVEL_BADGE[level] || "bg-gray-100 text-gray-600";
                    return (
                      <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center text-center">
                        <span className="text-2xl mb-1">{fc.icon}</span>
                        <p className="text-xs text-gray-500 font-medium mb-2">{fc.label}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-3 ${badge}`}>{level}</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div className={`${bar.color} h-1.5 rounded-full`} style={{ width: bar.width }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{fc.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Action + Fertilizer plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-2">⚕️ Immediate Action</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation.action}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-amber-600 uppercase mb-2">💊 Fertilizer Plan</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation.fertilizer}</p>
                  </div>
                </div>

                {/* Tips */}
                {result.recommendation.tips?.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-emerald-600 uppercase mb-3">💡 Management Tips</p>
                    <ul className="space-y-2">
                      {result.recommendation.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Severity alert */}
          {result?.recommendation?.severity && result.recommendation.severity !== "none" && (
            <div className={`rounded-2xl p-4 border flex items-center gap-4
              ${result.recommendation.severity === "high" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
              <span className="text-3xl">{result.recommendation.severity === "high" ? "🚨" : "⚠️"}</span>
              <div>
                <p className={`font-bold text-sm ${result.recommendation.severity === "high" ? "text-red-700" : "text-orange-700"}`}>
                  {result.recommendation.severity === "high" ? "HIGH SEVERITY — Act Immediately" : "MODERATE SEVERITY — Monitor Closely"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {result.recommendation.severity === "high"
                    ? "Late Blight can destroy an entire crop within days. Immediate fungicide application is critical."
                    : "Early Blight is manageable with timely treatment. Follow the recommendations above."}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}