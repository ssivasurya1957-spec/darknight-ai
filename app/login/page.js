'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, CheckCircle2, RefreshCw, ChevronLeft, User } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

// ─── Social Provider Config ──────────────────────────────────────────────────
const PROVIDERS = [
  {
    id: 'google',
    label: 'Continue with Google',
    bg: '#ffffff',
    color: '#1f1f1f',
    border: 'rgba(255,255,255,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'Continue with LinkedIn',
    bg: '#0A66C2',
    color: '#ffffff',
    border: 'rgba(10,102,194,0.4)',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'Continue with GitHub',
    bg: '#24292e',
    color: '#ffffff',
    border: 'rgba(255,255,255,0.15)',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
];

// ─── Simulate OAuth session (no real OAuth credentials needed for evaluation) ─
function simulateOAuthLogin(provider, router) {
  const mockUsers = {
    google: { name: 'Google User', email: 'user@gmail.com', avatar: 'GU', provider: 'google' },
    linkedin: { name: 'LinkedIn User', email: 'user@linkedin.com', avatar: 'LU', provider: 'linkedin' },
    github: { name: 'GitHub User', email: 'user@github.com', avatar: 'GH', provider: 'github' },
  };
  const session = {
    ...mockUsers[provider],
    authenticated: true,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('darknight_user', JSON.stringify(session));
  router.push('/dashboard');
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState('main'); // 'main' | 'whatsapp_phone' | 'whatsapp_otp' | 'success'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // ── OAuth Provider Handler ─────────────────────────────────────────────────
  const handleProviderLogin = (providerId) => {
    setLoadingProvider(providerId);
    // Simulate OAuth handshake delay then create local session
    setTimeout(() => {
      setLoadingProvider(null);
      simulateOAuthLogin(providerId, router);
    }, 1200);
  };

  // ── WhatsApp OTP: Send ─────────────────────────────────────────────────────
  const sendOtp = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) return;
    setIsSending(true);

    // Generate a 6-digit OTP client-side for demo
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);

    // Open WhatsApp with the OTP message pre-filled
    const waNumber = digits.startsWith('91') ? digits : `91${digits}`;
    const waMsg = encodeURIComponent(`🦇 DarkKnight AI - Your login OTP is: *${code}*\n\nValid for 5 minutes. Do not share this code.`);
    window.open(`https://api.whatsapp.com/send?phone=${waNumber}&text=${waMsg}`, '_blank');

    setIsSending(false);
    setView('whatsapp_otp');

    // Start 5-minute countdown
    setTimer(300);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // ── WhatsApp OTP: Verify ───────────────────────────────────────────────────
  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) return;
    setVerifying(true);
    setOtpError('');

    setTimeout(() => {
      if (entered === generatedOtp) {
        const session = {
          name: `+${phone.replace(/\D/g, '').startsWith('91') ? '' : '91'}${phone.replace(/\D/g, '')}`,
          phone,
          provider: 'whatsapp',
          authenticated: true,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('darknight_user', JSON.stringify(session));
        setVerifying(false);
        setView('success');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setOtpError('Invalid OTP. Please check your WhatsApp and try again.');
        setVerifying(false);
      }
    }, 800);
  };

  // ── Guest Access ───────────────────────────────────────────────────────────
  const handleGuestAccess = () => {
    const session = {
      name: 'Guest User',
      email: '',
      provider: 'guest',
      authenticated: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('darknight_user', JSON.stringify(session));
    router.push('/dashboard');
  };

  // ── OTP Input Handlers ─────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    clearInterval(timerRef.current);
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    sendOtp();
  };

  const formatTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <ParticleBackground />

      {/* Gold glow top */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <motion.div
        key="card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}
      >
        <div style={S.card}>

          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={S.bkLogo}>BK</div>
            <h1 style={S.title}>DarkKnight AI</h1>
            <p style={S.subtitle}>
              {view === 'main' && 'Sign in to access your career intelligence hub'}
              {view === 'whatsapp_phone' && 'Enter your WhatsApp number'}
              {view === 'whatsapp_otp' && 'Verify your WhatsApp OTP'}
              {view === 'success' && 'Authentication successful'}
            </p>
          </div>

          {/* ── VIEW: MAIN ── */}
          <AnimatePresence mode="wait">
            {view === 'main' && (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Social Providers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleProviderLogin(p.id)}
                      disabled={!!loadingProvider}
                      style={{
                        ...S.providerBtn,
                        backgroundColor: p.bg,
                        color: p.color,
                        border: `1px solid ${p.border}`,
                        opacity: loadingProvider && loadingProvider !== p.id ? 0.5 : 1,
                      }}
                    >
                      {loadingProvider === p.id ? (
                        <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        p.icon
                      )}
                      <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                        {loadingProvider === p.id ? 'Connecting...' : p.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div style={S.divider}>
                  <span style={S.divLine} />
                  <span style={S.divText}>or</span>
                  <span style={S.divLine} />
                </div>

                {/* WhatsApp Auth */}
                <button
                  onClick={() => setView('whatsapp_phone')}
                  style={S.waBtn}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Continue with WhatsApp OTP</span>
                </button>

                {/* Guest */}
                <button onClick={handleGuestAccess} style={S.guestBtn}>
                  <User size={16} />
                  Continue as Guest
                </button>

                <p style={S.terms}>
                  By continuing, you agree to DarkKnight AI's{' '}
                  <span style={{ color: 'var(--primary)' }}>Terms of Service</span>{' '}
                  and{' '}
                  <span style={{ color: 'var(--primary)' }}>Privacy Policy</span>.
                </p>
              </motion.div>
            )}

            {/* ── VIEW: WHATSAPP PHONE ── */}
            {view === 'whatsapp_phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setView('main')} style={S.backBtn}>
                  <ChevronLeft size={16} /> Back
                </button>

                <div style={{ marginBottom: '20px' }}>
                  <label style={S.label}>WhatsApp Phone Number</label>
                  <div style={S.phoneRow}>
                    <span style={S.countryCode}>🇮🇳 +91</span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={S.phoneInput}
                      autoFocus
                    />
                  </div>
                  <p style={S.hint}>We will send an OTP via WhatsApp to this number</p>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={phone.replace(/\D/g, '').length < 10 || isSending}
                  style={{
                    ...S.primaryBtn,
                    opacity: phone.replace(/\D/g, '').length < 10 ? 0.5 : 1,
                  }}
                >
                  {isSending ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
                  {isSending ? 'Sending OTP...' : 'Send OTP via WhatsApp'}
                </button>
              </motion.div>
            )}

            {/* ── VIEW: WHATSAPP OTP ── */}
            {view === 'whatsapp_otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => { setView('whatsapp_phone'); clearInterval(timerRef.current); }} style={S.backBtn}>
                  <ChevronLeft size={16} /> Back
                </button>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
                  Check your <span style={{ color: '#25D366', fontWeight: 600 }}>WhatsApp</span> — we opened a message with your 6-digit OTP. Enter it below to authenticate.
                </p>

                {/* OTP Grid */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      style={{
                        ...S.otpInput,
                        borderColor: otpError ? '#ef4444' : digit ? 'var(--primary)' : 'rgba(212,175,55,0.25)',
                        boxShadow: digit ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
                      }}
                    />
                  ))}
                </div>

                {otpError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', marginBottom: '12px' }}>
                    {otpError}
                  </p>
                )}

                <button
                  onClick={verifyOtp}
                  disabled={otp.some(d => !d) || verifying}
                  style={{
                    ...S.primaryBtn,
                    opacity: otp.some(d => !d) ? 0.5 : 1,
                    marginBottom: '16px',
                  }}
                >
                  {verifying ? <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={18} />}
                  {verifying ? 'Verifying...' : 'Verify & Sign In'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {timer > 0 ? (
                    <>OTP expires in <span style={{ color: timer < 60 ? '#ef4444' : 'var(--primary)' }}>{formatTimer(timer)}</span></>
                  ) : (
                    <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                      Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── VIEW: SUCCESS ── */}
            {view === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '16px 0' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(37,211,102,0.15)', border: '2px solid #25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#25D366' }}
                >
                  <CheckCircle2 size={36} />
                </motion.div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F5E6C8', margin: '0 0 8px' }}>
                  Authenticated
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: {
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#040406',
  },
  card: {
    backgroundColor: 'rgba(10,10,14,0.92)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '20px',
    padding: '36px 32px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.06)',
  },
  bkLogo: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6C8 50%, #B8960C 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1.1rem',
    color: '#000',
    margin: '0 auto 16px',
    boxShadow: '0 0 20px rgba(212,175,55,0.4)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#F5E6C8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin: '0 0 6px',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    margin: 0,
    letterSpacing: '0.02em',
  },
  providerBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '13px 18px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    gap: '12px',
  },
  divLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  divText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.05em',
  },
  waBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '13px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(37,211,102,0.3)',
    backgroundColor: 'rgba(37,211,102,0.08)',
    color: '#25D366',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.9rem',
    transition: 'all 0.15s ease',
    marginBottom: '10px',
  },
  guestBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    transition: 'all 0.15s ease',
    marginBottom: '20px',
  },
  terms: {
    textAlign: 'center',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    lineHeight: 1.6,
    margin: 0,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    padding: '0 0 16px',
    transition: 'color 0.15s',
  },
  label: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '8px',
  },
  phoneRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: '12px',
    padding: '0 16px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: '8px',
  },
  countryCode: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    borderRight: '1px solid rgba(212,175,55,0.15)',
    paddingRight: '12px',
    whiteSpace: 'nowrap',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontFamily: 'var(--font-mono)',
    fontSize: '1rem',
    padding: '14px 0',
    letterSpacing: '0.05em',
  },
  hint: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  primaryBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F5D767 100%)',
    color: '#000',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
    transition: 'all 0.15s ease',
    letterSpacing: '0.04em',
  },
  otpInput: {
    width: '48px',
    height: '56px',
    textAlign: 'center',
    fontSize: '1.4rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(212,175,55,0.25)',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.15s ease',
  },
};
