'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingChatbot from '@/components/FloatingChatbot';
import OnboardingModal from '@/components/OnboardingModal';

export default function DashboardLayout({ children }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    try {
      const prefs = localStorage.getItem('darknight_user_preferences');
      if (!prefs) {
        setShowOnboarding(true);
      }
    } catch (e) {}
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative', backgroundColor: '#040406' }}>
      <ParticleBackground />
      <Sidebar />
      <FloatingChatbot />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      
      {/* Gotham Bat-Signal Moon Atmospheric Effect on Right Side */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(13, 13, 18, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <main style={{
        flexGrow: 1,
        position: 'relative',
        minHeight: '100vh',
        overflowY: 'auto',
        zIndex: 10,
        paddingLeft: '84px', // 84px left padding offset for fixed sidebar
        paddingBottom: '80px',
      }}>
        {/* Top Slogan Banner */}
        <div style={{
          textAlign: 'center',
          padding: '12px 0 4px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: 'var(--primary)',
          fontWeight: 600,
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
        }}>
          🦇 NO EXCUSES. ONLY EXECUTION.
        </div>

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
