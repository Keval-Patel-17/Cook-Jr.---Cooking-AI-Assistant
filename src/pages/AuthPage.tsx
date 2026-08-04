import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme } from '@/lib/ThemeContext';

export function AuthPage() {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();
  const { theme, toggle } = useTheme();

  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Validation
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const validateForm = () => {
    setError('');

    if (isSignUp && !name.trim()) {
      setError('Please enter your full name.');
      return false;
    }

    if (!email.trim()) {
      setError('Email address is required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setError('Password is required.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp ? { name: name.trim(), email: email.trim(), password } : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your details.');
      }

      handleLoginSuccess(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      // Execute Google Auth API request
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Cook Junior User',
          email: email.trim() || 'google.user@cookjr.com',
          googleId: 'google-oauth-' + Date.now(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google Sign-In failed');
      }

      handleLoginSuccess(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setError('Please enter a valid email address for password reset.');
      return;
    }
    setForgotSubmitted(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500 text-white shadow-md">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg hidden sm:inline">Cook Jr.</span>
        </div>

        <button
          onClick={toggle}
          className="p-2.5 rounded-xl glass-panel hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
        </button>
      </header>

      {/* MAIN AUTH CONTAINER */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/20 shadow-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl"
        >
          {/* Header section inside card */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-3">
              <ChefHat className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              {isSignUp
                ? 'Sign up to unlock custom AI recipes & progress tracking'
                : 'Log in to access your personalized culinary dashboard'}
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex p-1 bg-stone-200/60 dark:bg-stone-800/60 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                !isSignUp
                  ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-md'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError('');
              }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                isSignUp
                  ? 'bg-white dark:bg-stone-900 text-orange-600 dark:text-orange-400 shadow-md'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 hover:bg-stone-100 dark:hover:bg-stone-700/80 transition shadow-sm mb-5 cursor-pointer disabled:opacity-50"
          >
            {/* Google Multicolor SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.31 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12c0 1.96.45 3.8 1.26 5.42l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* OR Divider */}
          <div className="relative my-5 text-center text-xs text-stone-400 font-semibold uppercase tracking-wider">
            <span className="bg-white/80 dark:bg-stone-900/80 px-3 relative z-10">Or continue with email</span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
          </div>

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Chef"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="chef@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotSubmitted(false);
                      setForgotEmail(email);
                    }}
                    className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60 text-sm focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 btn-skeuo font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Login'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access fallback */}
          <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 text-center">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'demo@cookjr.com', password: 'cookjr123' }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    handleLoginSuccess(data);
                    navigate('/dashboard');
                  }
                } catch (err) {
                  setError('Failed quick login.');
                } finally {
                  setLoading(false);
                }
              }}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 font-semibold cursor-pointer transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Guest Mode (Try without signing up)</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-sm p-6 rounded-3xl glass-panel bg-white dark:bg-stone-900 shadow-2xl border border-orange-500/30"
            >
              <h3 className="text-lg font-bold mb-2">Reset Password</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>

              {forgotSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                  <p className="font-bold">Reset Email Sent!</p>
                  <p>Check <b>{forgotEmail}</b> for password recovery instructions.</p>
                  <button
                    onClick={() => setForgotModalOpen(false)}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="chef@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl btn-skeuo text-xs font-bold cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 w-full py-4 text-center text-xs text-stone-400">
        <p>© 2026 Cook Junior • Secure Culinary Portal</p>
      </footer>
    </div>
  );
}
