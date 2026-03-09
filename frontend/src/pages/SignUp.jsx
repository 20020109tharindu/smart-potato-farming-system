import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle,
  Shield,
  UserPlus,
} from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
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
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 3)
      return { strength: 66, label: "Good", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setTouched({ email: true, password: true, confirm: true });
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/signin'), 1800);
    } catch (err) {
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError('Failed to create account: ' + (err.message || 'Unknown error'));
      }
    }
    setLoading(false);
  }

  const isEmailValid = touched.email && !fieldErrors.email && email;
  const isPasswordValid = touched.password && !fieldErrors.password && password;
  const isConfirmValid = touched.confirm && !fieldErrors.confirm && confirm;
  const passwordStrength = getPasswordStrength();

  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'></div>
        <div
          className='absolute bottom-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className='absolute top-1/2 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse'
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className='w-full max-w-md relative z-10'>
        {/* Logo/Brand Area */}
        <div className='text-center mb-8 animate-fade-in'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-4 shadow-2xl transform hover:scale-105 transition-transform duration-300'>
            <span className='text-4xl'>🌾</span>
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2'>
            Farm Predictions
          </h1>
          <p className='text-sm text-gray-600 flex items-center justify-center gap-1'>
            <Sparkles className='w-4 h-4 text-green-500' />
            Smart farming insights powered by AI
          </p>
        </div>

        {/* Main Card */}
        <div className='bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 animate-slide-up'>
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-2'>
              <UserPlus className='w-6 h-6 text-green-600' />
              <h2 className='text-2xl font-bold text-gray-900'>
                Create account
              </h2>
            </div>
            <p className='text-sm text-gray-600'>
              Join to manage your seed & field predictions
            </p>
          </div>

          {error && (
            <div className='flex items-start gap-3 text-sm text-red-700 mb-6 bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake'>
              <AlertCircle className='w-5 h-5 mt-0.5 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className='flex items-start gap-3 text-sm text-green-700 mb-6 bg-green-50 p-4 rounded-2xl border border-green-100 animate-fade-in'>
              <CheckCircle className='w-5 h-5 mt-0.5 flex-shrink-0' />
              <span>Account created successfully! Redirecting to sign in...</span>
            </div>
          )}

          <div className='space-y-5'>
            {/* Email Field */}
            <div className='group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Email address
              </label>
              <div className='relative'>
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    touched.email && fieldErrors.email
                      ? "text-red-400"
                      : "text-gray-400 group-hover:text-green-500"
                  }`}
                >
                  <Mail className='w-5 h-5' />
                </div>
                <input
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium ${
                    touched.email && fieldErrors.email
                      ? "border-red-300 focus:ring-red-100 bg-red-50/50"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-400 hover:border-gray-300"
                  }`}
                />
                {isEmailValid && (
                  <div className='absolute right-4 top-1/2 -translate-y-1/2 text-green-500'>
                    <CheckCircle className='w-5 h-5' />
                  </div>
                )}
              </div>
              {touched.email && fieldErrors.email && (
                <div className='flex items-center gap-1.5 text-xs text-red-600 mt-2 animate-fade-in'>
                  <AlertCircle className='w-3.5 h-3.5' />
                  <span className='font-medium'>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className='group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    touched.password && fieldErrors.password
                      ? "text-red-400"
                      : "text-gray-400 group-hover:text-green-500"
                  }`}
                >
                  <Lock className='w-5 h-5' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Create a strong password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium ${
                    touched.password && fieldErrors.password
                      ? "border-red-300 focus:ring-red-100 bg-red-50/50"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-400 hover:border-gray-300"
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50'
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
                {isPasswordValid && (
                  <div className='absolute right-12 top-1/2 -translate-y-1/2 text-green-500'>
                    <CheckCircle className='w-5 h-5' />
                  </div>
                )}
              </div>
              {touched.password && fieldErrors.password && (
                <div className='flex items-center gap-1.5 text-xs text-red-600 mt-2 animate-fade-in'>
                  <AlertCircle className='w-3.5 h-3.5' />
                  <span className='font-medium'>{fieldErrors.password}</span>
                </div>
              )}
              {/* Password Strength Indicator */}
              {password && !fieldErrors.password && (
                <div className='mt-2'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-medium text-gray-600'>
                      Password strength
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        passwordStrength.label === "Weak"
                          ? "text-red-600"
                          : passwordStrength.label === "Good"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-500`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className='group'>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Confirm password
              </label>
              <div className='relative'>
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                    touched.confirm && fieldErrors.confirm
                      ? "text-red-400"
                      : "text-gray-400 group-hover:text-green-500"
                  }`}
                >
                  <Lock className='w-5 h-5' />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder='Repeat your password'
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onBlur={() => handleBlur("confirm")}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all font-medium ${
                    touched.confirm && fieldErrors.confirm
                      ? "border-red-300 focus:ring-red-100 bg-red-50/50"
                      : "border-gray-200 focus:ring-green-100 focus:border-green-400 hover:border-gray-300"
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm(!showConfirm)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-50'
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
                {isConfirmValid && (
                  <div className='absolute right-12 top-1/2 -translate-y-1/2 text-green-500'>
                    <CheckCircle className='w-5 h-5' />
                  </div>
                )}
              </div>
              {touched.confirm && fieldErrors.confirm && (
                <div className='flex items-center gap-1.5 text-xs text-red-600 mt-2 animate-fade-in'>
                  <AlertCircle className='w-3.5 h-3.5' />
                  <span className='font-medium'>{fieldErrors.confirm}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type='button'
              onClick={handleSubmit}
              disabled={loading || success}
              className='w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Creating account...
                </span>
              ) : success ? (
                <span className='flex items-center justify-center gap-2'>
                  <CheckCircle className='w-5 h-5' />
                  Account created!
                </span>
              ) : (
                <span className='flex items-center justify-center gap-2'>
                  Create account
                  <span className='text-lg'>→</span>
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t-2 border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white/80 text-gray-500 font-medium'>
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <button
            type='button'
            onClick={() => navigate("/signin")}
            className='block w-full py-4 text-center border-2 border-green-600 text-green-600 rounded-2xl font-semibold hover:bg-green-50 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg'
          >
            Sign in instead
          </button>

          {/* Security Badge */}
          <div className='mt-6 flex items-center justify-center gap-2 text-xs text-gray-600'>
            <Shield className='w-4 h-4 text-green-600' />
            <span>
              We never share your data. You can delete your account anytime.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-xs text-gray-600 animate-fade-in'>
          By creating an account, you agree to our{" "}
          <button className='text-green-600 hover:text-green-700 font-semibold hover:underline'>
            Terms of Service
          </button>{" "}
          and{" "}
          <button className='text-green-600 hover:text-green-700 font-semibold hover:underline'>
            Privacy Policy
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
