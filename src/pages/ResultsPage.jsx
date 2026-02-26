import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmtLKR = (v) => {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return `LKR ${Math.round(v).toLocaleString()}`;
};

const fmtKg = (v) => {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return `${Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`;
};

const fmtKgAc = (v) => {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return `${Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg/ac`;
};

/* ─────────────────────────────────────────────
   SVG Icon helper
───────────────────────────────────────────── */
const Icon = ({
  d,
  size = 16,
  stroke = "currentColor",
  fill = "none",
  sw = 1.8,
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={fill}
    stroke={stroke}
    strokeWidth={sw}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    {Array.isArray(d) ? (
      d.map((p, i) => <path key={i} d={p} />)
    ) : (
      <path d={d} />
    )}
  </svg>
);

const LeafIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z' />
    <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
  </svg>
);

/* ─────────────────────────────────────────────
   Inline CSS
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --leaf:      #3d7a3a;
    --leaf-mid:  #5a9e56;
    --leaf-lt:   #7dc478;
    --sprout:    #a8d5a2;
    --fog:       #eef4ed;
    --cream:     #f8f4ec;
    --straw:     #e3d9c2;
    --soil:      #7a5c3a;
    --ink:       #1e2d1e;
    --ink-mid:   #3b4f3a;
    --ink-lt:    #6b8069;
    --white:     #ffffff;
    --amber:     #d48806;
    --amber-bg:  #fffbf0;
    --red:       #c0392b;
    --red-bg:    #fdf0ee;
    --blue:      #2563b0;
    --blue-bg:   #eff6ff;
    --shadow-sm: 0 1px 3px rgba(30,45,30,0.08);
    --shadow-md: 0 4px 16px rgba(30,45,30,0.10);
    --shadow-lg: 0 16px 48px rgba(30,45,30,0.13), 0 2px 8px rgba(30,45,30,0.08);
    --radius:    12px;
  }

  .rp-page {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse 70% 55% at 8% 0%,   rgba(90,158,86,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 92% 100%, rgba(122,92,58,0.08) 0%, transparent 55%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 20px 64px;
    font-family: 'Inter', sans-serif;
    position: relative;
  }

  .rp-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(90,158,86,0.10) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none; z-index: 0;
  }

  .rp-wrap {
    width: 100%;
    max-width: 860px;
    position: relative;
    z-index: 1;
  }

  /* ── Top nav bar ── */
  .rp-nav {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    animation: fadeDown .45s ease both;
  }

  .rp-logo {
    width: 44px; height: 44px; border-radius: 13px;
    background: linear-gradient(140deg, #2d5e2a 0%, #5a9e56 100%);
    display: flex; align-items: center; justify-content: center;
    color: #fff; box-shadow: 0 4px 14px rgba(61,122,58,.28); flex-shrink: 0;
  }

  .rp-nav-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--leaf-mid); margin-bottom: 2px;
  }

  .rp-nav-title {
    font-family: 'Lora', serif; font-size: 20px; font-weight: 700;
    color: var(--ink); letter-spacing: -.01em;
  }

  .rp-back-btn {
    margin-left: auto;
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px;
    background: var(--white); border: 1.5px solid var(--straw);
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--ink-lt); cursor: pointer;
    transition: all .18s ease;
    text-decoration: none;
  }

  .rp-back-btn:hover { border-color: var(--leaf-mid); color: var(--leaf); background: var(--fog); }

  /* ── Step indicator ── */
  .rp-steps {
    display: flex; align-items: center; gap: 0;
    margin-bottom: 28px;
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 14px;
    padding: 6px;
    box-shadow: var(--shadow-sm);
    animation: fadeDown .45s ease both .05s;
  }

  .rp-step {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 10px 16px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: var(--ink-lt);
    cursor: pointer; transition: all .2s ease;
  }

  .rp-step.active {
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    color: #fff;
    box-shadow: 0 3px 12px rgba(61,122,58,.3);
  }

  .rp-step.done {
    color: var(--leaf);
    background: var(--fog);
  }

  .rp-step-num {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    background: rgba(255,255,255,.25);
    flex-shrink: 0;
  }

  .rp-step.active .rp-step-num { background: rgba(255,255,255,.25); color: #fff; }
  .rp-step.done  .rp-step-num { background: var(--leaf); color: #fff; }
  .rp-step:not(.active):not(.done) .rp-step-num { background: var(--straw); color: var(--ink-lt); }

  .rp-step-divider { width: 1px; height: 28px; background: var(--straw); flex-shrink: 0; }

  /* ── Hero banner ── */
  .rp-hero {
    background: linear-gradient(108deg, #253f23 0%, #3d7a3a 50%, #5a9e56 100%);
    border-radius: 20px;
    padding: 32px 40px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both .05s;
  }

  .rp-hero::after {
    content: ''; position: absolute; right: -30px; bottom: -50px;
    width: 200px; height: 200px; border-radius: 50%;
    background: rgba(255,255,255,.05);
  }

  .rp-hero::before {
    content: ''; position: absolute; right: 80px; top: -40px;
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(255,255,255,.04);
  }

  .rp-hero-row {
    display: flex; align-items: center; gap: 18px;
    position: relative; z-index: 1;
  }

  .rp-hero-icon {
    width: 60px; height: 60px; border-radius: 16px; flex-shrink: 0;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    animation: popIn .5s cubic-bezier(.22,1,.36,1) both .15s;
  }

  .rp-hero-label {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--sprout); margin-bottom: 5px;
  }

  .rp-hero-title {
    font-family: 'Lora', serif; font-size: 26px; font-weight: 700;
    color: #fff; line-height: 1.2; letter-spacing: -.01em;
  }

  .rp-hero-sub {
    font-size: 13px; color: rgba(255,255,255,.6); margin-top: 4px;
    font-weight: 300;
  }

  .rp-hero-meta {
    margin-left: auto; flex-shrink: 0;
    display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
  }

  .rp-hero-tag {
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
    border-radius: 20px; padding: 5px 14px;
    font-size: 11px; font-weight: 500; color: rgba(255,255,255,.85);
    white-space: nowrap;
  }

  .rp-hero-tag.ok  { background: rgba(168,213,162,.18); border-color: rgba(168,213,162,.4); color: #d4f7d0; }
  .rp-hero-tag.bad { background: rgba(192,57,43,.18);   border-color: rgba(192,57,43,.4);   color: #ffc9c2; }

  @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0); } }
  @keyframes popIn    { from { transform:scale(.7); opacity:0; }         to { transform:scale(1); opacity:1; }      }
  @keyframes cardIn   { from { opacity:0; transform:translateY(14px); }  to { opacity:1; transform:translateY(0); } }

  /* ── Section heading ── */
  .rp-sec-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
  }

  .rp-sec-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--fog); border: 1px solid rgba(61,122,58,.16);
    display: flex; align-items: center; justify-content: center;
    color: var(--leaf); flex-shrink: 0;
  }

  .rp-sec-title {
    font-family: 'Lora', serif; font-size: 14px; font-weight: 600;
    color: var(--ink); letter-spacing: .01em;
  }

  .rp-sec-line { flex: 1; height: 1px; background: var(--straw); }

  /* ── Cards ── */
  .rp-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 16px;
    padding: 26px;
    box-shadow: var(--shadow-sm);
    animation: cardIn .5s ease both;
    margin-bottom: 20px;
  }

  /* ── Cost breakdown ── */
  .rp-cost-list { display: flex; flex-direction: column; gap: 10px; }

  .rp-cost-row {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 18px; border-radius: 12px;
    border: 1px solid var(--straw);
    background: var(--cream);
    transition: background .15s ease;
  }

  .rp-cost-row:hover { background: #f0faf0; border-color: rgba(61,122,58,.2); }

  .rp-cost-dot {
    width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
  }

  .rp-cost-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--ink-mid); }

  .rp-cost-bar-wrap {
    flex: 2; height: 8px; background: var(--straw);
    border-radius: 99px; overflow: hidden;
  }

  .rp-cost-bar {
    height: 100%; border-radius: 99px;
    transition: width .8s cubic-bezier(.22,1,.36,1);
  }

  .rp-cost-amount {
    font-size: 14px; font-weight: 700; color: var(--ink);
    font-variant-numeric: tabular-nums; min-width: 110px; text-align: right;
    font-family: 'Lora', serif;
  }

  .rp-cost-divider { border: none; border-top: 1px solid var(--straw); margin: 6px 0; }

  .rp-cost-total {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 18px; background: var(--fog);
    border-radius: 12px; border: 1.5px solid rgba(61,122,58,.2);
    margin-top: 6px;
  }

  .rp-cost-total-label {
    font-size: 14px; font-weight: 600; color: var(--ink);
    display: flex; align-items: center; gap: 7px;
  }

  .rp-cost-total-value {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700; color: var(--leaf);
  }

  /* ── Capital gauge ── */
  .rp-capital-block {
    margin-top: 16px;
    padding: 18px;
    border-radius: 12px;
    border: 1.5px solid var(--straw);
    background: var(--white);
  }

  .rp-capital-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px;
  }

  .rp-capital-label { font-size: 12px; font-weight: 500; color: var(--ink-lt); }
  .rp-capital-value { font-size: 14px; font-weight: 600; color: var(--ink); font-variant-numeric: tabular-nums; }

  .rp-gauge-track {
    height: 10px; background: var(--straw); border-radius: 99px; overflow: hidden;
    margin-bottom: 8px;
  }

  .rp-gauge-fill {
    height: 100%; border-radius: 99px;
    transition: width 1s cubic-bezier(.22,1,.36,1);
  }

  .rp-gauge-fill.ok  { background: linear-gradient(90deg, #3d7a3a, #7dc478); }
  .rp-gauge-fill.bad { background: linear-gradient(90deg, #c0392b, #e57373); }

  .rp-gauge-legend {
    display: flex; justify-content: space-between;
    font-size: 10px; color: var(--ink-lt); opacity: .65;
  }

  /* ── Feasibility banner ── */
  .rp-feasible {
    border-radius: 12px;
    padding: 16px 20px;
    display: flex; align-items: flex-start; gap: 14px;
    margin-bottom: 20px;
    animation: cardIn .45s ease both .08s;
  }

  .rp-feasible.ok  { background: #f0faf0; border: 1.5px solid rgba(61,122,58,.25); }
  .rp-feasible.bad { background: var(--red-bg); border: 1.5px solid rgba(192,57,43,.25); }

  .rp-feasible-icon {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }

  .rp-feasible.ok  .rp-feasible-icon { background: rgba(61,122,58,.12); }
  .rp-feasible.bad .rp-feasible-icon { background: rgba(192,57,43,.12); }

  .rp-feasible-title {
    font-size: 14px; font-weight: 600;
    margin-bottom: 3px;
  }

  .rp-feasible.ok  .rp-feasible-title { color: var(--leaf); }
  .rp-feasible.bad .rp-feasible-title { color: var(--red); }

  .rp-feasible-text {
    font-size: 12.5px; line-height: 1.55;
  }

  .rp-feasible.ok  .rp-feasible-text { color: var(--ink-mid); }
  .rp-feasible.bad .rp-feasible-text { color: #7a2020; }

  /* ── Yield & Price page ── */
  .rp-big-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .rp-big-metric {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 20px;
    padding: 32px 28px;
    text-align: center;
    box-shadow: var(--shadow-md);
    position: relative; overflow: hidden;
    animation: cardIn .5s ease both;
  }

  .rp-big-metric-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
  }

  .rp-big-metric-emoji {
    font-size: 42px; margin-bottom: 14px; display: block;
  }

  .rp-big-metric-label {
    font-size: 11px; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--ink-lt); margin-bottom: 10px;
  }

  .rp-big-metric-value {
    font-family: 'Lora', serif; font-size: 32px; font-weight: 700;
    color: var(--ink); line-height: 1;
  }

  .rp-big-metric-sub {
    font-size: 12px; color: var(--ink-lt); margin-top: 8px; opacity: .8;
  }

  .rp-price-highlight {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 2px solid rgba(37,99,176,.2);
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    animation: cardIn .5s ease both .1s;
  }

  .rp-price-left { display: flex; align-items: center; gap: 16px; }

  .rp-price-icon {
    width: 56px; height: 56px; border-radius: 16px; flex-shrink: 0;
    background: linear-gradient(135deg, #2563b0, #3b82f6);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    box-shadow: 0 6px 20px rgba(37,99,176,.3);
  }

  .rp-price-label { font-size: 12px; font-weight: 500; color: #1e3a7a; margin-bottom: 4px; }
  .rp-price-value { font-family: 'Lora', serif; font-size: 34px; font-weight: 700; color: var(--blue); }
  .rp-price-note  { font-size: 11px; color: #4a6891; margin-top: 3px; }

  .rp-profit-chip {
    background: linear-gradient(135deg, #f0faf0 0%, #dcfce7 100%);
    border: 1.5px solid rgba(61,122,58,.25);
    border-radius: 14px;
    padding: 20px 24px;
    text-align: center;
    flex-shrink: 0;
    min-width: 180px;
  }

  .rp-profit-chip-label { font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-lt); margin-bottom: 8px; }
  .rp-profit-chip-val   { font-family: 'Lora', serif; font-size: 22px; font-weight: 700; color: var(--leaf); }
  .rp-profit-chip-sub   { font-size: 11px; color: var(--ink-lt); margin-top: 4px; }

  .rp-yield-bars { display: flex; flex-direction: column; gap: 16px; }

  .rp-yield-bar-row { display: flex; flex-direction: column; gap: 6px; }

  .rp-yield-bar-header {
    display: flex; align-items: center; justify-content: space-between;
  }

  .rp-yield-bar-label { font-size: 12px; font-weight: 500; color: var(--ink-lt); }
  .rp-yield-bar-val   { font-size: 14px; font-weight: 700; color: var(--ink); font-family: 'Lora', serif; }

  .rp-yield-track {
    height: 10px; background: var(--straw); border-radius: 99px; overflow: hidden;
  }

  .rp-yield-fill {
    height: 100%; border-radius: 99px;
    transition: width .9s cubic-bezier(.22,1,.36,1);
  }

  /* ── Actions ── */
  .rp-actions {
    display: flex; gap: 14px; margin-top: 8px;
    animation: cardIn .5s ease both .35s;
  }

  .rp-btn-primary {
    flex: 1;
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    border: none; border-radius: var(--radius);
    padding: 15px 24px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
    color: #fff; letter-spacing: .04em; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .22s ease;
    box-shadow: 0 4px 18px rgba(61,122,58,.28);
  }

  .rp-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(61,122,58,.34);
    filter: brightness(1.06);
  }

  .rp-btn-secondary {
    flex: 1;
    background: var(--white);
    border: 1.5px solid var(--straw); border-radius: var(--radius);
    padding: 15px 24px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500;
    color: var(--ink-mid); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .18s ease;
    box-shadow: var(--shadow-sm);
  }

  .rp-btn-secondary:hover {
    border-color: var(--leaf-mid); color: var(--leaf); background: var(--fog);
  }

  /* ── Footer note ── */
  .rp-footnote {
    display: flex; align-items: center; justify-content: center; gap: 18px;
    margin-top: 28px;
    animation: fadeUp .5s ease both .4s;
  }

  .rp-fn-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--ink-lt); opacity: .45;
  }

  .rp-fn-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-lt); opacity: .3; }

  /* ── Loading / Empty states ── */
  .rp-state-wrap {
    min-height: 100vh; background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Inter', sans-serif;
  }

  .rp-state-card {
    background: var(--white); border: 1px solid rgba(122,92,58,.1);
    border-radius: 20px; padding: 56px 48px; text-align: center;
    box-shadow: var(--shadow-lg); max-width: 440px; width: 100%;
  }

  .rp-state-icon { font-size: 52px; margin-bottom: 20px; display: block; }

  .rp-state-title {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700;
    color: var(--ink); margin-bottom: 10px;
  }

  .rp-state-text {
    font-size: 13.5px; color: var(--ink-lt); line-height: 1.65;
    margin-bottom: 28px;
  }

  .rp-spin {
    width: 52px; height: 52px; margin: 0 auto 20px;
    border: 3px solid rgba(61,122,58,.15);
    border-top-color: var(--leaf-mid);
    border-radius: 50%;
    animation: spin .8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .rp-hero { padding: 24px 22px; }
    .rp-hero-meta { display: none; }
    .rp-hero-title { font-size: 21px; }
    .rp-big-metrics { grid-template-columns: 1fr; }
    .rp-actions { flex-direction: column; }
    .rp-nav-title { font-size: 17px; }
    .rp-price-highlight { flex-direction: column; }
    .rp-profit-chip { min-width: 100%; }
    .rp-steps { overflow-x: auto; }
  }
`;

/* ─────────────────────────────────────────────
   Cost bar colors
───────────────────────────────────────────── */
const COST_META = [
  {
    key: "seed_cost_lkr",
    label: "Seed Cost",
    emoji: "🌱",
    color: "#3d7a3a",
    dotBg: "#3d7a3a",
  },
  {
    key: "labor_cost_lkr",
    label: "Labor Cost",
    emoji: "👷",
    color: "#d48806",
    dotBg: "#d48806",
  },
  {
    key: "fertilizer_cost_lkr",
    label: "Fertilizer Cost",
    emoji: "🧪",
    color: "#2563b0",
    dotBg: "#2563b0",
  },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function ResultsPage() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [lastForm, setLastForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 1 = Costs, 2 = Price & Yield

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("analysisResult");
      const lf = sessionStorage.getItem("lastForm");
      setAnalysis(raw ? JSON.parse(raw) : null);
      setLastForm(lf ? JSON.parse(lf) : null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className='rp-state-wrap'>
          <div className='rp-state-card'>
            <div className='rp-spin' />
            <div className='rp-state-title'>Analyzing your farm data…</div>
            <div className='rp-state-text'>
              Our ML model is crunching your parameters. This takes just a
              moment.
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── No data ── */
  if (!analysis || analysis.status !== "ok") {
    return (
      <>
        <style>{CSS}</style>
        <div className='rp-state-wrap'>
          <div className='rp-state-card'>
            <span className='rp-state-icon'>📋</span>
            <div className='rp-state-title'>No Results Found</div>
            <div className='rp-state-text'>
              Please complete the farm input form first to generate your yield
              and profit predictions.
            </div>
            <button
              className='rp-btn-primary'
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => navigate("/app/cost/in")}
            >
              <Icon
                d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
                size={15}
                stroke='#fff'
                sw={2}
              />
              Go to Input Form
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Data ── */
  const { baseline, predicted_costs } = analysis;

  const yieldPerAcre = baseline?.yield_per_acre ?? null;
  const yieldTotal = baseline?.yield_total ?? null;
  const pricePerKg = baseline?.price_lkr_per_kg ?? null;

  const costs = predicted_costs ?? {};
  const seedCost = Number(costs.seed_cost_lkr ?? 0);
  const laborCost = Number(costs.labor_cost_lkr ?? 0);
  const fertCost = Number(costs.fertilizer_cost_lkr ?? 0);
  const totalCost = seedCost + laborCost + fertCost;

  const capital = Number(lastForm?.hands_on_money_lkr ?? 0);
  const feasible = capital > 0 ? totalCost <= capital : null;
  const shortfall = totalCost - capital;
  const gaugeWidth =
    capital > 0 ? Math.min((totalCost / capital) * 100, 100) : 0;

  const grossRevenue =
    yieldTotal && pricePerKg ? yieldTotal * pricePerKg : null;
  const netProfit = grossRevenue !== null ? grossRevenue - totalCost : null;

  return (
    <>
      <style>{CSS}</style>
      <div className='rp-page'>
        <div className='rp-wrap'>
          {/* ── Nav bar ── */}
          <nav className='rp-nav'>
            <div className='rp-logo'>
              <LeafIcon />
            </div>
            <div>
              <div className='rp-nav-eyebrow'>AgriIntelligence · Sri Lanka</div>
              <div className='rp-nav-title'>Prediction Results</div>
            </div>
            <button
              className='rp-back-btn'
              onClick={() => navigate("/app/cost/in")}
            >
              <Icon d='M19 12H5M12 5l-7 7 7 7' size={13} sw={2} />
              New Prediction
            </button>
          </nav>

          {/* ── Step indicator ── */}
          <div className='rp-steps'>
            <div
              className={`rp-step ${page === 1 ? "active" : "done"}`}
              onClick={() => setPage(1)}
            >
              <div className='rp-step-num'>{page > 1 ? "✓" : "1"}</div>
              <span>Predicted Costs</span>
            </div>
            <div className='rp-step-divider' />
            <div
              className={`rp-step ${page === 2 ? "active" : page > 2 ? "done" : ""}`}
              onClick={() => setPage(2)}
            >
              <div className='rp-step-num'>2</div>
              <span>Price &amp; Yield</span>
            </div>
            <div className='rp-step-divider' />
            <div
              className='rp-step'
              onClick={() => navigate("/app/cost/recommendations")}
            >
              <div className='rp-step-num'>3</div>
              <span>Strategies</span>
            </div>
          </div>

          {/* ── Hero banner ── */}
          <div className='rp-hero'>
            <div className='rp-hero-row'>
              <div className='rp-hero-icon'>🌾</div>
              <div>
                <div className='rp-hero-label'>
                  {page === 1
                    ? "Step 1 of 3 — Cost Analysis"
                    : "Step 2 of 3 — Yield & Market Data"}
                </div>
                <div className='rp-hero-title'>
                  {lastForm?.district
                    ? `${lastForm.district} Farm`
                    : "Your Farm"}{" "}
                  — {lastForm?.season ?? "—"}
                </div>
                <div className='rp-hero-sub'>
                  {lastForm?.field_size_acres
                    ? `${lastForm.field_size_acres} acres`
                    : "—"}
                  {lastForm?.soil_type
                    ? ` · ${lastForm.soil_type.replace("_", " ")} soil`
                    : ""}
                  {lastForm?.crop_quality
                    ? ` · ${lastForm.crop_quality} quality`
                    : ""}
                </div>
              </div>
              <div className='rp-hero-meta'>
                {feasible === true && (
                  <span className='rp-hero-tag ok'>✓ Financially Feasible</span>
                )}
                {feasible === false && (
                  <span className='rp-hero-tag bad'>⚠ Budget Shortfall</span>
                )}
                {lastForm?.season && (
                  <span className='rp-hero-tag'>{lastForm.season} Season</span>
                )}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
              PAGE 1 — PREDICTED COSTS
          ════════════════════════════════ */}
          {page === 1 && (
            <>
              {/* Feasibility alert */}
              {feasible !== null && (
                <div className={`rp-feasible ${feasible ? "ok" : "bad"}`}>
                  <div className='rp-feasible-icon'>
                    {feasible ? "✅" : "⚠️"}
                  </div>
                  <div>
                    <div className='rp-feasible-title'>
                      {feasible
                        ? "Budget is sufficient for this cultivation cycle"
                        : "Budget may be insufficient"}
                    </div>
                    <div className='rp-feasible-text'>
                      {feasible
                        ? `Your available capital of ${fmtLKR(capital)} covers the total estimated cost of ${fmtLKR(totalCost)}. You have a buffer of ${fmtLKR(capital - totalCost)}.`
                        : `Your available capital of ${fmtLKR(capital)} falls short by ${fmtLKR(shortfall)}. Consider reducing costs or securing additional funding.`}
                    </div>
                  </div>
                </div>
              )}

              {/* Cost Breakdown Card */}
              <div className='rp-card'>
                <div className='rp-sec-head'>
                  <div className='rp-sec-icon'>
                    <Icon
                      d={[
                        "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z",
                        "M2 11h20",
                      ]}
                      size={14}
                    />
                  </div>
                  <span className='rp-sec-title'>Predicted Cost Breakdown</span>
                  <div className='rp-sec-line' />
                </div>

                <div className='rp-cost-list'>
                  {COST_META.map(({ key, label, emoji, color, dotBg }) => {
                    const amount =
                      key === "seed_cost_lkr"
                        ? seedCost
                        : key === "labor_cost_lkr"
                          ? laborCost
                          : fertCost;
                    const pct = totalCost > 0 ? (amount / totalCost) * 100 : 0;
                    return (
                      <div className='rp-cost-row' key={key}>
                        <div
                          className='rp-cost-dot'
                          style={{ background: dotBg }}
                        />
                        <span className='rp-cost-name'>
                          {emoji} {label}
                        </span>
                        <div className='rp-cost-bar-wrap'>
                          <div
                            className='rp-cost-bar'
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--ink-lt)",
                            minWidth: 36,
                            textAlign: "center",
                          }}
                        >
                          {pct.toFixed(0)}%
                        </span>
                        <span className='rp-cost-amount'>{fmtLKR(amount)}</span>
                      </div>
                    );
                  })}

                  <hr className='rp-cost-divider' />

                  <div className='rp-cost-total'>
                    <span className='rp-cost-total-label'>
                      <Icon
                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        size={15}
                        stroke='var(--leaf)'
                        sw={2}
                      />
                      Total Investment Required
                    </span>
                    <span className='rp-cost-total-value'>
                      {fmtLKR(totalCost)}
                    </span>
                  </div>
                </div>

                {/* Capital utilisation gauge */}
                {capital > 0 && (
                  <div className='rp-capital-block'>
                    <div className='rp-capital-row'>
                      <span className='rp-capital-label'>
                        Capital Utilisation
                      </span>
                      <span className='rp-capital-value'>
                        {fmtLKR(totalCost)} of {fmtLKR(capital)} used
                      </span>
                    </div>
                    <div className='rp-gauge-track'>
                      <div
                        className={`rp-gauge-fill ${feasible ? "ok" : "bad"}`}
                        style={{ width: `${gaugeWidth}%` }}
                      />
                    </div>
                    <div className='rp-gauge-legend'>
                      <span>LKR 0</span>
                      <span>{gaugeWidth.toFixed(0)}% of budget</span>
                      <span>{fmtLKR(capital)}</span>
                    </div>
                    {!feasible && shortfall > 0 && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "10px 14px",
                          background: "var(--red-bg)",
                          border: "1px solid rgba(192,57,43,.2)",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "var(--red)",
                          fontWeight: 500,
                        }}
                      >
                        ⚠ Additional funding needed: {fmtLKR(shortfall)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='rp-actions'>
                <button className='rp-btn-primary' onClick={() => setPage(2)}>
                  <Icon
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                    size={15}
                    stroke='#fff'
                    sw={2}
                  />
                  Next: Price &amp; Yield
                </button>
                <button
                  className='rp-btn-secondary'
                  onClick={() => navigate("/app/cost/in")}
                >
                  <Icon
                    d='M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'
                    size={15}
                    sw={2}
                  />
                  New Prediction
                </button>
              </div>
            </>
          )}

          {/* ════════════════════════════════
              PAGE 2 — PRICE & YIELD
          ════════════════════════════════ */}
          {page === 2 && (
            <>
              {/* Price Highlight */}
              <div className='rp-price-highlight'>
                <div className='rp-price-left'>
                  <div className='rp-price-icon'>💰</div>
                  <div>
                    <div className='rp-price-label'>Predicted Market Price</div>
                    <div className='rp-price-value'>
                      {pricePerKg !== null
                        ? `LKR ${Number(pricePerKg).toFixed(2)}`
                        : "—"}
                    </div>
                    <div className='rp-price-note'>per kilogram at harvest</div>
                  </div>
                </div>
                {grossRevenue !== null && (
                  <div className='rp-profit-chip'>
                    <div className='rp-profit-chip-label'>Gross Revenue</div>
                    <div className='rp-profit-chip-val'>
                      {fmtLKR(grossRevenue)}
                    </div>
                    <div className='rp-profit-chip-sub'>
                      Net profit: {fmtLKR(netProfit)}
                    </div>
                  </div>
                )}
              </div>

              {/* Big Metric Cards */}
              <div className='rp-big-metrics'>
                <div className='rp-big-metric'>
                  <div
                    className='rp-big-metric-accent'
                    style={{
                      background: "linear-gradient(90deg, #3d7a3a, #7dc478)",
                    }}
                  />
                  <span className='rp-big-metric-emoji'>🌾</span>
                  <div className='rp-big-metric-label'>
                    Total Estimated Yield
                  </div>
                  <div className='rp-big-metric-value'>{fmtKg(yieldTotal)}</div>
                  <div className='rp-big-metric-sub'>
                    For {lastForm?.field_size_acres ?? "—"} acres
                  </div>
                </div>

                <div className='rp-big-metric'>
                  <div
                    className='rp-big-metric-accent'
                    style={{
                      background: "linear-gradient(90deg, #d48806, #fbbf24)",
                    }}
                  />
                  <span className='rp-big-metric-emoji'>📐</span>
                  <div className='rp-big-metric-label'>Yield Per Acre</div>
                  <div className='rp-big-metric-value'>
                    {fmtKgAc(yieldPerAcre)}
                  </div>
                  <div className='rp-big-metric-sub'>
                    {lastForm?.soil_type?.replace("_", " ") ?? "—"} soil
                  </div>
                </div>
              </div>

              {/* Yield Progress Bars */}
              <div className='rp-card'>
                <div className='rp-sec-head'>
                  <div className='rp-sec-icon'>
                    <Icon d='M13 2L3 14h9l-1 8 10-12h-9l1-8z' size={14} />
                  </div>
                  <span className='rp-sec-title'>
                    Yield &amp; Revenue Breakdown
                  </span>
                  <div className='rp-sec-line' />
                </div>

                <div className='rp-yield-bars'>
                  <div className='rp-yield-bar-row'>
                    <div className='rp-yield-bar-header'>
                      <span className='rp-yield-bar-label'>
                        🌾 Yield / Acre
                      </span>
                      <span className='rp-yield-bar-val'>
                        {fmtKgAc(yieldPerAcre)}
                      </span>
                    </div>
                    <div className='rp-yield-track'>
                      <div
                        className='rp-yield-fill'
                        style={{
                          width: "72%",
                          background:
                            "linear-gradient(90deg, #3d7a3a, #7dc478)",
                        }}
                      />
                    </div>
                  </div>

                  <div className='rp-yield-bar-row'>
                    <div className='rp-yield-bar-header'>
                      <span className='rp-yield-bar-label'>📦 Total Yield</span>
                      <span className='rp-yield-bar-val'>
                        {fmtKg(yieldTotal)}
                      </span>
                    </div>
                    <div className='rp-yield-track'>
                      <div
                        className='rp-yield-fill'
                        style={{
                          width: "88%",
                          background:
                            "linear-gradient(90deg, #d48806, #fbbf24)",
                        }}
                      />
                    </div>
                  </div>

                  <div className='rp-yield-bar-row'>
                    <div className='rp-yield-bar-header'>
                      <span className='rp-yield-bar-label'>
                        💹 Gross Revenue
                      </span>
                      <span className='rp-yield-bar-val'>
                        {fmtLKR(grossRevenue)}
                      </span>
                    </div>
                    <div className='rp-yield-track'>
                      <div
                        className='rp-yield-fill'
                        style={{
                          width: "80%",
                          background:
                            "linear-gradient(90deg, #2563b0, #60a5fa)",
                        }}
                      />
                    </div>
                  </div>

                  <div className='rp-yield-bar-row'>
                    <div className='rp-yield-bar-header'>
                      <span className='rp-yield-bar-label'>
                        {netProfit !== null && netProfit >= 0 ? "📈" : "📉"} Net
                        Profit
                      </span>
                      <span
                        className='rp-yield-bar-val'
                        style={{
                          color:
                            netProfit !== null && netProfit < 0
                              ? "var(--red)"
                              : "var(--leaf)",
                        }}
                      >
                        {fmtLKR(netProfit)}
                      </span>
                    </div>
                    <div className='rp-yield-track'>
                      <div
                        className='rp-yield-fill'
                        style={{
                          width:
                            netProfit !== null && grossRevenue
                              ? `${Math.max(0, Math.min((netProfit / grossRevenue) * 100, 100))}%`
                              : "0%",
                          background:
                            netProfit !== null && netProfit >= 0
                              ? "linear-gradient(90deg, #3d7a3a, #a8d5a2)"
                              : "linear-gradient(90deg, #c0392b, #e57373)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='rp-actions'>
                <button
                  className='rp-btn-primary'
                  onClick={() => navigate("/app/cost/recommendations")}
                >
                  <Icon
                    d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2'
                    size={15}
                    stroke='#fff'
                    sw={2}
                  />
                  View Strategies
                </button>
                <button className='rp-btn-secondary' onClick={() => setPage(1)}>
                  <Icon d='M19 12H5M12 5l-7 7 7 7' size={15} sw={2} />
                  Back to Costs
                </button>
              </div>
            </>
          )}

          {/* ── Footer ── */}
          <footer className='rp-footnote'>
            <span className='rp-fn-item'>🌍 Sri Lanka Agri Data</span>
            <span className='rp-fn-dot' />
            <span className='rp-fn-item'>🔒 Secure Processing</span>
            <span className='rp-fn-dot' />
            <span className='rp-fn-item'>
              💡 Estimates based on historical trends
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
