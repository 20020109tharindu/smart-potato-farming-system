import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --g950: #0f2318;
    --g900: #1a3d28;
    --g800: #2a5c3f;
    --g700: #3e9460;
    --g600: #4caf76;
    --g400: #85dba8;
    --g200: #c8f0d8;
    --g100: #e8f8ef;
    --g50:  #f4fdf7;
    --cream: #faf7f2;
    --amber: #d4882b;
    --amber-l: #fef3e0;
    --text: #0f2318;
    --soft: #5a8a6e;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .land {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .land-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 18px 48px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(250,247,242,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(42,92,63,.08);
  }
  .nav-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }
    text-transform: uppercase; color: var(--g800);
    margin-bottom: 22px;
  }
  .eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--g600);
    animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .hero-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(2.6rem, 5vw, 4rem);
    font-weight: 900; line-height: 1.05;
    color: var(--g950); margin-bottom: 20px;
  }
  .hero-title em {
    font-style: italic; color: var(--g700);
  }

  .hero-desc {
    font-size: 1rem; color: var(--soft);
    line-height: 1.72; max-width: 440px;
    margin-bottom: 36px;
  }

  .hero-cta { display: flex; gap: 14px; align-items: center; margin-bottom: 48px; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 14px;
    background: var(--g800); color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: .9rem; font-weight: 600;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(42,92,63,.3);
    transition: background .18s, transform .18s, box-shadow .18s;
  }
  .btn-primary:hover {
    background: var(--g900);
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(42,92,63,.4);
  }
  .btn-primary .arr { transition: transform .18s; }
  .btn-primary:hover .arr { transform: translateX(4px); }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 24px; border-radius: 14px;
    background: transparent;
    border: 1.5px solid var(--g200);
    color: var(--g800);
    font-family: 'Outfit', sans-serif;
    font-size: .9rem; font-weight: 500;
    text-decoration: none;
    transition: border-color .18s, background .18s;
  }
  .btn-secondary:hover { border-color: var(--g400); background: var(--g50); }

  .hero-trust {
    display: flex; align-items: center; gap: 16px;
  }
  .trust-avatars { display: flex; }
  .trust-av {
    width: 32px; height: 32px; border-radius: 50%;
    border: 2px solid var(--cream);
    background: var(--g700);
    display: flex; align-items: center; justify-content: center;
    font-size: .8rem; margin-left: -8px; color: #fff; font-weight: 600;
  }
  .trust-av:first-child { margin-left: 0; }
  .trust-text { font-size: .78rem; color: var(--soft); }
  .trust-text strong { color: var(--g800); }

  /* ── HERO RIGHT — visual card stack ── */
  .hero-right {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 14px;
  }

  .hero-card-main {
    background: var(--g900);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 20px 60px rgba(42,92,63,.3);
    padding: 28px;
    color: #fff;
    position: relative;
    animation: slideUp .7s ease both;
  }
  .hero-card-main::before {
    content: '';
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80') center/cover;
    opacity: .18;
  }
  .hcm-inner { position: relative; z-index: 1; }
  .hcm-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.1); border-radius: 20px;
    padding: 4px 12px; font-size: .65rem; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase; color: var(--g300);
    margin-bottom: 16px;
  }
  .hcm-title {
    font-family: 'Fraunces', serif;
    font-size: 1.5rem; font-weight: 700; margin-bottom: 6px;
  }
  .hcm-sub { font-size: .8rem; color: rgba(255,255,255,.55); margin-bottom: 20px; }
  .hcm-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .hcm-stat {
    background: rgba(255,255,255,.08); border-radius: 12px;
    padding: 12px; text-align: center;
  }
  .hcm-val { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700; }
  .hcm-label { font-size: .62rem; color: rgba(255,255,255,.45); margin-top: 2px; text-transform: uppercase; letter-spacing: .08em; }

  .hero-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .mini-card {
    background: #fff;
    border: 1.5px solid #e8f0ec;
    border-radius: 16px; padding: 18px;
    box-shadow: 0 4px 20px rgba(42,92,63,.06);
    animation: slideUp .7s ease both;
  }
  .mini-card:nth-child(1) { animation-delay: .1s; }
  .mini-card:nth-child(2) { animation-delay: .2s; }

  .mc-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; margin-bottom: 10px;
  }
  .mc-title { font-weight: 600; font-size: .88rem; color: var(--g900); margin-bottom: 4px; }
  .mc-desc { font-size: .73rem; color: var(--soft); line-height: 1.5; }
  .mc-badge {
    display: inline-block; margin-top: 8px;
    background: var(--g100); color: var(--g800);
    border-radius: 20px; padding: 2px 10px;
    font-size: .62rem; font-weight: 600;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FEATURES STRIP ── */
  .features {
    background: var(--g900);
    padding: 80px 48px;
    position: relative; overflow: hidden;
  }
  .features::before {
    content: '';
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=70') center/cover;
    opacity: .06;
  }
  .feat-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }
  .feat-head { text-align: center; margin-bottom: 48px; }
  .feat-eyebrow {
    display: inline-block; background: rgba(255,255,255,.08);
    border-radius: 20px; padding: 5px 16px;
    font-size: .68rem; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--g400); margin-bottom: 14px;
  }
  .feat-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 700;
    color: #fff; margin-bottom: 10px;
  }
  .feat-sub { font-size: .9rem; color: rgba(255,255,255,.45); max-width: 460px; margin: 0 auto; }

  .feat-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
  }
  .feat-card {
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px; padding: 24px;
    transition: background .22s, transform .22s;
  }
  .feat-card:hover { background: rgba(255,255,255,.09); transform: translateY(-4px); }
  .feat-ic {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; margin-bottom: 14px;
  }
  .feat-card-title { font-weight: 600; font-size: .92rem; color: #fff; margin-bottom: 8px; }
  .feat-card-desc { font-size: .78rem; color: rgba(255,255,255,.45); line-height: 1.6; }

  /* ── BOTTOM CTA ── */
  .cta-section {
    padding: 100px 48px;
    text-align: center;
    background: var(--cream);
    position: relative; overflow: hidden;
  }
  .cta-section::before {
    content: '';
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(62,148,96,.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
  .cta-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 900;
    color: var(--g950); margin-bottom: 16px; line-height: 1.1;
  }
  .cta-title em { font-style: italic; color: var(--g700); }
  .cta-desc { font-size: .95rem; color: var(--soft); margin-bottom: 36px; line-height: 1.65; }
  .cta-btns { display: flex; gap: 14px; justify-content: center; }

  /* ── FOOTER ── */
  .land-footer {
    background: var(--g950);
    padding: 28px 48px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .foot-brand {
    display: flex; align-items: center; gap: 10px;
  }
  .foot-name {
    font-family: 'Fraunces', serif; font-size: .95rem;
    font-weight: 700; color: #fff;
  }
  .foot-sub { font-size: .6rem; color: rgba(255,255,255,.25); letter-spacing: .1em; text-transform: uppercase; }
  .foot-copy { font-size: .75rem; color: rgba(255,255,255,.25); }
  .foot-links { display: flex; gap: 20px; }
  .foot-link { font-size: .75rem; color: rgba(255,255,255,.35); text-decoration: none; transition: color .16s; }
  .foot-link:hover { color: rgba(255,255,255,.7); }
`;

const FEATURES = [
  {
    icon: "🌱",
    bg: "#1e4a2e",
    title: "Seed Readiness",
    desc: "AI germination scoring — know which tubers are ready before planting.",
  },
  {
    icon: "🔬",
    bg: "#4a1e1e",
    title: "Disease Detection",
    desc: "Upload a leaf photo and get instant diagnosis with treatment plans.",
  },
  {
    icon: "🌍",
    bg: "#1e3a4a",
    title: "Soil Health",
    desc: "Track pH, moisture and nutrients to unlock maximum yield potential.",
  },
  {
    icon: "📊",
    bg: "#3a2e1a",
    title: "Cost Analysis",
    desc: "Forecast ROI, track inputs and get margin optimisation strategies.",
  },
];
export default function Landing() {
  return (
    <>
      <style>{STYLES}</style>
      <div className='land'>
        {/* NAV */}
        <nav className='land-nav'>
          <div className='nav-brand'>
            <div className='nav-mark'>🥔</div>
            <div>
              <div className='nav-name'>SmartPotato</div>
              <div className='nav-sub'>Sri Lanka</div>
            </div>
          </div>
          <div className='nav-links'>
            <Link to='/signin' className='nav-signin'>
              Sign in
            </Link>
            <Link to='/signup' className='nav-signup'>
              Get Started →
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className='hero'>
          <div className='orb orb-1' />
          <div className='orb orb-2' />
          <div className='hero-dots' />

          <div className='hero-left'>
            <div className='hero-eyebrow'>
              <span className='eyebrow-dot' />
              AI-Powered Farm Intelligence
            </div>
            <h1 className='hero-title'>
              Grow smarter,
              <br />
              harvest <em>better</em>
            </h1>
            <p className='hero-desc'>
              Seed readiness predictions, disease detection, soil monitoring and
              cost forecasting — everything a smallholder farmer needs, powered
              by machine learning.
            </p>
            <div className='hero-cta'>
              <Link to='/signin' className='btn-primary'>
                Start Farming Smarter <span className='arr'>→</span>
              </Link>
              <a href='#features' className='btn-secondary'>
                See How It Works
              </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 hover:border-emerald-300 text-gray-700 font-semibold rounded-2xl transition-all hover:shadow-lg"
                >
                  Explore Features ↓
                </a>
              </div>

              {/* Mini badges */}
              <div className="flex flex-wrap gap-2">
                {['TensorFlow', 'Gemini AI', 'OpenCV', 'ESP32-CAM', 'Firebase'].map(t => (
                  <span key={t} className="text-xs font-medium bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200/60">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Preview Cards Stack */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Glow */}
                <div className="absolute -inset-8 bg-gradient-to-br from-emerald-200/40 to-green-100/40 rounded-[2rem] blur-3xl" />

                <div className="relative space-y-4">
                  {/* Card 1: Disease Result */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 ml-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center text-white text-sm">🔬</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Disease Predictor</p>
                        <p className="text-[10px] text-gray-400">AI-powered leaf analysis</p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">Late Blight</span>
                    </div>
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-4 text-white">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">Confidence</span>
                        <span className="font-bold">92%</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {[{ i: '🌿', l: 'N', v: 'High' }, { i: '🌱', l: 'P', v: 'Med' }, { i: '⚡', l: 'K', v: 'High' }].map(n => (
                        <div key={n.l} className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                          <span className="text-sm">{n.i}</span>
                          <p className="text-[10px] font-medium text-gray-400">{n.l}</p>
                          <p className="text-[10px] font-bold text-gray-700">{n.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Seed Readiness */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 mr-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm">🌱</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Seed Readiness</p>
                        <p className="text-[10px] text-gray-400">Tuber quality analysis</p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">✓ Ready</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Readiness', value: '94%', color: 'text-emerald-600' },
                        { label: 'Sprout', value: 'Good', color: 'text-blue-600' },
                        { label: 'Damage', value: 'Low', color: 'text-green-600' },
                        { label: 'Shrivel', value: 'None', color: 'text-gray-600' },
                      ].map(s => (
                        <div key={s.label} className="bg-gray-50 rounded-lg p-2.5 text-center border border-gray-100">
                          <p className="text-[10px] text-gray-400">{s.label}</p>
                          <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Cost Analysis */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 ml-12">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-sm">💰</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Cost & Yield</p>
                        <p className="text-[10px] text-gray-400">Financial prediction</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Yield', value: '2,450 kg', bg: 'bg-blue-50', tc: 'text-blue-700' },
                        { label: 'Revenue', value: 'Rs 367K', bg: 'bg-emerald-50', tc: 'text-emerald-700' },
                        { label: 'Profit', value: 'Rs 198K', bg: 'bg-amber-50', tc: 'text-amber-700' },
                      ].map(m => (
                        <div key={m.label} className={`${m.bg} rounded-lg p-2.5 text-center`}>
                          <p className="text-[10px] text-gray-500">{m.label}</p>
                          <p className={`text-xs font-bold ${m.tc}`}>{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-12 -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <AnimatedStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES / MODULES ═══════════ */}
      <section id="features" className="py-24 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Project Modules
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Four Powerful Modules,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">One Complete Platform</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Each module tackles a different aspect of potato farming — together they give you full control over your crop cycle.
            </p>
          </div>

          {/* Module cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map((m, i) => (
              <div
                key={m.title}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Gradient header stripe */}
                <div className={`h-1.5 bg-gradient-to-r ${m.gradient}`} />

                <div className="p-7">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 bg-${m.color}-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform border border-${m.color}-100`}>
                      {m.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{m.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mt-1">{m.desc}</p>
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {m.details.map((d) => (
                      <div key={d} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`w-1.5 h-1.5 rounded-full bg-${m.color}-400 shrink-0`} />
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to={m.route}
                    className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-${m.color}-600 hover:text-${m.color}-700 transition-colors group/link`}
                  >
                    Explore Module
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              How It Works
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              From Upload to Insight
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">in Four Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative group">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] right-[-40px] h-0.5 bg-gradient-to-r from-emerald-300 to-transparent z-0" />
                )}

                <div className="relative bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform border border-emerald-100">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Step {s.num}</span>
                  <h3 className="text-base font-bold text-gray-900 mt-2 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TECHNOLOGY ═══════════ */}
      <section id="tech" className="py-24 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Technology Stack
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4">
              Built With
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">Industry-Leading Tech</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We combine the best open-source tools and cutting-edge AI to deliver accurate, fast results.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TECH.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{t.icon}</div>
                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DISEASE DETECTION SHOWCASE ═══════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                AI Disease Detection
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6">
                Detect Potato Diseases
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">Before They Spread</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Our CNN model identifies Early Blight and Late Blight with 95%+ accuracy. Combined with Gemini AI, you get personalized fertilizer recommendations, fungicide plans and organic alternatives — all from a single leaf photo.
              </p>

              <div className="space-y-4">
                {[
                  { icon: '📸', title: 'Upload or ESP32-CAM capture', desc: 'Works with smartphone camera or dedicated ESP32-CAM hardware' },
                  { icon: '🧠', title: 'CNN + OpenCV analysis', desc: 'Deep learning classification with visual disease-area mapping' },
                  { icon: '✨', title: 'Gemini AI fertilizer plan', desc: 'Personalized N-P-K ratios, fungicide, organic alternatives and tips' },
                  { icon: '🗺️', title: 'Disease map tracking', desc: 'Pin disease outbreaks on a map to track regional spread' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-lg shrink-0 border border-red-100">{f.icon}</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{f.title}</p>
                      <p className="text-sm text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/app/disease"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5"
              >
                Try Disease Predictor →
              </Link>
            </div>

            {/* Right — Simulated UI */}
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-red-100/30 to-rose-100/30 rounded-[2rem] blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Top bar */}
                <div className="bg-gradient-to-r from-emerald-700 to-green-600 px-5 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Potato Leaf Disease Predictor</p>
                    <p className="text-green-200 text-[10px]">AI-powered analysis</p>
                  </div>
                  <div className="ml-auto flex bg-white/15 rounded-lg p-0.5 text-[10px] font-semibold">
                    <span className="px-3 py-1 bg-white text-emerald-700 rounded-md">🔬 Predictor</span>
                    <span className="px-3 py-1 text-white/70">🗺️ Map</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Simulated result */}
                  <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-xl p-4 text-white mb-4">
                    <p className="text-white/60 text-[10px] uppercase font-semibold">Detected Disease</p>
                    <p className="text-lg font-bold mt-0.5">Late Blight</p>
                    <p className="text-white/70 text-[10px] mt-1">Phytophthora infestans — spreads rapidly in cool, wet conditions.</p>
                    <div className="mt-3 bg-white/20 rounded-full h-1.5">
                      <div className="bg-white h-1.5 rounded-full" style={{ width: '92%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 text-white/70">
                      <span>Confidence</span><span className="text-white font-bold">92%</span>
                    </div>
                  </div>

                  {/* AI badge */}
                  <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                    <span className="text-sm">✨</span>
                    <div>
                      <p className="text-[10px] font-bold text-purple-700">Gemini AI Recommendations Loaded</p>
                      <p className="text-[9px] text-gray-400">N-P-K plan + fungicide + organic tips</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SEED READINESS + COST SHOWCASE ═══════════ */}
      <section className="py-24 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Seed Readiness Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-500" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100">🌱</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Seed Readiness Predictor</h3>
                    <p className="text-sm text-gray-500">Camera-to-decision in seconds</p>
                  </div>
                </div>

                <p className="text-gray-500 mb-6">
                  Capture or upload seed potato images. Our model evaluates sprout length, damage level and shrivel — then tells you exactly whether to plant or wait.
                </p>

                {/* Simulated results */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Readiness', value: 'Ready ✓', bg: 'bg-emerald-50', tc: 'text-emerald-700', bc: 'border-emerald-100' },
                    { label: 'Confidence', value: '94.2%', bg: 'bg-blue-50', tc: 'text-blue-700', bc: 'border-blue-100' },
                    { label: 'Sprout Length', value: 'Optimal', bg: 'bg-green-50', tc: 'text-green-700', bc: 'border-green-100' },
                    { label: 'Damage Level', value: 'Low', bg: 'bg-gray-50', tc: 'text-gray-700', bc: 'border-gray-200' },
                  ].map(r => (
                    <div key={r.label} className={`${r.bg} border ${r.bc} rounded-xl p-3 text-center`}>
                      <p className="text-[10px] text-gray-500 mb-0.5">{r.label}</p>
                      <p className={`text-sm font-bold ${r.tc}`}>{r.value}</p>
                    </div>
                  ))}
                </div>

                <Link to="/app/seed-readiness" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                  Try Seed Readiness →
                </Link>
              </div>
            </div>

            {/* Cost Analysis Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl border border-blue-100">💰</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Cost & Yield Analysis</h3>
                    <p className="text-sm text-gray-500">Plan your season financially</p>
                  </div>
                </div>

                <p className="text-gray-500 mb-6">
                  Enter field size, soil type, seed costs and labour expenses. The system calculates expected yield, revenue and profit — so you can pick the best strategy.
                </p>

                {/* Simulated financials */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 mb-5">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Expected Yield', value: '2,450 kg', icon: '📦' },
                      { label: 'Revenue', value: 'Rs 367,500', icon: '💵' },
                      { label: 'Net Profit', value: 'Rs 198,200', icon: '📈' },
                    ].map(f => (
                      <div key={f.label} className="text-center">
                        <p className="text-lg mb-0.5">{f.icon}</p>
                        <p className="text-[10px] text-gray-500">{f.label}</p>
                        <p className="text-xs font-bold text-gray-900">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/app/cost" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  Try Cost Analysis →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-12 lg:p-16 text-white relative overflow-hidden">
            {/* Deco */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative text-center">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                Ready to Grow Smarter?
              </h2>
              <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
                Join farmers already using AI to improve yields and reduce losses. All four modules are completely free.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  🚀 Create Free Account
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl border border-white/20 transition-all"
                >
                  Already have an account? Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm">🥔</div>
                <span className="font-bold text-white text-lg">Smart Potato</span>
              </div>
              <p className="text-sm leading-relaxed">
                AI-powered farming intelligence platform for smallholder potato farmers.
              </p>
            </div>

            {/* Modules */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Modules</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/app/seed-readiness" className="hover:text-emerald-400 transition-colors">Seed Readiness</Link></li>
                <li><Link to="/app/soil-health" className="hover:text-emerald-400 transition-colors">Soil Health</Link></li>
                <li><Link to="/app/disease" className="hover:text-emerald-400 transition-colors">Disease Predictor</Link></li>
                <li><Link to="/app/cost" className="hover:text-emerald-400 transition-colors">Cost Analysis</Link></li>
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Technology</h4>
              <ul className="space-y-2 text-sm">
                <li>TensorFlow / Keras</li>
                <li>Google Gemini AI</li>
                <li>OpenCV</li>
                <li>React + Vite</li>
                <li>Flask + Python</li>
                <li>Firebase Auth</li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/signin" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-emerald-400 transition-colors">Create Account</Link></li>
              </ul>
            </div>
            <div className='hero-trust'>
              <div className='trust-avatars'>
                {["H", "A", "K", "M"].map((l, i) => (
                  <div
                    key={i}
                    className='trust-av'
                    style={{
                      background: ["#3e9460", "#2b82be", "#d4882b", "#cc4040"][
                        i
                      ],
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className='trust-text'>
                <strong>Trusted by 200+</strong> farmers across Sri Lanka
              </p>
            </div>
          </div>

          <div className='hero-right'>
            <div className='hero-card-main'>
              <div className='hcm-inner'>
                <div className='hcm-pill'>
                  <span className='eyebrow-dot' />
                  Live Dashboard
                </div>
                <div className='hcm-title'>Farm Overview</div>
                <div className='hcm-sub'>
                  Nuwara Eliya · Maha Season 2025/26
                </div>
                <div className='hcm-stats'>
                  <div className='hcm-stat'>
                    <div className='hcm-val'>18°C</div>
                    <div className='hcm-label'>Soil Temp</div>
                  </div>
                  <div className='hcm-stat'>
                    <div className='hcm-val'>62%</div>
                    <div className='hcm-label'>Moisture</div>
                  </div>
                  <div className='hcm-stat'>
                    <div className='hcm-val'>47d</div>
                    <div className='hcm-label'>To Harvest</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='hero-cards-row'>
              <div className='mini-card'>
                <div className='mc-icon' style={{ background: "#e8f8ef" }}>
                  🌱
                </div>
                <div className='mc-title'>Seed Score</div>
                <div className='mc-desc'>
                  Batch #A12 germination rate analysed
                </div>
                <span className='mc-badge'>92% Ready</span>
              </div>
              <div className='mini-card'>
                <div className='mc-icon' style={{ background: "#fef3e0" }}>
                  📊
                </div>
                <div className='mc-title'>Est. Revenue</div>
                <div className='mc-desc'>Based on current yield forecast</div>
                <span
                  className='mc-badge'
                  style={{ background: "#fef3e0", color: "#7a4a08" }}
                >
                  LKR 284K
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className='features' id='features'>
          <div className='feat-inner'>
            <div className='feat-head'>
              <div className='feat-eyebrow'>What We Offer</div>
              <h2 className='feat-title'>Everything your farm needs</h2>
              <p className='feat-sub'>
                Four intelligent modules working together to maximise your yield
                and profit.
              </p>
            </div>
            <div className='feat-grid'>
              {FEATURES.map((f) => (
                <div className='feat-card' key={f.title}>
                  <div className='feat-ic' style={{ background: f.bg }}>
                    {f.icon}
                  </div>
                  <div className='feat-card-title'>{f.title}</div>
                  <div className='feat-card-desc'>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='cta-section'>
          <div className='cta-inner'>
            <h2 className='cta-title'>
              Ready to grow <em>smarter?</em>
            </h2>
            <p className='cta-desc'>
              Join hundreds of Sri Lankan farmers using AI-powered insights to
              increase yield, reduce costs and make better decisions every
              season.
            </p>
            <div className='cta-btns'>
              <Link to='/signup' className='btn-primary'>
                Create Free Account →
              </Link>
              <Link to='/signin' className='btn-secondary'>
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className='land-footer'>
          <div className='foot-brand'>
            <div className='nav-mark'>🥔</div>
            <div>
              <div className='foot-name'>SmartPotato</div>
              <div className='foot-sub'>Sri Lanka</div>
            </div>
          </div>
          <p className='foot-copy'>
            © {new Date().getFullYear()} Smart Potato Farming System · Sri Lanka
          </p>
          <div className='foot-links'>
            <a href='#' className='foot-link'>
              Privacy
            </a>
            <a href='#' className='foot-link'>
              Terms
            </a>
            <a href='#' className='foot-link'>
              Contact
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
