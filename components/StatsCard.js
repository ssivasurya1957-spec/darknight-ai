'use client'

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

export default function StatsCard({ icon: Icon, label, value, change, changeType = 'neutral' }) {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-[var(--success)]';
    if (changeType === 'negative') return 'text-[var(--danger)]';
    return 'text-[var(--text-secondary)]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <GlassCard className="p-5 flex flex-col h-full relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
          {Icon && (
            <div className="p-2 bg-[rgba(255,255,255,0.03)] rounded-md border border-[rgba(255,255,255,0.05)]">
              <Icon size={18} className="text-[var(--text-secondary)]" />
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-bold text-3xl text-[var(--text-primary)]">{value}</span>
            {change && (
              <span className={`text-xs font-medium ${getChangeColor()}`}>
                {change}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
