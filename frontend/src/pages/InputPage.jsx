import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
   Styles
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
    --parchment: #f2ead8;
    --straw:     #e3d9c2;
    --soil:      #7a5c3a;
    --ink:       #1e2d1e;
    --ink-mid:   #3b4f3a;
    --ink-lt:    #6b8069;
    --white:     #ffffff;
    --error:     #c0392b;
    --error-bg:  #fdf0ee;
    --shadow-lg: 0 16px 48px rgba(30,45,30,0.13), 0 2px 8px rgba(30,45,30,0.08);
  }

  .ag-page {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse 70% 55% at 8% 0%,   rgba(90,158,86,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 55% 45% at 92% 100%, rgba(122,92,58,0.08) 0%, transparent 55%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 20px;
    font-family: 'Inter', sans-serif;
    position: relative;
  }

  .ag-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(90,158,86,0.10) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none; z-index: 0;
  }

  .ag-header {
    width: 100%; max-width: 720px;
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 22px;
    position: relative; z-index: 1;
    animation: fadeDown .5s ease both;
  }

  .ag-logo {
    width: 46px; height: 46px; border-radius: 13px;
    background: linear-gradient(140deg, #2d5e2a 0%, #5a9e56 100%);
    display: flex; align-items: center; justify-content: center;
    color: #fff; box-shadow: 0 4px 14px rgba(61,122,58,.28); flex-shrink: 0;
  }

  .ag-hdr-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--leaf-mid); margin-bottom: 2px;
  }

  .ag-hdr-title {
    font-family: 'Lora', serif; font-size: 21px; font-weight: 700;
    color: var(--ink); line-height: 1.2; letter-spacing: -.01em;
  }

  .ag-hdr-badge {
    margin-left: auto;
    background: var(--fog); border: 1px solid rgba(61,122,58,.2);
    border-radius: 20px; padding: 5px 14px;
    font-size: 11px; font-weight: 500; color: var(--leaf); white-space: nowrap;
  }

  .ag-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.1);
    border-radius: 20px;
    width: 100%; max-width: 720px;
    position: relative; z-index: 1;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both .05s;
  }

  @keyframes fadeDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px);  } to { opacity:1; transform:translateY(0); } }

  .ag-banner {
    background: linear-gradient(108deg, #253f23 0%, #3d7a3a 50%, #5a9e56 100%);
    padding: 28px 36px 22px;
    position: relative; overflow: hidden;
  }

  .ag-banner::after {
    content: ''; position: absolute; right: -20px; bottom: -36px;
    width: 170px; height: 170px; border-radius: 50%;
    background: rgba(255,255,255,.055);
  }

  .ag-banner-row {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }

  .ag-banner-title {
    font-family: 'Lora', serif; font-size: 26px; font-weight: 700;
    color: #fff; line-height: 1.25; letter-spacing: -.01em; margin-bottom: 6px;
  }

  .ag-banner-sub {
    font-size: 13px; font-weight: 300; color: rgba(255,255,255,.68);
    line-height: 1.55; max-width: 340px;
  }

  .ag-banner-stats { display: flex; gap: 24px; flex-shrink: 0; }

  .ag-stat-num {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700;
    color: var(--sprout); line-height: 1; text-align: right;
  }

  .ag-stat-lbl {
    font-size: 10px; font-weight: 400; color: rgba(255,255,255,.5);
    letter-spacing: .08em; text-transform: uppercase; margin-top: 3px; text-align: right;
  }

  .ag-prog-row {
    display: flex; align-items: center; gap: 12px; margin-top: 18px;
  }

  .ag-prog-track {
    flex: 1; height: 4px; background: rgba(255,255,255,.18);
    border-radius: 99px; overflow: hidden;
  }

  .ag-prog-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sprout), #d8f5d4);
    border-radius: 99px;
    transition: width .45s cubic-bezier(.22,1,.36,1);
  }

  .ag-prog-lbl {
    font-size: 11px; font-weight: 500; color: rgba(255,255,255,.6);
    white-space: nowrap; font-variant-numeric: tabular-nums;
  }

  .ag-body { padding: 32px 36px 36px; }

  .ag-sec-head {
    display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
  }

  .ag-sec-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--fog); border: 1px solid rgba(61,122,58,.16);
    display: flex; align-items: center; justify-content: center;
    color: var(--leaf); flex-shrink: 0;
  }

  .ag-sec-title {
    font-family: 'Lora', serif; font-size: 14px; font-weight: 600;
    color: var(--ink); letter-spacing: .01em;
  }

  .ag-sec-line { flex: 1; height: 1px; background: var(--straw); }

  .ag-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 18px 24px; margin-bottom: 26px;
  }

  .ag-full { grid-column: 1 / -1; }

  .ag-field { display: flex; flex-direction: column; gap: 6px; animation: fieldIn .4s ease both; }
  .ag-field:nth-child(1) { animation-delay:.07s; }
  .ag-field:nth-child(2) { animation-delay:.13s; }
  .ag-field:nth-child(3) { animation-delay:.19s; }
  .ag-field:nth-child(4) { animation-delay:.25s; }
  .ag-field:nth-child(5) { animation-delay:.31s; }
  .ag-field:nth-child(6) { animation-delay:.37s; }

  @keyframes fieldIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  .ag-label {
    font-size: 11px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: var(--ink-lt);
    display: flex; align-items: center; gap: 5px;
  }

  .ag-lbl-icon { color: var(--leaf-mid); opacity: .8; }
  .ag-req { color: var(--leaf-mid); font-size: 13px; margin-left: 1px; }

  .ag-wrap { position: relative; }

  .ag-input, .ag-select {
    width: 100%; background: var(--cream);
    border: 1.5px solid var(--straw); border-radius: 8px;
    padding: 11px 14px;
    font-family: 'Inter', sans-serif; font-size: 14px; color: var(--ink);
    outline: none; transition: all .18s ease;
    appearance: none; -webkit-appearance: none;
  }

  .ag-input::placeholder { color: rgba(107,128,105,.38); }

  .ag-input:hover, .ag-select:hover {
    border-color: rgba(90,158,86,.45); background: #fafdf8;
  }

  .ag-input:focus, .ag-select:focus {
    border-color: var(--leaf-mid); background: #f6fcf5;
    box-shadow: 0 0 0 3px rgba(90,158,86,.11);
  }

  .ag-input.ok, .ag-select.ok { border-color: rgba(61,122,58,.3); background: #f7fdf6; }

  .ag-input.err, .ag-select.err {
    border-color: rgba(192,57,43,.45); background: var(--error-bg);
    box-shadow: 0 0 0 3px rgba(192,57,43,.07);
  }

  .ag-sel-wrap::after {
    content: ''; position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%);
    border-left: 4.5px solid transparent; border-right: 4.5px solid transparent;
    border-top: 5.5px solid var(--leaf-mid); pointer-events: none;
  }

  .ag-select { padding-right: 34px; cursor: pointer; }

  .ag-pfx {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 12px; font-weight: 500; color: var(--ink-lt); pointer-events: none;
  }

  .ag-has-pfx { padding-left: 44px; }

  .ag-hint { font-size: 11px; color: var(--ink-lt); opacity: .6; margin-top: -2px; }

  .ag-error {
    font-size: 11.5px; color: var(--error); font-weight: 500;
    display: flex; align-items: center; gap: 4px;
    animation: errIn .2s ease;
  }

  @keyframes errIn { from { opacity:0; transform:translateX(-4px); } to { opacity:1; transform:translateX(0); } }

  .ag-chips { display: flex; gap: 8px; }

  .ag-chip {
    flex: 1; padding: 10px 6px;
    background: var(--cream); border: 1.5px solid var(--straw);
    border-radius: 8px; cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 13px;
    font-weight: 500; color: var(--ink-lt);
    text-align: center; transition: all .15s ease;
  }

  .ag-chip:hover { border-color: var(--leaf-mid); color: var(--leaf); background: #f3faf2; }

  .ag-chip.sel { font-weight: 600; box-shadow: 0 0 0 3px rgba(90,158,86,.12); }

  .ag-chip.sel.cl { border-color: #c0392b; background: #fef7f6; color: #c0392b; box-shadow: 0 0 0 3px rgba(192,57,43,.08); }
  .ag-chip.sel.cm { border-color: #d48806; background: #fffbf0; color: #d48806; box-shadow: 0 0 0 3px rgba(212,136,6,.08); }
  .ag-chip.sel.ch { border-color: var(--leaf); background: var(--fog); color: var(--leaf); }

  .ag-chip-sub { font-size: 10px; font-weight: 400; opacity: .6; margin-top: 2px; }

  .ag-hr { border: none; border-top: 1px solid var(--straw); margin: 4px 0 24px; }

  .ag-submit-row { display: flex; align-items: center; gap: 16px; }

  .ag-btn {
    flex: 1;
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    border: none; border-radius: 11px;
    padding: 15px 32px;
    font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
    color: #fff; letter-spacing: .05em; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    position: relative; overflow: hidden;
    transition: all .22s ease;
    box-shadow: 0 4px 18px rgba(61,122,58,.3), 0 1px 0 rgba(255,255,255,.1) inset;
  }

  .ag-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,.08) 0%, transparent 100%);
  }

  .ag-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(61,122,58,.36), 0 1px 0 rgba(255,255,255,.1) inset;
    filter: brightness(1.06);
  }

  .ag-btn:active:not(:disabled) { transform: translateY(0); }
  .ag-btn:disabled { opacity: .68; cursor: not-allowed; }

  .ag-spin {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spin .65s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .ag-submit-note {
    font-size: 11px; color: var(--ink-lt); opacity: .55;
    line-height: 1.55; text-align: right; max-width: 130px;
  }

  .ag-success {
    display: flex; flex-direction: column; align-items: center;
    padding: 52px 36px; gap: 14px;
    animation: fadeUp .45s ease both;
  }

  .ag-success-ring {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--fog); border: 2px solid rgba(61,122,58,.22);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
    animation: popIn .4s cubic-bezier(.22,1,.36,1) both .1s;
  }

  @keyframes popIn { from { transform:scale(.6); opacity:0; } to { transform:scale(1); opacity:1; } }

  .ag-success-title {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700; color: var(--ink);
  }

  .ag-success-text {
    font-size: 13.5px; color: var(--ink-lt);
    text-align: center; max-width: 320px; line-height: 1.65;
  }

  .ag-success-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 4px; }

  .ag-success-tag {
    background: var(--fog); border: 1px solid rgba(61,122,58,.18);
    border-radius: 20px; padding: 5px 14px;
    font-size: 12px; font-weight: 500; color: var(--leaf);
  }

  .ag-reset {
    margin-top: 6px; padding: 11px 28px;
    background: transparent; border: 1.5px solid rgba(61,122,58,.25);
    border-radius: 8px; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 500; color: var(--leaf);
    cursor: pointer; transition: all .18s ease; letter-spacing: .03em;
  }

  .ag-reset:hover { background: var(--fog); border-color: var(--leaf-mid); }

  .ag-footer {
    width: 100%; max-width: 720px;
    display: flex; align-items: center; justify-content: center; gap: 18px;
    margin-top: 18px; position: relative; z-index: 1;
    animation: fadeUp .6s ease both .2s;
  }

  .ag-fitem {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--ink-lt); opacity: .45; letter-spacing: .04em;
  }

  .ag-fdot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink-lt); opacity: .3; }

  @media (max-width: 580px) {
    .ag-banner, .ag-body { padding-left: 22px; padding-right: 22px; }
    .ag-banner-stats { display: none; }
    .ag-grid { grid-template-columns: 1fr; }
    .ag-full { grid-column: 1; }
    .ag-submit-row { flex-direction: column; }
    .ag-submit-note { text-align: center; max-width: 100%; }
    .ag-banner-title { font-size: 21px; }
    .ag-hdr-badge { display: none; }
    .ag-chips { flex-direction: column; }
  }
