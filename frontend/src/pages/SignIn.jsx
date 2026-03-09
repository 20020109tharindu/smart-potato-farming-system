import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --g950: #0a1a10;
    --g900: #0f2318;
    --g800: #1a3d28;
    --g700: #2a5c3f;
    --g600: #3e7a52;
    --g500: #4caf76;
    --g400: #85dba8;
    --g300: #aeeac4;
    --g100: #d9f5e8;
    --g50:  #f2fbf6;
    --cream: #faf7f2;
    --straw: #e8e0cc;
    --text:  #0a1a10;
    --mid:   #3b5c48;
    --soft:  #7a9e8a;
    --red:   #c0392b;
    --red-bg:#fdf0ee;
    --amber: #d4882b;
    --sh-md: 0 8px 32px rgba(10,26,16,.12);
    --sh-lg: 0 24px 80px rgba(10,26,16,.18);
  }

  .si-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
  }

  /* ══════════════ LEFT PANEL ══════════════ */
  .si-left {
    position: relative;
    background: var(--g900);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 44px 48px;
    overflow: hidden;
    min-height: 100vh;
  }

  /* Farm photo bg */
  .si-left-photo {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=85') center/cover no-repeat;
    opacity: .14;
  }

  /* Layered gradients */
  .si-left-grad {
    position: absolute; inset: 0;
    background:
      linear-gradient(160deg, rgba(10,26,16,.97) 0%, rgba(26,61,40,.88) 50%, rgba(42,92,63,.6) 100%);
  }

  /* Decorative rings */
  .si-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(76,175,118,.12);
    pointer-events: none;
  }
  .si-ring-1 { width: 420px; height: 420px; bottom: -120px; right: -120px; }
  .si-ring-2 { width: 280px; height: 280px; bottom: -60px; right: -60px; }
  .si-ring-3 { width: 140px; height: 140px; bottom: 0px; right: 0px;
    background: radial-gradient(circle, rgba(76,175,118,.06), transparent 70%); }

  /* Dot grid */
  .si-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(76,175,118,.1) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 70% 70% at 80% 80%, black 0%, transparent 70%);
  }

  .si-left-inner { position: relative; z-index: 2; }

  /* Brand */
  .si-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 0; }
  .si-brand-mark {
    width: 44px; height: 44px; border-radius: 13px;
    background: linear-gradient(135deg, var(--g500), var(--g600));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 4px 18px rgba(76,175,118,.3);
  }
  .si-brand-name {
    font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 700;
    color: #fff; line-height: 1.15; letter-spacing: -.01em;
  }
  .si-brand-sub {
    font-size: .58rem; color: var(--g300);
    letter-spacing: .18em; text-transform: uppercase; margin-top: 2px;
  }

  /* Left headline */
  .si-left-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .si-left-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(76,175,118,.12);
    border: 1px solid rgba(76,175,118,.2);
    border-radius: 30px; padding: 5px 14px;
    font-size: .66rem; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--g300); margin-bottom: 22px;
  }
  .si-ldot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(74,222,128,.7);
    animation: lpulse 2s infinite;
  }
  @keyframes lpulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  .si-left-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem, 3.5vw, 2.9rem); font-weight: 900;
    color: #fff; line-height: 1.08; letter-spacing: -.02em;
    margin-bottom: 18px;
  }
  .si-left-title em { font-style: italic; color: var(--g400); }

  .si-left-desc {
    font-size: .88rem; color: rgba(255,255,255,.48);
    line-height: 1.72; max-width: 340px; margin-bottom: 36px;
  }

  /* Stats row */
  .si-left-stats { display: flex; gap: 24px; }
  .si-lstat {
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 14px; padding: 14px 18px;
    min-width: 100px;
  }
  .si-lstat-val {
    font-family: 'Fraunces', serif;
    font-size: 1.5rem; font-weight: 700; color: #fff;
    line-height: 1; margin-bottom: 4px;
  }
  .si-lstat-label { font-size: .62rem; color: rgba(255,255,255,.38); letter-spacing: .06em; text-transform: uppercase; }

  /* Left footer */
  .si-left-foot {
    font-size: .72rem; color: rgba(255,255,255,.2);
    letter-spacing: .04em;
  }

  /* ══════════════ RIGHT PANEL ══════════════ */
  .si-right {
    display: flex; align-items: center; justify-content: center;
    padding: 48px 52px;
    background: var(--cream);
    position: relative; overflow: hidden;
  }

  /* Subtle bg texture */
  .si-right::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(42,92,63,.07) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }
  .si-right::after {
    content: '';
    position: absolute; top: -200px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(76,175,118,.07), transparent 70%);
    pointer-events: none;
  }

  .si-form-wrap {
    width: 100%; max-width: 400px;
    position: relative; z-index: 1;
    animation: siform 0.65s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes siform {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Form header */
  .si-form-head { margin-bottom: 34px; }
  .si-form-eyebrow {
    font-size: .6rem; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: var(--g600); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .si-form-eyebrow::before {
    content: ''; display: block; width: 20px; height: 2px;
    background: var(--g500); border-radius: 2px; flex-shrink: 0;
  }
  .si-form-title {
    font-family: 'Fraunces', serif;
    font-size: 2rem; font-weight: 900; color: var(--text);
    line-height: 1.1; letter-spacing: -.02em; margin-bottom: 8px;
  }
  .si-form-sub { font-size: .84rem; color: var(--soft); line-height: 1.6; }

  /* Alert */
  .si-alert {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--red-bg);
    border: 1.5px solid rgba(192,57,43,.2);
    border-radius: 12px; padding: 13px 15px;
    margin-bottom: 22px;
    font-size: .82rem; color: var(--red); font-weight: 500;
    animation: sishake 0.4s ease;
  }
  @keyframes sishake {
    0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)}
  }

  /* Fields */
  .si-field { margin-bottom: 20px; }
  .si-label {
    display: block; font-size: .65rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--mid); margin-bottom: 8px;
  }
  .si-input-wrap { position: relative; }
  .si-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--soft); pointer-events: none;
    display: flex; align-items: center;
  }
  .si-input {
    width: 100%;
    background: #fff;
    border: 1.5px solid var(--straw);
    border-radius: 12px;
    padding: 13px 14px 13px 44px;
    font-family: 'Outfit', sans-serif; font-size: .9rem; color: var(--text);
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
    box-shadow: 0 1px 4px rgba(10,26,16,.04);
  }
  .si-input::placeholder { color: rgba(122,158,138,.45); }
  .si-input:hover { border-color: rgba(76,175,118,.35); }
  .si-input:focus {
    border-color: var(--g600);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(76,175,118,.1), 0 1px 4px rgba(10,26,16,.06);
  }
  .si-input.ok  { border-color: rgba(42,92,63,.3); background: #f8fdf9; }
  .si-input.err { border-color: rgba(192,57,43,.4); background: var(--red-bg); box-shadow: 0 0 0 3px rgba(192,57,43,.06); }
  .si-input-pr  { padding-right: 46px; }

  .si-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--soft); padding: 4px; line-height: 0;
    transition: color .15s;
  }
  .si-eye:hover { color: var(--g600); }

  .si-field-err {
    display: flex; align-items: center; gap: 5px;
    font-size: .72rem; color: var(--red); font-weight: 500;
    margin-top: 6px;
    animation: errslide .2s ease;
  }
  @keyframes errslide { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }

  /* Forgot */
  .si-forgot-row { display: flex; justify-content: flex-end; margin: -8px 0 20px; }
  .si-forgot {
    font-size: .76rem; font-weight: 600; color: var(--g600);
    text-decoration: none; letter-spacing: .01em;
    transition: color .15s;
  }
  .si-forgot:hover { color: var(--g700); text-decoration: underline; }

  /* Submit */
  .si-btn {
    width: 100%;
    background: linear-gradient(130deg, var(--g900) 0%, var(--g700) 55%, var(--g600) 100%);
    border: none; border-radius: 14px;
    padding: 16px 28px;
    font-family: 'Outfit', sans-serif; font-size: .9rem; font-weight: 700;
    color: #fff; letter-spacing: .04em; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    position: relative; overflow: hidden;
    transition: all .22s ease;
    box-shadow: 0 6px 24px rgba(42,92,63,.3);
    margin-bottom: 24px;
  }
  .si-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,.1), transparent);
  }
  .si-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(42,92,63,.38);
    filter: brightness(1.07);
  }
  .si-btn:active:not(:disabled) { transform: translateY(0); }
  .si-btn:disabled { opacity: .6; cursor: not-allowed; }
  .si-spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spn .6s linear infinite; flex-shrink: 0;
  }
  @keyframes spn { to{transform:rotate(360deg)} }

  /* Divider */
  .si-divider {
    display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
  }
  .si-divider-line { flex: 1; height: 1px; background: var(--straw); }
  .si-divider-txt { font-size: .72rem; color: var(--soft); white-space: nowrap; }

  /* Sign up button */
  .si-signup-link {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 14px;
    background: transparent;
    border: 1.5px solid rgba(42,92,63,.2);
    border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: .88rem; font-weight: 600;
    color: var(--g700); text-decoration: none;
    transition: all .2s;
  }
  .si-signup-link:hover {
    background: var(--g50);
    border-color: rgba(42,92,63,.35);
    transform: translateY(-1px);
    box-shadow: var(--sh-md);
  }

  /* Footer */
  .si-footer {
    margin-top: 28px; text-align: center;
    font-size: .7rem; color: var(--soft); line-height: 1.8;
  }
  .si-footer a { color: var(--g700); text-decoration: none; font-weight: 500; }
  .si-footer a:hover { text-decoration: underline; }

  @media (max-width: 820px) {
    .si-root { grid-template-columns: 1fr; }
    .si-left  { display: none; }
    .si-right { padding: 40px 24px; }
  }
