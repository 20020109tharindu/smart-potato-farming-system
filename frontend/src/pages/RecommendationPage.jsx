import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const fmtLKR = (n) =>
  n === null || n === undefined
    ? "N/A"
    : `LKR ${Math.round(n).toLocaleString()}`;

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
   CSS
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
    --blue:      #2563b0;
    --blue-bg:   #eff6ff;
    --shadow-sm: 0 1px 3px rgba(30,45,30,0.08);
    --shadow-md: 0 4px 16px rgba(30,45,30,0.10);
    --shadow-lg: 0 16px 48px rgba(30,45,30,0.13), 0 2px 8px rgba(30,45,30,0.08);
    --radius:    12px;
  }

  .rc-page {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse 70% 55% at 8% 0%,   rgba(90,158,86,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 92% 100%, rgba(122,92,58,0.08) 0%, transparent 55%);
    display: flex; flex-direction: column; align-items: center;
    padding: 48px 20px 64px;
    font-family: 'Inter', sans-serif; position: relative;
  }

  .rc-page::before {
    content: ''; position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(90,158,86,0.10) 1px, transparent 1px);
    background-size: 26px 26px; pointer-events: none; z-index: 0;
  }

  .rc-wrap { width: 100%; max-width: 1060px; position: relative; z-index: 1; }

  /* ── Nav ── */
  .rc-nav {
    display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
    animation: fadeDown .45s ease both;
  }

  .rc-logo {
    width: 44px; height: 44px; border-radius: 13px;
    background: linear-gradient(140deg, #2d5e2a 0%, #5a9e56 100%);
    display: flex; align-items: center; justify-content: center;
    color: #fff; box-shadow: 0 4px 14px rgba(61,122,58,.28); flex-shrink: 0;
  }

  .rc-nav-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--leaf-mid); margin-bottom: 2px; }
  .rc-nav-title   { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -.01em; }

  .rc-nav-btns { margin-left: auto; display: flex; gap: 10px; }

  .rc-btn-ghost {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px;
    background: var(--white); border: 1.5px solid var(--straw);
    font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--ink-lt); cursor: pointer;
    transition: all .18s ease;
  }

  .rc-btn-ghost:hover { border-color: var(--leaf-mid); color: var(--leaf); background: var(--fog); }

  /* ── Steps ── */
  .rc-steps {
    display: flex; align-items: center; gap: 0; margin-bottom: 28px;
    background: var(--white); border: 1px solid rgba(122,92,58,.1);
    border-radius: 14px; padding: 6px; box-shadow: var(--shadow-sm);
    animation: fadeDown .45s ease both .05s;
  }

  .rc-step {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 10px 16px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: var(--ink-lt);
    cursor: pointer; transition: all .2s ease;
  }

  .rc-step.active { background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%); color: #fff; box-shadow: 0 3px 12px rgba(61,122,58,.3); }
  .rc-step.done   { color: var(--leaf); background: var(--fog); }

  .rc-step-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .rc-step.active .rc-step-num { background: rgba(255,255,255,.25); color: #fff; }
  .rc-step.done   .rc-step-num { background: var(--leaf); color: #fff; }
  .rc-step:not(.active):not(.done) .rc-step-num { background: var(--straw); color: var(--ink-lt); }
  .rc-step-div { width: 1px; height: 28px; background: var(--straw); flex-shrink: 0; }

  /* ── Hero banner ── */
  .rc-hero {
    background: linear-gradient(108deg, #253f23 0%, #3d7a3a 50%, #5a9e56 100%);
    border-radius: 20px; padding: 32px 40px; margin-bottom: 24px;
    position: relative; overflow: hidden;
    animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both .05s;
  }

  .rc-hero::after  { content: ''; position: absolute; right: -30px; bottom: -50px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,.05); }
  .rc-hero::before { content: ''; position: absolute; right: 80px; top: -40px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,.04); }

  .rc-hero-row { display: flex; align-items: center; gap: 18px; position: relative; z-index: 1; }

  .rc-hero-icon { width: 60px; height: 60px; border-radius: 16px; flex-shrink: 0; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); display: flex; align-items: center; justify-content: center; font-size: 28px; }

  .rc-hero-label { font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--sprout); margin-bottom: 5px; }
  .rc-hero-title { font-family: 'Lora', serif; font-size: 26px; font-weight: 700; color: #fff; line-height: 1.2; letter-spacing: -.01em; }
  .rc-hero-sub   { font-size: 13px; color: rgba(255,255,255,.6); margin-top: 4px; font-weight: 300; }

  .rc-hero-meta { margin-left: auto; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

  .rc-hero-budget-label { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.5); }
  .rc-hero-budget-value { font-family: 'Lora', serif; font-size: 24px; font-weight: 700; color: var(--sprout); }
  .rc-hero-tag { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); border-radius: 20px; padding: 4px 13px; font-size: 11px; font-weight: 500; color: rgba(255,255,255,.8); }

  /* ── Strategy cards grid ── */
  .rc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }

  .rc-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 18px; overflow: hidden;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    animation: cardIn .5s ease both;
    position: relative;
  }

  .rc-card:nth-child(1) { animation-delay: .1s; }
  .rc-card:nth-child(2) { animation-delay: .15s; }
  .rc-card:nth-child(3) { animation-delay: .2s; }

  .rc-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }

  .rc-card.selected { border-color: var(--leaf-mid); box-shadow: 0 0 0 3px rgba(90,158,86,.18), var(--shadow-md); }

  /* Card header banners */
  .rc-card-banner {
    padding: 24px 22px 20px; position: relative; overflow: hidden;
  }

  .rc-card-banner::after { content: ''; position: absolute; right: -14px; top: -14px; width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,.07); }

  .rc-card-banner.gold   { background: linear-gradient(135deg, #5c3a00 0%, #9a6510 55%, #d48806 100%); }
  .rc-card-banner.slate  { background: linear-gradient(135deg, #1e3a5f 0%, #2860a8 55%, #4a90d9 100%); }
  .rc-card-banner.forest { background: linear-gradient(135deg, #1a3a18 0%, #2d6a2a 55%, #3d9e3a 100%); }

  .rc-card-emoji { font-size: 34px; margin-bottom: 10px; display: block; position: relative; z-index: 1; }

  .rc-card-strategy { font-family: 'Lora', serif; font-size: 19px; font-weight: 700; color: #fff; margin-bottom: 3px; position: relative; z-index: 1; }
  .rc-card-variety  { font-size: 12px; color: rgba(255,255,255,.6); position: relative; z-index: 1; }

  .rc-best-badge {
    position: absolute; top: 12px; right: 12px; z-index: 2;
    background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.3);
    border-radius: 20px; padding: 3px 10px;
    font-size: 10px; font-weight: 700; color: #fff; letter-spacing: .06em; text-transform: uppercase;
  }

  /* Card body */
  .rc-card-body { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 10px; }

  /* Farmer explanation */
  .rc-explain {
    background: var(--fog); border: 1px solid rgba(61,122,58,.15);
    border-radius: 10px; padding: 12px 14px;
    font-size: 12px; color: var(--ink-mid); line-height: 1.55;
    font-style: italic;
  }

  /* Metric rows */
  .rc-metrics { display: flex; flex-direction: column; gap: 6px; }

  .rc-metric-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 12px; border-radius: 8px;
    border: 1px solid var(--straw); background: var(--cream);
  }

  .rc-metric-label { font-size: 12px; color: var(--ink-lt); font-weight: 500; }
  .rc-metric-value { font-size: 13px; font-weight: 700; color: var(--ink); font-family: 'Lora', serif; font-variant-numeric: tabular-nums; }
  .rc-metric-value.green  { color: var(--leaf); }
  .rc-metric-value.purple { color: #6b21a8; }

  /* ROI badge */
  .rc-roi-badge {
    display: inline-flex; align-items: center; gap: 6px;
    border-radius: 20px; padding: 6px 14px;
    font-size: 12px; font-weight: 700;
  }

  .rc-roi-badge.high { background: var(--fog); color: var(--leaf); border: 1px solid rgba(61,122,58,.2); }
  .rc-roi-badge.mid  { background: var(--blue-bg); color: var(--blue); border: 1px solid rgba(37,99,176,.2); }
  .rc-roi-badge.low  { background: var(--straw); color: var(--ink-lt); border: 1px solid rgba(107,128,105,.2); }

  /* Price per kg row */
  .rc-price-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px; border-radius: 8px;
    background: var(--cream); border: 1px solid var(--straw);
  }

  .rc-price-lbl { font-size: 12px; color: var(--ink-lt); }
  .rc-price-val { font-size: 13px; font-weight: 700; color: var(--blue); font-family: 'Lora', serif; }

  /* Select + Action Plan buttons */
  .rc-select-btn {
    width: 100%; padding: 12px;
    border: 1.5px solid rgba(61,122,58,.25); border-radius: 10px;
    background: var(--cream); cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--ink-lt); display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all .18s ease;
  }

  .rc-select-btn:hover { background: var(--fog); border-color: var(--leaf-mid); color: var(--leaf); }

  .rc-select-btn.selected {
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 14px rgba(61,122,58,.28);
  }

  .rc-plan-btn {
    width: 100%; padding: 11px;
    border-radius: 10px; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all .18s ease;
    border: 1.5px solid rgba(61,122,58,.3);
    background: var(--white); color: var(--leaf);
  }

  .rc-plan-btn:hover { background: var(--fog); }

  .rc-plan-btn.selected {
    background: linear-gradient(130deg, #1a3a18 0%, #2d6a2a 55%, #3d9e3a 100%);
    border-color: transparent; color: #fff;
    box-shadow: 0 4px 14px rgba(45,106,42,.28);
  }

  /* ── Actions row ── */
  .rc-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px; animation: cardIn .5s ease both .35s; }

  .rc-btn-primary {
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    border: none; border-radius: var(--radius); padding: 15px 24px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
    color: #fff; letter-spacing: .04em; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .22s ease; box-shadow: 0 4px 18px rgba(61,122,58,.28);
  }

  .rc-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(61,122,58,.34); filter: brightness(1.06); }

  .rc-btn-secondary {
    background: var(--white); border: 1.5px solid var(--straw);
    border-radius: var(--radius); padding: 15px 24px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 500;
    color: var(--ink-mid); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all .18s ease; box-shadow: var(--shadow-sm);
  }

  .rc-btn-secondary:hover { border-color: var(--leaf-mid); color: var(--leaf); background: var(--fog); }

  /* ── Footer ── */
  .rc-footnote { display: flex; align-items: center; justify-content: center; gap: 18px; animation: fadeUp .5s ease both .4s; }
  .rc-fn-item  { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-lt); opacity: .45; }
  .rc-fn-dot   { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-lt); opacity: .3; }

  /* ── Empty / error state ── */
  .rc-state-wrap { min-height: 100vh; background: var(--cream); display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; }
  .rc-state-card { background: var(--white); border: 1px solid rgba(122,92,58,.1); border-radius: 20px; padding: 56px 48px; text-align: center; box-shadow: var(--shadow-lg); max-width: 440px; width: 100%; }
  .rc-state-icon  { font-size: 52px; margin-bottom: 20px; display: block; }
  .rc-state-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 700; color: var(--ink); margin-bottom: 10px; }
  .rc-state-text  { font-size: 13.5px; color: var(--ink-lt); line-height: 1.65; margin-bottom: 28px; }

  /* ─────────────────────────────
     ACTION PLAN MODAL
  ───────────────────────────── */
  .rc-modal-overlay {
    position: fixed; inset: 0; background: rgba(10,20,10,.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 50; padding: 20px;
    animation: overlayIn .2s ease;
  }

  @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }

  .rc-modal {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.12);
    border-radius: 22px;
    max-width: 820px; width: 100%;
    max-height: 90vh; overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: var(--shadow-lg);
    animation: modalIn .3s cubic-bezier(.22,1,.36,1);
  }

  @keyframes modalIn { from { opacity:0; transform:scale(.94) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }

  .rc-modal-header {
    background: linear-gradient(108deg, #253f23 0%, #3d7a3a 50%, #5a9e56 100%);
    padding: 26px 30px;
    position: relative; overflow: hidden; flex-shrink: 0;
  }

  .rc-modal-header::after  { content: ''; position: absolute; right: -20px; bottom: -30px; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,.05); }
  .rc-modal-header::before { content: ''; position: absolute; right: 80px; top: -30px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,.04); }

  .rc-modal-head-row {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 14px;
    position: relative; z-index: 1;
  }

  .rc-modal-head-left { display: flex; align-items: center; gap: 14px; }

  .rc-modal-head-icon {
    width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center; font-size: 22px;
  }

  .rc-modal-head-label { font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: var(--sprout); margin-bottom: 4px; }
  .rc-modal-head-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: #fff; }
  .rc-modal-head-sub   { font-size: 12px; color: rgba(255,255,255,.55); margin-top: 2px; }

  .rc-modal-close {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.2);
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; transition: background .15s ease;
  }

  .rc-modal-close:hover { background: rgba(255,255,255,.22); }

  .rc-modal-stats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    margin-top: 18px; position: relative; z-index: 1;
  }

  .rc-modal-stat {
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12);
    border-radius: 11px; padding: 12px; text-align: center;
  }

  .rc-modal-stat-label { font-size: 10px; color: rgba(255,255,255,.55); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 4px; }
  .rc-modal-stat-value { font-family: 'Lora', serif; font-size: 16px; font-weight: 700; color: var(--sprout); }

  /* Modal scrollable content */
  .rc-modal-body { flex: 1; overflow-y: auto; padding: 28px 30px; }

  .rc-phase { position: relative; margin-bottom: 0; }

  .rc-phase-connector {
    position: absolute; left: 19px; top: 40px; bottom: -20px;
    width: 1px;
    background: linear-gradient(to bottom, var(--straw), transparent);
  }

  .rc-phase-row { display: flex; gap: 18px; margin-bottom: 20px; }

  .rc-phase-badge {
    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: #fff;
    box-shadow: 0 3px 10px rgba(0,0,0,.15);
  }

  .rc-phase-badge.p1 { background: linear-gradient(135deg, #1e3a7a, #2563b0); }
  .rc-phase-badge.p2 { background: linear-gradient(135deg, #253f23, #3d7a3a); }
  .rc-phase-badge.p3 { background: linear-gradient(135deg, #7a4a00, #d48806); }
  .rc-phase-badge.p4 { background: linear-gradient(135deg, #7a1a1a, #c0392b); }

  .rc-phase-content { flex: 1; }

  .rc-phase-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
  }

  .rc-phase-week { font-family: 'Lora', serif; font-size: 15px; font-weight: 700; color: var(--ink); }

  .rc-phase-tag {
    margin-left: auto; font-size: 10px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 20px;
  }

  .rc-phase-tag.p1 { background: var(--blue-bg); color: var(--blue); border: 1px solid rgba(37,99,176,.2); }
  .rc-phase-tag.p2 { background: var(--fog);     color: var(--leaf); border: 1px solid rgba(61,122,58,.2); }
  .rc-phase-tag.p3 { background: var(--amber-bg); color: var(--amber); border: 1px solid rgba(212,136,6,.2); }
  .rc-phase-tag.p4 { background: #fdf0ee; color: #c0392b; border: 1px solid rgba(192,57,43,.2); }

  .rc-phase-steps { display: flex; flex-direction: column; gap: 8px; }

  .rc-phase-step {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--white); border: 1px solid var(--straw);
    border-radius: 10px; padding: 12px 14px;
    transition: border-color .15s, background .15s;
  }

  .rc-phase-step:hover { background: var(--cream); border-color: rgba(61,122,58,.2); }

  .rc-step-check {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 1px;
    background: var(--fog); border: 1px solid rgba(61,122,58,.25);
    display: flex; align-items: center; justify-content: center;
    color: var(--leaf);
  }

  .rc-step-text { font-size: 13px; color: var(--ink-mid); line-height: 1.55; }

  /* Modal footer */
  .rc-modal-footer {
    border-top: 1px solid var(--straw); padding: 18px 30px;
    background: var(--cream); flex-shrink: 0;
    display: flex; gap: 12px;
  }

  .rc-modal-close-btn {
    flex: 1;
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    border: none; border-radius: var(--radius); padding: 13px;
    font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 600;
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all .2s ease; box-shadow: 0 4px 14px rgba(61,122,58,.25);
  }

  .rc-modal-close-btn:hover { filter: brightness(1.08); }

  @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
  @keyframes cardIn   { from{opacity:0;transform:translateY(14px)}  to{opacity:1;transform:translateY(0)} }

  @media (max-width: 860px) {
    .rc-grid { grid-template-columns: 1fr; }
    .rc-actions { grid-template-columns: 1fr; }
    .rc-hero-meta { display: none; }
    .rc-modal-stats { grid-template-columns: 1fr 1fr 1fr; }
  }

  @media (max-width: 560px) {
    .rc-hero { padding: 24px 22px; }
    .rc-hero-title { font-size: 21px; }
    .rc-modal-body { padding: 18px 18px; }
    .rc-modal-header { padding: 20px 20px; }
    .rc-modal-footer { padding: 14px 18px; }
    .rc-steps { overflow-x: auto; }
  }
`;

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const WEEK_ORDER = ["week_1_2", "week_3_5", "week_6_9", "week_10_12"];
const WEEK_LABELS = {
  week_1_2: "Weeks 1–2",
  week_3_5: "Weeks 3–5",
  week_6_9: "Weeks 6–9",
  week_10_12: "Weeks 10–12",
};

const CARD_META = [
  {
    banner: "gold",
    emoji: "🌟",
    badgeClass: "high",
    phaseCls: ["p1", "p2", "p3", "p4"],
  },
  {
    banner: "slate",
    emoji: "⚖️",
    badgeClass: "mid",
    phaseCls: ["p1", "p2", "p3", "p4"],
  },
  {
    banner: "forest",
    emoji: "💰",
    badgeClass: "low",
    phaseCls: ["p1", "p2", "p3", "p4"],
  },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function RecommendationPage() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [lastForm, setLastForm] = useState(null);
  const [selected, setSelected] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [activeStrategyIdx, setActiveStrategyIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem("analysisResult"));
      const lf = JSON.parse(sessionStorage.getItem("lastForm"));
      setAnalysis(raw);
      setLastForm(lf);
    } catch (e) {
      console.error(e);
    }
  }, []);

  /* ── Empty state ── */
  if (!analysis || analysis.status !== "ok") {
    return (
      <>
        <style>{CSS}</style>
        <div className='rc-state-wrap'>
          <div className='rc-state-card'>
            <span className='rc-state-icon'>📋</span>
            <div className='rc-state-title'>No Data Found</div>
            <div className='rc-state-text'>
              Please complete the input form first to get personalized
              investment strategies.
            </div>
            <button
              className='rc-btn-primary'
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

  const { strategies } = analysis;
  const budget = Number(lastForm?.hands_on_money_lkr || 0);

  const openModal = (s, idx) => {
    setActiveStrategy(s);
    setActiveStrategyIdx(idx);
    setShowModal(true);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className='rc-page'>
        <div className='rc-wrap'>
          {/* ── Nav ── */}
          <nav className='rc-nav'>
            <div className='rc-logo'>
              <LeafIcon />
            </div>
            <div>
              <div className='rc-nav-eyebrow'>AgriIntelligence · Sri Lanka</div>
              <div className='rc-nav-title'>Investment Strategies</div>
            </div>
            <div className='rc-nav-btns'>
              <button
                className='rc-btn-ghost'
                onClick={() => navigate("/app/cost/results")}
              >
                <Icon d='M19 12H5M12 5l-7 7 7 7' size={13} sw={2} />
                Back to Results
              </button>
              <button
                className='rc-btn-ghost'
                onClick={() => navigate("/app/cost/in")}
              >
                <Icon
                  d='M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'
                  size={13}
                  sw={2}
                />
                New Analysis
              </button>
            </div>
          </nav>

          {/* ── Steps ── */}
          <div className='rc-steps'>
            <div
              className='rc-step done'
              onClick={() => navigate("/app/cost/results")}
            >
              <div className='rc-step-num'>✓</div>
              <span>Predicted Costs</span>
            </div>
            <div className='rc-step-div' />
            <div
              className='rc-step done'
              onClick={() => navigate("/app/cost/results")}
            >
              <div className='rc-step-num'>✓</div>
              <span>Price &amp; Yield</span>
            </div>
            <div className='rc-step-div' />
            <div className='rc-step active'>
              <div className='rc-step-num'>3</div>
              <span>Strategies</span>
            </div>
          </div>

          {/* ── Hero ── */}
          <div className='rc-hero'>
            <div className='rc-hero-row'>
              <div className='rc-hero-icon'>💡</div>
              <div>
                <div className='rc-hero-label'>
                  Step 3 of 3 — Investment Strategies
                </div>
                <div className='rc-hero-title'>
                  Smart Investment Recommendations
                </div>
                <div className='rc-hero-sub'>
                  {strategies.length} AI-powered strategies tailored to your
                  capital and farm conditions
                </div>
              </div>
              <div className='rc-hero-meta'>
                <div>
                  <div className='rc-hero-budget-label'>Available Budget</div>
                  <div className='rc-hero-budget-value'>{fmtLKR(budget)}</div>
                </div>
                <span className='rc-hero-tag'>
                  {strategies.length} Strategies Found
                </span>
              </div>
            </div>
          </div>

          {/* ── Strategy cards ── */}
          <div className='rc-grid'>
            {strategies.map((s, i) => {
              const meta = CARD_META[i] || CARD_META[0];
              const isSelected = selected === i;
              const roiCls =
                s.roi_percent > 100
                  ? "high"
                  : s.roi_percent > 50
                    ? "mid"
                    : "low";

              return (
                <div
                  key={i}
                  className={`rc-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  {/* Card banner */}
                  <div className={`rc-card-banner ${meta.banner}`}>
                    {i === 0 && (
                      <span className='rc-best-badge'>⚡ Best ROI</span>
                    )}
                    <span className='rc-card-emoji'>{meta.emoji}</span>
                    <div className='rc-card-strategy'>{s.strategy}</div>
                    <div className='rc-card-variety'>
                      {s.type !== "Other"
                        ? `Variety: ${s.type}`
                        : "Best Available"}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className='rc-card-body'>
                    {/* Farmer explanation */}
                    {s.farmer_explanation && (
                      <div className='rc-explain'>"{s.farmer_explanation}"</div>
                    )}

                    {/* Metrics */}
                    <div className='rc-metrics'>
                      <div className='rc-metric-row'>
                        <span className='rc-metric-label'>💰 Investment</span>
                        <span className='rc-metric-value'>
                          {fmtLKR(s.investment_lkr)}
                        </span>
                      </div>
                      <div className='rc-metric-row'>
                        <span className='rc-metric-label'>
                          🌾 Expected Yield
                        </span>
                        <span className='rc-metric-value'>
                          {Math.round(s.expected_yield_kg).toLocaleString()} kg
                        </span>
                      </div>
                      <div className='rc-metric-row'>
                        <span className='rc-metric-label'>📈 Revenue</span>
                        <span className='rc-metric-value green'>
                          {fmtLKR(s.revenue_lkr)}
                        </span>
                      </div>
                      <div className='rc-metric-row'>
                        <span className='rc-metric-label'>✨ Net Profit</span>
                        <span className='rc-metric-value purple'>
                          {fmtLKR(s.net_profit_lkr)}
                        </span>
                      </div>
                    </div>

                    {/* ROI badge */}
                    <div>
                      <span className={`rc-roi-badge ${roiCls}`}>
                        <Icon d='M23 6l-9.5 9.5-5-5L1 18' size={13} sw={2} />
                        {s.roi_percent.toFixed(1)}% ROI
                      </span>
                    </div>

                    {/* Price per kg */}
                    <div className='rc-price-row'>
                      <span className='rc-price-lbl'>Price / kg</span>
                      <span className='rc-price-val'>
                        LKR {s.expected_price_per_kg.toFixed(2)}
                      </span>
                    </div>

                    {/* Select button */}
                    <button
                      className={`rc-select-btn ${isSelected ? "selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(i);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Icon
                            d='M20 6L9 17l-5-5'
                            size={14}
                            stroke='#fff'
                            sw={2.5}
                          />
                          Selected Strategy
                        </>
                      ) : (
                        "Select This Strategy"
                      )}
                    </button>

                    {/* View Action Plan button */}
                    <button
                      className={`rc-plan-btn ${isSelected ? "selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(i);
                        openModal(s, i);
                      }}
                    >
                      <Icon
                        d='M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
                        size={14}
                        stroke={isSelected ? "#fff" : "var(--leaf)"}
                        sw={1.8}
                      />
                      View Action Plan
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Action buttons ── */}
          <div className='rc-actions'>
            <button
              className='rc-btn-primary'
              onClick={() => navigate("/app/cost/results")}
            >
              <Icon d='M19 12H5M12 5l-7 7 7 7' size={15} stroke='#fff' sw={2} />
              Back to Results
            </button>
            <button
              className='rc-btn-secondary'
              onClick={() => navigate("/app/cost/in")}
            >
              <Icon
                d='M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'
                size={15}
                sw={2}
              />
              New Analysis
            </button>
          </div>

          {/* ── Footer ── */}
          <footer className='rc-footnote'>
            <span className='rc-fn-item'>🌍 Sri Lanka Agri Data</span>
            <span className='rc-fn-dot' />
            <span className='rc-fn-item'>🔒 Secure Processing</span>
            <span className='rc-fn-dot' />
            <span className='rc-fn-item'>💡 ML-Powered Insights</span>
          </footer>
        </div>
      </div>

      {/* ═════════════════════════════════
          ACTION PLAN MODAL
      ═════════════════════════════════ */}
      {showModal &&
        activeStrategy &&
        (() => {
          const meta = CARD_META[activeStrategyIdx] || CARD_META[0];
          const phases = WEEK_ORDER.filter(
            (w) => activeStrategy.action_plan?.[w],
          );

          return (
            <div
              className='rc-modal-overlay'
              onClick={() => setShowModal(false)}
            >
              <div className='rc-modal' onClick={(e) => e.stopPropagation()}>
                {/* Modal header */}
                <div className='rc-modal-header'>
                  <div className='rc-modal-head-row'>
                    <div className='rc-modal-head-left'>
                      <div className='rc-modal-head-icon'>{meta.emoji}</div>
                      <div>
                        <div className='rc-modal-head-label'>
                          Weekly Action Plan
                        </div>
                        <div className='rc-modal-head-title'>
                          {activeStrategy.strategy} Strategy
                        </div>
                        <div className='rc-modal-head-sub'>
                          {activeStrategy.type !== "Other"
                            ? `${activeStrategy.type} Variety`
                            : "Best Available"}
                        </div>
                      </div>
                    </div>
                    <button
                      className='rc-modal-close'
                      onClick={() => setShowModal(false)}
                    >
                      <Icon
                        d='M18 6L6 18M6 6l12 12'
                        size={16}
                        stroke='#fff'
                        sw={2}
                      />
                    </button>
                  </div>

                  <div className='rc-modal-stats'>
                    <div className='rc-modal-stat'>
                      <div className='rc-modal-stat-label'>Expected Yield</div>
                      <div className='rc-modal-stat-value'>
                        {Math.round(
                          activeStrategy.expected_yield_kg,
                        ).toLocaleString()}{" "}
                        kg
                      </div>
                    </div>
                    <div className='rc-modal-stat'>
                      <div className='rc-modal-stat-label'>Net Profit</div>
                      <div className='rc-modal-stat-value'>
                        {fmtLKR(activeStrategy.net_profit_lkr)}
                      </div>
                    </div>
                    <div className='rc-modal-stat'>
                      <div className='rc-modal-stat-label'>ROI</div>
                      <div className='rc-modal-stat-value'>
                        {activeStrategy.roi_percent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal body */}
                <div className='rc-modal-body'>
                  {phases.map((week, idx) => {
                    const phaseCls = ["p1", "p2", "p3", "p4"][idx] || "p1";
                    const steps = [
                      ...new Set(activeStrategy.action_plan[week]),
                    ];

                    return (
                      <div className='rc-phase' key={week}>
                        {idx < phases.length - 1 && (
                          <div className='rc-phase-connector' />
                        )}
                        <div className='rc-phase-row'>
                          <div className={`rc-phase-badge ${phaseCls}`}>
                            {idx + 1}
                          </div>
                          <div className='rc-phase-content'>
                            <div className='rc-phase-head'>
                              <span className='rc-phase-week'>
                                <Icon
                                  d='M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
                                  size={14}
                                  stroke='var(--ink-lt)'
                                  sw={1.6}
                                  style={{
                                    marginRight: 6,
                                    verticalAlign: "middle",
                                  }}
                                />
                                {WEEK_LABELS[week]}
                              </span>
                              <span className={`rc-phase-tag ${phaseCls}`}>
                                Phase {idx + 1}
                              </span>
                            </div>
                            <div className='rc-phase-steps'>
                              {steps.map((step, si) => (
                                <div className='rc-phase-step' key={si}>
                                  <div className='rc-step-check'>
                                    <Icon
                                      d='M20 6L9 17l-5-5'
                                      size={11}
                                      stroke='var(--leaf)'
                                      sw={2.5}
                                    />
                                  </div>
                                  <span className='rc-step-text'>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modal footer */}
                <div className='rc-modal-footer'>
                  <button
                    className='rc-modal-close-btn'
                    onClick={() => setShowModal(false)}
                  >
                    <Icon
                      d='M18 6L6 18M6 6l12 12'
                      size={15}
                      stroke='#fff'
                      sw={2}
                    />
                    Close Action Plan
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </>
  );
}
