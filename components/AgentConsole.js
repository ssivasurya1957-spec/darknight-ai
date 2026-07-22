'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, RefreshCw, Cpu } from 'lucide-react';
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
        background: 'rgba(10,10,16,0.95)',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        fontSize: '0.72rem',
        fontFamily: 'var(--font-mono)',
        zIndex: 40,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22C55E' }}>
          <Radio size={14} className="animate-pulse" />
          <span style={{ fontWeight: 700 }}>{status.status}</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Active Loops: <strong style={{ color: '#D4AF37' }}>{status.activeAgents} Agents</strong>
        </span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ color: 'var(--text-secondary)' }}>
          Postings Scanned: <strong style={{ color: '#fff' }}>{status.scannedCount}+</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--text-muted)' }}>
          Last Agent Sync: <strong style={{ color: '#22C55E' }}>{status.lastSync}</strong>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
          <Cpu size={12} /> Gemini 1.5 Flash Active
        </div>
      </div>
    </motion.div>
  );
}
