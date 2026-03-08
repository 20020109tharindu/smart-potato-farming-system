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
/* ═══════════════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700;900&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    /* Brand greens — light, fresh, natural */
    --g950: #1a3d28;
    --g900: #2a5c3f;
    --g800: #347a52;
    --g700: #3e9460;
    --g600: #4caf76;
    --g500: #62c98e;
    --g400: #85dba8;
    --g300: #aeeac4;
    --g100: #d9f5e8;
    --g50:  #f0fdf6;

    --amber:   #d4882b;
    --amber-l: #fef3e0;
    --sky:     #2b82be;
    --sky-l:   #e2f1fb;
    --red:     #cc4040;
    --red-l:   #fce9e9;

    --cream:   #f5f2eb;
    --card:    #ffffff;
    --text:    #1a3d28;
    --mid:     #3e7a58;
    --soft:    #7cb898;
    --border:  #c8e8d4;

    --sh-xs: 0 1px 4px  rgba(42,92,63,.06);
    --sh-sm: 0 2px 10px rgba(42,92,63,.08);
    --sh-md: 0 6px 24px rgba(42,92,63,.12);
    --sh-xl: 0 14px 50px rgba(42,92,63,.14);

    --sidebar-w: 236px;
    --r: 16px;
  }

  /* ── reset ── */
  .spf, .spf * { box-sizing: border-box; margin: 0; padding: 0; }
  .spf { font-family: 'Outfit', sans-serif; background: var(--cream); min-height: 100vh; color: var(--text); }

  /* ═══════════════ SIDEBAR ═══════════════ */
  .spf-sidebar {
    width: var(--sidebar-w);
    min-height: 100vh;
    position: fixed; left: 0; top: 0; bottom: 0;
    z-index: 200;
    display: flex; flex-direction: column;
    background: var(--g900);
    box-shadow: 3px 0 20px rgba(0,0,0,.18);
    overflow: hidden;
  }

  .sb-brand {
    padding: 22px 18px 18px;
    border-bottom: 1px solid rgba(255,255,255,.08);
    flex-shrink: 0;
  }
  .sb-brand-row { display: flex; align-items: center; gap: 10px; }
  .sb-mark {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--g600);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.25rem; flex-shrink: 0;
  }
  .sb-name { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 700; color: #fff; line-height: 1.1; }
  .sb-sub  { font-size: .62rem; color: var(--g300); letter-spacing: .12em; text-transform: uppercase; margin-top: 2px; }

  .sb-nav { flex: 1; overflow-y: auto; padding: 8px 0 12px; }
  .sb-section {
    font-size: .6rem; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(255,255,255,.28); padding: 16px 18px 6px;
  }
  .sb-link {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 18px; margin: 1px 8px;
    border-radius: 10px; text-decoration: none;
    color: rgba(255,255,255,.56); font-size: .86rem; font-weight: 500;
    transition: background .18s, color .18s;
    position: relative;
  }
  .sb-link:hover { background: rgba(255,255,255,.07); color: #fff; }
  .sb-link.active { background: var(--g700); color: #fff; }
  .sb-link-icon { font-size: .95rem; width: 20px; text-align: center; flex-shrink: 0; }
  .sb-badge {
    margin-left: auto; font-size: .6rem; font-weight: 700;
    background: var(--amber); color: #fff;
    border-radius: 20px; padding: 2px 7px;
  }
  .sb-badge.ai { background: var(--sky); }

  .sb-foot {
    flex-shrink: 0;
    padding: 14px 18px 18px;
    border-top: 1px solid rgba(255,255,255,.08);
  }
  .sb-weather {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.07); border-radius: 10px;
    padding: 10px 12px; margin-bottom: 10px;
  }
  .sb-wi { font-size: 1.4rem; }
  .sb-wlabel { font-size: .63rem; color: rgba(255,255,255,.38); }
  .sb-wval   { font-size: .98rem; font-weight: 600; color: #fff; }
  .sb-ver    { font-size: .62rem; color: rgba(255,255,255,.2); text-align: center; margin-bottom: 8px; }
  .sb-logout {
    width: 100%; padding: 8px; border-radius: 8px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.45); font-size: .75rem;
    font-family: 'Outfit', sans-serif; cursor: pointer;
    transition: background .18s;
  }
  .sb-logout:hover { background: rgba(255,255,255,.1); color: rgba(255,255,255,.75); }

  /* ═══════════════ MAIN ═══════════════ */
  .spf-main {
    margin-left: var(--sidebar-w);
    padding: 26px 28px 52px;
    min-width: 0;
    display: flex;
    justify-content: center;
  }
  .spf-inner {
    width: 100%;
    max-width: 1200px;
  }

  /* ═══════════════ HERO ═══════════════ */
  .hero {
    position: relative; overflow: hidden;
    border-radius: var(--r);
    background: var(--g700);
    color: #fff;
    padding: 44px 42px 38px;
    margin-bottom: 20px;
    box-shadow: var(--sh-xl);
  }
  .hero-photo {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&q=85') center/cover no-repeat;
    opacity: .22;
  }
  .hero-grad {
    position: absolute; inset: 0;
    background: linear-gradient(108deg, rgba(42,92,63,.92) 36%, rgba(42,92,63,.28));
  }
  .hero-body  { position: relative; z-index: 1; }
  .hero-pill  {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,.1); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 30px; padding: 5px 14px;
    font-size: .69rem; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; color: var(--g300); margin-bottom: 14px;
  }
  .ldot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80; animation: blink 1.8s infinite;
    flex-shrink: 0;
  }
  @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.55)} }

  .hero-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem, 3vw, 2.65rem); font-weight: 900;
    line-height: 1.08; margin-bottom: 11px;
  }
  .hero-sub { font-size: .87rem; color: rgba(255,255,255,.65); max-width: 480px; line-height: 1.68; }
  .hero-stats { display: flex; gap: 32px; margin-top: 28px; flex-wrap: wrap; }
  .hs-label { font-size: .61rem; letter-spacing: .13em; text-transform: uppercase; color: var(--g300); margin-bottom: 3px; }
  .hs-val   { font-family: 'Fraunces', serif; font-size: 1.75rem; font-weight: 700; }

  .hero-badge {
    position: absolute; top: 20px; right: 24px;
    background: rgba(255,255,255,.1); backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 30px; padding: 6px 15px;
    font-size: .71rem; font-weight: 600; color: #fff;
    display: flex; align-items: center; gap: 7px; z-index: 2;
  }

  /* ═══════════════ PHOTO COLLAGE ═══════════════ */
  /*  4 equal columns, all same height — no blank gaps */
  .collage {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    height: 185px;
    gap: 8px;
    margin-bottom: 20px;
    border-radius: var(--r);
    overflow: hidden;
    box-shadow: var(--sh-md);
  }
  .col-item { position: relative; overflow: hidden; height: 100%; }
  .col-img  {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
    display: block;
    transition: transform .5s ease;
  }
  .col-item:hover .col-img { transform: scale(1.07); }
  .col-label {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(30,70,48,.78));
    padding: 20px 10px 8px;
    font-size: .66rem; font-weight: 600; color: #fff;
    text-transform: uppercase; letter-spacing: .08em;
    opacity: 0; transition: opacity .28s;
  }
  .col-item:hover .col-label { opacity: 1; }

  /* ═══════════════ STAT CARDS ═══════════════ */
  /* 5 equal columns, photo top + data bottom */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 14px;
    margin-bottom: 28px;
  }
  .stat-card {
    border-radius: 13px; overflow: hidden;
    border: 1.5px solid var(--border);
    background: var(--card);
    box-shadow: var(--sh-xs);
    transition: transform .22s, box-shadow .22s;
  }
  .stat-card:hover { transform: translateY(-4px); box-shadow: var(--sh-md); }
  .stat-img {
    width: 100%; height: 76px;
    object-fit: cover; object-position: center;
    display: block;
  }
  .stat-body  { padding: 9px 11px 11px; }
  .stat-label { font-size: .58rem; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); margin-bottom: 2px; }
  .stat-val   { font-family: 'Fraunces', serif; font-size: 1.25rem; font-weight: 700; color: var(--text); }
  .stat-sub   { font-size: .67rem; color: var(--soft); margin-top: 1px; }

  /* ═══════════════ MODULES — always 4 cols ═══════════════ */
  .sec-head  { margin-bottom: 16px; }
  .sec-title { font-family: 'Fraunces', serif; font-size: 1.4rem; font-weight: 700; color: var(--text); }
  .sec-sub   { font-size: .8rem; color: var(--soft); margin-top: 3px; }

  /* Force 4 columns always — avoids wrapping */
  .modules-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }

  .mod-card {
    background: var(--card);
    border-radius: var(--r);
    border: 1.5px solid var(--border);
    overflow: hidden; cursor: pointer;
    box-shadow: var(--sh-xs);
    transition: transform .26s ease, box-shadow .26s ease, border-color .26s ease;
    display: flex; flex-direction: column;
  }
  .mod-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--sh-xl);
    border-color: var(--g400);
  }
  .mod-img-wrap { position: relative; overflow: hidden; flex-shrink: 0; }
  .mod-img {
    width: 100%; height: 160px;
    object-fit: cover; object-position: center;
    display: block;
    transition: transform .44s ease;
  }
  .mod-card:hover .mod-img { transform: scale(1.06); }
  .mod-tag {
    position: absolute; top: 10px; left: 10px;
    border-radius: 20px; padding: 3px 10px;
    font-size: .61rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  }
  .mod-body  { padding: 16px 18px 18px; flex: 1; display: flex; flex-direction: column; }
  .mod-hd    { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; }
  .mod-icon  {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .mod-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 700; }
  .mod-desc  { font-size: .77rem; color: var(--mid); line-height: 1.58; margin-bottom: 14px; flex: 1; }
  .mod-ft    { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
  .mod-btn   {
    display: inline-flex; align-items: center; gap: 5px;
    border: none; border-radius: 30px; padding: 7px 16px;
    font-family: 'Outfit', sans-serif; font-size: .77rem; font-weight: 600;
    cursor: pointer; transition: opacity .18s, transform .15s;
  }
  .mod-btn:hover { opacity: .87; transform: scale(1.03); }
  .mod-status { font-size: .68rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }
  .sdot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .soon-chip {
    background: var(--sky-l); color: var(--sky);
    border: 1.5px solid #b5d9f5;
    border-radius: 20px; padding: 4px 11px;
    font-size: .68rem; font-weight: 600;
  }

  /* ═══════════════ DASH FOOTER ═══════════════ */
  .dash-footer {
    margin-top: 36px; padding-top: 18px;
    border-top: 1.5px solid var(--border);
    display: flex; justify-content: space-between;
    flex-wrap: wrap; gap: 8px;
    font-size: .73rem; color: var(--soft);
  }
  .df-left { display: flex; gap: 22px; flex-wrap: wrap; align-items: center; }

  /* ═══════════════ ANIMATIONS ═══════════════ */
  .fu  { animation: fu .48s ease both; }
  @keyframes fu { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .d1{animation-delay:.06s} .d2{animation-delay:.12s}
  .d3{animation-delay:.18s} .d4{animation-delay:.24s}
  .d5{animation-delay:.30s} .d6{animation-delay:.36s}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */
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
    badge: "AI",
  },
  {
    icon: "📊",
    label: "Cost Analysis",
    path: "/app/cost",
    end: false,
    badge: "ML",
  },
];

