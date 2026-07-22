'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

export default function LoginPage() {
  const [loading, setLoading] = useState(null); // 'google' | 'guest'
  const [error, setError] = useState('');
  const [guestName, setGuestName] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading('google');
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Google Sign-In failed. Please check your network or OAuth configuration.');
      setLoading(null);
    }
  };

  const handleGuestLogin = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please enter a username for Guest access.');
      return;
    }
    setLoading('guest');
    const session = {
      name: guestName.trim(),
      email: `${guestName.toLowerCase().replace(/\s+/g, '')}@guest.local`,
      provider: 'guest',
      authenticated: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('darknight_user', JSON.stringify(session));
    window.location.href = '/dashboard';
  };

  return (
    <div style={S.page}>
      <ParticleBackground />

      {/* Background radial ambient glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px' }}
      >
        <div style={S.card}>

          {/* Logo Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={S.bkLogo}>BK</div>
            <h1 style={S.title}>DarkKnight AI</h1>
            <p style={S.subtitle}>Autonomous Career & Opportunity Intelligence</p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '16px', fontSize: '0.8rem', color: '#ef4444' }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Authentication Options (Google & Guest with Username Only) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* 1. Real Google OAuth Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={!!loading}
              style={{
                ...S.providerBtn,
                background: '#ffffff',
                color: '#1f1f1f',
                boxShadow: '0 4px 14px rgba(255,255,255,0.1)',
                opacity: loading && loading !== 'google' ? 0.4 : 1,
              }}
            >
              {loading === 'google' ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', color: '#4285F4' }} />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span style={{ fontWeight: 600 }}>{loading === 'google' ? 'Redirecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <span style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.12)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>or</span>
              <span style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.12)' }} />
            </div>

            {/* 2. Guest Login with Username */}
            {!showGuestForm ? (
              <button
                onClick={() => setShowGuestForm(true)}
                disabled={!!loading}
                style={{
                  ...S.providerBtn,
                  background: 'rgba(255,255,255,0.03)',
                  color: '#F5E6C8',
                  border: '1px solid rgba(212,175,55,0.25)',
                }}
              >
                <User size={18} style={{ color: '#D4AF37' }} />
                <span>Continue as Guest</span>
              </button>
            ) : (
              <form onSubmit={handleGuestLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#D4AF37', textTransform: 'uppercase' }}>
                  Enter your Username:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. Alex_Wayne"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    autoFocus
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(212,175,55,0.3)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      fontFamily: 'inherit',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading === 'guest'}
                    style={{
                      padding: '0 18px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #D4AF37, #F5D767)',
                      color: '#000000',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {loading === 'guest' ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={18} />}
                  </button>
                </div>
              </form>
            )}

          </div>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
            Secured by OAuth 2.0 & NextAuth.js · No passwords stored.
          </p>
        </div>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

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
    background: 'rgba(10,10,14,0.95)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '20px',
    padding: '36px 32px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.05)',
  },
  bkLogo: {
    width: '52px', height: '52px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6C8 50%, #B8960C 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: '#000',
    margin: '0 auto 16px', boxShadow: '0 0 24px rgba(212,175,55,0.4)',
  },
  title: {
    fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800,
    color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px',
  },
  subtitle: {
    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
    color: 'var(--text-secondary)', margin: 0, letterSpacing: '0.02em',
  },
  providerBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justify: 'center', gap: '12px',
    padding: '14px 18px', borderRadius: '12px', border: 'none',
    cursor: 'pointer', transition: 'all 0.15s ease',
    fontFamily: 'inherit', fontSize: '0.9rem',
  },
};
