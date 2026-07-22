'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Radio, Cpu } from 'lucide-react';
import { getAgentStatus } from '@/lib/agentState';

export default function AgentConsole() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(getAgentStatus());
    const interval = setInterval(() => {
      setStatus(getAgentStatus());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(10,8,16,0.95)',
        borderBottom: '1px solid rgba(255,133,161,0.25)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        zIndex: 40,
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div className="cute-badge cute-badge-pink">
          <span>🦇✨</span>
          <span>Batty AI Guarding 24/7</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Active Bat-Loops: <strong style={{ color: '#F4C430' }}>{status.activeAgents} Agents 💖</strong>
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Dream Opportunities Scanned: <strong style={{ color: '#FF85A1' }}>{status.scannedCount}+ 🎀</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          Bat-Sync: <strong style={{ color: '#10B981' }}>{status.lastSync}</strong>
        </span>
        <div className="cute-badge" style={{ padding: '3px 10px' }}>
          <Sparkles size={12} /> Gemini 2.5 Active ✨
        </div>
      </div>
    </motion.div>
  );
}
