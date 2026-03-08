import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

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
    --blue:      #2563b0;
    --shadow-sm: 0 1px 3px rgba(30,45,30,0.08);
    --shadow-md: 0 4px 16px rgba(30,45,30,0.10);
    --shadow-lg: 0 20px 60px rgba(30,45,30,0.14), 0 2px 8px rgba(30,45,30,0.08);
  }

  .si-page {
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

  /* Dot grid texture */
  .si-page::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(90,158,86,0.09) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none; z-index: 0;
  }

  /* Decorative botanical ring */
  .si-page::after {
    content: '🌿';
    position: fixed;
    bottom: -40px; right: -30px;
    font-size: 280px;
    opacity: 0.04;
    pointer-events: none; z-index: 0;
    transform: rotate(-20deg);
    filter: grayscale(1);
  }

  .si-wrap {
    width: 100%; max-width: 440px;
    position: relative; z-index: 1;
    animation: si-rise 0.6s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes si-rise {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Brand header ── */
  .si-brand {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 32px;
    animation: si-fade 0.5s ease both;
  }

  @keyframes si-fade {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .si-logo {
    width: 52px; height: 52px; border-radius: 15px; flex-shrink: 0;
    background: linear-gradient(140deg, #253f23 0%, #5a9e56 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 6px 20px rgba(61,122,58,.3), 0 1px 0 rgba(255,255,255,.1) inset;
  }

  .si-brand-name {
    font-family: 'Lora', serif; font-size: 22px; font-weight: 700;
    color: var(--ink); letter-spacing: -0.01em; line-height: 1.2;
  }

  .si-brand-tagline {
    font-size: 11px; font-weight: 400; color: var(--ink-lt);
    letter-spacing: 0.06em; text-transform: uppercase; margin-top: 2px;
  }

  /* ── Card ── */
  .si-card {
    background: var(--white);
    border: 1px solid rgba(122,92,58,.12);
    border-radius: 24px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  /* Card top banner */
  .si-card-banner {
    background: linear-gradient(108deg, #253f23 0%, #3d7a3a 55%, #5a9e56 100%);
    padding: 28px 32px 24px;
    position: relative; overflow: hidden;
  }

  .si-card-banner::after {
    content: ''; position: absolute;
    right: -24px; bottom: -40px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(255,255,255,.055); pointer-events: none;
  }

  .si-card-banner::before {
    content: ''; position: absolute;
    right: 60px; top: -30px;
    width: 90px; height: 90px; border-radius: 50%;
    background: rgba(255,255,255,.04); pointer-events: none;
  }

  .si-banner-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--sprout); margin-bottom: 6px;
    position: relative; z-index: 1;
  }

  .si-banner-title {
    font-family: 'Lora', serif; font-size: 24px; font-weight: 700;
    color: #fff; letter-spacing: -.01em; line-height: 1.2;
    position: relative; z-index: 1;
  }

  .si-banner-sub {
    font-size: 13px; color: rgba(255,255,255,.6); margin-top: 5px;
    font-weight: 300; position: relative; z-index: 1;
  }

  /* Card body */
  .si-card-body { padding: 30px 32px 32px; }

  /* ── Error alert ── */
  .si-alert {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--red-bg); border: 1.5px solid rgba(192,57,43,.2);
    border-radius: 12px; padding: 14px 16px;
    margin-bottom: 22px;
    font-size: 13px; color: var(--red); font-weight: 500;
    animation: si-shake 0.4s ease;
  }

  @keyframes si-shake {
    0%, 100% { transform: translateX(0); }
    25%       { transform: translateX(-5px); }
    75%       { transform: translateX(5px); }
  }

  /* ── Field ── */
  .si-field { margin-bottom: 18px; }

  .si-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--ink-lt); margin-bottom: 8px;
  }

  .si-input-wrap { position: relative; }

  .si-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--ink-lt); pointer-events: none;
    display: flex; align-items: center;
  }

  .si-input {
    width: 100%; background: var(--cream);
    border: 1.5px solid var(--straw); border-radius: 10px;
    padding: 12px 14px 12px 42px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
    outline: none; transition: all .18s ease;
    appearance: none;
  }

  .si-input::placeholder { color: rgba(107,128,105,.38); }

  .si-input:hover {
    border-color: rgba(90,158,86,.4); background: #fafdf8;
  }

  .si-input:focus {
    border-color: var(--leaf-mid); background: #f6fcf5;
    box-shadow: 0 0 0 3px rgba(90,158,86,.11);
  }

  .si-input.ok {
    border-color: rgba(61,122,58,.3); background: #f7fdf6;
    padding-right: 42px;
  }

  .si-input.err {
    border-color: rgba(192,57,43,.4); background: var(--red-bg);
    box-shadow: 0 0 0 3px rgba(192,57,43,.07);
  }

  .si-input-pr { padding-right: 42px; }

  .si-eye-btn {
    position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--ink-lt); padding: 4px;
    transition: color .15s; line-height: 0;
  }

  .si-eye-btn:hover { color: var(--leaf); }

  .si-field-error {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; color: var(--red); font-weight: 500;
    margin-top: 6px;
    animation: si-err-in .2s ease;
  }

  @keyframes si-err-in {
    from { opacity:0; transform:translateX(-4px); }
    to   { opacity:1; transform:translateX(0); }
  }

  /* ── Forgot link ── */
  .si-forgot-row {
    display: flex; justify-content: flex-end;
    margin-bottom: 22px; margin-top: -6px;
  }

  .si-forgot {
    font-size: 12px; font-weight: 500; color: var(--leaf);
    text-decoration: none; letter-spacing: .02em;
    transition: color .15s;
  }

  .si-forgot:hover { color: var(--leaf-mid); text-decoration: underline; }

  /* ── Submit button ── */
  .si-btn {
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
    margin-bottom: 22px;
  }

  .si-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,.08) 0%, transparent 100%);
  }

  .si-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(61,122,58,.36);
    filter: brightness(1.06);
  }

  .si-btn:active:not(:disabled) { transform: translateY(0); }

  .si-btn:disabled { opacity: .65; cursor: not-allowed; }

  .si-spin {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spin .65s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Divider ── */
  .si-divider {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 20px;
  }

  .si-divider-line { flex: 1; height: 1px; background: var(--straw); }

  .si-divider-txt {
    font-size: 11px; color: var(--ink-lt); white-space: nowrap;
    letter-spacing: .04em;
  }

  /* ── Sign up link ── */
  .si-signup-btn {
    display: block; width: 100%;
    padding: 14px 24px; text-align: center;
    background: transparent; border: 1.5px solid rgba(61,122,58,.28);
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: var(--leaf); cursor: pointer; text-decoration: none;
    transition: all .18s ease;
  }

  .si-signup-btn:hover {
    background: var(--fog); border-color: var(--leaf-mid);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  /* ── Footer ── */
  .si-footer {
    margin-top: 24px; text-align: center;
    font-size: 11px; color: var(--ink-lt); opacity: .55;
    line-height: 1.7;
  }

  .si-footer a {
    color: var(--leaf); text-decoration: none; font-weight: 500;
  }

  .si-footer a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .si-card-banner, .si-card-body { padding-left: 22px; padding-right: 22px; }
    .si-banner-title { font-size: 20px; }
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

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (!emailRegex.test(email)) e.email = "Enter a valid email address";
    if (!password || password.length < 6)
      e.password = "Password must be at least 6 characters";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleBlur(field) {
    setTouched({ ...touched, [field]: true });
    validate();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setTouched({ email: true, password: true });
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate("/app");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const emailOk = touched.email && !fieldErrors.email && email;
  const emailErr = touched.email && fieldErrors.email;
  const pwdErr = touched.password && fieldErrors.password;

  return (
    <>
      <style>{CSS}</style>
      <div className='si-page'>
        <div className='si-wrap'>
          {/* Brand */}
          <div className='si-brand'>
            <div className='si-logo'>
              <LeafIcon />
            </div>
            <div>
              <div className='si-brand-name'>AgriIntelligence</div>
              <div className='si-brand-tagline'>
                Sri Lanka · ML-Powered Farming
              </div>
            </div>
          </div>

          {/* Card */}
          <div className='si-card'>
            {/* Banner */}
            <div className='si-card-banner'>
              <div className='si-banner-eyebrow'>Secure Access</div>
              <div className='si-banner-title'>Welcome back</div>
              <div className='si-banner-sub'>
                Sign in to continue to your farm dashboard
              </div>
            </div>

            {/* Body */}
            <div className='si-card-body'>
              {error && (
                <div className='si-alert'>
                  <AlertCircle
                    size={16}
                    style={{ flexShrink: 0, marginTop: 1 }}
                  />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div className='si-field'>
                  <label className='si-label'>Email address</label>
                  <div className='si-input-wrap'>
                    <span className='si-input-icon'>
                      <Mail size={16} />
                    </span>
                    <input
                      type='email'
                      placeholder='you@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`si-input ${emailOk ? "ok" : ""} ${emailErr ? "err" : ""}`}
                    />
                  </div>
                  {emailErr && (
                    <div className='si-field-error'>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className='si-field'>
                  <label className='si-label'>Password</label>
                  <div className='si-input-wrap'>
                    <span className='si-input-icon'>
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder='Enter your password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className={`si-input si-input-pr ${pwdErr ? "err" : ""}`}
                    />
                    <button
                      type='button'
                      className='si-eye-btn'
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {pwdErr && (
                    <div className='si-field-error'>
                      <AlertCircle size={12} />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                </div>

                {/* Forgot */}
                <div className='si-forgot-row'>
                  <Link to='/forgot-password' className='si-forgot'>
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button type='submit' disabled={loading} className='si-btn'>
                  {loading ? (
                    <>
                      <span className='si-spin' />
                      Signing in…
                    </>
                  ) : (
                    "Sign in →"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className='si-divider'>
                <div className='si-divider-line' />
                <span className='si-divider-txt'>New to Farm Predictions?</span>
                <div className='si-divider-line' />
              </div>

              {/* Sign up link */}
              <Link to='/signup' className='si-signup-btn'>
                Create an account
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className='si-footer'>
            By signing in, you agree to our{" "}
            <a href='/terms'>Terms of Service</a> and{" "}
            <a href='/privacy'>Privacy Policy</a>
          </div>
        </div>
      </div>
    </>
  );
}
