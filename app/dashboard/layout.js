'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingChatbot from '@/components/FloatingChatbot';
import OnboardingModal from '@/components/OnboardingModal';
import AgentConsole from '@/components/AgentConsole';

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