const COLLAGE = [
  {
    img: potatoField,
    label: "Potato Fields — Nuwara Eliya",
  },
  {
    img: harvestReady,
    label: "Harvest Ready",
  },
  {
    img: freshPotatoes,
    label: "Fresh Potatoes",
  },
  {
    img: richSoil,
    label: "Rich Soil",
  },
];

const STATS = [
  {
    label: "Avg. Soil Temp",
    value: "18 °C",
    sub: "Optimal range",
    img: soilTempImg,
  },
  {
    label: "Moisture Level",
    value: "62 %",
    sub: "Adequate",
    img: moistureImg,
  },
  {
    label: "Active Fields",
    value: "3",
    sub: "In season",
    img: activeFieldImg,
  },
  {
    label: "Days to Harvest",
    value: "47",
    sub: "On schedule",
    img: harvestImg,
  },
  {
    label: "Open Alerts",
    value: "2",
    sub: "Needs review",
    img: alertImg,
  },
];

const MODULES = [
   {
    id: "seed",
    title: "Seed Readiness",
    path: "/app/seed-readiness",
    icon: "🌱",
    tag: "Active",
    tagStyle: { background: "#d9f4e7", color: "#185c30" },
    iconBg: "#d9f4e7",
    btnBg: "#3e9460",
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
    tagStyle: { background: "#fce9e9", color: "#8b1f1f" },
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
    tagStyle: { background: "#e2f1fb", color: "#1a5a82" },
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
  tagStyle: { background: "#fef3e0", color: "#7a4a08" },
  iconBg: "#fef3e0",
  btnBg: "#d4882b",
  btnColor: "#fff",
  statusColor: "#d4882b",
  statusLabel: "Ready",
  img: costAnalysisImg,
  desc: "Track inputs, labour and harvest costs. Forecast ROI and get margin optimisation recommendations.",
}
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
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

  return (
    <>
      <style>{STYLES}</style>
      <div className='spf'>
        {/* ═══════════════ SIDEBAR ═══════════════ */}
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
            <div className='sb-weather'>
              <span className='sb-wi'>🌤️</span>
              <div>
                <div className='sb-wlabel'>Nuwara Eliya</div>
                <div className='sb-wval'>28°C</div>
              </div>
            </div>
            <div className='sb-ver'>SmartPotato v2.1 · Sri Lanka</div>
            <button className='sb-logout' onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </aside>

        {/* ═══════════════ MAIN ═══════════════ */}
        <main className='spf-main'>
          <div className='spf-inner'>
            {/* ── HERO ── */}
            <div className='hero fu'>
              <div className='hero-photo' />
              <div className='hero-grad' />
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
                <div className='hero-stats'>
                  {[].map((s) => (
                    <div key={s.label}>
                      <div className='hs-label'>{s.label}</div>
                      <div className='hs-val'>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── PHOTO COLLAGE ── */}
            <div className='collage fu d1'>
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

            {/* ── STAT CARDS WITH POTATO PHOTOS ── */}
            <div className='stats-row fu d2'>
              {STATS.map((s, i) => (
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

            {/* ── MODULE CARDS — 4 columns, always ── */}
            <div className='fu d3'>
              <div className='sec-head'>
                <div className='sec-title'>Farm Intelligence Modules</div>
                <div className='sec-sub'>
                  Select a module to begin your analysis
                </div>
              </div>

              <div className='modules-grid'>
                {MODULES.map((m, i) => (
                  <div
                    key={m.id}
                    className={`mod-card fu d${i + 3}`}
                    onClick={() => !m.disabled && navigate(m.path)}
                    style={{
                      opacity: m.disabled ? 0.76 : 1,
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