`;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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
  function handleBlur(f) {
    setTouched({ ...touched, [f]: true });
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
      const code = err.code;
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect email or password. Please check your credentials and try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a few minutes and try again.');
      } else if (code === 'auth/user-disabled') {
        setError('This account has been disabled. Please contact support.');
      } else {
        setError('Sign in failed. Please try again.');
      }
    }
    setLoading(false);
  }

  const emailOk = touched.email && !fieldErrors.email && email;
  const emailErr = touched.email && fieldErrors.email;
  const pwdErr = touched.password && fieldErrors.password;

  return (
    <>
      <style>{CSS}</style>
      <div className='si-root'>
        {/* ── LEFT ── */}
        <div className='si-left'>
          <div className='si-left-photo' />
          <div className='si-left-grad' />
          <div className='si-dots' />
          <div className='si-ring si-ring-1' />
          <div className='si-ring si-ring-2' />
          <div className='si-ring si-ring-3' />

          <div className='si-left-inner si-brand'>
            <div className='si-brand-mark'>🥔</div>
            <div>
              <div className='si-brand-name'>SmartPotato</div>
              <div className='si-brand-sub'>Sri Lanka</div>
            </div>
          </div>

          <div className='si-left-inner si-left-body'>
            
            
            <h1 className='si-left-title'>
              Farm smarter,
              <br />
              yield <em>better</em>
            </h1>
            <p className='si-left-desc'>
              AI-driven seed scoring, disease detection, soil monitoring and
              cost forecasting — built for Sri Lankan farmers.
            </p>
            <div className='si-left-stats'>
              <div className='si-lstat'>
                <div className='si-lstat-val'>200+</div>
                <div className='si-lstat-label'>Farmers</div>
              </div>
              <div className='si-lstat'>
                <div className='si-lstat-val'>92%</div>
                <div className='si-lstat-label'>Accuracy</div>
              </div>
              <div className='si-lstat'>
                <div className='si-lstat-val'>4</div>
                <div className='si-lstat-label'>AI Modules</div>
              </div>
            </div>
          </div>

          <div className='si-left-inner si-left-foot'>
            © {new Date().getFullYear()} SmartPotato · Sri Lanka Agri System
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className='si-right'>
          <div className='si-form-wrap'>
            <div className='si-form-head'>
              <div className='si-form-eyebrow'>Secure Access</div>
              <div className='si-form-title'>Welcome back 👋</div>
              <div className='si-form-sub'>
                Sign in to continue to your farm dashboard
              </div>
            </div>

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
                  <div className='si-field-err'>
                    <AlertCircle size={12} />
                    {fieldErrors.email}
                  </div>
                )}
              </div>

              <div className='si-field'>
                <label className='si-label'>Password</label>
                <div className='si-input-wrap'>
                  <span className='si-input-icon'>
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`si-input si-input-pr ${pwdErr ? "err" : ""}`}
                  />
                  <button
                    type='button'
                    className='si-eye'
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwdErr && (
                  <div className='si-field-err'>
                    <AlertCircle size={12} />
                    {fieldErrors.password}
                  </div>
                )}
              </div>

              <div className='si-forgot-row'>
                
                
              </div>

              <button type='submit' disabled={loading} className='si-btn'>
                {loading ? (
                  <>
                    <span className='si-spin' /> Signing in…
                  </>
                ) : (
                  "Sign in →"
                )}
              </button>
            </form>

            <div className='si-divider'>
              <div className='si-divider-line' />
              <span className='si-divider-txt'>New to SmartPotato?</span>
              <div className='si-divider-line' />
            </div>

            <Link to='/signup' className='si-signup-link'>
              Create a free account →
            </Link>

            <div className='si-footer'>
              By signing in you agree to our <a href='/terms'>Terms</a> and{" "}
              <a href='/privacy'>Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
