'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  Send,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type AuthTab = 'login' | 'signup' | 'otp' | 'recovery';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<AuthTab>('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(30);

  // Reset Password States
  const [recoveryCodeVerified, setRecoveryCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Instant URL token & session handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const search = window.location.search;

      if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
        router.replace('/sectors');
        return;
      }

      if (search && search.includes('code=')) {
        const urlParams = new URLSearchParams(search);
        const code = urlParams.get('code');
        if (code) {
          supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
            if (!error && data.session) {
              router.replace('/sectors');
            }
          });
        }
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/sectors');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace('/sectors');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Clean messages on tab change
  const handleTabChange = (newTab: AuthTab) => {
    setTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setOtpCode('');
    setRecoveryCodeVerified(false);
  };

  // Instant Guest / Demo Clearance (Zero Latency)
  const handleDemoAccess = () => {
    localStorage.setItem('nexoraGuestMode', 'true');
    localStorage.setItem('activeSector', 'ENGINEERING');
    localStorage.setItem('activeStream', 'MPC');
    localStorage.setItem('activeSubPath', 'Intermediate MPC');
    router.replace('/dashboard');
  };

  // Google OAuth Login with dedicated server callback
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:3001/auth/callback';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { prompt: 'select_account' }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to initiate Google OAuth gateway.');
      setLoading(false);
    }
  };

  // Email & Password Auth (Instant Auto-Confirmed)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg('Please enter both Email and Password.');
      return;
    }

    setLoading(true);

    try {
      if (tab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid credentials. If this account was registered via Google, please sign in with Google or use OTP.');
          }
          throw error;
        }

        if (data.session) {
          localStorage.removeItem('nexoraGuestMode');
          router.replace('/sectors');
        }
      } else if (tab === 'signup') {
        if (password !== confirmPassword) {
          setErrorMsg('Password confirmation does not match.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: name.trim() || 'Nexora Student' }
          }
        });

        if (error) throw error;

        // Auto-confirmed via database trigger - sign in immediately
        const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!loginErr && loginData.session) {
          router.replace('/sectors');
        } else {
          router.replace('/sectors');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication clearance denied.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (tab === 'recovery') {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/auth`
        });
        if (error) throw error;
        setOtpSent(true);
        setTimer(30);
        setSuccessMsg('Password recovery token dispatched. Check your inbox.');
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        setOtpSent(true);
        setTimer(30);
        setSuccessMsg('Instant 6-digit OTP verification code dispatched to your email.');
      }
    } catch (err: any) {
      if (err.status === 429) {
        setErrorMsg('Email rate limit reached on Supabase. Wait a moment or use Email/Password or Guest Clearance.');
      } else {
        setErrorMsg(err.message || 'Failed to dispatch security code.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Code
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = otpCode.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMsg('Please input the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const verifyType = tab === 'recovery' ? 'recovery' : 'email';
      
      let { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanCode,
        type: verifyType as any
      });

      if (error && verifyType === 'email') {
        const fallback = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanCode,
          type: 'magiclink' as any
        });
        if (!fallback.error) {
          data = fallback.data;
          error = null;
        }
      }

      if (error) throw error;

      if (tab === 'recovery') {
        setRecoveryCodeVerified(true);
        setSuccessMsg('Recovery verified. Set your new security password.');
      } else {
        router.replace('/sectors');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Update Password After Recovery
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccessMsg('Password updated! Redirecting to command hub...');
      setTimeout(() => router.replace('/dashboard'), 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        
        {/* Glowing Background Ring */}
        <div className="absolute -top-6 -left-6 -right-6 -bottom-6 bg-gradient-to-r from-cyber-cyan/20 via-cyber-violet/20 to-cyber-pink/20 rounded-[36px] blur-xl opacity-75 pointer-events-none"></div>

        {/* Main Auth Container */}
        <div className="relative glass-panel rounded-3xl border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 shadow-2xl">
          
          {/* Logo / Greeting */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyber-cyan to-cyber-violet p-[1.5px] items-center justify-center mb-1 shadow-md">
              <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyber-cyan" />
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-widest text-slate-900 dark:text-white">NEXORA CLEARANCE</h2>
            <p className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-wider">
              STUDENT IDENTITY & ACADEMIC GATEWAY
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-4 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] mb-6">
            {(['login', 'signup', 'otp', 'recovery'] as AuthTab[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleTabChange(mode)}
                className={`py-2 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all ${
                  tab === mode
                    ? 'bg-gradient-to-r from-cyber-cyan to-cyber-violet text-background shadow-md font-extrabold'
                    : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Register' : mode === 'otp' ? 'OTP' : 'Reset'}
              </button>
            ))}
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs font-bold flex items-start gap-2 leading-relaxed">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GOOGLE OAUTH 1-CLICK GATEWAY */}
          {(tab === 'login' || tab === 'signup') && (
            <div className="space-y-4 mb-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-xs font-black tracking-wider text-slate-800 dark:text-white flex items-center justify-center gap-3 transition group shadow-sm"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z" />
                </svg>
                <span>CONTINUE WITH GOOGLE</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/[0.08]"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-white/30 tracking-widest">OR VIA CREDENTIALS</span>
                <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/[0.08]"></div>
              </div>
            </div>
          )}

          {/* TAB 1 & 2: LOGIN / SIGNUP FORM */}
          {(tab === 'login' || tab === 'signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@institution.edu"
                    className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                  Password Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                    required
                  />
                </div>
              </div>

              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                    Confirm Password Key
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full cyber-button-primary py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING CLEARANCE...</span>
                  </>
                ) : (
                  <>
                    <span>{tab === 'login' ? 'ENTER NEXUS HUB' : 'CREATE INSTANT STUDENT DOSSIER'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: OTP LOGIN */}
          {tab === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@institution.edu"
                        className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cyber-button-primary py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>TRANSMIT OTP TOKEN</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider">
                        6-Digit Security OTP
                      </label>
                      <span className="text-[11px] font-bold text-cyber-cyan">{timer > 0 ? `${timer}s` : 'Expired'}</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition shadow-inner"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full cyber-button-primary py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>VERIFY SECURITY CODE</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={timer > 0 || loading}
                      onClick={() => handleSendOTP()}
                      className="text-xs font-bold text-cyber-cyan hover:underline disabled:text-slate-400 dark:disabled:text-white/30 flex items-center gap-1.5 mx-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Resend Token</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: PASSWORD RECOVERY */}
          {tab === 'recovery' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                      Account Email for Recovery
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@institution.edu"
                        className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cyber-button-primary py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>DISPATCH RECOVERY SIGNAL</span>
                  </button>
                </form>
              ) : !recoveryCodeVerified ? (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                      Enter Recovery Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-cyber-cyan transition shadow-inner"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full cyber-button-primary py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    <span>VERIFY RECOVERY CODE</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-white/70 uppercase tracking-wider mb-1.5">
                      Enter New Security Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/40" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-100 dark:bg-surface-card border border-slate-200 dark:border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyber-cyan transition shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full cyber-button-primary py-3.5 rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>UPDATE SECURITY KEY</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* INSTANT QUICK DEMO ACCESS BUTTON */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/[0.08] text-center">
            <button
              onClick={handleDemoAccess}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-xs font-black tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Zap className="w-4 h-4" />
              <span>INSTANT GUEST CLEARANCE (DEMO)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
