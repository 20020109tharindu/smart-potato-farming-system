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
  .nav-mark {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--g800);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
  }
  .nav-name {
    font-family: 'Fraunces', serif;
    font-size: 1.1rem; font-weight: 700; color: var(--g900);
    line-height: 1;
  }
  .nav-sub { font-size: .6rem; color: var(--soft); letter-spacing: .12em; text-transform: uppercase; }
  .nav-links { display: flex; align-items: center; gap: 8px; }
  .nav-signin {
    padding: 8px 20px; border-radius: 30px;
    color: var(--g800); font-size: .85rem; font-weight: 500;
    text-decoration: none;
    transition: background .18s;
  }
  .nav-signin:hover { background: var(--g100); }
  .nav-signup {
    padding: 8px 20px; border-radius: 30px;
    background: var(--g800); color: #fff;
    font-size: .85rem; font-weight: 600;
    text-decoration: none;
    transition: background .18s, transform .15s;
    box-shadow: 0 2px 12px rgba(42,92,63,.25);
  }
  .nav-signup:hover { background: var(--g900); transform: translateY(-1px); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 120px 48px 80px;
    gap: 60px;
    position: relative;
    overflow: hidden;
  }

  /* Background texture */
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 60% 40%, rgba(62,148,96,.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 10% 80%, rgba(212,136,43,.06) 0%, transparent 60%);
    pointer-events: none;
  }

  /* Floating orbs */
  .orb {
    position: absolute; border-radius: 50%;
    pointer-events: none; filter: blur(60px);
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(62,148,96,.12) 0%, transparent 70%);
    top: -100px; right: -100px;
    animation: drift 12s ease-in-out infinite;
  }
  .orb-2 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(212,136,43,.09) 0%, transparent 70%);
    bottom: 80px; left: 100px;
    animation: drift 16s ease-in-out infinite reverse;
  }
  @keyframes drift {
    0%,100% { transform: translate(0,0); }
    33% { transform: translate(20px,-30px); }
    66% { transform: translate(-15px,20px); }
  }

  /* Dot grid pattern */
  .hero-dots {
    position: absolute; inset: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(42,92,63,.12) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse 60% 60% at 70% 50%, black 0%, transparent 70%);
  }

  .hero-left { position: relative; z-index: 1; }

  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--g100); border: 1px solid var(--g200);
    border-radius: 30px; padding: 6px 14px;
    font-size: .7rem; font-weight: 600; letter-spacing: .12em;
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
