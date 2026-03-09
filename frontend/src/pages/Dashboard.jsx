import { useNavigate } from "react-router-dom";

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

const LeafIcon = ({ size = 20 }) => (
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
  }

  .db-page {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse 70% 55% at 8% 0%,   rgba(90,158,86,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 92% 100%, rgba(122,92,58,0.08) 0%, transparent 55%);
    font-family: 'Inter', sans-serif;
    position: relative;
  }

  .db-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(90,158,86,0.09) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none; z-index: 0;
  }

  /* ── Top hero banner ── */
  .db-hero {
    background: linear-gradient(108deg, #1a3018 0%, #2d5a2a 35%, #3d7a3a 65%, #5a9e56 100%);
    padding: 36px 0 80px;
    position: relative; overflow: hidden;
  }

  .db-hero::after {
    content: '';
    position: absolute; right: -60px; bottom: -80px;
    width: 320px; height: 320px; border-radius: 50%;
    background: rgba(255,255,255,.04);
  }

  .db-hero::before {
    content: '';
    position: absolute; right: 200px; top: -60px;
    width: 180px; height: 180px; border-radius: 50%;
    background: rgba(255,255,255,.03);
  }

  .db-hero-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    position: relative; z-index: 1;
  }

  .db-hero-left { display: flex; align-items: center; gap: 18px; }

  .db-logo-box {
    width: 60px; height: 60px; border-radius: 16px; flex-shrink: 0;
    background: rgba(255,255,255,.13); border: 1px solid rgba(255,255,255,.2);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 28px;
  }

  .db-hero-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--sprout); margin-bottom: 5px;
  }

  .db-hero-title {
    font-family: 'Lora', serif; font-size: 28px; font-weight: 700;
    color: #fff; letter-spacing: -.01em; line-height: 1.2;
  }

  .db-hero-sub {
    font-size: 13px; color: rgba(255,255,255,.55); margin-top: 4px; font-weight: 300;
  }

  .db-hero-right {
    display: flex; align-items: center; gap: 16px; flex-shrink: 0;
  }

  .db-hero-welcome {
    text-align: right;
  }

  .db-hero-welcome-label { font-size: 11px; color: rgba(255,255,255,.5); }

  .db-hero-welcome-name {
    font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: #fff;
  }

  .db-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(255,255,255,.15); border: 2px solid rgba(255,255,255,.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: #fff;
  }

  /* ── Main content ── */
  .db-main {
    max-width: 1100px; margin: 0 auto; padding: 0 32px 64px;
    position: relative; z-index: 1;
    margin-top: -48px;
  }

  /* ── Stat cards (pulled up over hero) ── */
  .db-stats {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-bottom: 32px;
  }

  .db-stat-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 16px; padding: 22px 24px;
    box-shadow: var(--shadow-md);
    display: flex; align-items: center; gap: 16px;
    animation: cardIn .5s ease both;
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .db-stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

  .db-stat-card:nth-child(1) { animation-delay: .05s; }
  .db-stat-card:nth-child(2) { animation-delay: .10s; }
  .db-stat-card:nth-child(3) { animation-delay: .15s; }

  .db-stat-icon {
    width: 48px; height: 48px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 22px;
    border: 1px solid;
  }

  .db-stat-icon.green  { background: var(--fog);   border-color: rgba(61,122,58,.2); }
  .db-stat-icon.amber  { background: var(--amber-bg); border-color: rgba(212,136,6,.2); }
  .db-stat-icon.blue   { background: var(--blue-bg);  border-color: rgba(37,99,176,.2); }

  .db-stat-value {
    font-family: 'Lora', serif; font-size: 28px; font-weight: 700;
    color: var(--ink); line-height: 1;
  }

  .db-stat-label { font-size: 12px; color: var(--ink-lt); margin-top: 4px; }

  /* ── Section heading ── */
  .db-sec-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }

  .db-sec-icon {
    width: 32px; height: 32px; border-radius: 9px;
    background: var(--fog); border: 1px solid rgba(61,122,58,.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--leaf); flex-shrink: 0;
  }

  .db-sec-title {
    font-family: 'Lora', serif; font-size: 17px; font-weight: 700;
    color: var(--ink); letter-spacing: -.005em;
  }

  .db-sec-line { flex: 1; height: 1px; background: var(--straw); }

  /* ── Quick Action cards ── */
  .db-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }

  .db-action-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 18px; overflow: hidden;
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    animation: cardIn .5s ease both;
    position: relative;
  }

  .db-action-card:nth-child(1) { animation-delay: .1s; }
  .db-action-card:nth-child(2) { animation-delay: .15s; }
  .db-action-card:nth-child(3) { animation-delay: .2s; }

  .db-action-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: rgba(61,122,58,.22); }

  .db-action-banner {
    padding: 26px 24px 22px; position: relative; overflow: hidden;
  }

  .db-action-banner::after {
    content: ''; position: absolute; right: -16px; top: -16px;
    width: 100px; height: 100px; border-radius: 50%;
    background: rgba(255,255,255,.08);
  }

  .db-action-emoji { font-size: 36px; display: block; margin-bottom: 12px; position: relative; z-index: 1; }

  .db-action-title {
    font-family: 'Lora', serif; font-size: 18px; font-weight: 700;
    color: #fff; line-height: 1.2; margin-bottom: 5px;
    position: relative; z-index: 1;
  }

  .db-action-desc {
    font-size: 12.5px; color: rgba(255,255,255,.65); line-height: 1.5;
    position: relative; z-index: 1;
  }

  .db-action-banner.green  { background: linear-gradient(135deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%); }
  .db-action-banner.amber  { background: linear-gradient(135deg, #6b3a0a 0%, #9a5c1a 55%, #d48806 100%); }
  .db-action-banner.blue   { background: linear-gradient(135deg, #0f2a5c 0%, #1e4a9a 55%, #2563b0 100%); }

  .db-action-foot {
    padding: 16px 20px; background: var(--cream);
    border-top: 1px solid rgba(122,92,58,.08);
  }

  .db-action-btn {
    width: 100%; padding: 11px 16px;
    background: var(--white); border: 1.5px solid rgba(61,122,58,.22);
    border-radius: 10px; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--leaf); letter-spacing: .03em;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all .18s ease;
  }

  .db-action-btn:hover { background: var(--fog); border-color: var(--leaf-mid); transform: none; }

  .db-action-banner.amber + .db-action-foot .db-action-btn { color: var(--amber); border-color: rgba(212,136,6,.3); }
  .db-action-banner.amber + .db-action-foot .db-action-btn:hover { background: var(--amber-bg); border-color: var(--amber); }

  .db-action-banner.blue + .db-action-foot .db-action-btn { color: var(--blue); border-color: rgba(37,99,176,.25); }
  .db-action-banner.blue + .db-action-foot .db-action-btn:hover { background: var(--blue-bg); border-color: var(--blue); }

  .db-popular-badge {
    position: absolute; top: 12px; right: 12px;
    background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.3);
    border-radius: 20px; padding: 3px 10px;
    font-size: 10px; font-weight: 600; color: #fff; letter-spacing: .06em;
    text-transform: uppercase; z-index: 2;
  }

  /* ── Two column row ── */
  .db-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 32px; }

  /* ── Activity card ── */
  .db-activity-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 18px; padding: 28px;
    box-shadow: var(--shadow-sm);
    animation: cardIn .5s ease both .15s;
  }

  .db-activity-list { display: flex; flex-direction: column; gap: 4px; }

  .db-activity-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 12px; border-radius: 12px;
    cursor: pointer;
    transition: background .15s ease;
  }

  .db-activity-item:hover { background: var(--cream); }

  .db-activity-icon {
    width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 19px;
    border: 1px solid;
  }

  .db-activity-icon.g { background: var(--fog);      border-color: rgba(61,122,58,.2); }
  .db-activity-icon.b { background: var(--blue-bg);  border-color: rgba(37,99,176,.2); }
  .db-activity-icon.a { background: var(--amber-bg); border-color: rgba(212,136,6,.18); }

  .db-activity-main { flex: 1; }

  .db-activity-action { font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
  .db-activity-detail { font-size: 12px; color: var(--ink-lt); }
  .db-activity-time   { font-size: 11px; color: var(--ink-lt); opacity: .55; white-space: nowrap; }

  .db-activity-divider { border: none; border-top: 1px solid var(--straw); margin: 8px 0; }

  .db-view-all {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; color: var(--leaf);
    background: none; border: none; cursor: pointer;
    padding: 8px 0; transition: gap .15s ease;
  }

  .db-view-all:hover { gap: 10px; }

  /* ── Performance card ── */
  .db-perf-card {
    background: linear-gradient(145deg, #1a3018 0%, #2d5a2a 50%, #3d7a3a 100%);
    border-radius: 18px; padding: 28px;
    box-shadow: var(--shadow-md);
    animation: cardIn .5s ease both .2s;
    display: flex; flex-direction: column;
  }

  .db-perf-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 22px;
  }

  .db-perf-icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center; color: #fff;
  }

  .db-perf-title {
    font-family: 'Lora', serif; font-size: 16px; font-weight: 700; color: #fff;
  }

  .db-perf-metrics { display: flex; flex-direction: column; gap: 14px; flex: 1; }

  .db-perf-item {
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.1);
    border-radius: 12px; padding: 14px 16px;
  }

  .db-perf-row {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  }

  .db-perf-label { font-size: 11.5px; color: rgba(255,255,255,.6); }

  .db-perf-value {
    font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: var(--sprout);
  }

  .db-perf-track {
    height: 5px; background: rgba(255,255,255,.12);
    border-radius: 99px; overflow: hidden;
  }

  .db-perf-fill {
    height: 100%; border-radius: 99px;
    transition: width 1s cubic-bezier(.22,1,.36,1);
  }

  .db-perf-btn {
    margin-top: 20px; width: 100%;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
    border-radius: 10px; padding: 12px;
    font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
    color: rgba(255,255,255,.85); cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all .18s ease;
  }

  .db-perf-btn:hover { background: rgba(255,255,255,.16); color: #fff; }

  /* ── Tips card ── */
  .db-tips-card {
    background: var(--amber-bg);
    border: 1.5px solid rgba(212,136,6,.2);
    border-radius: 18px; padding: 28px;
    animation: cardIn .5s ease both .25s;
  }

  .db-tips-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px; }

  .db-tip-item {
    background: var(--white);
    border: 1px solid rgba(212,136,6,.12);
    border-radius: 14px; padding: 22px 18px;
    transition: box-shadow .2s ease, transform .2s ease;
  }

  .db-tip-item:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }

  .db-tip-emoji { font-size: 28px; margin-bottom: 10px; }

  .db-tip-title {
    font-family: 'Lora', serif; font-size: 14px; font-weight: 600;
    color: var(--ink); margin-bottom: 6px;
  }

  .db-tip-text { font-size: 12.5px; color: var(--ink-lt); line-height: 1.55; }

  /* ── Footer ── */
  .db-footer {
    display: flex; align-items: center; justify-content: center; gap: 18px;
    padding-bottom: 16px;
    animation: fadeUp .5s ease both .3s;
  }

  .db-fi { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-lt); opacity: .45; }
  .db-fd { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-lt); opacity: .3; }

  @keyframes cardIn  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(10px);  } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeDown{ from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

  @media (max-width: 900px) {
    .db-stats   { grid-template-columns: 1fr 1fr; }
    .db-actions { grid-template-columns: 1fr; }
    .db-row     { grid-template-columns: 1fr; }
    .db-tips-grid { grid-template-columns: 1fr; }
    .db-hero-right { display: none; }
  }

  @media (max-width: 560px) {
    .db-stats { grid-template-columns: 1fr; }
    .db-hero-inner { flex-direction: column; align-items: flex-start; }
    .db-main { padding: 0 18px 48px; }
    .db-hero { padding: 28px 0 70px; }
  }
  
`;

export default function Dashboard() {
  const navigate = useNavigate();

  const quickStats = [
    { icon: "🌾", cls: "green", value: "18.4 t/ha", label: "Expected Yield" },
    { icon: "💰", cls: "amber", value: "LKR 284K", label: "Est. Revenue" },
    { icon: "📈", cls: "blue", value: "32%", label: "Profit Margin" },
  ];

  const actions = [
    {
      emoji: "📝",
      banner: "green",
      badge: "Popular",
      title: "Start New Input",
      desc: "Enter field details, costs and constraints to generate predictions.",
      cta: "Go to Input Page",
      to: "/app/cost/in",
    },
    {
      emoji: "📊",
      banner: "amber",
      title: "View Results",
      desc: "Check predicted yield, revenue and key metrics from your last run.",
      cta: "Open Results",
      to: "/app/cost/results",
    },
    {
      emoji: "💡",
      banner: "blue",
      title: "Recommendations",
      desc: "See actionable investment strategies with weekly action plans.",
      cta: "See Recommendations",
      to: "/app/cost/recommendations",
    },
  ];

  const activity = [
    {
      icon: "🚜",
      cls: "g",
      action: 'Ran prediction for "Yala-Field-A"',
      detail: "Soil: Loam · Budget: LKR 120k",
      time: "2 hrs ago",
    },
    {
      icon: "💰",
      cls: "b",
      action: "Updated fertilizer cost assumptions",
      detail: "New rate: LKR 85/kg",
      time: "5 hrs ago",
    },
    {
      icon: "🌱",
      cls: "a",
      action: 'Reviewed recommendations for "Maha-Plot-B"',
      detail: "Strategy: High-yield · Season: Maha",
      time: "1 day ago",
    },
  ];

  const perfMetrics = [
    { label: "Model Accuracy", value: "94%", pct: 94, color: "#7dc478" },
    {
      label: "Avg. Profit Margin",
      value: "32%",
      pct: 32,
      color: "var(--sprout)",
    },
    { label: "Cost Efficiency", value: "87%", pct: 87, color: "#a8d5a2" },
  ];

  const tips = [
    {
      emoji: "🌱",
      title: "Seed Readiness",
      text: "Update soil test results every season for accurate yield predictions.",
    },
    {
      emoji: "🌤️",
      title: "Soil Health",
      text: "Track forecasts to optimize fertilizer application timing.",
    },
    {
      emoji: "📊",
      title: "Disease Predictor",
      text: "Compare multiple scenarios before making final planting decisions.",
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className='db-page'>
        {/* ── Hero ── */}
        <div className='db-hero'>
          <div className='db-hero-inner'>
            <div className='db-hero-left'>
              <div className='db-logo-box'>
                <LeafIcon size={28} />
              </div>
              <div>
                <div className='db-hero-eyebrow'>SmartPotato · Sri Lanka</div>
                <div className='db-hero-title'>Potato Farm Analytics</div>
                <div className='db-hero-sub'>
                  Smart farming decisions powered by ML
                </div>
              </div>
            </div>
            <div className='db-hero-right'>
              <div className='db-hero-welcome'>
                <div className='db-hero-welcome-label'>Current Season</div>
                <div className='db-hero-welcome-name'>Maha 2025/26</div>
              </div>
              <div className='db-avatar'>🥔</div>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className='db-main'>
          {/* Stat chips */}
          <div className='db-stats'>
            {quickStats.map((s, i) => (
              <div className='db-stat-card' key={i}>
                <div className={`db-stat-icon ${s.cls}`}>{s.icon}</div>
                <div>
                  <div className='db-stat-value'>{s.value}</div>
                  <div className='db-stat-label'>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className='db-sec-head'>
            <div className='db-sec-icon'>
              <Icon d='M13 10V3L4 14h7v7l9-11h-7z' size={15} />
            </div>
            <span className='db-sec-title'>Quick Actions</span>
            <div className='db-sec-line' />
          </div>

          <div className='db-actions'>
            {actions.map((a, i) => (
              <div
                className='db-action-card'
                key={i}
                onClick={() => navigate(a.to)}
              >
                {a.badge && <span className='db-popular-badge'>{a.badge}</span>}
                <div className={`db-action-banner ${a.banner}`}>
                  <span className='db-action-emoji'>{a.emoji}</span>
                  <div className='db-action-title'>{a.title}</div>
                  <div className='db-action-desc'>{a.desc}</div>
                </div>
                <div className='db-action-foot'>
                  <button
                    className='db-action-btn'
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(a.to);
                    }}
                  >
                    {a.cta}
                    <Icon d='M13 7l5 5m0 0l-5 5m5-5H6' size={13} sw={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Activity + Performance */}
          <div className='db-row'>
            {/* Activity */}
            <div className='db-activity-card'>
              <div className='db-sec-head' style={{ marginBottom: 18 }}>
                <div className='db-sec-icon'>
                  <Icon d='M22 12h-4l-3 9L9 3l-3 9H2' size={15} />
                </div>
                <span className='db-sec-title'>Recent Activity</span>
                <div className='db-sec-line' />
              </div>

              <div className='db-activity-list'>
                {activity.map((a, i) => (
                  <div key={i}>
                    <div className='db-activity-item'>
                      <div className={`db-activity-icon ${a.cls}`}>
                        {a.icon}
                      </div>
                      <div className='db-activity-main'>
                        <div className='db-activity-action'>{a.action}</div>
                        <div className='db-activity-detail'>{a.detail}</div>
                      </div>
                      <div className='db-activity-time'>{a.time}</div>
                    </div>
                    {i < activity.length - 1 && (
                      <hr className='db-activity-divider' />
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: "1px solid var(--straw)",
                }}
              >
                <button className='db-view-all'>
                  View all activity
                  <Icon d='M13 7l5 5m0 0l-5 5m5-5H6' size={14} sw={2} />
                </button>
              </div>
            </div>

            {/* Performance */}
            <div className='db-perf-card'>
              <div className='db-perf-header'>
                <div className='db-perf-icon'>
                  <Icon
                    d='M18 20V10M12 20V4M6 20v-6'
                    size={16}
                    stroke='#fff'
                    sw={2}
                  />
                </div>
                <span className='db-perf-title'>Performance Insights</span>
              </div>

              <div className='db-perf-metrics'>
                {perfMetrics.map((m, i) => (
                  <div className='db-perf-item' key={i}>
                    <div className='db-perf-row'>
                      <span className='db-perf-label'>{m.label}</span>
                      <span className='db-perf-value'>{m.value}</span>
                    </div>
                    <div className='db-perf-track'>
                      <div
                        className='db-perf-fill'
                        style={{ width: `${m.pct}%`, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className='db-perf-btn'>
                View Detailed Analytics
                <Icon
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                  size={13}
                  stroke='rgba(255,255,255,.7)'
                  sw={2}
                />
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className='db-tips-card'>
            <div className='db-sec-head' style={{ marginBottom: 0 }}>
              <div
                className='db-sec-icon'
                style={{
                  background: "rgba(212,136,6,.1)",
                  borderColor: "rgba(212,136,6,.2)",
                  color: "var(--amber)",
                }}
              >
                <Icon
                  d='M12 2l.642 2.08A6 6 0 0 0 15 5.876L17.08 5.236A6 6 0 0 1 18 9.196l-2.08.642A6 6 0 0 0 14.124 12L14.764 14.08A6 6 0 0 1 10.804 15l-.642-2.08A6 6 0 0 0 8 11.124L5.92 11.764A6 6 0 0 1 5 7.804l2.08-.642A6 6 0 0 0 8.876 5L8.236 2.92A6 6 0 0 1 12 2z'
                  size={15}
                />
              </div>
              <span className='db-sec-title' style={{ color: "#7a4a00" }}>
                Farming Best Practices
              </span>
              <div
                className='db-sec-line'
                style={{ background: "rgba(212,136,6,.2)" }}
              />
            </div>
            <div className='db-tips-grid'>
              {tips.map((t, i) => (
                <div className='db-tip-item' key={i}>
                  <div className='db-tip-emoji'>{t.emoji}</div>
                  <div className='db-tip-title'>{t.title}</div>
                  <div className='db-tip-text'>{t.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className='db-footer'>
            <span className='db-fi'>🌍 Sri Lanka Agri Data</span>
            <span className='db-fd' />
            <span className='db-fi'>🔒 Secure Processing</span>
            <span className='db-fd' />
            <span className='db-fi'>📊 ML-Powered Insights</span>
          </div>
        </div>
      </div>
    </>
  );
}
