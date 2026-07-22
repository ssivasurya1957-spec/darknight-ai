'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';

export default function LandingPage() {
  const [showButtons, setShowButtons] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <ParticleBackground />
      
      <div style={styles.content}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={styles.monogramContainer}
          className="animate-pulse-glow"
        >
          <span style={styles.monogram}>DK</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          style={styles.title}
          className="text-display"
        >
          DARKNIGHT AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          style={styles.subtitle}
        >
          by the dn production
        </motion.p>

        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={styles.buttonGroup}
            >
              <button 
                className="btn btn-primary" 
                onClick={() => router.push('/login')}
                style={styles.glowButtonPrimary}
              >
                Sign In
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => router.push('/dashboard')}
                style={styles.glowButtonOutline}
              >
                Explore
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#050505',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  monogramContainer: {
    marginBottom: '24px',
    borderRadius: '50%',
    padding: '20px',
  },
  monogram: {
    fontSize: '120px',
    fontWeight: 300,
    letterSpacing: '0.1em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-display)',
    lineHeight: 1,
  },
  title: {
    fontSize: '32px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontWeight: 400,
    textTransform: 'lowercase',
    marginBottom: '48px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
  },
  glowButtonPrimary: {
    minWidth: '140px',
    boxShadow: '0 0 16px rgba(59, 130, 246, 0.15)',
  },
  glowButtonOutline: {
    minWidth: '140px',
  }
};
