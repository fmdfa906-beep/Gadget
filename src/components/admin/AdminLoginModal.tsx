import React, { useState } from 'react';
import { 
  Lock, 
  X, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AdminLoginModal: React.FC = () => {
  const { 
    isAdminLoginOpen, 
    closeAdminLogin, 
    loginWithEmail, 
    setupFirstAdmin,
    loginWithGoogle,
    hasAdmins
  } = useShop();

  const [mode, setMode] = useState<'login' | 'setup'>(hasAdmins ? 'login' : 'setup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminLoginOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('ইমেইল ও পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    setLoading(true);
    const success = await loginWithEmail(email, password);
    setLoading(false);
    if (!success) {
      setErrorMsg('ভুল ইমেইল বা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।');
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('সবগুলো তথ্য পূরণ করুন।');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('উভয় পাসওয়ার্ড একই হতে হবে!');
      return;
    }

    setLoading(true);
    const success = await setupFirstAdmin(email, password);
    setLoading(false);
    if (!success) {
      setErrorMsg('এডমিন একাউন্ট তৈরি করতে ব্যর্থ হয়েছে। ইমেইলটি চেক করুন।');
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setGoogleLoading(true);
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Decor */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={closeAdminLogin}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>

          <h2 className="text-xl font-black">
            {mode === 'login' ? 'এডমিন সিকিউর লগইন' : 'প্রথম এডমিন একাউন্ট সেটআপ'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Gadget Garden ম্যানেজমেন্ট প্যানেল অ্যাক্সেস' 
              : 'Firebase Authentication এ আপনার এডমিন একাউন্ট তৈরি করুন'}
          </p>
        </div>

        {/* Tab switch between Login and First Admin Setup */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'login'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>লগইন করুন</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('setup'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'setup'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>নতুন এডমিন সেটআপ</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode 1: Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  এডমিন ইমেইল (Admin Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="admin@gadgetgarden.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  এডমিন পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>লগইন হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>এডমিন লগইন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Mode 2: First Admin Setup Form */
            <form onSubmit={handleSetupSubmit} className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 leading-relaxed">
                💡 <strong>এডমিন সেটআপ:</strong> আপনার ব্যক্তিগত ইমেইল এবং অন্তত ৬ অক্ষরের একটি শক্তিশালী পাসওয়ার্ড দিয়ে নতুন এডমিন একাউন্ট খুলুন।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  এডমিন ইমেইল (Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="আপনার ইমেইল দিন (যেমন: fmdfa906@gmail.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="নতুন পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>একাউন্ট তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>এডমিন একাউন্ট তৈরি করুন</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center pt-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-semibold absolute">
              অথবা
            </span>
          </div>

          {/* Google One-Tap Sign In */}
          <div>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Google একাউন্ট দিয়ে এক ক্লিকে সাইন ইন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
