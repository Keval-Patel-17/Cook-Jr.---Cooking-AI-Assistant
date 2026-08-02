import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('cookjr_token', data.token);
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@cookjr.com', password: 'cookjr123' }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('cookjr_token', data.token);
        onSuccess(data.user, data.token);
        onClose();
      }
    } catch (err) {
      setError('Could not start guest session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-orange-500/30 shadow-2xl bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg mb-3">
            <ChefHat className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">{isSignUp ? 'Join Cook Jr. Today' : 'Welcome Back, Chef!'}</h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {isSignUp ? 'Create your profile to save recipes & track progress' : 'Log in to access your customized culinary dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                placeholder="chef@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 btn-skeuo font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center text-xs text-stone-400">
          <span className="bg-white dark:bg-stone-900 px-3 relative z-10">OR</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
          </div>
        </div>

        <button
          onClick={handleGuestEntry}
          type="button"
          className="w-full py-2.5 btn-skeuo-secondary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quick Guest Entry (Instant Chef Access)</span>
        </button>

        <p className="text-center text-xs text-stone-500 mt-5">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-orange-600 dark:text-orange-400 font-bold hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
