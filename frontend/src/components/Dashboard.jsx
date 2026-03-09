import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import potatoField from "../assets/potato feild.jpeg";
import harvestReady from "../assets/havest ready.jpg";
import freshPotatoes from "../assets/fresh potato.jpg";
import richSoil from "../assets/soil best.png";
import soilTempImg from "../assets/soil temp.png";
import moistureImg from "../assets/soil-moisture.jpg";
import activeFieldImg from "../assets/activeFieldImg .png";
import harvestImg from "../assets/havest ready.jpg";
import alertImg from "../assets/alert.jpg";
import seedReadinessImg from "../assets/seed readnes.png";
import costAnalysisImg from "../assets/cost analysis.png";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --g950: #0d2118;
    --g900: #1a3d28;
    --g850: #1f4a30;
    --g800: #2a5c3f;
    --g700: #3e7a52;
    --g600: #4caf76;
    --g500: #62c98e;
    --g400: #85dba8;
    --g300: #aeeac4;
    --g200: #cff2de;
    --g100: #e4f8ee;
    --g50:  #f2fbf6;

    --amber:   #d4882b;
    --amber-l: #fef3e0;
    --sky:     #2b82be;
    --sky-l:   #e2f1fb;
    --red:     #cc4040;
    --red-l:   #fce9e9;

    --cream:   #f5f2eb;
    --cream2:  #edeae2;
    --card:    #ffffff;
    --text:    #0d2118;
    --mid:     #3e7a58;
    --soft:    #7cb898;
    --border:  #d0ead8;

    --sh-xs: 0 1px 4px  rgba(26,61,40,.05);
    --sh-sm: 0 2px 10px rgba(26,61,40,.08);
    --sh-md: 0 6px 24px rgba(26,61,40,.11);
    --sh-lg: 0 10px 40px rgba(26,61,40,.13);
    --sh-xl: 0 20px 60px rgba(26,61,40,.16);

    --sidebar-w: 220px;
    --r: 16px;
    --r-sm: 10px;
  }

  .spf, .spf * { box-sizing: border-box; margin: 0; padding: 0; }
  .spf {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--text);
  }

  /* ═══════ SIDEBAR ═══════ */
  .spf-sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    position: fixed; left: 0; top: 0; bottom: 0;
    z-index: 200;
    display: flex; flex-direction: column;
    background: linear-gradient(175deg, var(--g950) 0%, var(--g850) 60%, var(--g900) 100%);
    box-shadow: 4px 0 32px rgba(0,0,0,.22);
    overflow: hidden;
  }
  /* Subtle noise texture overlay */
  .spf-sidebar::before {
    content: '';
    position: absolute; inset: 0; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
  }
  /* Glowing accent line */
  .spf-sidebar::after {
    content: '';
    position: absolute; top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(76,175,118,.3) 40%, rgba(76,175,118,.15) 70%, transparent);
    z-index: 1;
  }

  .sb-brand {
    position: relative; z-index: 2;
    padding: 24px 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    flex-shrink: 0;
  }
  .sb-brand-row { display: flex; align-items: center; gap: 11px; }
  .sb-mark {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--g600), var(--g700));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(76,175,118,.35);
  }
  .sb-name {
    font-family: 'Fraunces', serif;
    font-size: 1.05rem; font-weight: 700; color: #fff; line-height: 1.15;
    letter-spacing: -.01em;
  }
  .sb-sub {
    font-size: .58rem; color: var(--g400);
    letter-spacing: .18em; text-transform: uppercase; margin-top: 2px;
  }

  .sb-nav { flex: 1; overflow-y: auto; padding: 10px 0 14px; position: relative; z-index: 2; }
  .sb-nav::-webkit-scrollbar { width: 3px; }
  .sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }

  .sb-section {
    font-size: .56rem; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(255,255,255,.22); padding: 14px 16px 5px;
    font-weight: 600;
  }
  .sb-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 16px; margin: 2px 10px;
    border-radius: var(--r-sm); text-decoration: none;
    color: rgba(255,255,255,.48); font-size: .84rem; font-weight: 500;
    transition: all .2s ease;
    position: relative;
  }
  .sb-link:hover {
    background: rgba(255,255,255,.07);
    color: rgba(255,255,255,.88);
    transform: translateX(2px);
  }
  .sb-link.active {
    background: linear-gradient(90deg, rgba(76,175,118,.22), rgba(76,175,118,.08));
    color: #fff;
    border-left: 2px solid var(--g500);
    padding-left: 14px;
  }
  .sb-link-icon { font-size: .9rem; width: 20px; text-align: center; flex-shrink: 0; }
  .sb-badge {
    margin-left: auto; font-size: .58rem; font-weight: 700;
    background: var(--amber); color: #fff;
    border-radius: 20px; padding: 2px 8px;
    letter-spacing: .04em;
  }
  .sb-badge.ai { background: linear-gradient(135deg, var(--sky), #1a6fa8); }

  .sb-foot {
    position: relative; z-index: 2;
    flex-shrink: 0;
    padding: 12px 14px 16px;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .sb-weather {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px;
    padding: 10px 12px; margin-bottom: 10px;
  }
  .sb-wi { font-size: 1.5rem; }
  .sb-wlabel { font-size: .6rem; color: rgba(255,255,255,.3); }
  .sb-wval   { font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: -.01em; }
  .sb-ver    { font-size: .58rem; color: rgba(255,255,255,.16); text-align: center; margin-bottom: 8px; letter-spacing: .06em; }
  .sb-logout {
    width: 100%; padding: 9px; border-radius: var(--r-sm);
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.09);
    color: rgba(255,255,255,.38); font-size: .74rem;
    font-family: 'Outfit', sans-serif; cursor: pointer;
    transition: all .2s;
    letter-spacing: .02em;
  }
  .sb-logout:hover {
    background: rgba(204,64,64,.15);
    border-color: rgba(204,64,64,.3);
    color: rgba(255,180,180,.75);
  }

  /* ═══════ TOP BAR ═══════ */
  .spf-topbar {
    position: fixed; top: 0; left: var(--sidebar-w); right: 0; z-index: 100;
    height: 56px;
    background: rgba(245,242,235,.88);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(26,61,40,.08);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
  }
  .topbar-status {
    display: flex; align-items: center; gap: 7px;
    background: var(--g50);
    border: 1px solid var(--g200);
    border-radius: 30px; padding: 5px 14px;
    font-size: .7rem; font-weight: 600; color: var(--g800);
  }
  .topbar-right { display: flex; align-items: center; gap: 14px; }
  .topbar-bell {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--card); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: .95rem; cursor: pointer;
    box-shadow: var(--sh-xs);
    transition: box-shadow .18s;
  }
  .topbar-bell:hover { box-shadow: var(--sh-sm); }
  .topbar-user {
    display: flex; align-items: center; gap: 9px;
    background: var(--card); border: 1.5px solid var(--border);
    border-radius: 30px; padding: 5px 14px 5px 6px;
    box-shadow: var(--sh-xs);
    cursor: pointer;
  }
  .topbar-av {
    width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, var(--g600), var(--g800));
    display: flex; align-items: center; justify-content: center;
    font-size: .72rem; font-weight: 700; color: #fff;
  }
  .topbar-uname { font-size: .76rem; font-weight: 600; color: var(--text); }
  .topbar-urole { font-size: .61rem; color: var(--soft); }

  /* ═══════ MAIN ═══════ */
  .spf-main {
    margin-left: var(--sidebar-w);
    padding: 76px 24px 48px;
    min-width: 0;
  }
  .spf-inner { width: 100%; }

  /* ═══════ HERO ═══════ */
  .hero {
    position: relative; overflow: hidden;
    border-radius: 20px;
    background: var(--g900);
    color: #fff;
    padding: 40px 44px 36px;
    margin-bottom: 22px;
    box-shadow: var(--sh-xl);
  }
  .hero-photo {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&q=85') center/cover no-repeat;
    opacity: .18;
  }
  .hero-grad {
    position: absolute; inset: 0;
    background: linear-gradient(110deg, rgba(13,33,24,.96) 30%, rgba(42,92,63,.55) 70%, rgba(76,175,118,.15));
  }
  /* Decorative circles */
  .hero-deco1 {
    position: absolute; top: -80px; right: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    border: 1px solid rgba(76,175,118,.15);
    pointer-events: none;
  }
  .hero-deco2 {
    position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(76,175,118,.1), transparent 70%);
    pointer-events: none;
  }

  .hero-body  { position: relative; z-index: 1; }
  .hero-pill  {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 30px; padding: 5px 14px;
    font-size: .66rem; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--g300); margin-bottom: 14px;
  }
  .ldot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80; animation: blink 1.8s infinite;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(74,222,128,.6);
  }
  @keyframes blink {
    0%,100% { opacity:1; transform:scale(1); box-shadow: 0 0 6px rgba(74,222,128,.6); }
    50% { opacity:.5; transform:scale(1.4); box-shadow: 0 0 12px rgba(74,222,128,.8); }
  }

  .hero-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.9rem, 3vw, 2.8rem); font-weight: 900;
    line-height: 1.05; margin-bottom: 10px;
    letter-spacing: -.02em;
  }
  .hero-sub {
    font-size: .86rem; color: rgba(255,255,255,.55);
    max-width: 500px; line-height: 1.7;
  }

  .hero-badge {
    position: absolute; top: 20px; right: 24px;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 30px; padding: 6px 16px;
    font-size: .68rem; font-weight: 600; color: rgba(255,255,255,.8);
    display: flex; align-items: center; gap: 7px; z-index: 2;
    backdrop-filter: blur(8px);
  }

  /* ═══════ QUICK STATS STRIP ═══════ */
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }
  .qs-card {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 16px 18px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: var(--sh-xs);
    transition: transform .22s, box-shadow .22s;
    cursor: default;
  }
  .qs-card:hover { transform: translateY(-3px); box-shadow: var(--sh-md); }
  .qs-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
  }
  .qs-label {
    font-size: .58rem; letter-spacing: .1em; text-transform: uppercase;
    color: var(--soft); margin-bottom: 3px; font-weight: 600;
  }
  .qs-val {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem; font-weight: 700; color: var(--text); line-height: 1;
  }
  .qs-sub {
    font-size: .65rem; color: var(--soft); margin-top: 2px;
    display: flex; align-items: center; gap: 4px;
  }
  .qs-trend { font-size: .65rem; font-weight: 600; }
  .qs-trend.up { color: #22c55e; }
  .qs-trend.warn { color: var(--amber); }

  /* ═══════ PHOTO COLLAGE ═══════ */
  .collage {
    display: grid;
    grid-template-columns: 2.2fr 1fr 1fr 1fr;
    height: 190px;
    gap: 10px;
    margin-bottom: 22px;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: var(--sh-md);
  }
  .col-item { position: relative; overflow: hidden; height: 100%; }
  .col-img  {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    display: block;
    transition: transform .55s cubic-bezier(.25,.46,.45,.94);
  }
  .col-item:hover .col-img { transform: scale(1.08); }
  .col-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(13,33,24,.82));
    padding: 24px 10px 9px;
    font-size: .63rem; font-weight: 600; color: rgba(255,255,255,.9);
    text-transform: uppercase; letter-spacing: .1em;
    opacity: 0; transition: opacity .3s;
  }
  .col-item:hover .col-label { opacity: 1; }

  /* ═══════ STAT CARDS ═══════ */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  .stat-card {
    border-radius: 14px; overflow: hidden;
    border: 1.5px solid var(--border);
    background: var(--card);
    box-shadow: var(--sh-xs);
    transition: transform .22s cubic-bezier(.25,.46,.45,.94), box-shadow .22s;
  }
  .stat-card:hover { transform: translateY(-5px); box-shadow: var(--sh-lg); }
  .stat-img {
    width: 100%; height: 80px;
    object-fit: cover; object-position: center;
    display: block;
  }
  .stat-body  { padding: 10px 12px 13px; }
  .stat-label {
    font-size: .56rem; letter-spacing: .12em; text-transform: uppercase;
    color: var(--soft); margin-bottom: 3px; font-weight: 600;
  }
  .stat-val   {
    font-family: 'Fraunces', serif;
    font-size: 1.3rem; font-weight: 700; color: var(--text); line-height: 1.1;
  }
  .stat-sub   { font-size: .64rem; color: var(--soft); margin-top: 2px; }

  /* ═══════ SECTION HEADER ═══════ */
  .sec-head  { margin-bottom: 18px; display: flex; align-items: flex-end; justify-content: space-between; }
  .sec-title {
    font-family: 'Fraunces', serif;
    font-size: 1.45rem; font-weight: 700; color: var(--text);
    letter-spacing: -.02em;
  }
  .sec-sub   { font-size: .78rem; color: var(--soft); margin-top: 3px; }
  .sec-tag {
    font-size: .68rem; font-weight: 600; color: var(--g700);
    background: var(--g100); border: 1px solid var(--g200);
    border-radius: 20px; padding: 4px 12px;
  }

  /* ═══════ MODULE CARDS ═══════ */
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .mod-card {
    background: var(--card);
    border-radius: 18px;
    border: 1.5px solid var(--border);
    overflow: hidden; cursor: pointer;
    box-shadow: var(--sh-xs);
    transition: transform .28s cubic-bezier(.25,.46,.45,.94), box-shadow .28s, border-color .28s;
    display: flex; flex-direction: column;
  }
  .mod-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--sh-xl);
    border-color: var(--g300);
  }
  .mod-img-wrap { position: relative; overflow: hidden; flex-shrink: 0; }
  .mod-img {
    width: 100%; height: 155px;
    object-fit: cover; object-position: center;
    display: block;
    transition: transform .48s cubic-bezier(.25,.46,.45,.94);
  }
  .mod-card:hover .mod-img { transform: scale(1.07); }
  /* Gradient overlay on card image */
  .mod-img-wrap::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,.15));
    pointer-events: none;
  }
  .mod-tag {
    position: absolute; top: 10px; left: 10px; z-index: 1;
    border-radius: 20px; padding: 4px 11px;
    font-size: .6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    backdrop-filter: blur(8px);
  }
  .mod-body  { padding: 18px 18px 18px; flex: 1; display: flex; flex-direction: column; }
  .mod-hd    { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
  .mod-icon  {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,.06);
  }
  .mod-title {
    font-family: 'Fraunces', serif;
    font-size: 1.02rem; font-weight: 700; letter-spacing: -.01em;
  }
  .mod-desc  { font-size: .76rem; color: var(--mid); line-height: 1.62; margin-bottom: 16px; flex: 1; }
  .mod-ft    { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .mod-btn   {
    display: inline-flex; align-items: center; gap: 6px;
    border: none; border-radius: 30px; padding: 8px 18px;
    font-family: 'Outfit', sans-serif; font-size: .76rem; font-weight: 600;
    cursor: pointer; transition: all .2s;
    letter-spacing: .01em;
  }
  .mod-btn:hover { opacity: .88; transform: translateX(2px); }
  .mod-status { font-size: .67rem; font-weight: 600; display: flex; align-items: center; gap: 5px; }
  .sdot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .soon-chip {
    background: var(--sky-l); color: var(--sky);
    border: 1.5px solid rgba(43,130,190,.2);
    border-radius: 20px; padding: 5px 13px;
    font-size: .67rem; font-weight: 600;
  }

  /* ═══════ FOOTER ═══════ */
  .dash-footer {
    margin-top: 36px; padding-top: 18px;
    border-top: 1.5px solid var(--border);
    display: flex; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
    font-size: .72rem; color: var(--soft);
  }
  .df-left { display: flex; gap: 22px; flex-wrap: wrap; align-items: center; }
  .df-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--g400); display: inline-block;
  }

  /* ═══════ ANIMATIONS ═══════ */
  .fu  { animation: fu .5s cubic-bezier(.25,.46,.45,.94) both; }
  @keyframes fu {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .d0{animation-delay:.0s}
  .d1{animation-delay:.08s} .d2{animation-delay:.16s}
  .d3{animation-delay:.24s} .d4{animation-delay:.32s}
  .d5{animation-delay:.40s} .d6{animation-delay:.48s}
`;

const NAV = [
  { icon: "🏠", label: "Dashboard", path: "/app", end: true, badge: null },
  {
    icon: "🌱",
    label: "Seed Readiness",
    path: "/app/seed-readiness",
    end: false,
    badge: null,
  },
  {
    icon: "🌍",
    label: "Soil Health",
    path: "/app/soil-health",
    end: false,
    badge: null,
  },
  {
    icon: "🔬",
    label: "Disease Predictor",
    path: "/app/disease",
    end: false,
   
  },
  {
    icon: "📊",
    label: "Cost Analysis",
    path: "/app/cost",
    end: false,
    
  },
];

const COLLAGE = [
  { img: potatoField, label: "Potato Fields — Nuwara Eliya" },
  { img: harvestReady, label: "Harvest Ready" },
  { img: freshPotatoes, label: "Fresh Potatoes" },
  { img: richSoil, label: "Rich Soil" },
];

const QUICK_STATS = [
  {
    icon: "🌡️",
    iconBg: "#fff8f0",
    label: "Soil Temperature",
    value: "18°C",
    sub: "Optimal range",
    trend: "+0.3°",
    trendType: "up",
  },
  {
    icon: "💧",
    iconBg: "#f0f8ff",
    label: "Moisture Level",
    value: "62%",
    sub: "Adequate",
    trend: "Stable",
    trendType: "up",
  },
  {
    icon: "🌾",
    iconBg: "#f2fbf6",
    label: "Active Fields",
    value: "3",
    sub: "In season",
    trend: "",
    trendType: "",
  },
  {
    icon: "⏱️",
    iconBg: "#fff8f0",
    label: "Days to Harvest",
    value: "47",
    sub: "On schedule",
    trend: "On track",
    trendType: "up",
  },
];

const STATS = [
  {
    label: "Avg. Soil Temp",
    value: "18 °C",
    sub: "Optimal range",
    img: soilTempImg,
  },
  { label: "Moisture Level", value: "62 %", sub: "Adequate", img: moistureImg },
  { label: "Active Fields", value: "3", sub: "In season", img: activeFieldImg },
  {
    label: "Days to Harvest",
    value: "47",
    sub: "On schedule",
    img: harvestImg,
  },
  { label: "Open Alerts", value: "2", sub: "Needs review", img: alertImg },
];

const MODULES = [
  {
    id: "seed",
    title: "Seed Readiness",
    path: "/app/seed-readiness",
    icon: "🌱",
    tag: "Active",
    tagStyle: { background: "rgba(217,244,231,.9)", color: "#185c30" },
    iconBg: "#e4f8ee",
    btnBg: "#2a5c3f",
    btnColor: "#fff",
    statusColor: "#4caf76",
    statusLabel: "Ready",
    img: seedReadinessImg,
    desc: "Evaluate seed potato quality before planting. AI-driven germination scores and batch recommendations.",
  },
  {
    id: "disease",
    title: "Disease Predictor",
    path: "/app/disease",
    icon: "🔬",
    tag: "Active",
    tagStyle: { background: "rgba(252,233,233,.9)", color: "#8b1f1f" },
    iconBg: "#fce9e9",
    btnBg: "#cc4040",
    btnColor: "#fff",
    statusColor: "#cc4040",
    statusLabel: "Ready",
    img: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=700&q=85",
    desc: "Upload leaf images or describe symptoms for instant AI diagnosis and targeted treatment plans.",
  },
  {
    id: "soil",
    title: "Soil Health",
    path: "/app/soil-health",
    icon: "🌍",
    tag: "Soon",
    tagStyle: { background: "rgba(226,241,251,.9)", color: "#1a5a82" },
    iconBg: "#e2f1fb",
    btnBg: "#2b82be",
    btnColor: "#fff",
    statusColor: "#2b82be",
    statusLabel: "Coming soon",
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=85",
    desc: "Analyse soil composition, pH levels and nutrients to unlock your field's maximum yield potential.",
    disabled: true,
  },
  {
    id: "cost",
    title: "Cost Analysis",
    path: "/app/cost",
    icon: "📊",
    tag: "Active",
    tagStyle: { background: "rgba(254,243,224,.9)", color: "#7a4a08" },
    iconBg: "#fef3e0",
    btnBg: "#d4882b",
    btnColor: "#fff",
    statusColor: "#d4882b",
    statusLabel: "Ready",
    img: costAnalysisImg,
    desc: "Track inputs, labour and harvest costs. Forecast ROI and get margin optimisation recommendations.",
  },
];

export default function AppDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const userInitials = currentUser?.email?.slice(0, 2).toUpperCase() || "HW";

  return (
    <>
      <style>{STYLES}</style>
      <div className='spf'>
        {/* ═══ SIDEBAR ═══ */}
        <aside className='spf-sidebar'>
          <div className='sb-brand'>
            <div className='sb-brand-row'>
              <div className='sb-mark'>🥔</div>
              <div>
                <div className='sb-name'>SmartPotato</div>
                <div className='sb-sub'>Sri Lanka</div>
              </div>
            </div>
          </div>

          <nav className='sb-nav'>
            <div className='sb-section'>Main Menu</div>
            {NAV.map((n) => (
              <NavLink
                key={n.path}
                to={n.path}
                end={n.end}
                className={({ isActive }) =>
                  `sb-link${isActive ? " active" : ""}`
                }
              >
                <span className='sb-link-icon'>{n.icon}</span>
                {n.label}
                {n.badge && (
                  <span className={`sb-badge${n.badge === "AI" ? " ai" : ""}`}>
                    {n.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className='sb-foot'>
          
            <div className='sb-ver'>SmartPotato v2.1 · Sri Lanka</div>
            <button className='sb-logout' onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </aside>

        {/* ═══ TOP BAR ═══ */}
        <div className='spf-topbar'>
          <div className='topbar-status'>
            <span className='ldot' /> System online · ML active
          </div>
          <div className='topbar-right'>
            <div className='topbar-bell'>🔔</div>
            <div className='topbar-user'>
              <div className='topbar-av'>{userInitials}</div>
              <div>
                <div className='topbar-uname'>
                  {currentUser?.email?.split("@")[0] || "Farmer"}
                </div>
                <div className='topbar-urole'>Farmer Account</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MAIN ═══ */}
        <main className='spf-main'>
          <div className='spf-inner'>
            {/* HERO */}
            <div className='hero fu d0'>
              <div className='hero-photo' />
              <div className='hero-grad' />
              <div className='hero-deco1' />
              <div className='hero-deco2' />
              <div className='hero-badge'>
                <span className='ldot' /> System Online · ML Active
              </div>
              <div className='hero-body'>
                <div className='hero-pill'>
                  <span className='ldot' /> Smart Potato Farming System
                </div>
                <div className='hero-title'>{greeting()}, Farmer 👋</div>
                <div className='hero-sub'>
                  {dateStr} — Your fields are being monitored. Here's a quick
                  overview of your farm's health today.
                </div>
              </div>
            </div>

            {/* QUICK STATS STRIP */}
            <div className='quick-stats fu d1'>
              {QUICK_STATS.map((s) => (
                <div className='qs-card' key={s.label}>
                  <div className='qs-icon' style={{ background: s.iconBg }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className='qs-label'>{s.label}</div>
                    <div className='qs-val'>{s.value}</div>
                    <div className='qs-sub'>
                      {s.trend && (
                        <span className={`qs-trend ${s.trendType}`}>
                          {s.trend} ·
                        </span>
                      )}
                      {s.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PHOTO COLLAGE */}
            <div className='collage fu d2'>
              {COLLAGE.map((c, i) => (
                <div className='col-item' key={i}>
                  <img
                    src={c.img}
                    alt={c.label}
                    className='col-img'
                    loading='lazy'
                  />
                  <div className='col-label'>{c.label}</div>
                </div>
              ))}
            </div>

            {/* STAT CARDS */}
            <div className='stats-row fu d3'>
              {STATS.map((s) => (
                <div className='stat-card' key={s.label}>
                  <img
                    src={s.img}
                    alt={s.label}
                    className='stat-img'
                    loading='lazy'
                  />
                  <div className='stat-body'>
                    <div className='stat-label'>{s.label}</div>
                    <div className='stat-val'>{s.value}</div>
                    <div className='stat-sub'>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* MODULE CARDS */}
            <div className='fu d4'>
              <div className='sec-head'>
                <div>
                  <div className='sec-title'>Farm Intelligence Modules</div>
                  <div className='sec-sub'>
                    Select a module to begin your analysis
                  </div>
                </div>
                <span className='sec-tag'>4 Modules</span>
              </div>

              <div className='modules-grid'>
                {MODULES.map((m, i) => (
                  <div
                    key={m.id}
                    className={`mod-card fu d${i + 4}`}
                    onClick={() => !m.disabled && navigate(m.path)}
                    style={{
                      opacity: m.disabled ? 0.75 : 1,
                      cursor: m.disabled ? "default" : "pointer",
                    }}
                  >
                    <div className='mod-img-wrap'>
                      <img
                        src={m.img}
                        alt={m.title}
                        className='mod-img'
                        loading='lazy'
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${m.id}/600/300`;
                        }}
                      />
                      <span className='mod-tag' style={m.tagStyle}>
                        {m.tag}
                      </span>
                    </div>
                    <div className='mod-body'>
                      <div className='mod-hd'>
                        <div
                          className='mod-icon'
                          style={{ background: m.iconBg }}
                        >
                          {m.icon}
                        </div>
                        <span className='mod-title'>{m.title}</span>
                      </div>
                      <div className='mod-desc'>{m.desc}</div>
                      <div className='mod-ft'>
                        {m.disabled ? (
                          <span className='soon-chip'>Coming Soon</span>
                        ) : (
                          <button
                            className='mod-btn'
                            style={{ background: m.btnBg, color: m.btnColor }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(m.path);
                            }}
                          >
                            Open Module →
                          </button>
                        )}
                        <span
                          className='mod-status'
                          style={{ color: m.statusColor }}
                        >
                          <span
                            className='sdot'
                            style={{ background: m.statusColor }}
                          />
                          {m.statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
            
          </div>
        </main>
      </div>
    </>
  );
}
