import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_URL        = "http://127.0.0.1:5000/api/predict-disease";
const ESP32_API_URL  = "http://127.0.0.1:5000/api/predict-from-esp32";
const REPORTS_API    = "http://127.0.0.1:5000/api/disease-reports";
const ESP32_BASE_URL = "http://10.81.119.16";
const ESP32_STREAM_URL = "http://10.81.119.16:81/stream";
const ESP32_CAPTURE_URL = "http://10.81.119.16/capture";

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
  Moderate:     "bg-yellow-100 text-yellow-700",
  High:         "bg-orange-100 text-orange-700",
  Critical:     "bg-red-100 text-red-700",
  Maximum:      "bg-red-200 text-red-800 font-bold",
  Standard:     "bg-green-100 text-green-700",
  Balanced:     "bg-green-100 text-green-700",
};

const LEVEL_BAR = {
  Low:         { width: "20%",  color: "bg-gray-400" },
  Moderate:    { width: "45%",  color: "bg-yellow-400" },
  High:        { width: "65%",  color: "bg-orange-400" },
  Critical:    { width: "85%",  color: "bg-red-400" },
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
function getGaugeColor(diseaseAreaPct, predicted) {
  if (predicted === "Healthy") return ["#10b981", "#34d399"]; // green
  if (diseaseAreaPct >= 80) return ["#ef4444", "#f43f5e"]; // red – critical
  if (diseaseAreaPct >= 50) return ["#f97316", "#ef4444"]; // orange-red – high
  if (diseaseAreaPct >= 20) return ["#fbbf24", "#f97316"]; // amber-orange – medium
  return ["#84cc16", "#facc15"]; // lime-yellow – low
}

function SeverityGauge({ diseaseAreaPct = 0, predicted }) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 62;
  const strokeWidth = 14;

  // ── Severity is based on DISEASE AREA %, not model confidence ──
  const sevPct = predicted === "Healthy" ? 0 : Math.min(Math.max(diseaseAreaPct, 0), 100);

  const sweepAngle = 270;
  const startAngle = -225;
  const filled = (sevPct / 100) * sweepAngle;

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
  const [colorA, colorB] = getGaugeColor(sevPct, predicted);

  // Severity label based on disease area %
  const severityLabel =
    sevPct >= 80 ? "Critical" : sevPct >= 50 ? "High" : sevPct >= 20 ? "Moderate" : "Low";

  const severityColor =
    sevPct >= 80 ? "text-red-700"
    : sevPct >= 50 ? "text-red-600"
    : sevPct >= 20 ? "text-orange-600"
    : "text-emerald-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase mb-4">Disease Severity Assessment</p>
      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Circular gauge — shows disease area % */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size}>
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorA} />
                <stop offset="100%" stopColor={colorB} />
              </linearGradient>
            </defs>
            <path d={trackPath} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
            {fillPath && (
              <path d={fillPath} fill="none" stroke="url(#gaugeGrad)" strokeWidth={strokeWidth} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.15))" }} />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-extrabold ${severityColor}`}>{sevPct}%</span>
            <span className="text-[10px] text-gray-400 mt-0.5">disease area</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700">Severity Level</span>
            <span className={`text-sm font-bold ${severityColor}`}>{severityLabel}</span>
          </div>

          {/* Gradient scale bar — marker at disease area % */}
          <div className="relative h-5 rounded-full overflow-hidden mb-3"
            style={{ background: "linear-gradient(to right, #10b981, #84cc16, #facc15, #f97316, #ef4444)" }}>
            <div
              className="absolute top-0 h-full w-1.5 bg-white shadow-md rounded-full transition-all duration-700"
              style={{ left: `calc(${sevPct}% - 3px)`, boxShadow: "0 0 6px rgba(0,0,0,0.35)" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mb-4">
            <span>Low</span><span>Moderate</span><span>High</span><span>Critical</span>
          </div>

          {/* Mini stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Prediction", value: predicted, color: severityColor },
              { label: "Disease Area", value: `${sevPct}%`, color: severityColor },
              { label: "Severity", value: severityLabel, color: severityColor },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                <p className={`text-xs font-bold truncate ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Disease Map helpers ───────────────────────────────────────────────────────
const MAP_COLORS = {
  "Early Blight": "#f97316",
  "Late Blight": "#ef4444",
  Healthy: "#22c55e",
  Unknown: "#6b7280",
};

const MAP_SEVERITY_BADGE = {
  Low: "bg-yellow-100 text-yellow-800",
  Moderate: "bg-orange-100 text-orange-800",
  High: "bg-red-100 text-red-800",
  Critical: "bg-red-200 text-red-900",
  Medium: "bg-orange-100 text-orange-800",
  "Very High": "bg-red-200 text-red-900",
};

function mapMarkerIcon(color = "#ef4444") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z"
            fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="6" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -36],
  });
}

const MAP_BLUE_ICON = mapMarkerIcon("#3b82f6");

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng); } });
  return null;
}

export default function DiseasePredictor() {
  /* ── Page-level tab: predictor vs map ── */
  const [pageTab, setPageTab] = useState("predictor");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [esp32Ip] = useState("10.81.119.16");
  const [esp32Loading, setEsp32Loading] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [streamKey, setStreamKey] = useState(0);
  const [streamSrc, setStreamSrc] = useState(ESP32_CAPTURE_URL);
  const inputRef = useRef(null);

  /* ── AI Recommendation state ── */
  const [aiRec, setAiRec] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  /* ── Fetch AI recommendation from Gemini ── */
  async function fetchAiRecommendation(diseaseResult) {
    setAiLoading(true);
    setAiError(null);
    setAiRec(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/ai-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease: diseaseResult.predicted_class,
          confidence: diseaseResult.confidence,
          disease_area_pct: diseaseResult.visualizations?.disease_area_pct || 0,
        }),
      });
      const data = await res.json();
      if (data.success && data.ai_recommendation) {
        setAiRec(data.ai_recommendation);
      } else {
        setAiError(data.error || "Failed to get AI recommendation");
      }
    } catch (err) {
      setAiError("Could not reach AI service. Check your Gemini API key in backend/.env");
    } finally {
      setAiLoading(false);
    }
  }

  /* ── Map state ── */
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [clickedPos, setClickedPos] = useState(null);
  const [mapForm, setMapForm] = useState({
    disease: "Early Blight",
    severity: "Moderate",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [mapSubmitting, setMapSubmitting] = useState(false);

  /* ── Fetch reports ── */
  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(REPORTS_API);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to fetch disease reports", err);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleMapClick = (latlng) => { setClickedPos(latlng); setFormOpen(true); };

  const handleMapSubmit = async (e) => {
    e.preventDefault();
    setMapSubmitting(true);
    try {
      const res = await fetch(REPORTS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: clickedPos.lat, lng: clickedPos.lng, ...mapForm }),
      });
      if (res.ok) {
        setFormOpen(false);
        setClickedPos(null);
        setMapForm({ disease: "Early Blight", severity: "Moderate", note: "", date: new Date().toISOString().slice(0, 10) });
        fetchReports();
      }
    } catch (err) { console.error("Failed to add report", err); }
    finally { setMapSubmitting(false); }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete this disease report?")) return;
    try { await fetch(`${REPORTS_API}/${id}`, { method: "DELETE" }); fetchReports(); }
    catch (err) { console.error("Failed to delete report", err); }
  };

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
    setAiRec(null);
    setAiError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function streamUrl() {
    return ESP32_STREAM_URL;
  }

  useEffect(() => {
    if (!liveMode) return;
    let isMounted = true;
    const updateStream = () => {
      if (!isMounted) return;
      setStreamSrc(`${ESP32_CAPTURE_URL}?t=${Date.now()}`);
    };
    updateStream();
    const intervalId = setInterval(updateStream, 500);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [liveMode]);

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
      if (res.data?.success) fetchAiRecommendation(res.data);
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
      const res = await axios.post(ESP32_API_URL, { esp32_ip: ESP32_BASE_URL }, { timeout: 30000 });
      setResult(res.data);
      if (res.data?.success) fetchAiRecommendation(res.data);
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Potato Leaf Disease Predictor</h1>
          <p className="text-green-100 text-sm">Advanced AI-powered disease analysis and fertilizer recommendations</p>
        </div>
        {/* Page-level tabs */}
        <div className="flex bg-white/15 rounded-xl p-1 text-sm font-semibold">
          <button
            onClick={() => setPageTab("predictor")}
            className={`px-5 py-2 rounded-lg transition-all ${
              pageTab === "predictor" ? "bg-white text-emerald-700 shadow" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            🔬 Predictor
          </button>
          <button
            onClick={() => setPageTab("map")}
            className={`px-5 py-2 rounded-lg transition-all ${
              pageTab === "map" ? "bg-white text-emerald-700 shadow" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            🗺️ Disease Map
          </button>
        </div>
      </div>

      {/* ═══════════════ MAP VIEW ═══════════════ */}
      {pageTab === "map" ? (
        <div className="flex flex-col" style={{ height: "calc(100vh - 140px)" }}>
          {/* Map legend bar */}
          <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Click anywhere on the map to report a diseased area. All users can see these pins.
            </p>
            <div className="flex items-center gap-4 text-xs">
              {Object.entries(MAP_COLORS).map(([name, color]) => (
                <span key={name} className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full border" style={{ backgroundColor: color }} />
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Leaflet map */}
            <div className="flex-1">
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={8}
                className="w-full h-full z-0"
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />

                {clickedPos && (
                  <Marker position={[clickedPos.lat, clickedPos.lng]} icon={MAP_BLUE_ICON}>
                    <Popup>New report location</Popup>
                  </Marker>
                )}

                {reports.map((r) => (
                  <Marker
                    key={r.id}
                    position={[r.lat, r.lng]}
                    icon={mapMarkerIcon(MAP_COLORS[r.disease] || MAP_COLORS.Unknown)}
                  >
                    <Popup>
                      <div className="text-sm min-w-[180px]">
                        <p className="font-bold text-base mb-1">{r.disease}</p>
                        <p>
                          <span className="font-medium">Severity:</span>{" "}
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${MAP_SEVERITY_BADGE[r.severity] || ""}`}>
                            {r.severity}
                          </span>
                        </p>
                        {r.note && <p className="mt-1 text-gray-600 italic">"{r.note}"</p>}
                        <p className="text-gray-400 mt-1 text-xs">📅 {r.date}</p>
                        <p className="text-gray-400 text-xs">📍 {r.lat.toFixed(5)}, {r.lng.toFixed(5)}</p>
                        <button onClick={() => handleDeleteReport(r.id)} className="mt-2 text-xs text-red-600 hover:text-red-800 underline">
                          🗑️ Delete
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Side panel */}
            <div className="w-80 bg-white border-l overflow-y-auto">
              {formOpen && clickedPos ? (
                <form onSubmit={handleMapSubmit} className="p-4 border-b space-y-3">
                  <h3 className="font-semibold text-gray-800 text-lg">📌 Add Disease Report</h3>
                  <p className="text-xs text-gray-500">
                    Location: {clickedPos.lat.toFixed(5)}, {clickedPos.lng.toFixed(5)}
                  </p>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Disease</span>
                    <select value={mapForm.disease} onChange={(e) => setMapForm({ ...mapForm, disease: e.target.value })}
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                      <option>Early Blight</option>
                      <option>Late Blight</option>
                      <option>Healthy</option>
                      <option>Unknown</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Severity</span>
                    <select value={mapForm.severity} onChange={(e) => setMapForm({ ...mapForm, severity: e.target.value })}
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none">
                      <option>Low</option>
                        <option>Moderate</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Date</span>
                    <input type="date" value={mapForm.date} onChange={(e) => setMapForm({ ...mapForm, date: e.target.value })}
                      className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Note (optional)</span>
                    <textarea value={mapForm.note} onChange={(e) => setMapForm({ ...mapForm, note: e.target.value })}
                      rows={2} className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      placeholder="E.g. Severe infection on 2 acres..." />
                  </label>

                  <div className="flex gap-2">
                    <button type="submit" disabled={mapSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-md disabled:opacity-50">
                      {mapSubmitting ? "Saving…" : "💾 Save Report"}
                    </button>
                    <button type="button" onClick={() => { setFormOpen(false); setClickedPos(null); }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 rounded-md">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 border-b bg-green-50">
                  <p className="text-sm text-green-800 font-medium">👆 Click on the map to add a new disease report</p>
                </div>
              )}

              {/* Report list */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-3">📋 Reports ({reports.length})</h3>
                {reportsLoading ? (
                  <p className="text-sm text-gray-400">Loading…</p>
                ) : reports.length === 0 ? (
                  <p className="text-sm text-gray-400">No reports yet. Click the map to add one.</p>
                ) : (
                  <div className="space-y-2">
                    {[...reports].reverse().map((r) => (
                      <div key={r.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="inline-block w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: MAP_COLORS[r.disease] || MAP_COLORS.Unknown }} />
                            <span className="font-medium text-sm">{r.disease}</span>
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${MAP_SEVERITY_BADGE[r.severity] || ""}`}>
                            {r.severity}
                          </span>
                        </div>
                        {r.note && <p className="text-xs text-gray-500 mt-1 italic truncate">{r.note}</p>}
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-gray-400">
                            📅 {r.date} &nbsp;·&nbsp; 📍{r.lat.toFixed(4)}, {r.lng.toFixed(4)}
                          </span>
                          <button onClick={() => handleDeleteReport(r.id)} className="text-[10px] text-red-400 hover:text-red-600">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (

      /* ═══════════════ PREDICTOR VIEW ═══════════════ */
      <div className={`p-6 max-w-7xl mx-auto ${result ? 'grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6' : 'flex justify-center'}`}>

        {/* ══ LEFT — Upload ══ */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${result ? 'lg:sticky lg:top-6 lg:self-start' : 'w-full max-w-lg'}`}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 text-lg">🖼</div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">Upload Leaf</h2>
              <p className="text-xs text-gray-500">Select a high-quality image</p>
            </div>
            {/* Tab toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
              <button
                onClick={() => setLiveMode(false)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  !liveMode ? "bg-white text-emerald-700 shadow" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📁 Upload
              </button>
              <button
                onClick={() => { setLiveMode(true); setStreamKey(k => k + 1); }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  liveMode ? "bg-white text-blue-600 shadow" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📹 Live
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* ── Live stream view ── */}
            {liveMode ? (
              <div className="mb-4">
                <div className="rounded-xl overflow-hidden border-2 border-blue-200 bg-black" style={{ minHeight: 260 }}>
                  <img
                    key={streamKey}
                    src={streamSrc}
                    alt="ESP32-CAM Live"
                    className="w-full object-contain"
                    style={{ maxHeight: 280 }}
                    onError={() => setError("Stream failed. Check ESP32 IP and make sure it's on the same WiFi.")}
                  />
                </div>
                <p className="text-xs text-center text-gray-400 mt-1">Live feed · {streamUrl()}</p>
              </div>
            ) : (
            <>
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
            </>
            )}

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
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ESP32-CAM</p>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={esp32Ip}
                  readOnly
                  disabled
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 font-mono"
                />
                <button
                  onClick={() => { setLiveMode(true); setStreamKey(k => k + 1); setError(null); }}
                  className="px-3 py-2 text-xs rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold whitespace-nowrap"
                  title="Open live stream"
                >
                  📺 Stream
                </button>
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

        {/* ══ RIGHT — Results (only shown when loading or result exists) ══ */}
        {(loading || result) && (
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
                  <p className="text-white/80 text-sm">{cfg.description}</p>
                </div>

                {/* ── Severity Gauge ── */}
                <SeverityGauge diseaseAreaPct={result.visualizations?.disease_area_pct ?? 0} predicted={result.predicted_class} />

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

          {/* ══ GEMINI AI PERSONALIZED RECOMMENDATIONS ══ */}
          {(aiLoading || aiRec || aiError) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg">✨</div>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">AI-Powered Recommendations</h2>
                  <p className="text-xs text-gray-500">Personalized by Gemini AI — based on your specific results</p>
                </div>
                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Thinking...
                  </div>
                )}
                {aiRec && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">Gemini AI</span>
                )}
              </div>

              {/* Loading skeleton */}
              {aiLoading && (
                <div className="p-6 space-y-4 animate-pulse">
                  <div className="h-5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-full" />
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-purple-50 rounded-xl" />)}
                  </div>
                  <div className="h-4 bg-gray-200 rounded-lg w-4/5" />
                  <div className="h-4 bg-gray-200 rounded-lg w-full" />
                </div>
              )}

              {/* Error */}
              {aiError && !aiLoading && (
                <div className="p-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
                    <span className="mt-0.5">⚠️</span>
                    <div>
                      <p className="font-medium">AI Recommendation unavailable</p>
                      <p className="text-xs mt-1 text-red-500">{aiError}</p>
                      <p className="text-xs mt-2 text-gray-500">
                        Get a free API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">aistudio.google.com/apikey</a> and add it to <code className="bg-gray-100 px-1 rounded">backend/.env</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Results */}
              {aiRec && !aiLoading && (
                <div className="p-6 space-y-4">
                  {/* Severity Assessment */}
                  {aiRec.ai_severity_assessment && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-purple-600 uppercase mb-2">🧠 AI Severity Assessment</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{aiRec.ai_severity_assessment}</p>
                    </div>
                  )}

                  {/* AI N-P-K cards */}
                  {(aiRec.ai_nitrogen || aiRec.ai_phosphorus || aiRec.ai_potassium) && (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: "ai_nitrogen", label: "Nitrogen (N)", icon: "🌿", color: "emerald" },
                        { key: "ai_phosphorus", label: "Phosphorus (P)", icon: "🌱", color: "blue" },
                        { key: "ai_potassium", label: "Potassium (K)", icon: "⚡", color: "amber" },
                      ].map(({ key, label, icon, color }) => {
                        const item = aiRec[key];
                        if (!item) return null;
                        const lvl = item.level || "—";
                        const badgeMap = { Low: "bg-gray-100 text-gray-600", Moderate: "bg-yellow-100 text-yellow-700", High: "bg-orange-100 text-orange-700", Critical: "bg-red-100 text-red-700", Medium: "bg-yellow-100 text-yellow-700", "Very High": "bg-red-100 text-red-700" };
                        const barMap = { Low: "20%", Moderate: "45%", High: "65%", Critical: "85%", Medium: "45%", "Very High": "85%" };
                        return (
                          <div key={key} className={`bg-${color}-50 rounded-xl p-4 border border-${color}-100 flex flex-col items-center text-center`}>
                            <span className="text-2xl mb-1">{icon}</span>
                            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 ${badgeMap[lvl] || "bg-gray-100 text-gray-600"}`}>{lvl}</span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-2">
                              <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-700" style={{ width: barMap[lvl] || "30%" }} />
                            </div>
                            <p className="text-[10px] text-gray-500 leading-snug">{item.detail}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action + Fertilizer from AI */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiRec.ai_action && (
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-purple-600 uppercase mb-2">⚕️ AI Action Plan</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{aiRec.ai_action}</p>
                      </div>
                    )}
                    {aiRec.ai_fertilizer && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-2">💊 AI Fertilizer Plan</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{aiRec.ai_fertilizer}</p>
                      </div>
                    )}
                  </div>

                  {/* Fungicide + Organic Alternative */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiRec.ai_fungicide && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-rose-600 uppercase mb-2">🧴 Fungicide Recommendation</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{aiRec.ai_fungicide}</p>
                      </div>
                    )}
                    {aiRec.ai_organic_alternative && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-green-600 uppercase mb-2">🌿 Organic Alternative</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{aiRec.ai_organic_alternative}</p>
                      </div>
                    )}
                  </div>

                  {/* Prevention */}
                  {aiRec.ai_prevention && (
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-sky-600 uppercase mb-2">🛡️ Prevention for Next Season</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{aiRec.ai_prevention}</p>
                    </div>
                  )}

                  {/* AI Tips */}
                  {aiRec.ai_tips?.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                      <p className="text-xs font-bold text-purple-600 uppercase mb-3">💡 AI Expert Tips</p>
                      <ul className="space-y-2">
                        {aiRec.ai_tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-purple-500 font-bold mt-0.5 shrink-0">✦</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
        )}
      </div>
      )}
    </div>
  );
}