'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserPlus, LogIn, Mail } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import EmailVerificationModal from '@/components/EmailVerificationModal';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState('SIGN_IN'); // 'SIGN_IN' | 'SIGN_UP'
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [skills, setSkills] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const targetEmail = email || 'alex.chen@gmail.com';
    setIsDispatching(true);
    try {
      const res = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetEmail,
          title: tab === 'SIGN_UP' ? '🦇 DarkKnight AI Google Registration Passkey' : '🔐 DarkKnight Google Authentication Token',
          message: `Your 6-digit Google authentication token is ready. Verify email identity to log in.`,
        }),
      });
      const data = await res.json();
      if (data.details?.previewUrl) {
        setPreviewUrl(data.details.previewUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDispatching(false);
      setShowModal(true);
    }
  };

  const handleGoogleSignIn = () => {
    // Official Google OAuth Authorization Redirect URL
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=105829148291-darknight.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(window.location.origin + '/dashboard')}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
    window.location.href = googleOAuthUrl;
  };

  const handleVerified = () => {
    // Save persistent user session to localStorage
    const userSession = {
      name: name || (tab === 'SIGN_UP' ? 'Google Agent' : 'Alex Chen'),
      email: email || 'alex.chen@gmail.com',
      university: university || 'Indian Institute of Technology, Delhi',
      skills: skills ? skills.split(',').map(s => s.trim()) : ['Python', 'Machine Learning', 'React', 'SQL'],
      authenticated: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('darknight_user', JSON.stringify(userSession));
    router.push('/dashboard');
  };

  return (
    <div style={styles.container}>
      <ParticleBackground />

      <EmailVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userEmail={email || 'alex.chen@gmail.com'}
        previewUrl={previewUrl}
        mode={tab}
        onVerified={handleVerified}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={styles.cardContainer}
      >
        <div style={styles.glassCard}>
          <div style={styles.header}>
            <div className="bat-hud-tag" style={{ display: 'inline-block', marginBottom: '12px' }}>
              [ WAYNE TECH AUTH SYSTEM // v4.2 ]
            </div>
            <h1 className="text-display" style={styles.title}>darknight ai</h1>
            <p style={styles.subtitle}>
              {tab === 'SIGN_IN' ? '[ SECURITY CLEARANCE ACCESS ]' : '[ NEW AGENT REGISTRATION ]'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={styles.tabContainer}>
            <button
              onClick={() => setTab('SIGN_IN')}
              style={{
                ...styles.tabButton,
                ...(tab === 'SIGN_IN' ? styles.tabActive : styles.tabInactive)
              }}
            >
              <LogIn size={15} />
              <span>SIGN IN</span>
            </button>
            <button
              onClick={() => setTab('SIGN_UP')}
              style={{
                ...styles.tabButton,
                ...(tab === 'SIGN_UP' ? styles.tabActive : styles.tabInactive)
              }}
            >
              <UserPlus size={15} />
              <span>CREATE ACCOUNT</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {tab === 'SIGN_UP' && (
              <>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="University / Organization"
                    className="input"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Skills (e.g. Python, ML, React)"
                    className="input"
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                  />
                </div>
              </>
            )}

            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Google / Gmail Address"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="password"
                placeholder="Security Passphrase"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            
            {tab === 'SIGN_IN' && (
              <div style={styles.row}>
                <label style={styles.remember}>
                  <input type="checkbox" style={{ marginRight: '8px' }} defaultChecked />
                  Remember Session
                </label>
                <a href="#" style={styles.forgot}>Forgot Passphrase?</a>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={isDispatching}>
              {isDispatching ? 'Dispatching Google OTP...' : (tab === 'SIGN_IN' ? '[ GOOGLE MAIL AUTHENTICATION ]' : '[ REGISTER & VERIFY MAIL ]')}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or</span>
            <span style={styles.dividerLine}></span>
          </div>

          <button type="button" className="btn btn-outline" style={styles.googleBtn} onClick={handleGoogleSignIn}>
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google Account
          </button>

          <div style={styles.footer}>
            {tab === 'SIGN_IN' ? (
              <>Don't have clearance? <button onClick={() => setTab('SIGN_UP')} style={styles.linkBtn}>Register New Account</button></>
            ) : (
              <>Already registered? <button onClick={() => setTab('SIGN_IN')} style={styles.linkBtn}>Sign In to Clearance</button></>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#040406',
  },
  cardContainer: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '460px',
  },
  glassCard: {
    backgroundColor: 'rgba(12, 12, 16, 0.85)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    borderRadius: '24px',
    padding: '36px 32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.1)',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.2rem',
    color: '#F5E6C8',
    marginBottom: '6px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-display)',
  },
  subtitle: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
    letterSpacing: '0.1em',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(212, 175, 55, 0.15)',
  },
  tabButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms ease',
  },
  tabActive: {
    backgroundColor: 'var(--primary)',
    color: '#000000',
    boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
  },
  tabInactive: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
  },
  remember: {
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  forgot: {
    color: 'var(--primary)',
    textDecoration: 'none',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.1em',
    marginTop: '8px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  dividerText: {
    padding: '0 16px',
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
  },
  googleBtn: {
    width: '100%',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-secondary)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'underline',
    marginLeft: '6px',
  },
};
