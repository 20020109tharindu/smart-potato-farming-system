import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";

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
  }

  .su-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
  }

  /* ══════════════ LEFT PANEL ══════════════ */
  .su-left {
    position: relative;
    background: var(--g900);
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 44px 48px;
    overflow: hidden;
    min-height: 100vh;
  }

  .su-left-photo {
    position: absolute; inset: 0;
    background: url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85') center/cover no-repeat;
    opacity: .13;
  }
  .su-left-grad {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(10,26,16,.97) 0%, rgba(26,61,40,.88) 50%, rgba(42,92,63,.6) 100%);
  }
  .su-ring {
    position: absolute; border-radius: 50%;
    border: 1px solid rgba(76,175,118,.1);
    pointer-events: none;
  }
  .su-ring-1 { width: 460px; height: 460px; top: -140px; left: -140px; }
  .su-ring-2 { width: 300px; height: 300px; top: -80px; left: -80px; }
  .su-ring-3 {
    width: 160px; height: 160px; top: -20px; left: -20px;
    background: radial-gradient(circle, rgba(76,175,118,.07), transparent 70%);
  }
  .su-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(76,175,118,.1) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 70% 70% at 20% 20%, black 0%, transparent 70%);
  }

  .su-left-inner { position: relative; z-index: 2; }

  .su-brand { display: flex; align-items: center; gap: 12px; }
  .su-brand-mark {
    width: 44px; height: 44px; border-radius: 13px;
    background: linear-gradient(135deg, var(--g500), var(--g600));
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 4px 18px rgba(76,175,118,.3);
  }
  .su-brand-name {
    font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 700;
    color: #fff; line-height: 1.15;
  }
  .su-brand-sub {
    font-size: .58rem; color: var(--g300);
    letter-spacing: .18em; text-transform: uppercase; margin-top: 2px;
  }

  .su-left-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .su-left-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(76,175,118,.12);
    border: 1px solid rgba(76,175,118,.2);
    border-radius: 30px; padding: 5px 14px;
    font-size: .66rem; font-weight: 600; letter-spacing: .14em;
    text-transform: uppercase; color: var(--g300); margin-bottom: 22px;
  }
  .su-ldot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; flex-shrink: 0;
    box-shadow: 0 0 8px rgba(74,222,128,.7);
    animation: lpulse 2s infinite;
  }
  @keyframes lpulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  .su-left-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(2rem, 3.5vw, 2.9rem); font-weight: 900;
    color: #fff; line-height: 1.08; letter-spacing: -.02em; margin-bottom: 18px;
  }
  .su-left-title em { font-style: italic; color: var(--g400); }
  .su-left-desc {
    font-size: .88rem; color: rgba(255,255,255,.48);
    line-height: 1.72; max-width: 340px; margin-bottom: 32px;
  }

  /* Feature list */
  .su-features { display: flex; flex-direction: column; gap: 12px; }
  .su-feat {
    display: flex; align-items: center; gap: 12px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 12px; padding: 12px 16px;
  }
  .su-feat-icon {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: .95rem;
  }
  .su-feat-title { font-size: .82rem; font-weight: 600; color: rgba(255,255,255,.88); }
  .su-feat-sub   { font-size: .7rem; color: rgba(255,255,255,.36); margin-top: 1px; }

  .su-left-foot { font-size: .72rem; color: rgba(255,255,255,.2); letter-spacing: .04em; }

  /* ══════════════ RIGHT PANEL ══════════════ */
  .su-right {
    display: flex; align-items: center; justify-content: center;
    padding: 40px 52px;
    background: var(--cream);
    position: relative; overflow: hidden;
  }
  .su-right::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(42,92,63,.07) 1px, transparent 1px);
    background-size: 24px 24px;
    pointer-events: none;
  }
  .su-right::after {
    content: '';
    position: absolute; bottom: -200px; left: -200px;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(76,175,118,.06), transparent 70%);
    pointer-events: none;
  }

  .su-form-wrap {
    width: 100%; max-width: 420px;
    position: relative; z-index: 1;
    animation: suform 0.65s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes suform {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .su-form-head { margin-bottom: 28px; }
  .su-form-eyebrow {
    font-size: .6rem; font-weight: 700; letter-spacing: .2em;
    text-transform: uppercase; color: var(--g600); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .su-form-eyebrow::before {
    content: ''; display: block; width: 20px; height: 2px;
    background: var(--g500); border-radius: 2px; flex-shrink: 0;
  }
  .su-form-title {
    font-family: 'Fraunces', serif;
    font-size: 1.9rem; font-weight: 900; color: var(--text);
    line-height: 1.1; letter-spacing: -.02em; margin-bottom: 6px;
  }
  .su-form-sub { font-size: .84rem; color: var(--soft); line-height: 1.6; }

  /* Alerts */
  .su-alert-err {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--red-bg); border: 1.5px solid rgba(192,57,43,.2);
    border-radius: 12px; padding: 12px 15px; margin-bottom: 20px;
    font-size: .82rem; color: var(--red); font-weight: 500;
    animation: sushake .4s ease;
  }
  .su-alert-ok {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--g50); border: 1.5px solid rgba(42,92,63,.2);
    border-radius: 12px; padding: 12px 15px; margin-bottom: 20px;
    font-size: .82rem; color: var(--g700); font-weight: 500;
  }
  @keyframes sushake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }

  /* Fields */
  .su-field { margin-bottom: 18px; }
  .su-label {
    display: block; font-size: .65rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--mid); margin-bottom: 7px;
  }
  .su-input-wrap { position: relative; }
  .su-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: var(--soft); pointer-events: none; display: flex; align-items: center;
  }
  .su-input {
    width: 100%; background: #fff;
    border: 1.5px solid var(--straw); border-radius: 12px;
    padding: 13px 14px 13px 44px;
    font-family: 'Outfit', sans-serif; font-size: .9rem; color: var(--text);
    outline: none; transition: all .18s ease;
    box-shadow: 0 1px 4px rgba(10,26,16,.04);
  }
  .su-input::placeholder { color: rgba(122,158,138,.45); }
  .su-input:hover { border-color: rgba(76,175,118,.35); }
  .su-input:focus {
    border-color: var(--g600); background: #fff;
    box-shadow: 0 0 0 3px rgba(76,175,118,.1), 0 1px 4px rgba(10,26,16,.06);
  }
  .su-input.ok  { border-color: rgba(42,92,63,.3); background: #f8fdf9; }
  .su-input.err { border-color: rgba(192,57,43,.4); background: var(--red-bg); box-shadow: 0 0 0 3px rgba(192,57,43,.06); }
  .su-input-pr  { padding-right: 46px; }

  .su-eye {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--soft); padding: 4px; line-height: 0; transition: color .15s;
  }
  .su-eye:hover { color: var(--g600); }

  .su-field-err {
    display: flex; align-items: center; gap: 5px;
    font-size: .72rem; color: var(--red); font-weight: 500; margin-top: 6px;
    animation: errslide .2s ease;
  }
  @keyframes errslide { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }

  /* Strength meter */
  .su-strength { margin-top: 8px; }
  .su-strength-head {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;
  }
  .su-strength-lbl { font-size: .68rem; color: var(--soft); }
  .su-strength-val { font-size: .68rem; font-weight: 700; }
  .su-strength-val.weak   { color: var(--red); }
  .su-strength-val.good   { color: var(--amber); }
  .su-strength-val.strong { color: var(--g600); }
  .su-strength-track {
    height: 5px; background: var(--straw); border-radius: 99px; overflow: hidden;
  }
  .su-strength-fill {
    height: 100%; border-radius: 99px;
    transition: width .5s cubic-bezier(.22,1,.36,1), background .4s;
  }

  /* Submit */
  .su-btn {
    width: 100%;
    background: linear-gradient(130deg, var(--g900) 0%, var(--g700) 55%, var(--g600) 100%);
    border: none; border-radius: 14px; padding: 16px 28px;
    font-family: 'Outfit', sans-serif; font-size: .9rem; font-weight: 700;
    color: #fff; letter-spacing: .04em; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    position: relative; overflow: hidden;
    transition: all .22s ease;
    box-shadow: 0 6px 24px rgba(42,92,63,.3);
    margin-top: 6px; margin-bottom: 20px;
  }
  .su-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,.1), transparent);
  }
  .su-btn:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 10px 36px rgba(42,92,63,.38); filter: brightness(1.07);
  }
  .su-btn:active:not(:disabled) { transform: translateY(0); }
  .su-btn:disabled { opacity: .6; cursor: not-allowed; }
  .su-spin {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
    border-radius: 50%; animation: spn .6s linear infinite; flex-shrink: 0;
  }
  @keyframes spn { to{transform:rotate(360deg)} }

  /* Divider */
  .su-divider { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .su-divider-line { flex: 1; height: 1px; background: var(--straw); }
  .su-divider-txt { font-size: .72rem; color: var(--soft); white-space: nowrap; }

  /* Sign in link */
  .su-signin-link {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 13px;
    background: transparent; border: 1.5px solid rgba(42,92,63,.2);
    border-radius: 14px;
    font-family: 'Outfit', sans-serif; font-size: .88rem; font-weight: 600;
    color: var(--g700); text-decoration: none; cursor: pointer;
    transition: all .2s; margin-bottom: 18px;
  }
  .su-signin-link:hover {
    background: var(--g50); border-color: rgba(42,92,63,.35);
    transform: translateY(-1px); box-shadow: var(--sh-md);
  }

  /* Security */
  .su-security {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: .7rem; color: var(--soft); opacity: .7;
  }

  /* Footer */
  .su-footer {
    margin-top: 22px; text-align: center;
    font-size: .7rem; color: var(--soft); line-height: 1.8;
  }
  .su-footer button {
    background: none; border: none; cursor: pointer;
    color: var(--g700); font-size: .7rem; font-weight: 500;
    font-family: 'Outfit', sans-serif; padding: 0;
  }
  .su-footer button:hover { text-decoration: underline; }

  @media (max-width: 820px) {
    .su-root { grid-template-columns: 1fr; }
    .su-left  { display: none; }
    .su-right { padding: 40px 24px; }
  }
`;

const FEATURES = [
  {
    icon: "🌱",
    iconBg: "#1a3d28",
    title: "Seed Readiness",
    sub: "AI germination scoring",
  },
  {
    icon: "🔬",
    iconBg: "#3d1a1a",
    title: "Disease Detection",
    sub: "Instant leaf diagnosis",
  },
  {
    icon: "📊",
    iconBg: "#3d3010",
    title: "Cost Analysis",
    sub: "ROI & margin forecasting",
  },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConf, setShowConf] = useState(false);
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
  function handleBlur(f) {
    setTouched({ ...touched, [f]: true });
    validate();
  }

  function getStrength() {
    if (!password) return { pct: 0, label: "", cls: "", color: "" };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 2)
      return { pct: 33, label: "Weak", cls: "weak", color: "#c0392b" };
    if (s <= 3)
      return { pct: 66, label: "Good", cls: "good", color: "#d4882b" };
    return { pct: 100, label: "Strong", cls: "strong", color: "#3e7a52" };
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setSuccess(false);
    setTouched({ email: true, password: true, confirm: true });
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/app"), 1500);
    }, 1500);
  }

  const emailOk = touched.email && !fieldErrors.email && email;
  const emailErr = touched.email && fieldErrors.email;
  const pwdErr = touched.password && fieldErrors.password;
  const confOk = touched.confirm && !fieldErrors.confirm && confirm;
  const confErr = touched.confirm && fieldErrors.confirm;
  const str = getStrength();

  return (
    <>
      <style>{CSS}</style>
      <div className='su-root'>
        {/* ── LEFT ── */}
        <div className='su-left'>
          <div className='su-left-photo' />
          <div className='su-left-grad' />
          <div className='su-dots' />
          <div className='su-ring su-ring-1' />
          <div className='su-ring su-ring-2' />
          <div className='su-ring su-ring-3' />

          <div className='su-left-inner su-brand'>
            <div className='su-brand-mark'>🥔</div>
            <div>
              <div className='su-brand-name'>SmartPotato</div>
              <div className='su-brand-sub'>Sri Lanka</div>
            </div>
          </div>

          <div className='su-left-inner su-left-body'>
            
            
            <h1 className='su-left-title'>
              Start growing
              <br />
              <em>smarter</em> today
            </h1>
            <p className='su-left-desc'>
              Everything you need to maximise your potato yield — AI-powered
              tools designed for smallholder farmers.
            </p>
            <div className='su-features'>
              {FEATURES.map((f) => (
                <div className='su-feat' key={f.title}>
                  <div
                    className='su-feat-icon'
                    style={{ background: f.iconBg }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className='su-feat-title'>{f.title}</div>
                    <div className='su-feat-sub'>{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='su-left-inner su-left-foot'>
            © {new Date().getFullYear()} SmartPotato · Sri Lanka Agri System
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className='su-right'>
          <div className='su-form-wrap'>
            <div className='su-form-head'>
              <div className='su-form-eyebrow'>Free Account</div>
              <div className='su-form-title'>Create account 🌱</div>
              
              
            </div>

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
                <span>Account created! Redirecting to your dashboard…</span>
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
                </div>
                {emailErr && (
                  <div className='su-field-err'>
                    <AlertCircle size={12} />
                    {fieldErrors.email}
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
                    type={showPwd ? "text" : "password"}
                    placeholder='Create a strong password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`su-input su-input-pr ${pwdErr ? "err" : ""}`}
                  />
                  <button
                    type='button'
                    className='su-eye'
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {pwdErr && (
                  <div className='su-field-err'>
                    <AlertCircle size={12} />
                    {fieldErrors.password}
                  </div>
                )}
                {password && !pwdErr && (
                  <div className='su-strength'>
                    <div className='su-strength-head'>
                      <span className='su-strength-lbl'>Password strength</span>
                      <span className={`su-strength-val ${str.cls}`}>
                        {str.label}
                      </span>
                    </div>
                    <div className='su-strength-track'>
                      <div
                        className='su-strength-fill'
                        style={{ width: `${str.pct}%`, background: str.color }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className='su-field'>
                <label className='su-label'>Confirm password</label>
                <div className='su-input-wrap'>
                  <span className='su-input-icon'>
                    <Lock size={16} />
                  </span>
                  <input
                    type={showConf ? "text" : "password"}
                    placeholder='Repeat your password'
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => handleBlur("confirm")}
                    className={`su-input su-input-pr ${confOk ? "ok" : ""} ${confErr ? "err" : ""}`}
                  />
                  <button
                    type='button'
                    className='su-eye'
                    onClick={() => setShowConf(!showConf)}
                  >
                    {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confErr && (
                  <div className='su-field-err'>
                    <AlertCircle size={12} />
                    {fieldErrors.confirm}
                  </div>
                )}
              </div>

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

            <div className='su-divider'>
              <div className='su-divider-line' />
              <span className='su-divider-txt'>Already have an account?</span>
              <div className='su-divider-line' />
            </div>

            <button
              className='su-signin-link'
              onClick={() => navigate("/signin")}
            >
              Sign in instead →
            </button>

            <div className='su-security'>
              <Shield size={13} color='var(--g600)' />
              <span>
                We never share your data. Delete your account anytime.
              </span>
            </div>

            <div className='su-footer'>
              By creating an account, you agree to our{" "}
              <button>Terms of Service</button> and{" "}
              <button>Privacy Policy</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
