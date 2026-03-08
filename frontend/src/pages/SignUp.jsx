import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle,
  Shield,
} from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─────────────────────────────────────────────
   Inline CSS — matches AgriIntelligence system
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

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
    --red:       #c0392b;
    --red-bg:    #fdf0ee;
    --shadow-sm: 0 1px 3px rgba(30,45,30,0.08);
    --shadow-md: 0 4px 16px rgba(30,45,30,0.10);
    --shadow-lg: 0 20px 60px rgba(30,45,30,0.14), 0 2px 8px rgba(30,45,30,0.08);
  }

  .su-page {
    min-height: 100vh;
    background: var(--cream);
    background-image:
      radial-gradient(ellipse 80% 60% at 10% 0%,   rgba(90,158,86,0.12) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 90% 100%, rgba(122,92,58,0.09) 0%, transparent 55%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .su-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(90,158,86,0.09) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none; z-index: 0;
  }

  .su-page::after {
    content: '🌱';
    position: fixed;
    bottom: -50px; right: -30px;
    font-size: 300px;
    opacity: 0.04;
    pointer-events: none; z-index: 0;
    transform: rotate(-15deg);
    filter: grayscale(1);
  }

  .su-wrap {
    width: 100%; max-width: 460px;
    position: relative; z-index: 1;
    animation: su-rise 0.6s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes su-rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Brand header ── */
  .su-brand {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 32px;
    animation: su-fade 0.5s ease both;
  }

  @keyframes su-fade {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .su-logo {
    width: 52px; height: 52px; border-radius: 15px; flex-shrink: 0;
    background: linear-gradient(140deg, #253f23 0%, #5a9e56 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 6px 20px rgba(61,122,58,.3), 0 1px 0 rgba(255,255,255,.1) inset;
  }

  .su-brand-name {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700;
    color: var(--ink); letter-spacing: -0.01em; line-height: 1.2;
  }

  .su-brand-tagline {
    font-size: 11px; font-weight: 400; color: var(--ink-lt);
    letter-spacing: 0.06em; text-transform: uppercase; margin-top: 2px;
  }

  /* ── Card ── */
  .su-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.12);
    border-radius: 24px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  .su-card-banner {
    background: linear-gradient(108deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    padding: 28px 32px 24px;
    position: relative; overflow: hidden;
  }

  .su-card-banner::after {
    content: ''; position: absolute;
    right: -24px; bottom: -40px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(255,255,255,.055); pointer-events: none;
  }

  .su-card-banner::before {
    content: ''; position: absolute;
    right: 60px; top: -30px;
    width: 90px; height: 90px; border-radius: 50%;
    background: rgba(255,255,255,.04); pointer-events: none;
  }

  .su-banner-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--sprout); margin-bottom: 6px;
    position: relative; z-index: 1;
  }

  .su-banner-title {
    font-family: 'Lora', serif; font-size: 24px; font-weight: 700;
    color: #fff; letter-spacing: -.01em; line-height: 1.2;
    position: relative; z-index: 1;
  }

  .su-banner-sub {
    font-size: 13px; color: rgba(255,255,255,.6); margin-top: 5px;
    font-weight: 300; position: relative; z-index: 1;
  }

  /* Banner feature pills */
  .su-banner-pills {
    display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }

  .su-banner-pill {
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
    border-radius: 20px; padding: 4px 12px;
    font-size: 11px; font-weight: 500; color: rgba(255,255,255,.82);
    display: flex; align-items: center; gap: 5px;
  }

  /* Card body */
  .su-card-body { padding: 30px 32px 32px; }

  /* ── Alerts ── */
  .su-alert-err {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--red-bg); border: 1.5px solid rgba(192,57,43,.2);
    border-radius: 12px; padding: 14px 16px;
    margin-bottom: 22px;
    font-size: 13px; color: var(--red); font-weight: 500;
    animation: su-shake 0.4s ease;
  }

  .su-alert-ok {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--fog); border: 1.5px solid rgba(61,122,58,.25);
    border-radius: 12px; padding: 14px 16px;
    margin-bottom: 22px;
    font-size: 13px; color: var(--leaf); font-weight: 500;
    animation: su-fade 0.3s ease;
  }

  @keyframes su-shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-5px); }
    75%       { transform: translateX(5px); }
  }

  /* ── Field ── */
  .su-field { margin-bottom: 18px; }

  .su-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--ink-lt); margin-bottom: 8px;
  }

  .su-input-wrap { position: relative; }

  .su-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--ink-lt); pointer-events: none;
    display: flex; align-items: center;
  }

  .su-input {
    width: 100%; background: var(--cream);
    border: 1.5px solid var(--straw); border-radius: 10px;
    padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    outline: none; transition: all .18s ease;
    appearance: none;
  }

  .su-input::placeholder { color: rgba(107,128,105,.38); }

  .su-input:hover {
    border-color: rgba(90,158,86,.4); background: #fafdf8;
  }

  .su-input:focus {
    border-color: var(--leaf-mid); background: #f6fcf5;
    box-shadow: 0 0 0 3px rgba(90,158,86,.11);
  }

  .su-input.ok {
    border-color: rgba(61,122,58,.3); background: #f7fdf6;
    padding-right: 42px;
  }

  .su-input.err {
    border-color: rgba(192,57,43,.4); background: var(--red-bg);
    box-shadow: 0 0 0 3px rgba(192,57,43,.07);
  }

  .su-input-pr { padding-right: 42px; }

  .su-eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ink-lt); padding: 4px;
    transition: color .15s; line-height: 0;
  }

  .su-eye-btn:hover { color: var(--leaf); }

  .su-check-icon {
    position: absolute; right: 40px; top: 50%; transform: translateY(-50%);
    color: var(--leaf-mid); line-height: 0;
  }

  .su-check-icon.no-eye { right: 13px; }

  .su-field-error {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; color: var(--red); font-weight: 500;
    margin-top: 6px;
    animation: su-err-in .2s ease;
  }

  @keyframes su-err-in {
    from { opacity:0; transform:translateX(-4px); }
    to   { opacity:1; transform:translateX(0); }
  }

  /* ── Password strength ── */
  .su-strength { margin-top: 8px; }

  .su-strength-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 6px;
  }

  .su-strength-lbl { font-size: 11px; color: var(--ink-lt); }

  .su-strength-val {
    font-size: 11px; font-weight: 600;
  }

  .su-strength-val.weak   { color: var(--red); }
  .su-strength-val.good   { color: #d48806; }
  .su-strength-val.strong { color: var(--leaf); }

  .su-strength-track {
    height: 5px; background: var(--straw);
    border-radius: 99px; overflow: hidden;
  }

  .su-strength-fill {
    height: 100%; border-radius: 99px;
    transition: width .5s cubic-bezier(.22,1,.36,1), background .4s ease;
  }

  /* ── Submit button ── */
  .su-btn {
    width: 100%;
    background: linear-gradient(130deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    border: none; border-radius: 12px;
    padding: 15px 24px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    color: #fff; letter-spacing: .05em; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    position: relative; overflow: hidden;
    transition: all .22s ease;
    box-shadow: 0 4px 18px rgba(61,122,58,.3), 0 1px 0 rgba(255,255,255,.1) inset;
    margin-top: 4px; margin-bottom: 22px;
  }

  .su-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,.08) 0%, transparent 100%);
  }

  .su-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(61,122,58,.36);
    filter: brightness(1.06);
  }

  .su-btn:active:not(:disabled) { transform: translateY(0); }
  .su-btn:disabled { opacity: .65; cursor: not-allowed; }

  .su-spin {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spin .65s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .su-divider {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 20px;
  }

  .su-divider-line { flex: 1; height: 1px; background: var(--straw); }

  .su-divider-txt {
    font-size: 11px; color: var(--ink-lt); white-space: nowrap;
    letter-spacing: .04em;
  }

  /* ── Sign in link ── */
  .su-signin-btn {
    display: block; width: 100%;
    padding: 14px 24px; text-align: center;
    background: transparent; border: 1.5px solid rgba(61,122,58,.28);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: var(--leaf); cursor: pointer; text-decoration: none;
    transition: all .18s ease;
    margin-bottom: 20px;
  }

  .su-signin-btn:hover {
    background: var(--fog); border-color: var(--leaf-mid);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  /* ── Security note ── */
  .su-security {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    font-size: 11.5px; color: var(--ink-lt); opacity: .65;
    padding-top: 4px;
  }

  /* ── Footer ── */
  .su-footer {
    margin-top: 24px; text-align: center;
    font-size: 11px; color: var(--ink-lt); opacity: .55;
    line-height: 1.7;
  }

  .su-footer button {
    background: none; border: none; cursor: pointer;
    color: var(--leaf); font-size: 11px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    padding: 0; text-decoration: none;
  }

  .su-footer button:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .su-card-banner, .su-card-body { padding-left: 22px; padding-right: 22px; }
    .su-banner-title { font-size: 20px; }
    .su-banner-pills { display: none; }
  }
`;

const LeafIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 24 24'
    fill='none'
    stroke='white'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z' />
    <path d='M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12' />
  </svg>
);

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!emailRegex.test(email)) e.email = "Enter a valid email address";
    if (!password || password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });
    validate();
  }

  function getPasswordStrength() {
    if (!password) return { pct: 0, label: "", cls: "" };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 2)
      return { pct: 33, label: "Weak", cls: "weak", color: "#c0392b" };
    if (s <= 3)
      return { pct: 66, label: "Good", cls: "good", color: "#d48806" };
    return { pct: 100, label: "Strong", cls: "strong", color: "#3d7a3a" };
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setSuccess(false);
    setTouched({ email: true, password: true, confirm: true });
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      if (email && password && confirm) {
        setSuccess(true);
        setLoading(false);
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }, 1500);
  }

  const emailOk = touched.email && !fieldErrors.email && email;
  const emailErr = touched.email && fieldErrors.email;
  const pwdErr = touched.password && fieldErrors.password;
  const confOk = touched.confirm && !fieldErrors.confirm && confirm;
  const confErr = touched.confirm && fieldErrors.confirm;
  const pwdStrength = getPasswordStrength();

  return (
    <>
      <style>{CSS}</style>
      <div className='su-page'>
        <div className='su-wrap'>
          {/* Brand */}
          <div className='su-brand'>
            <div className='su-logo'>
              <LeafIcon />
            </div>
            <div>
              <div className='su-brand-name'>AgriIntelligence</div>
              <div className='su-brand-tagline'>
                Sri Lanka · ML-Powered Farming
              </div>
            </div>
          </div>

          {/* Card */}
          <div className='su-card'>
            {/* Banner */}
            <div className='su-card-banner'>
              <div className='su-banner-eyebrow'>Free Account</div>
              <div className='su-banner-title'>Create your account</div>
              <div className='su-banner-sub'>
                Join to manage seed &amp; field predictions
              </div>
              <div className='su-banner-pills'>
                <span className='su-banner-pill'>🌾 Yield Forecasts</span>
                <span className='su-banner-pill'>💰 Cost Analysis</span>
                <span className='su-banner-pill'>📊 Strategies</span>
              </div>
            </div>

            {/* Body */}
            <div className='su-card-body'>
              {error && (
                <div className='su-alert-err'>
                  <AlertCircle
                    size={16}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className='su-alert-ok'>
                  <CheckCircle
                    size={16}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>Account created successfully! Redirecting…</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className='su-field'>
                  <label className='su-label'>Email address</label>
                  <div className='su-input-wrap'>
                    <span className='su-input-icon'>
                      <Mail size={16} />
                    </span>
                    <input
                      type='email'
                      placeholder='you@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`su-input ${emailOk ? "ok" : ""} ${emailErr ? "err" : ""}`}
                    />
                    {emailOk && (
                      <span className='su-check-icon no-eye'>
                        <CheckCircle size={15} />
                      </span>
                    )}
                  </div>
                  {emailErr && (
                    <div className='su-field-error'>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className='su-field'>
                  <label className='su-label'>Password</label>
                  <div className='su-input-wrap'>
                    <span className='su-input-icon'>
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder='Create a strong password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className={`su-input su-input-pr ${pwdErr ? "err" : ""}`}
                    />
                    <button
                      type='button'
                      className='su-eye-btn'
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdErr && (
                    <div className='su-field-error'>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                  {/* Strength meter */}
                  {password && !pwdErr && (
                    <div className='su-strength'>
                      <div className='su-strength-header'>
                        <span className='su-strength-lbl'>
                          Password strength
                        </span>
                        <span className={`su-strength-val ${pwdStrength.cls}`}>
                          {pwdStrength.label}
                        </span>
                      </div>
                      <div className='su-strength-track'>
                        <div
                          className='su-strength-fill'
                          style={{
                            width: `${pwdStrength.pct}%`,
                            background: pwdStrength.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className='su-field'>
                  <label className='su-label'>Confirm password</label>
                  <div className='su-input-wrap'>
                    <span className='su-input-icon'>
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder='Repeat your password'
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onBlur={() => handleBlur("confirm")}
                      className={`su-input su-input-pr ${confOk ? "ok" : ""} ${confErr ? "err" : ""}`}
                    />
                    <button
                      type='button'
                      className='su-eye-btn'
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confErr && (
                    <div className='su-field-error'>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.confirm}</span>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type='button'
                  onClick={handleSubmit}
                  disabled={loading || success}
                  className='su-btn'
                >
                  {loading ? (
                    <>
                      <span className='su-spin' />
                      Creating account…
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={16} />
                      Account created!
                    </>
                  ) : (
                    "Create account →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className='su-divider'>
                <div className='su-divider-line' />
                <span className='su-divider-txt'>Already have an account?</span>
                <div className='su-divider-line' />
              </div>

              {/* Sign in */}
              <button
                type='button'
                onClick={() => navigate("/signin")}
                className='su-signin-btn'
              >
                Sign in instead
              </button>

              {/* Security */}
              <div className='su-security'>
                <Shield size={13} color='var(--leaf)' />
                <span>
                  We never share your data. Delete your account anytime.
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='su-footer'>
            By creating an account, you agree to our{" "}
            <button>Terms of Service</button> and{" "}
            <button>Privacy Policy</button>
          </div>
        </div>
      </div>
    </>
  );
}
