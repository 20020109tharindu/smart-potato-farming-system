import { useState, useEffect, useCallback, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore';
import { realtimeDb, db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import jsPDF from 'jspdf';

// ================================================================
// CONSTANTS
// ================================================================
// Slide 1 — potato pile close-up (Pexels CDN — confirmed potatoes)
// Slide 2 — potato plants growing in field rows
// Slide 3 — rich dark farming soil close-up
// Slide 4 — Sri Lanka Uva/Badulla misty hill-country farm landscape
// Slide 5 — harvested potato sack/crate (confirmed Unsplash potato photo)
const SLIDES = [
  {
    img:      'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&fit=crop',
    gradient: 'from-yellow-950 via-amber-950 to-stone-950',
    accent:   '#fbbf24',
    tag:      '🥔  Potato Farming — Sri Lanka',
    title:    'Smart Potato Farming in Sri Lanka',
    desc:     'Smart soil health monitoring built for potato farmers in Badulla District, Uva Province. Granola, Kondor & local variety cultivation — powered by AI and IoT.',
    stat:     '📍 Badulla · Uva Province · Sri Lanka',
  },
  {
    img:      'https://images.pexels.com/photos/8369485/pexels-photo-8369485.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&fit=crop',
    gradient: 'from-green-950 via-lime-950 to-emerald-950',
    accent:   '#86efac',
    tag:      '🌱  Potato Growth Stages · Maha & Yala Seasons',
    title:    'From Seed Potato to Harvest',
    desc:     'Germination → Vegetative Growth → Tuber Initiation → Maturation. Soil nutrient requirements change at every stage — the system automatically adapts recommendations.',
    stat:     '4 Growth Stages · Maha (Oct–Feb) & Yala (Mar–Aug)',
  },
  {
    img:      'https://images.pexels.com/photos/9608574/pexels-photo-9608574.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&fit=crop',
    gradient: 'from-blue-950 via-sky-950 to-cyan-950',
    accent:   '#38bdf8',
    tag:      '📡  IoT Sensor · NodeMCU ESP32 · Firebase',
    title:    'Live Field Soil Sensor Data',
    desc:     '7-in-1 RS485 NPK sensor → NodeMCU ESP32 → Firebase Realtime DB → ML model. pH, EC, Nitrogen, Phosphorus, Potassium, Temperature & Moisture — updated in seconds.',
    stat:     '7 Parameters · Real-Time · Firebase Sync',
  },
  {
    img:      'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&fit=crop',
    gradient: 'from-teal-950 via-emerald-950 to-cyan-950',
    accent:   '#2dd4bf',
    tag:      '🧪  Uva Highland Soil Requirements',
    title:    'Optimal Soil for Highland Potatoes',
    desc:     'Optimal for Badulla highland potatoes (1000–2000 m AMSL): pH 5.5–6.5 · EC 0.05–0.16 mS/cm · Temp 15–22°C · Moisture 50–72%. Instant flag on any deviation.',
    stat:     '🌡️ Calibrated for Uva Highland Elevation',
  },
  {
    img:      'https://images.pexels.com/photos/35873595/pexels-photo-35873595.jpeg?auto=compress&cs=tinysrgb&w=1200&h=500&fit=crop',
    gradient: 'from-purple-950 via-violet-950 to-indigo-950',
    accent:   '#c084fc',
    tag:      '📊  Fertilizer · Reports · History',
    title:    'Recommendations, Trends & PDF Reports',
    desc:     'Exact per-acre Urea, TSP, MOP & Organic fertilizer quantities for your field size. Download professional PDF soil reports and track historical analysis trends.',
    stat:     'PDF Reports · Cloud Backup · Trend Charts',
  },
];

const GROWTH_STAGES = [
  { value: 0, label: 'Germination' },
  { value: 1, label: 'Vegetative Growth' },
  { value: 2, label: 'Tuber Initiation' },
  { value: 3, label: 'Maturation' },
];

const ACTION_STYLES = {
  critical: 'bg-red-50 border-red-400 text-red-800',
  warning:  'bg-yellow-50 border-yellow-400 text-yellow-800',
  info:     'bg-blue-50 border-blue-400 text-blue-700',
  success:  'bg-green-50 border-green-400 text-green-800',
};
const ACTION_ICONS = { critical: '⛔', warning: '⚠️', info: 'ℹ️', success: '✅' };

const PARAM_META = {
  pH:          { icon: '🧪', hint: 'Optimal: 5.5–6.5. Affects nutrient availability' },
  EC:          { icon: '⚡', hint: 'Electrical conductivity. Optimal: 0.05–0.16 mS/cm' },
  N:           { icon: '🌿', hint: 'Nitrogen promotes leafy growth' },
  P:           { icon: '🌸', hint: 'Phosphorus supports roots & tubers' },
  K:           { icon: '💪', hint: 'Potassium boosts tuber size & disease resistance' },
  Temperature: { icon: '🌡️', hint: 'Root zone temperature. Optimal: 15–22°C' },
  Moisture:    { icon: '💧', hint: 'Soil water content. Affects nutrient uptake' },
};

// Parameter optimal ranges for gauge colouring
const PARAM_RANGES = {
  pH:          { lo: 5.5,  hi: 6.5,  warn: 0.3  },
  EC:          { lo: 0.05, hi: 0.16, warn: 0.03 },
  N:           { lo: 20,   hi: 60,   warn: 10   },
  P:           { lo: 30,   hi: 120,  warn: 15   },
  K:           { lo: 180,  hi: 320,  warn: 30   },
  Temperature: { lo: 15,   hi: 22,   warn: 2    },
  Moisture:    { lo: 50,   hi: 72,   warn: 8    },
};

const INITIAL_MANUAL_FORM = {
  pH: '', EC: '', N: '', P: '', K: '', Temperature: '', Moisture: '',
};

// Hard sanity limits for live sensor visualization & live prediction
// (user requirement: keep displayed values within these ranges)
const LIVE_LIMITS = {
  pH: 7.25,
  EC: 0.0299,
  N: 81.6,
  P: 182.9,
  K: 382.10,
  Temperature: 27.9,
  Moisture: 76.5,
};

function toFiniteNumber(v) {
  if (v == null) return null;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
}

function clamp01Range(value, min, max) {
  if (value == null) return null;
  return Math.min(max, Math.max(min, value));
}

function format2dpTrunc(value) {
  const n = toFiniteNumber(value);
  if (n == null) return null;
  // Truncate (not round) to 2 decimals to keep live UI stable.
  return (Math.floor(n * 100) / 100).toFixed(2);
}

async function fetchWithTimeout(url, options, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function normalizeFromFirebaseSoil(raw) {
  // Firebase keys observed: pH, conductivity, nitrogen, phosphorus, potassium, temperature, moisture
  // Expected by backend/UI: pH, EC (mS/cm), N, P, K (ppm), Temperature (°C), Moisture (%)
  let pH = toFiniteNumber(raw?.pH);
  if (pH != null && pH > 14) pH = pH / 1000; // e.g. 6553.5 -> 6.5535
  // Keep live pH display within requested bounds (4.3–7.25)
  pH = clamp01Range(pH, 4.3, LIVE_LIMITS.pH);

  let EC = toFiniteNumber(raw?.conductivity);
  if (EC != null) {
    // Common sensor patterns:
    // - conductivity stored as (uS/cm * 100) => convert to mS/cm by /100000
    // - conductivity stored as uS/cm        => convert to mS/cm by /1000
    if (EC > 5) EC = EC / 100000;
    else if (EC > 1) EC = EC / 1000;
    EC = clamp01Range(EC, 0, LIVE_LIMITS.EC);
  }

  let N = toFiniteNumber(raw?.nitrogen);
  if (N != null) {
    if (N > 1000) N = N / 1000;   // e.g. 64245 -> 64.245
    else if (N > LIVE_LIMITS.N) N = N / 10;
    N = clamp01Range(N, 0, LIVE_LIMITS.N);
  }

  let P = toFiniteNumber(raw?.phosphorus);
  if (P != null) {
    if (P > 1000) P = P / 1000;   // e.g. 65535 -> 65.535
    else if (P > LIVE_LIMITS.P) P = P / 10;
    P = clamp01Range(P, 15.09, LIVE_LIMITS.P);
  }

  let K = toFiniteNumber(raw?.potassium);
  if (K != null) {
    if (K > 1000) K = K / 1000;   // e.g. 65535 -> 65.535
    K = clamp01Range(K, 153.05, LIVE_LIMITS.K);
  }

  let Temperature = toFiniteNumber(raw?.temperature);
  if (Temperature != null) {
    // Handle typical scaling: value may be *100
    if (Temperature > 150) {
      const base = Temperature / 100;
      // If base looks like Fahrenheit (e.g. 65°F), convert to Celsius.
      if (base > 50 && base <= 140) {
        const c = (base - 32) * (5 / 9);
        Temperature = c;
      } else {
        Temperature = base;
      }
    } else if (Temperature > 50 && Temperature <= 140) {
      // Unscaled Fahrenheit
      Temperature = (Temperature - 32) * (5 / 9);
    }
    Temperature = clamp01Range(Temperature, 13.0, LIVE_LIMITS.Temperature);
  }

  let Moisture = toFiniteNumber(raw?.moisture);
  if (Moisture != null) {
    if (Moisture > 100) Moisture = Moisture / 100; // e.g. 6553.1 -> 65.531%
    Moisture = clamp01Range(Moisture, 34.3, LIVE_LIMITS.Moisture);
  }

  return { pH, EC, N, P, K, Temperature, Moisture };
}

function getParamStatus(key, value) {
  if (value == null) return 'unknown';
  const r = PARAM_RANGES[key];
  if (!r) return 'unknown';
  if (value < r.lo - r.warn || value > r.hi + r.warn) return 'critical';
  if (value < r.lo || value > r.hi) return 'warning';
  return 'ok';
}

const STATUS_RING  = { ok: 'border-green-400 bg-green-50',  warning: 'border-yellow-400 bg-yellow-50', critical: 'border-red-400 bg-red-50',   unknown: 'border-gray-200 bg-white'   };
const STATUS_VALUE = { ok: 'text-green-700',                warning: 'text-yellow-700',                critical: 'text-red-700',               unknown: 'text-gray-800'              };
const STATUS_DOT   = { ok: 'bg-green-500',                  warning: 'bg-yellow-500',                  critical: 'bg-red-500',                 unknown: 'bg-gray-300'                };
const STATUS_LABEL = { ok: 'Normal',                        warning: 'Warning',                        critical: 'Critical',                   unknown: '--'                         };

// ================================================================
// STYLES — CSS-in-JS (matches Cost Analysis design system)
// ================================================================
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  .sh-page {
    font-family: 'Inter', sans-serif;
    position: relative;
  }
  .sh-page h1, .sh-page h2, .sh-page h3 {
    font-family: 'Lora', serif;
  }

  /* ── Dot-grid background overlay ── */
  .sh-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(61,122,58,0.06) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none; z-index: 0;
  }

  /* ── Section entrance animation ── */
  @keyframes shFadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sh-section {
    animation: shFadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
    position: relative; z-index: 1;
  }
  .sh-section:nth-child(2)  { animation-delay: 0.08s; }
  .sh-section:nth-child(3)  { animation-delay: 0.16s; }
  .sh-section:nth-child(4)  { animation-delay: 0.24s; }
  .sh-section:nth-child(5)  { animation-delay: 0.32s; }
  .sh-section:nth-child(6)  { animation-delay: 0.40s; }
  .sh-section:nth-child(7)  { animation-delay: 0.48s; }
  .sh-section:nth-child(8)  { animation-delay: 0.56s; }
  .sh-section:nth-child(9)  { animation-delay: 0.64s; }
  .sh-section:nth-child(10) { animation-delay: 0.72s; }

  /* ── Card hover enhancement ── */
  @keyframes shCardIn {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .sh-card-anim {
    animation: shCardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* ── Improved loading spinner ── */
  @keyframes shSpinGlow {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes shPulseText {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.5; }
  }
  .sh-spinner {
    width: 44px; height: 44px;
    border: 3.5px solid #e8e3d8;
    border-top-color: #3d7a3a;
    border-radius: 50%;
    animation: shSpinGlow 0.9s linear infinite;
  }
  .sh-loading-text {
    color: #6b8069;
    font-size: 14px;
    font-weight: 500;
    animation: shPulseText 1.8s ease-in-out infinite;
  }

  /* ── Hero banner glow ── */
  .sh-hero {
    background: linear-gradient(108deg, #1a3018 0%, #2d5a2a 35%, #3d7a3a 65%, #5a9e56 100%);
    position: relative;
    overflow: hidden;
  }
  .sh-hero::after {
    content: '';
    position: absolute; right: -40px; bottom: -60px;
    width: 240px; height: 240px; border-radius: 50%;
    background: rgba(255,255,255,0.04);
  }

  /* ── Tab bar ── */
  .sh-tabs {
    background: linear-gradient(135deg, #f0ede6, #f8f4ec);
    border-radius: 16px;
    padding: 6px;
    display: flex; gap: 4px;
    border: 1px solid #e3d9c2;
  }
  .sh-tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 14px; font-weight: 600;
    white-space: nowrap;
    cursor: pointer; border: none; background: transparent;
    color: #6b8069;
    transition: all 0.25s ease;
  }
  .sh-tab:hover { color: #3d7a3a; background: rgba(61,122,58,0.06); }
  .sh-tab-active {
    background: #3d7a3a !important;
    color: white !important;
    box-shadow: 0 2px 10px rgba(61,122,58,0.35);
  }

  /* ── Predict button ── */
  .sh-btn-predict {
    width: 100%;
    padding: 16px 0;
    border-radius: 16px;
    background: linear-gradient(135deg, #2d5a2a 0%, #3d7a3a 40%, #5a9e56 100%);
    color: white; font-weight: 700; font-size: 16px;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(61,122,58,0.3);
    font-family: 'Inter', sans-serif;
  }
  .sh-btn-predict:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(61,122,58,0.4);
  }
  .sh-btn-predict:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── White content card ── */
  .sh-content-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid #e8e3d8;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(30,45,30,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .sh-content-card:hover {
    box-shadow: 0 6px 20px rgba(30,45,30,0.09);
  }

  /* ── Section header with green accent line ── */
  .sh-sec-head {
    display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
  }
  .sh-sec-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #e8f5e8, #d4edda);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .sh-sec-line {
    height: 3px;
    width: 48px;
    border-radius: 3px;
    background: linear-gradient(90deg, #3d7a3a, #a8d5a2);
    margin-top: 8px;
  }

  /* ── Alert banner ── */
  .sh-alert {
    border-radius: 16px;
    border: 1px solid #fca5a5;
    background: linear-gradient(135deg, #fef2f2, #fff5f5);
    padding: 16px 20px;
    display: flex; gap: 12px; align-items: flex-start;
    animation: shFadeInUp 0.5s ease both;
  }

  /* ── Slideshow overlay text animation ── */
  @keyframes shSlideContent {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sh-slide-content {
    animation: shSlideContent 0.6s ease both;
    animation-delay: 0.2s;
  }

  /* ── Gauge card stagger ── */
  .sh-gauge-grid > *:nth-child(1) { animation-delay: 0.05s; }
  .sh-gauge-grid > *:nth-child(2) { animation-delay: 0.10s; }
  .sh-gauge-grid > *:nth-child(3) { animation-delay: 0.15s; }
  .sh-gauge-grid > *:nth-child(4) { animation-delay: 0.20s; }
  .sh-gauge-grid > *:nth-child(5) { animation-delay: 0.25s; }
  .sh-gauge-grid > *:nth-child(6) { animation-delay: 0.30s; }
  .sh-gauge-grid > *:nth-child(7) { animation-delay: 0.35s; }

  /* ── Result banner glow ── */
  @keyframes shResultPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(61,122,58,0.2); }
    50%      { box-shadow: 0 0 0 8px rgba(61,122,58,0); }
  }
  .sh-result-banner {
    animation: shResultPulse 2s ease-in-out 1;
  }

  /* ── Success popup overlay ── */
  @keyframes shPopupOverlay {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shPopupCard {
    0%   { opacity: 0; transform: translateY(40px) scale(0.9); }
    60%  { transform: translateY(-8px) scale(1.02); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shPopupRing {
    0%   { transform: scale(0); opacity: 0; }
    50%  { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes shPopupCheck {
    0%   { stroke-dashoffset: 40; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes shConfetti {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-80px) rotate(360deg); opacity: 0; }
  }
  .sh-popup-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    animation: shPopupOverlay 0.3s ease both;
  }
  .sh-popup-card {
    background: white;
    border-radius: 24px;
    padding: 40px 36px 32px;
    max-width: 420px; width: 90%;
    text-align: center;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: shPopupCard 0.5s cubic-bezier(0.22,1,0.36,1) both;
    position: relative; overflow: hidden;
  }
  .sh-popup-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, #3d7a3a, #5a9e56, #a8d5a2, #5a9e56, #3d7a3a);
    background-size: 200% 100%;
    animation: shPopupBar 2s linear infinite;
  }
  @keyframes shPopupBar {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 0%; }
  }
  .sh-popup-icon-ring {
    width: 80px; height: 80px; margin: 0 auto 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    animation: shPopupRing 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.2s;
  }
  .sh-popup-icon-ring svg {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    animation: shPopupCheck 0.5s ease both;
    animation-delay: 0.5s;
  }
  .sh-popup-confetti {
    position: absolute; top: 50%; left: 50%;
    width: 8px; height: 8px; border-radius: 2px;
    animation: shConfetti 1s ease-out both;
  }
  .sh-popup-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    border-radius: 14px;
    font-weight: 700; font-size: 14px;
    cursor: pointer; border: none;
    transition: all 0.25s ease;
    font-family: 'Inter', sans-serif;
  }
  .sh-popup-btn-primary {
    background: linear-gradient(135deg, #2d5a2a, #3d7a3a, #5a9e56);
    color: white;
    box-shadow: 0 4px 16px rgba(61,122,58,0.3);
  }
  .sh-popup-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(61,122,58,0.4);
  }
  .sh-popup-btn-ghost {
    background: transparent;
    color: #3d7a3a;
    border: 2px solid #d4edda;
  }
  .sh-popup-btn-ghost:hover {
    background: #f0faf0;
  }
`;

// ================================================================
// MAIN COMPONENT
// ================================================================
export default function SoilHealth() {
  const { currentUser } = useAuth();

  const [activeTab,    setActiveTab]    = useState('live');
  const [liveData,     setLiveData]     = useState(null);
  const [liveStatus,   setLiveStatus]   = useState('connecting');
  const [lastUpdated,  setLastUpdated]  = useState(null);

  const [growthStage,  setGrowthStage]  = useState(1);
  const [landAcres,    setLandAcres]    = useState('');
  const [predicting,   setPredicting]   = useState(false);
  const [prediction,   setPrediction]   = useState(null);
  const [predError,    setPredError]    = useState(null);

  const [manualForm, setManualForm] = useState(INITIAL_MANUAL_FORM);

  // History & Trends
  const [history,        setHistory]        = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [trendParam,     setTrendParam]     = useState('pH');

  // PDF flag
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [predInputs,   setPredInputs]   = useState(null);

  const resetPrediction = useCallback(() => {
    setPrediction(null);
    setPredError(null);
    setPredInputs(null);
    setShowSuccessModal(false);
  }, []);

  const focusResults = useCallback(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setPulseResults(true);
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = setTimeout(() => setPulseResults(false), 1200);
  }, []);

  // Slideshow
  const [slideIdx,   setSlideIdx]   = useState(0);
  const [slideAnim,  setSlideAnim]  = useState(true);
  const [imgErrors,  setImgErrors]  = useState({});

  useEffect(() => {
    const t = setInterval(() => {
      setSlideAnim(false);
      setTimeout(() => { setSlideIdx(i => (i + 1) % SLIDES.length); setSlideAnim(true); }, 150);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const goSlide = (idx) => {
    setSlideAnim(false);
    setTimeout(() => { setSlideIdx(idx); setSlideAnim(true); }, 150);
  };

  // ----------------------------------------------------------------
  // Firebase Realtime DB — live sensor listener
  // ----------------------------------------------------------------
  useEffect(() => {
    const soilRef = ref(realtimeDb, '/soil');
    const unsubscribe = onValue(
      soilRef,
      (snapshot) => {
        const raw = snapshot.val();
        if (!raw) { setLiveStatus('error'); return; }
        setLiveData(normalizeFromFirebaseSoil(raw));
        setLastUpdated(new Date());
        setLiveStatus('live');
      },
      () => setLiveStatus('error'),
    );
    return () => unsubscribe();
  }, []);

  const getHistorySortKey = useCallback((row) => {
    if (row?.timestamp?.toDate) return row.timestamp.toDate().getTime();
    const fallback = row?.timestampClient ?? row?.timestamp ?? 0;
    return Number(fallback) || 0;
  }, []);

  const sortAndLimitHistory = useCallback((rows) => {
    return [...rows]
      .sort((a, b) => getHistorySortKey(b) - getHistorySortKey(a))
      .slice(0, 20);
  }, [getHistorySortKey]);

  // ----------------------------------------------------------------
  // Firestore — load prediction history
  // ----------------------------------------------------------------
  const loadHistory = useCallback(async () => {
    if (!currentUser) return;
    setHistoryLoading(true);
    try {
      const q = query(
        collection(db, 'soil_predictions'),
        orderBy('timestamp', 'desc'),
        limit(20),
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('History load failed:', e);
    }
    setHistoryLoading(false);
  }, [currentUser]);

  useEffect(() => {
    if (!prediction) return undefined;
    setShowSuccessModal(true);
    return undefined;
  }, [prediction]);

  useEffect(() => () => {
    if (pulseTimerRef.current) {
      clearTimeout(pulseTimerRef.current);
    }
  }, []);

  // ----------------------------------------------------------------
  // Save prediction to Firestore
  // ----------------------------------------------------------------
  const savePrediction = async (payload, result) => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'soil_predictions'), {
        uid:         currentUser.uid,
        timestamp:   serverTimestamp(),
        timestampClient: Date.now(),
        inputs:      payload,
        result:      result,
        landAcres:   parseFloat(landAcres) || null,
        growthStage: growthStage,
      });
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  // ----------------------------------------------------------------
  // Predict
  // ----------------------------------------------------------------
  const runPrediction = async (payload) => {
    try {
      const res  = await fetchWithTimeout('http://127.0.0.1:5000/api/soil/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }, 15000);
      const data = await res.json();
      if (data.error) {
        setPredError(data.error);
      } else {
        setPrediction(data);
        setPredInputs(payload);
        await savePrediction(payload, data);
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        setPredError('Prediction timed out. Please try again.');
      } else {
        setPredError('Cannot connect to backend. Make sure the Flask server is running on port 5000.');
      }
    }
  };

  const handlePredictLive = async () => {
    if (!liveData) return;
    const acres = parseFloat(landAcres);
    if (!landAcres || isNaN(acres) || acres <= 0) {
      setPredError('Please enter your field size (acres) before analyzing.');
      return;
    }
    setPredicting(true); setPrediction(null); setPredError(null);
    try {
      await runPrediction({ ...liveData, Growth_Stage: growthStage });
    } finally {
      setPredicting(false);
    }
  };

  const handlePredictManual = async (e) => {
    e.preventDefault();
    const acres = parseFloat(landAcres);
    if (!landAcres || isNaN(acres) || acres <= 0) {
      setPredError('Please enter your field size (acres) before analyzing.');
      return;
    }
    setPredicting(true); setPrediction(null); setPredError(null);
    try {
      await runPrediction({
        pH: parseFloat(manualForm.pH), EC: parseFloat(manualForm.EC),
        N: parseFloat(manualForm.N),   P: parseFloat(manualForm.P),
        K: parseFloat(manualForm.K),   Temperature: parseFloat(manualForm.Temperature),
        Moisture: parseFloat(manualForm.Moisture), Growth_Stage: growthStage,
      });
    } finally {
      setPredicting(false);
    }
  };

  // ----------------------------------------------------------------
  // PDF Report
  // ----------------------------------------------------------------
  const generatePDF = () => {
    if (!prediction) return;
    setGeneratingPdf(true);
    try {
      const doc      = new jsPDF();
      const now      = new Date();
      const nowStr   = now.toLocaleString();
      const acre     = parseFloat(landAcres);
      const hasA     = landAcres && !isNaN(acre) && acre > 0;
      const reportId = `SHR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const PW       = 210;
      const M        = 14;
      const CW       = PW - M * 2;

      // ── Colour palette ──────────────────────────────────────────
      const C = {
        gD:  [15,118,53],   g:   [22,163,74],   gL:  [220,252,231],
        o:   [234,88,12],   oL:  [255,237,213],
        r:   [185,28,28],   rL:  [254,226,226],
        b:   [37,99,235],   bL:  [219,234,254],
        p:   [126,34,206],  pL:  [243,232,255],
        tD:  [31,41,55],    tM:  [107,114,128],  tL:  [243,244,246],
        bd:  [209,213,219], wh:  [255,255,255],
        pk:  [219,39,119],  pkL: [252,231,243],
      };
      const sc = suitColor => prediction.soil_suitability.color === suitColor;
      const sC = sc('green') ? C.g  : sc('orange') ? C.o  : C.r;
      const sL = sc('green') ? C.gL : sc('orange') ? C.oL : C.rL;

      const sf = c => doc.setFillColor(...c);
      const stc = c => doc.setTextColor(...c);
      const sd = c => doc.setDrawColor(...c);

      let y = 0;
      let pageNum = 1;

      const addFooter = () => {
        sf(C.tL); doc.rect(0, 283, PW, 14, 'F');
        sd(C.bd); doc.setLineWidth(0.3); doc.line(0, 283, PW, 283); doc.setLineWidth(0.2);
        stc(C.tM); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
        doc.text('Smart Potato Farming System  —  Precision Agriculture Research, Badulla District, Sri Lanka', M, 289);
        doc.text(`Report ID: ${reportId}   |   Generated: ${nowStr}`, M, 294);
        doc.text(`Page ${pageNum}`, PW - M, 289, { align: 'right' });
        doc.text('For advisory use only. Verify with a qualified agronomist.', PW - M, 294, { align: 'right' });
      };

      const newPage = (needed = 30) => {
        if (y + needed > 279) {
          addFooter(); doc.addPage(); pageNum++; y = 16;
        }
      };

      const sectionTitle = (title) => {
        newPage(16);
        sf(C.g);  doc.rect(M, y, 4, 7, 'F');
        sf(C.gL); doc.rect(M + 4, y, CW - 4, 7, 'F');
        stc(C.gD); doc.setFontSize(10); doc.setFont('helvetica', 'bold');
        doc.text(title, M + 8, y + 5.2);
        y += 11;
      };

      // ══════════════════════════════════════════════════════════
      // HEADER
      // ══════════════════════════════════════════════════════════
      sf(C.gD); doc.rect(0, 0, PW, 38, 'F');
      sf(C.g);  doc.rect(0, 32, PW, 6, 'F');
      // decorative circles
      doc.setFillColor(255,255,255);
      doc.setFillColor(40, 180, 90);
      doc.circle(196, 8, 22, 'F');
      doc.circle(185, 30, 12, 'F');
      sf(C.gD); doc.circle(196, 8, 18, 'F');
      sf(C.gD); doc.circle(185, 30, 9, 'F');

      stc(C.wh);
      doc.setFontSize(19); doc.setFont('helvetica', 'bold');
      doc.text('Soil Health Analysis Report', M, 15);
      doc.setFontSize(8.5); doc.setFont('helvetica', 'normal');
      doc.text('Smart Potato Farming System  |  Precision Agriculture Research  |  Badulla District', M, 23.5);
      doc.text(`Generated: ${nowStr}    |    Report ID: ${reportId}`, M, 30);

      // Meta info bar
      sf(C.tL); doc.rect(0, 38, PW, 17, 'F');
      sd(C.bd); doc.setLineWidth(0.2); doc.line(0, 38, PW, 38);
      const metaItems = [
        ['LOCATION', 'Badulla District, Sri Lanka'],
        ['GROWTH STAGE', prediction.growth_stage.label],
        ['FIELD AREA', hasA ? `${acre} acres` : 'Not specified'],
        ['ANALYSIS DATE', now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })],
      ];
      metaItems.forEach(([lbl, val], i) => {
        const x = M + i * 47;
        stc(C.tM); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
        doc.text(lbl, x, 45.5);
        stc(C.tD); doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
        doc.text(val, x, 52);
      });
      y = 65;

      // ══════════════════════════════════════════════════════════
      // SUITABILITY CARD
      // ══════════════════════════════════════════════════════════
      sf(sL); doc.roundedRect(M, y, CW, 30, 3, 3, 'F');
      sf(sC); doc.roundedRect(M, y, 5, 30, 2, 2, 'F'); doc.rect(M+3, y, 2, 30, 'F');
      sd(sC); doc.setLineWidth(0.4); doc.roundedRect(M, y, CW, 30, 3, 3, 'S'); doc.setLineWidth(0.2);
      stc(C.tM); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
      doc.text('SOIL SUITABILITY RESULT', M + 9, y + 7);
      stc(sC); doc.setFontSize(15); doc.setFont('helvetica', 'bold');
      doc.text(prediction.soil_suitability.label.toUpperCase(), M + 9, y + 17);
      stc(C.tM); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(prediction.soil_suitability.description || '', 98);
      descLines.forEach((ln, i) => doc.text(ln, M + 9, y + 23.5 + i * 4.5));
      if (prediction.confidence != null) {
        sf(C.wh); doc.roundedRect(144, y + 4, 46, 22, 3, 3, 'F');
        sd(sC); doc.setLineWidth(0.3); doc.roundedRect(144, y + 4, 46, 22, 3, 3, 'S'); doc.setLineWidth(0.2);
        stc(C.tM); doc.setFontSize(6); doc.setFont('helvetica', 'bold');
        doc.text('MODEL CONFIDENCE', 167, y + 10.5, { align: 'center' });
        stc(sC); doc.setFontSize(17); doc.setFont('helvetica', 'bold');
        doc.text(`${prediction.confidence}%`, 167, y + 21, { align: 'center' });
      }
      y += 38;

      // ══════════════════════════════════════════════════════════
      // SENSOR READINGS
      // ══════════════════════════════════════════════════════════
      sectionTitle('Sensor Readings & Status');
      const RANGES = {
        pH:          { lo:5.5,  hi:6.5,  warn:0.3  },
        EC:          { lo:0.05, hi:0.16, warn:0.03 },
        N:           { lo:20,   hi:60,   warn:10   },
        P:           { lo:30,   hi:120,  warn:15   },
        K:           { lo:180,  hi:320,  warn:30   },
        Temperature: { lo:15,   hi:22,   warn:2    },
        Moisture:    { lo:50,   hi:72,   warn:8    },
      };
      const getParamSt = (key, val) => {
        if (val == null) return { label:'NO DATA', c:C.tM, bg:C.tL };
        const r = RANGES[key];
        if (val < r.lo - r.warn || val > r.hi + r.warn) return { label:'CRITICAL', c:C.r, bg:C.rL };
        if (val < r.lo || val > r.hi)                   return { label:'WARNING',  c:C.o, bg:C.oL };
        return { label:'OPTIMAL', c:C.g, bg:C.gL };
      };

      // header row
      sf(C.tD); doc.rect(M, y, CW, 8, 'F');
      stc(C.wh); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('Parameter',       M + 3,   y + 5.5);
      doc.text('Value',           M + 72,  y + 5.5);
      doc.text('Unit',            M + 97,  y + 5.5);
      doc.text('Optimal Range',   M + 116, y + 5.5);
      doc.text('Status',          M + 157, y + 5.5);
      y += 8;

      const sensorRows = [
        { label:'Soil pH',           key:'pH',          unit:'' },
        { label:'Conductivity (EC)', key:'EC',          unit:'mS/cm' },
        { label:'Nitrogen (N)',       key:'N',           unit:'ppm' },
        { label:'Phosphorus (P)',     key:'P',           unit:'ppm' },
        { label:'Potassium (K)',      key:'K',           unit:'ppm' },
        { label:'Temperature',        key:'Temperature', unit:'\u00B0C' },
        { label:'Soil Moisture',      key:'Moisture',    unit:'%' },
      ];
      const tableStartY = y;
      sensorRows.forEach((row, i) => {
        const rawVal = predInputs?.[row.key];
        const val    = rawVal != null ? (typeof rawVal === 'number' ? rawVal : parseFloat(rawVal)) : null;
        const r      = RANGES[row.key];
        const st     = getParamSt(row.key, val);
        const RH     = 8;
        sf(i % 2 === 0 ? C.wh : C.tL); doc.rect(M, y, CW, RH, 'F');
        stc(C.tD); doc.setFontSize(8);   doc.setFont('helvetica','normal'); doc.text(row.label, M + 3, y + 5.5);
        stc(C.tD); doc.setFontSize(8.5); doc.setFont('helvetica','bold');
        doc.text(val != null ? String(Math.round(val * 1000) / 1000) : ' --', M + 72, y + 5.5);
        stc(C.tM); doc.setFontSize(7.5); doc.setFont('helvetica','normal');
        doc.text(row.unit, M + 97, y + 5.5);
        doc.text(`${r.lo} - ${r.hi}`, M + 116, y + 5.5);
        sf(st.bg); doc.roundedRect(M + 153, y + 1.5, 36, 5, 1.5, 1.5, 'F');
        stc(st.c); doc.setFontSize(6.5); doc.setFont('helvetica','bold');
        doc.text(st.label, M + 171, y + 5.3, { align:'center' });
        y += RH;
      });
      sd(C.bd); doc.setLineWidth(0.3);
      doc.rect(M, tableStartY, CW, sensorRows.length * 8);
      doc.setLineWidth(0.2);
      y += 10;

      // ══════════════════════════════════════════════════════════
      // NPK STATUS
      // ══════════════════════════════════════════════════════════
      newPage(44); sectionTitle('NPK Nutrient Status');
      const npkCfg = [
        { key:'n', name:'Nitrogen (N)',   ac:C.g,  lt:C.gL,  desc:'Leaf & vine growth support'     },
        { key:'p', name:'Phosphorus (P)', ac:C.pk, lt:C.pkL, desc:'Root & tuber development'        },
        { key:'k', name:'Potassium (K)',  ac:C.p,  lt:C.pL,  desc:'Tuber quality & disease resist.' },
      ];
      const bW = (CW - 8) / 3;
      npkCfg.forEach((n, i) => {
        const lbl = prediction.npk_status[n.key]?.label || '—';
        const lC  = lbl === 'Adequate' ? n.ac : lbl === 'Low' ? C.r : C.b;
        const bx  = M + i * (bW + 4);
        sf(n.lt);  doc.roundedRect(bx, y, bW, 26, 2, 2, 'F');
        sf(n.ac);  doc.roundedRect(bx, y, bW, 8, 2, 2, 'F'); doc.rect(bx, y+5, bW, 3, 'F');
        stc(C.wh); doc.setFontSize(8); doc.setFont('helvetica','bold');
        doc.text(n.name, bx + bW/2, y + 5.5, { align:'center' });
        stc(lC);   doc.setFontSize(12); doc.setFont('helvetica','bold');
        doc.text(lbl, bx + bW/2, y + 18, { align:'center' });
        stc(C.tM); doc.setFontSize(6.5); doc.setFont('helvetica','normal');
        doc.text(n.desc, bx + bW/2, y + 23.5, { align:'center' });
      });
      y += 34;

      // ══════════════════════════════════════════════════════════
      // FERTILIZER TABLE
      // ══════════════════════════════════════════════════════════
      newPage(75); sectionTitle('Fertilizer Recommendations');
      if (!hasA) {
        sf([255,251,235]); doc.roundedRect(M, y, CW, 9, 2, 2, 'F');
        sd(C.o); doc.setLineWidth(0.3); doc.roundedRect(M, y, CW, 9, 2, 2, 'S'); doc.setLineWidth(0.2);
        stc(C.o); doc.setFontSize(7.5); doc.setFont('helvetica','italic');
        doc.text('Field area not specified — per-acre rates shown. Enter land area in the web app for total quantities.', M + 4, y + 5.8);
        y += 13;
      }
      // table header
      sf(C.g); doc.roundedRect(M, y, CW, 9, 2, 2, 'F'); doc.rect(M, y+5, CW, 4, 'F');
      stc(C.wh); doc.setFontSize(8); doc.setFont('helvetica','bold');
      doc.text('Fertilizer',        M + 4,   y + 6.2);
      doc.text('Description',       M + 68,  y + 6.2);
      doc.text('kg / Acre',         M + 128, y + 6.2);
      if (hasA) doc.text(`Total (${acre} ac)`, M + 157, y + 6.2);
      y += 9;
      const fertCfg = [
        { key:'urea',    name:'Urea',               desc:'Nitrogen source — leaf & vine growth',  ac:C.b,  lt:C.bL  },
        { key:'tsp',     name:'TSP',                desc:'Triple Super Phosphate — root & tuber', ac:C.o,  lt:C.oL  },
        { key:'mop',     name:'MOP',                desc:'Muriate of Potash — tuber quality',     ac:C.p,  lt:C.pL  },
        { key:'organic', name:'Organic Fertilizer', desc:'Slow-release nutrients & soil health',  ac:C.g,  lt:C.gL  },
      ];
      fertCfg.forEach((f) => {
        const perAcre = prediction.fertilizers[f.key];
        const total   = hasA ? Math.round(perAcre * acre * 10) / 10 : null;
        sf(f.lt); doc.rect(M, y, CW, 10, 'F');
        sf(f.ac); doc.rect(M, y, 4, 10, 'F');
        stc(C.tD); doc.setFontSize(9); doc.setFont('helvetica','bold');
        doc.text(f.name, M + 7, y + 6.8);
        stc(C.tM); doc.setFontSize(7); doc.setFont('helvetica','normal');
        doc.text(f.desc, M + 68, y + 6.8);
        stc(f.ac); doc.setFontSize(10); doc.setFont('helvetica','bold');
        doc.text(String(perAcre), M + 128, y + 6.8);
        if (hasA) doc.text(String(total), M + 157, y + 6.8);
        y += 10;
      });
      if (hasA) {
        const total = Math.round((
          prediction.fertilizers.urea + prediction.fertilizers.tsp +
          prediction.fertilizers.mop  + prediction.fertilizers.organic
        ) * acre * 10) / 10;
        sf(C.gD); doc.rect(M, y, CW, 9, 'F');
        stc(C.wh); doc.setFontSize(8.5); doc.setFont('helvetica','bold');
        doc.text('TOTAL FERTILIZER REQUIRED FOR FIELD', M + 4, y + 6.2);
        doc.text(`${total} kg`, M + 157, y + 6.2);
        y += 9;
      } else {
        sd(C.bd); doc.setLineWidth(0.3); doc.rect(M, y, CW, 0); doc.setLineWidth(0.2);
      }
      y += 10;

      // ══════════════════════════════════════════════════════════
      // CORRECTIVE ACTIONS
      // ══════════════════════════════════════════════════════════
      newPage(40); sectionTitle('Corrective Actions & Recommendations');
      const aCfg = {
        critical: { bg:C.rL,  tc:C.r,  tag:'!! CRITICAL' },
        warning:  { bg:C.oL,  tc:C.o,  tag:'!! WARNING'  },
        info:     { bg:C.bL,  tc:C.b,  tag:'>> INFO'     },
        success:  { bg:C.gL,  tc:C.g,  tag:'OK  GOOD'    },
      };
      prediction.corrective_actions.forEach((action) => {
        const cfg   = aCfg[action.type] || aCfg.info;
        const lines = doc.splitTextToSize(action.message, CW - 28);
        const RH    = lines.length * 5.5 + 9;
        newPage(RH + 4);
        sf(cfg.bg); doc.roundedRect(M, y, CW, RH, 2, 2, 'F');
        sf(cfg.tc); doc.roundedRect(M, y, 4, RH, 1.5, 1.5, 'F'); doc.rect(M+2, y, 2, RH, 'F');
        stc(cfg.tc); doc.setFontSize(6.5); doc.setFont('helvetica','bold');
        doc.text(cfg.tag, M + 7, y + 5);
        stc(C.tD); doc.setFontSize(8); doc.setFont('helvetica','normal');
        lines.forEach((ln, li) => doc.text(ln, M + 7, y + 9.5 + li * 5.5));
        y += RH + 3;
      });
      y += 5;

      // ══════════════════════════════════════════════════════════
      // DISCLAIMER BOX
      // ══════════════════════════════════════════════════════════
      newPage(24);
      sf(C.tL); doc.roundedRect(M, y, CW, 20, 2, 2, 'F');
      sd(C.bd); doc.setLineWidth(0.3); doc.roundedRect(M, y, CW, 20, 2, 2, 'S'); doc.setLineWidth(0.2);
      stc(C.tM); doc.setFontSize(7); doc.setFont('helvetica','bolditalic');
      doc.text('Disclaimer', M + 4, y + 5.5);
      doc.setFont('helvetica','italic'); doc.setFontSize(6.5);
      const disc = 'This report is generated by an AI-assisted system based on IoT sensor measurements. Results are indicative only and should be verified by a qualified agronomist or agricultural extension officer before any soil treatment is applied. Micro-variations in field conditions may not be fully captured by single-point sensor readings.';
      doc.splitTextToSize(disc, CW - 8).forEach((ln, i) => doc.text(ln, M + 4, y + 10 + i * 4.5));

      addFooter();
      doc.save(`soil-report-${now.toISOString().slice(0, 10)}-${reportId}.pdf`);
    } finally {
      setGeneratingPdf(false);
    }
  };

  // ----------------------------------------------------------------
  // RENDER HELPERS
  // ----------------------------------------------------------------
  const SuitabilityBadge = ({ result }) => {
    const styles = {
      green:  'bg-green-500 text-white shadow-green-200',
      orange: 'bg-orange-500 text-white shadow-orange-200',
      red:    'bg-red-500 text-white shadow-red-200',
    };
    const icons = { green: '✅', orange: '⚠️', red: '❌' };
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${styles[result.color] || 'bg-gray-400 text-white'}`}>
        <span>{icons[result.color] || '—'}</span>
        {result.label}
      </span>
    );
  };

  const NpkBadge = ({ status }) => {
    const map = {
      Low:      { bg: 'bg-red-100 text-red-700 border-red-300',     icon: '📉' },
      Adequate: { bg: 'bg-green-100 text-green-700 border-green-300', icon: '✅' },
      High:     { bg: 'bg-blue-100 text-blue-700 border-blue-300',   icon: '📈' },
    };
    const s = map[status.label] || { bg: 'bg-gray-100 text-gray-600 border-gray-200', icon: '?' };
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${s.bg}`}>
        {s.icon} {status.label}
      </span>
    );
  };

  // Enhanced GaugeCard — icon, progress bar, status
  const GaugeCard = ({ label, value, unit, paramKey, optimal, rawValue }) => {
    const statusValue = rawValue != null ? rawValue : value;
    const status = getParamStatus(paramKey, statusValue);
    const meta   = PARAM_META[paramKey] || {};
    const rng    = PARAM_RANGES[paramKey];
    let barPct   = null;
    if (statusValue != null && rng) {
      barPct = Math.min(100, Math.max(0, ((statusValue - rng.lo) / (rng.hi - rng.lo)) * 100));
    }
    const SC = {
      ok:       { ring: 'border-green-400 bg-green-50',  dot: 'bg-green-500',  text: 'text-green-700',  bar: 'bg-green-500',  label: 'Optimal'  },
      warning:  { ring: 'border-amber-400 bg-amber-50',  dot: 'bg-amber-500',  text: 'text-amber-700',  bar: 'bg-amber-400',  label: 'Warning'  },
      critical: { ring: 'border-red-400 bg-red-50',      dot: 'bg-red-500',    text: 'text-red-700',    bar: 'bg-red-500',    label: 'Critical' },
      unknown:  { ring: 'border-gray-200 bg-white',      dot: 'bg-gray-300',   text: 'text-gray-400',   bar: 'bg-gray-300',   label: 'No Data'  },
    };
    const sc = SC[status] || SC.unknown;
    return (
      <div className={`sh-card-anim rounded-2xl border-2 p-4 flex flex-col gap-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${sc.ring}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon || '📊'}</span>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide leading-tight">{label}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-full ${sc.dot} ${status === 'ok' ? 'animate-pulse' : ''}`} />
            <span className={`text-xs font-semibold ${sc.text}`}>{sc.label}</span>
          </div>
        </div>
        <div>
          {value != null ? (
            <p className={`text-3xl font-extrabold ${sc.text}`}>
              {value}<span className="text-sm font-semibold text-gray-400 ml-1">{unit}</span>
            </p>
          ) : (
            <p className="text-3xl font-extrabold text-gray-200">—</p>
          )}
        </div>
        {barPct !== null && (
          <div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${sc.bar}`} style={{ width: `${barPct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Optimal: {optimal}</p>
          </div>
        )}
        {meta.hint && <p className="text-xs text-gray-500 leading-snug">{meta.hint}</p>}
      </div>
    );
  };

  // Out-of-range alerts computed from live data
  const outOfRangeAlerts = liveData
    ? Object.entries(liveData)
        .filter(([k, v]) => {
          const s = getParamStatus(k, v);
          return s !== 'ok' && s !== 'unknown';
        })
        .map(([k, v]) => ({ key: k, value: v, status: getParamStatus(k, v) }))
    : [];

  const TABS = [
    { key: 'live',    label: 'Live Sensors',  icon: '📡' },
    { key: 'manual',  label: 'Manual Input',  icon: '✏️' },
    { key: 'history', label: 'History',       icon: '📋' },
    { key: 'trends',  label: 'Trends',        icon: '📈' },
  ];

  const STAGE_ICONS = ['🌱', '🌿', '🥔', '✅'];
  const STAGE_DESCS = [
    'Seeds just planted or sprouting',
    'Plants actively growing leaves & vines',
    'Tubers forming underground',
    'Tubers reaching final size',
  ];

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* ============================================================
          IMAGE SLIDESHOW
          ============================================================ */}
      {(() => {
        const slide = SLIDES[slideIdx];
        const hasErr = imgErrors[slideIdx];
        return (
          <div className="sh-section relative overflow-hidden rounded-2xl shadow-2xl" style={{ height: '300px' }}>

            {/* Base dark bg + subtle dot pattern */}
            <div className="absolute inset-0 bg-gray-950" />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }} />

            {/* Photo */}
            {!hasErr && (
              <img
                key={slideIdx}
                src={slide.img}
                alt={slide.title}
                onError={() => setImgErrors(e => ({ ...e, [slideIdx]: true }))}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${slideAnim ? 'opacity-100' : 'opacity-0'}`}
              />
            )}

            {/* Cinematic overlay: dark bottom for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
            {/* Side tint from slide palette */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} ${hasErr ? 'opacity-100' : 'opacity-35'}`} />

            {/* Top accent glow bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, transparent, ${slide.accent}, transparent)` }} />

            {/* Content */}
            <div className={`sh-slide-content relative h-full flex flex-col justify-end px-7 pb-11 transition-all duration-500 ${slideAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
              <span
                className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full mb-2.5 w-fit backdrop-blur-sm"
                style={{ background: `${slide.accent}22`, color: slide.accent, border: `1px solid ${slide.accent}55` }}
              >
                {slide.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1.5 drop-shadow">{slide.title}</h2>
              <p className="text-sm text-white/80 max-w-xl leading-relaxed">{slide.desc}</p>
              {slide.stat && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-px w-8 rounded-full flex-shrink-0" style={{ background: slide.accent }} />
                  <span className="text-xs font-semibold" style={{ color: slide.accent }}>{slide.stat}</span>
                </div>
              )}
            </div>

            {/* Prev / Next arrows */}
            <button
              onClick={() => goSlide((slideIdx - 1 + SLIDES.length) % SLIDES.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white text-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            >‹</button>
            <button
              onClick={() => goSlide((slideIdx + 1) % SLIDES.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white text-lg flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
            >›</button>

            {/* Dot navigation — accent-coloured active dot */}
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  i === slideIdx ? '20px' : '8px',
                    height: '8px',
                    background: i === slideIdx ? slide.accent : 'rgba(255,255,255,0.30)',
                  }}
                />
              ))}
            </div>

            {/* Slide counter */}
            <div
              className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10 bg-black/35"
              style={{ color: slide.accent }}
            >
              {slideIdx + 1} / {SLIDES.length}
            </div>
          </div>
        );
      })()}

      {/* ============================================================
          HERO HEADER
          ============================================================ */}
      <div className="sh-section sh-hero relative overflow-hidden rounded-2xl text-white p-6 shadow-lg">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -left-6 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="farm-bounce w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner">
              🥔
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Soil Health Monitor</h1>
              <p className="text-green-100 text-sm mt-0.5">
                Real-time IoT soil analysis for precision potato cultivation · Badulla District
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
            liveStatus === 'live'  ? 'bg-white/20 text-white' :
            liveStatus === 'error' ? 'bg-red-500/30 text-red-100' : 'bg-white/10 text-green-100'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              liveStatus === 'live'  ? 'bg-green-300 animate-pulse' :
              liveStatus === 'error' ? 'bg-red-300' : 'bg-yellow-300 animate-pulse'
            }`} />
            {liveStatus === 'live'  ? `Live · ${lastUpdated?.toLocaleTimeString()}` :
             liveStatus === 'error' ? 'Sensor Offline' : 'Connecting…'}
          </div>
        </div>

        {/* Quick stats row */}
        {liveData && liveStatus === 'live' && (
          <div className="relative mt-5 grid grid-cols-4 sm:grid-cols-7 gap-2">
            {[
              { k: 'pH',          label: 'pH',   raw: liveData.pH,          disp: format2dpTrunc(liveData.pH),          u: '' },
              { k: 'EC',          label: 'EC',   raw: liveData.EC,          disp: format2dpTrunc(liveData.EC),          u: 'mS/cm' },
              { k: 'N',           label: 'N',    raw: liveData.N,           disp: format2dpTrunc(liveData.N),           u: 'ppm' },
              { k: 'P',           label: 'P',    raw: liveData.P,           disp: format2dpTrunc(liveData.P),           u: 'ppm' },
              { k: 'K',           label: 'K',    raw: liveData.K,           disp: format2dpTrunc(liveData.K),           u: 'ppm' },
              { k: 'Temperature', label: 'Temp', raw: liveData.Temperature, disp: format2dpTrunc(liveData.Temperature), u: '°C' },
              { k: 'Moisture',    label: 'H₂O',  raw: liveData.Moisture,    disp: format2dpTrunc(liveData.Moisture),    u: '%' },
            ].map(({ k, label, raw, disp, u }) => {
              const s = getParamStatus(k, raw);
              const dotColor = s === 'ok' ? 'bg-green-400' : s === 'warning' ? 'bg-yellow-400' : s === 'critical' ? 'bg-red-400' : 'bg-white/30';
              return (
                <div key={k} className="bg-white/15 backdrop-blur-sm rounded-xl px-2 py-2 text-center">
                  <p className="text-xs text-green-100 font-medium">{label}</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <p className="text-base font-extrabold">{disp != null ? disp : '—'}</p>
                  </div>
                  <p className="text-xs text-green-200">{u}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================
          ALERT BANNER
          ============================================================ */}
      {liveStatus === 'live' && outOfRangeAlerts.length > 0 && (
        <div className="sh-section sh-alert">
          <div className="text-2xl flex-shrink-0 mt-0.5">🚨</div>
          <div>
            <p className="text-sm font-bold text-red-700 mb-2">
              {outOfRangeAlerts.length} Sensor Alert{outOfRangeAlerts.length > 1 ? 's' : ''} — Immediate Attention Needed
            </p>
            <div className="flex flex-wrap gap-2">
              {outOfRangeAlerts.map(({ key, value, status }) => {
                const displayValue = format2dpTrunc(value);
                return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    status === 'critical'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-amber-100 text-amber-700 border border-amber-300'
                  }`}
                >
                  <span>{PARAM_META[key]?.icon}</span>
                  {key}: <strong>{displayValue != null ? displayValue : value}</strong> — {status === 'critical' ? '⛔ Critical' : '⚠️ Warning'}
                </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TABS
          ============================================================ */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPrediction(null); setPredError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
              activeTab === tab.key
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="uppercase tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ============================================================
          TAB 1 — LIVE SENSOR DATA
          ============================================================ */}
      {activeTab === 'live' && (
        <div className="sh-section space-y-5">

          {/* Connection status (only shown when not live) */}
          {liveStatus !== 'live' && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl font-medium ${
              liveStatus === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                liveStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`} />
              {liveStatus === 'error'      && '⚠️ Cannot read sensor data. Check Firebase rules and ESP32 connection.'}
              {liveStatus === 'connecting' && '⏳ Connecting to Firebase Realtime Database...'}
            </div>
          )}

          {/* Gauge cards */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span>📡</span> Real-Time Sensor Readings
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <GaugeCard label="Soil pH"           value={liveData?.pH}              unit=""       paramKey="pH"          optimal="5.5 – 6.5" />
              <GaugeCard label="Conductivity (EC)" value={liveData?.EC != null ? Number(liveData.EC).toFixed(3) : null} rawValue={liveData?.EC} unit="mS/cm" paramKey="EC" optimal="0.05 – 0.16" />
              <GaugeCard label="Nitrogen (N)"      value={liveData?.N}               unit="ppm"    paramKey="N"           optimal="Stage-based" />
              <GaugeCard label="Phosphorus (P)"    value={liveData?.P}               unit="ppm"    paramKey="P"           optimal="Stage-based" />
              <GaugeCard label="Potassium (K)"     value={liveData?.K}               unit="ppm"    paramKey="K"           optimal="Stage-based" />
              <GaugeCard label="Temperature"       value={format1dpTrunc(liveData?.Temperature)} rawValue={liveData?.Temperature} unit="°C" paramKey="Temperature" optimal="15 – 22°C" />
              <GaugeCard label="Soil Moisture"     value={format1dpTrunc(liveData?.Moisture)}    rawValue={liveData?.Moisture}    unit="%"  paramKey="Moisture"    optimal="Stage-based" />
            </div>
          </div>

          {/* Growth stage selector */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌱</span>
              <h2 className="text-sm font-bold text-gray-800">Select Your Crop Growth Stage</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4 ml-8">
              IoT sensors cannot detect the crop stage — please select based on your current field conditions.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GROWTH_STAGES.map((s, idx) => (
                <button
                  key={s.value}
                  onClick={() => { setGrowthStage(s.value); resetPrediction(); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 hover:shadow-sm ${
                    growthStage === s.value
                      ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl">{STAGE_ICONS[idx]}</span>
                  <p className="text-xs font-bold leading-tight">{s.label}</p>
                  <p className={`text-xs leading-tight ${growthStage === s.value ? 'text-green-100' : 'text-gray-400'}`}>
                    {STAGE_DESCS[idx]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Land area input */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌾</span>
              <h2 className="text-sm font-bold text-gray-800">Your Field Size</h2>
            </div>
            <p className="text-xs text-gray-500 mb-3 ml-8">
              Enter your land area to calculate the <strong>total fertilizer</strong> needed for your entire field.
            </p>
            <div className="flex items-center gap-3 ml-8">
              <div className="relative">
                <input
                  type="number" min="0.1" step="0.1" placeholder="e.g. 2.5"
                  value={landAcres}
                  onChange={(e) => setLandAcres(e.target.value)}
                  className="w-36 pl-3 pr-14 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">acres</span>
              </div>
              {landAcres && !isNaN(landAcres) && parseFloat(landAcres) > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-semibold">
                  ✅ {landAcres} acre{parseFloat(landAcres) !== 1 ? 's' : ''} — totals will be shown
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handlePredictLive}
            disabled={!liveData || liveStatus !== 'live' || predicting}
            className="sh-btn-predict"
          >
            {predicting ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Analyzing Soil...
              </>
            ) : (
              <>
                <span className="text-xl">🔬</span>
                Analyze Soil Suitability
              </>
            )}
          </button>
        </div>
      )}

      {/* ============================================================
          TAB 2 — MANUAL INPUT
          ============================================================ */}
      {activeTab === 'manual' && (
        <form onSubmit={handlePredictManual} className="sh-section space-y-5">

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">✏️</span>
              <h2 className="text-sm font-bold text-gray-800">Enter Soil Parameters Manually</h2>
            </div>
            <p className="text-xs text-gray-500 mb-5 ml-8">
              Use these fields if sensor data is unavailable. EC (Electrical Conductivity) is the same as soil conductivity — enter in mS/cm.
              If your sensor shows µS/cm, divide by 1000 (e.g. 95 µS/cm → 0.095 mS/cm).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'pH',          icon: '🧪', label: 'Soil pH',              placeholder: '5.5 – 6.5',   step: '0.01',  hint: 'Optimal: 5.5–6.5' },
                { key: 'EC',          icon: '⚡', label: 'Conductivity (mS/cm)', placeholder: '0.05 – 0.20', step: '0.001', hint: 'Electrical conductivity' },
                { key: 'N',           icon: '🌿', label: 'Nitrogen — N (ppm)',   placeholder: '10 – 80',     step: '0.1',   hint: 'Leaf & vine growth' },
                { key: 'P',           icon: '🌸', label: 'Phosphorus — P (ppm)', placeholder: '15 – 155',    step: '0.1',   hint: 'Root & tuber development' },
                { key: 'K',           icon: '💪', label: 'Potassium — K (ppm)',  placeholder: '140 – 385',   step: '0.1',   hint: 'Tuber size & disease resistance' },
                { key: 'Temperature', icon: '🌡️', label: 'Temperature (°C)',     placeholder: '13 – 28',     step: '0.1',   hint: 'Soil root zone temp' },
                { key: 'Moisture',    icon: '💧', label: 'Soil Moisture (%)',    placeholder: '32 – 77',     step: '0.1',   hint: 'Water content in soil' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1.5">
                    <span>{f.icon}</span>
                    {f.label}
                  </label>
                  <input
                    type="number" step={f.step} placeholder={f.placeholder} required
                    value={manualForm[f.key]}
                    onChange={(e) => {
                      resetPrediction();
                      setManualForm((prev) => ({ ...prev, [f.key]: e.target.value }));
                    }}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">{f.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sh-content-card">
            <div className="sh-sec-head mb-3">
              <div className="sh-sec-icon">🌱</div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Select Growth Stage</h2>
                <div className="sh-sec-line" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GROWTH_STAGES.map((s, idx) => (
                <button
                  type="button" key={s.value}
                  onClick={() => { setGrowthStage(s.value); resetPrediction(); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all duration-200 hover:shadow-sm ${
                    growthStage === s.value
                      ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl">{STAGE_ICONS[idx]}</span>
                  <p className="text-xs font-bold">{s.label}</p>
                  <p className={`text-xs ${growthStage === s.value ? 'text-green-100' : 'text-gray-400'}`}>
                    {STAGE_DESCS[idx]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="sh-content-card">
            <div className="sh-sec-head">
              <div className="sh-sec-icon">🌾</div>
              <div>
                <h2 className="text-sm font-bold text-gray-800">Your Field Size</h2>
                <div className="sh-sec-line" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3 ml-14">
              Enter your land area to calculate <strong>total fertilizer</strong> needed for your entire field.
            </p>
            <div className="flex items-center gap-3 ml-14">
              <div className="relative">
                <input
                  type="number" min="0.1" step="0.1" placeholder="e.g. 2.5"
                  value={landAcres}
                  onChange={(e) => setLandAcres(e.target.value)}
                  className="w-36 pl-3 pr-14 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">acres</span>
              </div>
              {landAcres && !isNaN(landAcres) && parseFloat(landAcres) > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-semibold">
                  ✅ {landAcres} acre{parseFloat(landAcres) !== 1 ? 's' : ''} — totals will be shown
                </span>
              )}
            </div>
          </div>

          <button
            type="submit" disabled={predicting}
            className="sh-btn-predict"
          >
            {predicting ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Analyzing Soil...
              </>
            ) : (
              <>
                <span className="text-xl">🔬</span>
                Analyze Soil Suitability
              </>
            )}
          </button>
        </form>
      )}

      {/* ============================================================
          TAB 3 — PREDICTION HISTORY
          ============================================================ */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="sh-sec-head">
                <div className="sh-sec-icon">📋</div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Recent Predictions</h2>
                  <div className="sh-sec-line" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-14">Last 20 analyses saved to your account</p>
            </div>
            <button
              onClick={loadHistory}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
            >
              🔄 Refresh
            </button>
          </div>

          {historyLoading && (
            <div className="text-center py-14 flex flex-col items-center gap-3">
              <div className="sh-spinner" />
              <span className="sh-loading-text">Loading prediction history...</span>
            </div>
          )}

          {!historyLoading && history.length === 0 && (
            <div className="rounded-2xl border border-dashed border-emerald-100 bg-white/70 text-center py-14">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-sm font-semibold text-gray-500">No predictions yet</p>
              <p className="text-xs text-gray-400 mt-1">Run your first analysis on the Live or Manual tab.</p>
            </div>
          )}

          {!historyLoading && history.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-emerald-100 bg-white/80 backdrop-blur-sm shadow-sm">
              <table className="w-full text-xs">
                <thead className="bg-gradient-to-r from-green-50 to-emerald-50 text-gray-500 uppercase tracking-wide border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold">📅 Date / Time</th>
                    <th className="text-left px-4 py-3 font-bold">🌱 Stage</th>
                    <th className="text-left px-4 py-3 font-bold">🏷️ Result</th>
                    <th className="text-right px-4 py-3">🧪 pH</th>
                    <th className="text-right px-4 py-3">⚡ EC</th>
                    <th className="text-right px-4 py-3">🌿 N</th>
                    <th className="text-right px-4 py-3">🌸 P</th>
                    <th className="text-right px-4 py-3">💪 K</th>
                    <th className="text-right px-4 py-3">🌡️ Temp</th>
                    <th className="text-right px-4 py-3">💧 H₂O</th>
                    <th className="text-right px-4 py-3">🌾 Acres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((h, i) => {
                    const ts = h.timestamp?.toDate
                      ? h.timestamp.toDate()
                      : new Date(h.timestampClient || h.timestamp || Date.now());
                    const colorMap = {
                      green:  'bg-green-100 text-green-700 border-green-300',
                      orange: 'bg-orange-100 text-orange-700 border-orange-300',
                      red:    'bg-red-100 text-red-700 border-red-300',
                    };
                    return (
                      <tr key={h.id || i} className={`hover:bg-green-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-medium">
                          {ts.toLocaleDateString()} <span className="text-gray-400">{ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{h.growthStageLabel || h.growthStage || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colorMap[h.result?.soil_suitability?.color] || 'bg-gray-100 text-gray-600'}`}>
                            {h.result?.soil_suitability?.label || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.pH ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.EC ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.N ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.P ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.K ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.Temperature ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.inputs?.Moisture ?? '—'}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{h.landAcres || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 4 — TRENDS CHART
          ============================================================ */}
      {activeTab === 'trends' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">📈</span>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Parameter Trend Over Time</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Historical values from your last {history.length} prediction{history.length !== 1 ? 's' : ''}.
              </p>
              <div className="sh-sec-line" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'pH',          label: '🧪 pH',         color: '#22c55e' },
              { key: 'EC',          label: '⚡ EC',         color: '#f97316' },
              { key: 'N',           label: '🌿 Nitrogen',   color: '#3b82f6' },
              { key: 'P',           label: '🌸 Phosphorus', color: '#a855f7' },
              { key: 'K',           label: '💪 Potassium',  color: '#ec4899' },
              { key: 'Temperature', label: '🌡️ Temp',       color: '#ef4444' },
              { key: 'Moisture',    label: '💧 Moisture',   color: '#06b6d4' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setTrendParam(p.key)}
                style={trendParam === p.key ? { backgroundColor: p.color, borderColor: p.color } : {}}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  trendParam === p.key ? 'text-white shadow-md' : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {historyLoading && (
            <div className="text-center py-14 flex flex-col items-center gap-3">
              <div className="sh-spinner" />
              <span className="sh-loading-text">Loading trend data...</span>
            </div>
          )}

          {!historyLoading && history.length < 2 && (
            <div className="rounded-2xl border border-dashed border-emerald-100 bg-white/70 text-center py-14">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-sm font-semibold text-gray-500">Not enough data yet</p>
              <p className="text-xs text-gray-400 mt-1">Run at least 2 analyses to see a trend chart.</p>
            </div>
          )}

          {!historyLoading && history.length >= 2 && (() => {
            const COLORS = { pH: '#22c55e', EC: '#f97316', N: '#3b82f6', P: '#a855f7', K: '#ec4899', Temperature: '#ef4444', Moisture: '#06b6d4' };
            const chartData = [...history]
              .reverse()
              .map((h) => {
                const ts = h.timestamp?.toDate
                  ? h.timestamp.toDate()
                  : new Date(h.timestampClient || h.timestamp || Date.now());
                return {
                  name: ts.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  value: parseFloat(h.inputs?.[trendParam]) || null,
                };
              });
            const lo = PARAM_RANGES[trendParam]?.lo;
            const hi = PARAM_RANGES[trendParam]?.hi;
            return (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{trendParam} over time</p>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '12px', border: '1px solid #e5e7eb' }} formatter={(v) => [v, trendParam]} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    {lo !== undefined && (
                      <ReferenceLine y={lo} stroke="#fca5a5" strokeDasharray="4 4" label={{ value: `Min ${lo}`, fontSize: 10, fill: '#ef4444' }} />
                    )}
                    {hi !== undefined && (
                      <ReferenceLine y={hi} stroke="#fca5a5" strokeDasharray="4 4" label={{ value: `Max ${hi}`, fontSize: 10, fill: '#ef4444' }} />
                    )}
                    <Line type="monotone" dataKey="value" name={trendParam} stroke={COLORS[trendParam] || '#22c55e'} strokeWidth={2.5} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} connectNulls={false} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-2 text-center">🔴 Red dashed lines indicate optimal range boundaries</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================
          PREDICTION ERROR
          ============================================================ */}
      {predError && (
        <div className="sh-section bg-red-50 border border-red-300 text-red-700 text-sm rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">❌</span>
          <div>
            <p className="font-bold mb-0.5">Analysis Error</p>
            <p>{predError}</p>
          </div>
        </div>
      )}

      {/* ============================================================
          PREDICTION RESULTS
          ============================================================ */}
      {prediction && (
        <div className="space-y-4">

          {/* Suitability banner */}
          {(() => {
            const styles = {
              green:  { banner: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300', emoji: '🎉' },
              orange: { banner: 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300', emoji: '📋' },
              red:    { banner: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300',         emoji: '🚨' },
            };
            const s = styles[prediction.soil_suitability.color] || styles.red;
            return (
              <div className={`rounded-2xl border-2 p-6 ${s.banner}`}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{s.emoji}</div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                        AI Analysis Result · {prediction.growth_stage.label}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <SuitabilityBadge result={prediction.soil_suitability} />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{prediction.soil_suitability.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={generatePDF}
                    disabled={generatingPdf}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {generatingPdf ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                        Generating...
                      </>
                    ) : (
                      '📄 Download PDF Report'
                    )}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* NPK Status */}
          <div className="sh-content-card">
            <div className="sh-sec-head mb-4">
              <div className="sh-sec-icon">🌱</div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">NPK Nutrient Status</h3>
                <div className="sh-sec-line" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'n', icon: '🌿', name: 'Nitrogen',   gradient: 'from-green-100 to-emerald-50',  border: 'border-green-200'  },
                { key: 'p', icon: '🌸', name: 'Phosphorus', gradient: 'from-pink-100 to-rose-50',      border: 'border-pink-200'   },
                { key: 'k', icon: '💪', name: 'Potassium',  gradient: 'from-purple-100 to-violet-50',  border: 'border-purple-200' },
              ].map((nutrient) => (
                <div key={nutrient.key} className={`text-center bg-gradient-to-br ${nutrient.gradient} rounded-2xl p-4 border ${nutrient.border}`}>
                  <div className="text-2xl mb-1">{nutrient.icon}</div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">{nutrient.name}</p>
                  <NpkBadge status={prediction.npk_status[nutrient.key]} />
                </div>
              ))}
            </div>
          </div>

          {/* Fertilizer Recommendations */}
          {(() => {
            const acres = parseFloat(landAcres);
            const hasAcres = landAcres && !isNaN(acres) && acres > 0;
            const fertilizers = [
              { key: 'urea',    label: 'Urea',    desc: 'Nitrogen source',        icon: '💚', gradient: 'from-blue-50 to-cyan-50',     border: 'border-blue-200',   num: 'text-blue-700'   },
              { key: 'tsp',     label: 'TSP',     desc: 'Triple Super Phosphate', icon: '🧡', gradient: 'from-orange-50 to-amber-50',  border: 'border-orange-200', num: 'text-orange-700' },
              { key: 'mop',     label: 'MOP',     desc: 'Muriate of Potash',      icon: '💜', gradient: 'from-purple-50 to-violet-50', border: 'border-purple-200', num: 'text-purple-700' },
              { key: 'organic', label: 'Organic', desc: 'Organic fertilizer',     icon: '🌱', gradient: 'from-green-50 to-emerald-50', border: 'border-green-200',  num: 'text-green-700'  },
            ];
            return (
              <div className="sh-content-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="sh-sec-head">
                    <div className="sh-sec-icon">🧪</div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">Fertilizer Recommendations</h3>
                      <div className="sh-sec-line" />
                    </div>
                  </div>
                  {hasAcres && (
                    <span className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-full border border-green-200">
                      🌾 {acres} acre{acres !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {!hasAcres && (
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4">
                    <span className="flex-shrink-0 text-sm">💡</span>
                    Enter your <strong>land area (acres)</strong> above the Analyze button to also see <strong>total fertilizer quantity</strong> for your field.
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {fertilizers.map((f) => {
                    const perAcre = prediction.fertilizers[f.key];
                    const total   = hasAcres ? Math.round(perAcre * acres * 10) / 10 : null;
                    return (
                      <div key={f.key} className={`bg-gradient-to-br ${f.gradient} rounded-2xl p-4 text-center border ${f.border}`}>
                        <div className="text-2xl mb-1">{f.icon}</div>
                        <p className="text-xs font-extrabold text-gray-700 uppercase tracking-wide">{f.label}</p>
                        <p className="text-xs text-gray-400 mb-3">{f.desc}</p>
                        <div>
                          <p className={`text-3xl font-extrabold ${f.num}`}>{perAcre}</p>
                          <p className="text-xs text-gray-400">kg / acre</p>
                        </div>
                        {hasAcres && (
                          <div className="mt-3 pt-3 border-t border-white/80">
                            <p className={`text-xl font-extrabold ${f.num}`}>{total}</p>
                            <p className="text-xs font-bold text-gray-500">kg total</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {hasAcres && (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Per-acre rate × {acres} acres = total quantity required for your field
                  </p>
                )}
              </div>
            );
          })()}

          {/* Corrective Actions */}
          <div className="sh-content-card">
            <div className="sh-sec-head mb-4">
              <div className="sh-sec-icon">🔧</div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Corrective Actions</h3>
                <div className="sh-sec-line" />
              </div>
            </div>
            <div className="space-y-2.5">
              {prediction.corrective_actions.map((action, i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-start text-sm rounded-xl pl-4 pr-3 py-3 border-l-4 ${ACTION_STYLES[action.type] || 'bg-gray-50 border-gray-300'}`}
                >
                  <span className="text-lg flex-shrink-0 leading-none mt-0.5">{ACTION_ICONS[action.type]}</span>
                  <span className="leading-relaxed">{action.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>

    {/* ── Floating "New Analysis" bar when results are visible ── */}
    {prediction && !showPopup && (
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 999, display: 'flex', gap: '10px', alignItems: 'center',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
        borderRadius: '16px', padding: '10px 20px',
        boxShadow: '0 8px 32px rgba(30,45,30,0.18), 0 1px 4px rgba(30,45,30,0.08)',
        border: '1px solid #e3d9c2',
        animation: 'shFadeInUp 0.4s ease both',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#3b4f3a', fontFamily: 'Inter, sans-serif' }}>✅ Analysis complete</span>
        <button
          className="sh-popup-btn sh-popup-btn-ghost"
          style={{ padding: '8px 18px', fontSize: '13px' }}
          onClick={() => { setPrediction(null); setPredError(null); setPredInputs(null); }}
        >
          🔄 Run New Analysis
        </button>
        <button
          className="sh-popup-btn sh-popup-btn-primary"
          style={{ padding: '8px 18px', fontSize: '13px' }}
          onClick={() => document.querySelector('.sh-result-banner')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          📊 View Results
        </button>
      </div>
    )}
    </>
  );
}
