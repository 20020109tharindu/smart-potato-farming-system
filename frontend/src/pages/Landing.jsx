import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* ── Feature modules ── */
const MODULES = [
  {
    icon: '🌱',
    title: 'Seed Readiness Predictor',
    desc: 'Upload or capture a seed potato image — our AI instantly grades sprout length, damage level, shrivel level and tells you if it\'s ready for planting with a confidence score.',
    details: ['Sprout length classification', 'Damage & shrivel detection', 'Ready / Not-ready decision', 'Quality breakdown chart'],
    color: 'emerald',
    gradient: 'from-emerald-500 to-green-600',
    route: '/app/seed-readiness',
  },
  {
    icon: '🧪',
    title: 'Soil Health Monitor',
    desc: 'Track soil pH, nitrogen, phosphorus, potassium and micro-nutrients over time. Get personalised improvement recommendations for your plot.',
    details: ['N-P-K level tracking', 'pH analysis', 'Nutrient trend graphs', 'Improvement suggestions'],
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    route: '/app/soil-health',
  },
  {
    icon: '🔬',
    title: 'Disease Predictor',
    desc: 'Snap a potato leaf photo and get instant Early Blight / Late Blight / Healthy classification powered by a CNN model — plus Gemini AI fertilizer plans.',
    details: ['Early Blight & Late Blight detection', 'OpenCV disease-area visualization', 'Gemini AI fertilizer plan', 'ESP32-CAM live integration'],
    color: 'rose',
    gradient: 'from-red-500 to-rose-500',
    route: '/app/disease',
  },
  {
    icon: '💰',
    title: 'Cost & Yield Analysis',
    desc: 'Enter your field data, seed costs, labour and fertilizer expenses — the system predicts expected yield, revenue and net profit so you can plan better.',
    details: ['Season & district selection', 'Field size & soil type inputs', 'Yield & revenue prediction', 'Strategy comparison cards'],
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-500',
    route: '/app/cost',
  },
]

/* ── How it works steps ── */
const STEPS = [
  { num: '01', title: 'Sign Up Free', desc: 'Create your account in seconds with email — no credit card needed.', icon: '👤' },
  { num: '02', title: 'Upload or Capture', desc: 'Take a photo of your seed / leaf or enter field data into the forms.', icon: '📸' },
  { num: '03', title: 'AI Analyzes', desc: 'Our TensorFlow + Gemini AI models process your data in real-time.', icon: '🧠' },
  { num: '04', title: 'Get Results', desc: 'Receive disease diagnosis, seed grading, soil tips and cost predictions instantly.', icon: '📊' },
]

/* ── Tech stack ── */
const TECH = [
  { name: 'TensorFlow', icon: '🤖', desc: 'Deep learning models' },
  { name: 'Gemini AI', icon: '✨', desc: 'Personalized recommendations' },
  { name: 'OpenCV', icon: '👁️', desc: 'Disease area visualization' },
  { name: 'React', icon: '⚛️', desc: 'Modern frontend' },
  { name: 'Flask', icon: '🐍', desc: 'Python REST API' },
  { name: 'Firebase', icon: '🔥', desc: 'Auth & security' },
]

/* ── Stats ── */
const STATS = [
  { value: '4', label: 'Smart Modules', suffix: '' },
  { value: '95', label: 'Model Accuracy', suffix: '%' },
  { value: '3', label: 'Disease Classes', suffix: '+' },
  { value: '0', label: 'Cost to Start', suffix: 'LKR' },
]

/* ── Animated counter ── */
function AnimatedStat({ value, suffix, label }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const num = parseInt(value)
    if (isNaN(num) || num === 0) { setCount(value); return }
    let start = 0
    const step = Math.max(1, Math.floor(num / 30))
    const timer = setInterval(() => {
      start += step
      if (start >= num) { setCount(num); clearInterval(timer) }
      else setCount(start)
    }, 40)
    return () => clearInterval(timer)
  }, [value])
  return (
    <div className="text-center">
      <p className="text-3xl lg:text-4xl font-extrabold text-white">
        {count}{suffix}
      </p>
      <p className="text-emerald-200 text-sm mt-1">{label}</p>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col scroll-smooth">

      {/* ═══════════ NAVBAR ═══════════ */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-emerald-200">🥔</div>
            <div className="leading-tight">
              <span className="text-lg font-bold text-gray-900 block">Smart Potato</span>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Farming System</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#tech" className="hover:text-emerald-600 transition-colors">Technology</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/signin" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors px-4 py-2 hidden sm:block">
              Sign in
            </Link>
            <Link to="/signup" className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition-all hover:shadow-lg hover:-translate-y-0.5">
              Get Started — Free
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50/50" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-emerald-100/30 to-transparent rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-100/20 to-transparent rounded-full translate-y-1/3 -translate-x-1/4" />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                AI-Powered Smart Farming Platform
              </div>

              <h1 className="text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                The Complete
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">
                  Potato Farming
                </span>
                <br />
                Intelligence Suite
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                From <strong className="text-gray-700">seed selection</strong> to <strong className="text-gray-700">disease diagnosis</strong>, from <strong className="text-gray-700">soil monitoring</strong> to <strong className="text-gray-700">cost forecasting</strong> — everything a potato farmer needs, powered by AI.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-xl shadow-emerald-200/60 transition-all hover:shadow-2xl hover:-translate-y-0.5"
                >
                  🚀 Start Free Account
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
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
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© {new Date().getFullYear()} Smart Potato Farming System. All rights reserved.</p>
            <p className="text-sm">Built with ❤️ for farmers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
