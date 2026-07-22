'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ParticleBackground from '@/components/ParticleBackground';
import OnboardingModal from '@/components/OnboardingModal';
import AgentConsole from '@/components/AgentConsole';
import BattyChatbotWidget from '@/components/BattyChatbotWidget';

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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative', backgroundColor: 'var(--bg)' }}>
      <ParticleBackground />
      <Sidebar />
      <BattyChatbotWidget />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.08) 0%, rgba(255, 42, 95, 0.04) 50%, rgba(3, 2, 6, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      <main style={{
        flexGrow: 1,
        position: 'relative',
        minHeight: '100vh',
        overflowY: 'auto',
        zIndex: 10,
        paddingLeft: '84px',
        paddingBottom: '80px',
      }}>
        {/* Top Agent Status Bar */}
        <AgentConsole />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '16px 20px 0' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
