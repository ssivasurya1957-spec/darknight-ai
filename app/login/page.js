'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { User, AlertCircle, Loader2 } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';

export default function LoginPage() {
  const [loading, setLoading] = useState(null); // 'google' | 'github' | 'guest'
  const [error, setError] = useState('');

  const handleOAuth = async (provider) => {
    setLoading(provider);
    setError('');
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setLoading(null);
    }
  };

  const handleGuest = () => {
    setLoading('guest');
    const session = {
      name: 'Guest',
      email: '',
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

      {/* Background glow */}
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px' }}
      >
        <div style={S.card}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={S.bkLogo}>BK</div>
            <h1 style={S.title}>DarkKnight AI</h1>
            <p style={S.subtitle}>Career Intelligence Platform</p>
            <p style={{ ...S.subtitle, marginTop: '4px', fontSize: '0.7rem', opacity: 0.6 }}>
              PS4 · The DN Production
            </p>
          </div>

          {/* Error */}
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

          {/* Sign In Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Google */}
            <button
              onClick={() => handleOAuth('google')}
              disabled={!!loading}
              style={{ ...S.providerBtn, background: '#fff', color: '#1f1f1f', border: '1px solid rgba(255,255,255,0.15)', opacity: loading && loading !== 'google' ? 0.4 : 1 }}
            >
              {loading === 'google' ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>{loading === 'google' ? 'Redirecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleOAuth('github')}
              disabled={!!loading}
              style={{ ...S.providerBtn, background: '#24292e', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', opacity: loading && loading !== 'github' ? 0.4 : 1 }}
            >
              {loading === 'github' ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              )}
              <span>{loading === 'github' ? 'Redirecting to GitHub...' : 'Continue with GitHub'}</span>
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <span style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>or</span>
              <span style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
            </div>

            {/* Guest */}
            <button
              onClick={handleGuest}
              disabled={!!loading}
              style={{ ...S.providerBtn, background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.06)', opacity: loading && loading !== 'guest' ? 0.4 : 1 }}
            >
              {loading === 'guest' ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <User size={20} />}
              <span>Continue as Guest</span>
            </button>
          </div>

          {/* Setup Note */}
          <div style={{ marginTop: '24px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: '#D4AF37' }}>⚙ Setup Required:</span> Add your <strong>Google OAuth credentials</strong> from{' '}
              <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color: '#D4AF37' }}>console.cloud.google.com</a>{' '}
              to <code style={{ background: 'rgba(212,175,55,0.1)', padding: '1px 5px', borderRadius: '3px' }}>.env.local</code>
            </p>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
            By signing in, you agree to our Terms & Privacy Policy.
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
    background: 'rgba(10,10,14,0.94)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(212,175,55,0.18)',
    borderRadius: '20px',
    padding: '36px 32px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.05)',
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
    width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
    padding: '14px 18px', borderRadius: '12px', border: 'none',
    cursor: 'pointer', transition: 'all 0.15s ease',
    fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 500,
  },
};
