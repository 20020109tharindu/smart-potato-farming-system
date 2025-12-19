import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Brand Area */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg'>
            <span className='text-3xl'>🌾</span>
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>Farm Predictions</h1>
        </div>

        {/* Main Card */}
        <div className='bg-white p-8 rounded-3xl shadow-xl border border-gray-100'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold text-gray-900 mb-1'>
              Welcome back
            </h2>
            <p className='text-sm text-gray-600'>
              Sign in to continue to your dashboard
            </p>
          </div>

          {error && (
            <div className='flex items-start gap-2 text-sm text-red-700 mb-4 bg-red-50 p-3 rounded-xl border border-red-100'>
              <AlertCircle className='w-4 h-4 mt-0.5 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Email Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Email address
              </label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Mail className='w-5 h-5' />
                </div>
                <input
                  type='email'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    touched.email && fieldErrors.email
                      ? "border-red-300 focus:ring-red-200 bg-red-50"
                      : "border-gray-300 focus:ring-green-200 focus:border-green-400"
                  }`}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <div className='flex items-center gap-1 text-xs text-red-600 mt-1.5'>
                  <AlertCircle className='w-3 h-3' />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>
                Password
              </label>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                  <Lock className='w-5 h-5' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full pl-11 pr-11 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                    touched.password && fieldErrors.password
                      ? "border-red-300 focus:ring-red-200 bg-red-50"
                      : "border-gray-300 focus:ring-green-200 focus:border-green-400"
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <div className='flex items-center gap-1 text-xs text-red-600 mt-1.5'>
                  <AlertCircle className='w-3 h-3' />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='text-right'>
              <Link
                to='/forgot-password'
                className='text-sm text-green-600 hover:text-green-700 font-medium'
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-2'>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>
                New to Farm Predictions?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to='/signup'
            className='block w-full py-3 text-center border-2 border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-all'
          >
            Create an account
          </Link>
        </div>

        {/* Footer */}
        <div className='mt-6 text-center text-xs text-gray-500'>
          By signing in, you agree to our{" "}
          <a href='/terms' className='text-green-600 hover:underline'>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href='/privacy' className='text-green-600 hover:underline'>
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
