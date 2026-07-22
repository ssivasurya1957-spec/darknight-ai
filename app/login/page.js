'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserPlus, LogIn, ArrowRight } from 'lucide-react';
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
    e.preventDefault();
    setIsDispatching(true);
    try {
      const res = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          title: tab === 'SIGN_UP' ? '🦇 DarkKnight AI Registration Passkey' : '🔐 DarkKnight Authentication Passkey',
          message: `Your 6-digit verification token is ready. Authenticate to establish your session.`,
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

  const handleVerified = () => {
    // Save persistent user session to localStorage
    const userSession = {
      name: name || (tab === 'SIGN_UP' ? 'New Agent' : 'Alex Chen'),
      email: email || 'alex.chen@university.edu',
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
        userEmail={email || 'alex.chen@university.edu'}
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
                placeholder="Email Address"
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
              {isDispatching ? 'Generating Passkey...' : (tab === 'SIGN_IN' ? '[ AUTHENTICATE SESSION ]' : '[ REGISTER & VERIFY EMAIL ]')}
            </button>
          </form>

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
    backgroundColor: '#050505',
  },
  cardContainer: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '460px',
  },
  glassCard: {
    backgroundColor: 'rgba(17, 17, 17, 0.75)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(0, 217, 255, 0.25)',
    borderRadius: '24px',
    padding: '36px 32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 217, 255, 0.08)',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.2rem',
    color: '#ffffff',
    marginBottom: '6px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
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
    color: '#ffffff',
    boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)',
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
    color: 'var(--accent)',
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
    color: 'var(--accent)',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'underline',
    marginLeft: '6px',
  },
};