`;

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const InputPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    season: "",
    district: "",
    field_size_acres: "",
    soil_type: "",
    crop_quality: "",
    hands_on_money_lkr: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const completed = Object.values(formData).filter(Boolean).length;
  const total = Object.keys(formData).length;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const setChip = (name, value) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.season) e.season = "Please select a growing season";
    if (!formData.district) e.district = "Please select a district";
    if (!formData.field_size_acres || +formData.field_size_acres <= 0)
      e.field_size_acres = "Enter a valid field size";
    if (!formData.soil_type) e.soil_type = "Please select a soil type";
    if (!formData.crop_quality)
      e.crop_quality = "Please select a quality grade";
    if (!formData.hands_on_money_lkr || +formData.hands_on_money_lkr <= 0)
      e.hands_on_money_lkr = "Enter a valid budget amount";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        ...formData,
        field_size_acres: parseFloat(formData.field_size_acres),
        hands_on_money_lkr: parseFloat(formData.hands_on_money_lkr),
      };
      const { data } = await axios.post(
        "http://127.0.0.1:5000/potato_analyze",
        payload,
      );
      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem("lastForm", JSON.stringify(payload));
      setSubmitted(true);
      setTimeout(() => navigate("/app/cost/results"), 900);
    } catch {
      alert("Prediction failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setFormData({
      season: "",
      district: "",
      field_size_acres: "",
      soil_type: "",
      crop_quality: "",
      hands_on_money_lkr: "",
    });
    setErrors({});
  };

  return (
    <>
      <style>{CSS}</style>
      <div className='ag-page'>
        <header className='ag-header'>
          <div className='ag-logo'>
            <LeafIcon />
          </div>
          <div>
            <div className='ag-hdr-eyebrow'>AgriIntelligence · Sri Lanka</div>
            <div className='ag-hdr-title'>Potato Yield Predictor</div>
          </div>
          <div className='ag-hdr-badge'>🌱 ML-Powered</div>
        </header>

        <div className='ag-card'>
          <div className='ag-banner'>
            <div className='ag-banner-row'>
              <div>
                <div className='ag-banner-title'>
                  Smart Farming
                  <br />
                  Prediction System
                </div>
                <div className='ag-banner-sub'>
                  Enter your agronomic parameters to generate an AI-driven yield
                  &amp; cost forecast for your potato crop.
                </div>
              </div>
              <div className='ag-banner-stats'>
                <div>
                  <div className='ag-stat-num'>94%</div>
                  <div className='ag-stat-lbl'>Accuracy</div>
                </div>
                <div>
                  <div className='ag-stat-num'>12K+</div>
                  <div className='ag-stat-lbl'>Samples</div>
                </div>
              </div>
            </div>
            <div className='ag-prog-row'>
              <div className='ag-prog-track'>
                <div
                  className='ag-prog-fill'
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </div>
              <span className='ag-prog-lbl'>
                {completed}/{total} fields complete
              </span>
            </div>
          </div>

          {submitted ? (
            <div className='ag-success'>
              <div className='ag-success-ring'>🌾</div>
              <div className='ag-success-title'>Prediction Generated</div>
              <div className='ag-success-text'>
                Your farm parameters have been analyzed. Redirecting to results…
              </div>
              <div className='ag-success-tags'>
                <span className='ag-success-tag'>📍 {formData.district}</span>
                <span className='ag-success-tag'>🌿 {formData.season}</span>
                <span className='ag-success-tag'>
                  📐 {formData.field_size_acres} ac
                </span>
              </div>
              <button className='ag-reset' onClick={reset}>
                ← New Prediction
              </button>
            </div>
          ) : (
            <div className='ag-body'>
              <div className='ag-sec-head'>
                <div className='ag-sec-icon'>
                  <Icon
                    d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
                    size={14}
                  />
                </div>
                <span className='ag-sec-title'>Farm Profile</span>
                <div className='ag-sec-line' />
              </div>

              <form onSubmit={onSubmit} noValidate>
                <div className='ag-grid'>
                  {/* Season */}
                  <div className='ag-field'>
                    <label className='ag-label'>
                      <span className='ag-lbl-icon'>
                        <Icon
                          d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'
                          size={13}
                        />
                      </span>
                      Growing Season <span className='ag-req'>*</span>
                    </label>
                    <div className='ag-wrap ag-sel-wrap'>
                      <select
                        name='season'
                        value={formData.season}
                        onChange={onChange}
                        className={`ag-select ${formData.season ? "ok" : ""} ${errors.season ? "err" : ""}`}
                      >
                        <option value=''>Select season…</option>
                        <option value='Yala'>Yala (May – Sep)</option>
                        <option value='Maha'>Maha (Oct – Apr)</option>
                      </select>
                    </div>
                    {errors.season && (
                      <span className='ag-error'>⚠ {errors.season}</span>
                    )}
                  </div>

                  {/* District */}
                  <div className='ag-field'>
                    <label className='ag-label'>
                      <span className='ag-lbl-icon'>
                        <Icon
                          d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'
                          size={13}
                        />
                      </span>
                      District <span className='ag-req'>*</span>
                    </label>

                    <div className='ag-wrap ag-sel-wrap'>
                      <select
                        name='district'
                        value={formData.district}
                        onChange={onChange}
                        className={`ag-select ${formData.district ? "ok" : ""} ${errors.district ? "err" : ""}`}
                      >
                        <option value=''>Select District…</option>
                        <option value='Badulla'>Badulla</option>
                        <option value='Nuwara_Eliya'>Nuwara Eliya</option>
                      </select>
                    </div>

                    {errors.district && (
                      <span className='ag-error'>⚠ {errors.district}</span>
                    )}
                  </div>

                  {/* Field Size */}
                  <div className='ag-field'>
                    <label className='ag-label'>
                      <span className='ag-lbl-icon'>
                        <Icon
                          d={[
                            "M3 3h7v7H3z",
                            "M14 3h7v7h-7z",
                            "M14 14h7v7h-7z",
                            "M3 14h7v7H3z",
                          ]}
                          size={13}
                        />
                      </span>
                      Field Size <span className='ag-req'>*</span>
                    </label>
                    <div className='ag-wrap'>
                      <input
                        type='number'
                        step='0.1'
                        min='0.1'
                        name='field_size_acres'
                        value={formData.field_size_acres}
                        onChange={onChange}
                        placeholder='e.g. 2.5'
                        className={`ag-input ${formData.field_size_acres ? "ok" : ""} ${errors.field_size_acres ? "err" : ""}`}
                      />
                    </div>
                    <span className='ag-hint'>Measured in acres</span>
                    {errors.field_size_acres && (
                      <span className='ag-error'>
                        ⚠ {errors.field_size_acres}
                      </span>
                    )}
                  </div>

                  {/* Soil Type */}
                  <div className='ag-field'>
                    <label className='ag-label'>
                      <span className='ag-lbl-icon'>
                        <Icon
                          d='M12 22V12M12 12C12 7 7 4 3 6M12 12C12 7 17 4 21 6M5 20c2-2 4-3 7-3s5 1 7 3'
                          size={13}
                        />
                      </span>
                      Soil Type <span className='ag-req'>*</span>
                    </label>
                    <div className='ag-wrap ag-sel-wrap'>
                      <select
                        name='soil_type'
                        value={formData.soil_type}
                        onChange={onChange}
                        className={`ag-select ${formData.soil_type ? "ok" : ""} ${errors.soil_type ? "err" : ""}`}
                      >
                        <option value=''>Select soil type…</option>
                        <option value='Clay_Loam'>
                          Clay Loam — water-retentive
                        </option>
                        <option value='Sandy_Loam'>
                          Sandy — well-draining
                        </option>
                        <option value='Loamy'>Loamy — nutrient-rich</option>
                      </select>
                    </div>
                    {errors.soil_type && (
                      <span className='ag-error'>⚠ {errors.soil_type}</span>
                    )}
                  </div>
                </div>

                <div className='ag-sec-head'>
                  <div className='ag-sec-icon'>
                    <Icon
                      d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
                      size={14}
                    />
                  </div>
                  <span className='ag-sec-title'>Quality &amp; Finance</span>
                  <div className='ag-sec-line' />
                </div>

                <div className='ag-grid'>
                  <div className='ag-field ag-full'>
                    <label className='ag-label'>
                      <span className='ag-lbl-icon'>
                        <Icon
                          d='M22 11.08V12a10 10 0 1 1-5.93-9.14'
                          size={13}
                        />
                      </span>
                      Crop Quality Grade <span className='ag-req'>*</span>
                    </label>
                    <div className='ag-chips'>
                      {[
                        { v: "Low", cls: "cl", desc: "Below average" },
                        { v: "Medium", cls: "cm", desc: "Average grade" },
                        { v: "High", cls: "ch", desc: "Premium quality" },
                      ].map((q) => (
                        <button
                          key={q.v}
                          type='button'
                          className={`ag-chip ${q.cls} ${formData.crop_quality === q.v ? `sel ${q.cls}` : ""}`}
                          onClick={() => setChip("crop_quality", q.v)}
                        >
                          {formData.crop_quality === q.v ? `✓ ${q.v}` : q.v}
                          <div className='ag-chip-sub'>{q.desc}</div>
                        </button>
                      ))}
                    </div>
                    {errors.crop_quality && (
                      <span className='ag-error'>⚠ {errors.crop_quality}</span>
                    )}
                  </div>

                  <div className='ag-field ag-full'>
                    <label className='ag-label'>
                      <span className='ag-lbl-icon'>
                        <Icon
                          d={[
                            "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z",
                            "M2 11h20",
                          ]}
                          size={13}
                        />
                      </span>
                      Hands-on Budget <span className='ag-req'>*</span>
                    </label>
                    <div className='ag-wrap'>
                      <span className='ag-pfx'>LKR</span>
                      <input
                        type='number'
                        name='hands_on_money_lkr'
                        value={formData.hands_on_money_lkr}
                        onChange={onChange}
                        placeholder='0.00'
                        className={`ag-input ag-has-pfx ${formData.hands_on_money_lkr ? "ok" : ""} ${errors.hands_on_money_lkr ? "err" : ""}`}
                      />
                    </div>
                    <span className='ag-hint'>
                      Total available budget for this cultivation cycle
                    </span>
                    {errors.hands_on_money_lkr && (
                      <span className='ag-error'>
                        ⚠ {errors.hands_on_money_lkr}
                      </span>
                    )}
                  </div>
                </div>

                <hr className='ag-hr' />

                <div className='ag-submit-row'>
                  <button type='submit' disabled={loading} className='ag-btn'>
                    {loading ? (
                      <>
                        <span className='ag-spin' /> Analyzing parameters…
                      </>
                    ) : (
                      <>
                        <Icon
                          d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'
                          size={15}
                          stroke='#fff'
                          sw={2}
                        />
                        Generate Prediction
                      </>
                    )}
                  </button>
                  <div className='ag-submit-note'>
                    Processed by ML model
                    <br />
                    Results in seconds
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        <footer className='ag-footer'>
          <span className='ag-fitem'>🌍 Sri Lanka Agri Data</span>
          <span className='ag-fdot' />
          <span className='ag-fitem'>🔒 Secure Processing</span>
          <span className='ag-fdot' />
          <span className='ag-fitem'>📊 ML-Powered Insights</span>
        </footer>
      </div>
    </>
  );
};

export default InputPage;
