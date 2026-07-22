'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import ParticleBackground from '@/components/ParticleBackground';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative', backgroundColor: '#050505' }}>
      <ParticleBackground />
      <Sidebar />
      <main style={{
        flexGrow: 1,
        position: 'relative',
        minHeight: '100vh',
        overflowY: 'auto',
        zIndex: 10,
        paddingLeft: '80px', // Explicit 80px offset for fixed sidebar
        paddingBottom: '80px',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to bottom, rgba(59,130,246,0.05), transparent)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
