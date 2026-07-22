'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';
import Badge from './Badge';

export default function OpportunityCard({ opportunity, index = 0 }) {
  const router = useRouter();
  const { id, type, domain, title, organization, location, deadline, stipend, matchScore, link } = opportunity;

  const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  const getTypeVariant = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon': return 'cyan';
      case 'internship': return 'blue';
      case 'job': return 'green';
      case 'research': return 'amber';
      default: return 'blue';
    }
  };

  const getBorderColor = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon': return 'rgba(0, 217, 255, 0.4)';
      case 'internship': return 'rgba(212, 175, 55, 0.4)';
      case 'job': return 'rgba(34, 197, 94, 0.4)';
      case 'research': return 'rgba(243, 156, 18, 0.4)';
      default: return 'rgba(212, 175, 55, 0.4)';
    }
  };

  const getHeaderBarColor = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon': return '#00D9FF';
      case 'internship': return '#D4AF37';
      case 'job': return '#22C55E';
      case 'research': return '#F39C12';
      default: return '#D4AF37';
    }
  };

  const handleCardClick = () => {
    router.push(`/dashboard/opportunity/${id}`);
  };

  const handleAskAI = (e) => {
    e.stopPropagation();
    const prompt = `Help me prepare for ${title} at ${organization} (${domain}). What skills should I highlight on my resume?`;
    router.push(`/dashboard/chat?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleApplyClick = (e) => {
    e.stopPropagation();
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer', height: '100%' }}
    >
      <GlassCard 
        style={{
          position: 'relative',
          height: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0c0c10',
          border: `1px solid ${getBorderColor(type)}`,
          borderRadius: '14px',
          boxShadow: `0 0 15px ${getBorderColor(type)}1A`,
          transition: 'all 250ms ease',
        }}
        className="group"
      >
        {/* Top header glow bar */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: getHeaderBarColor(type),
            boxShadow: `0 0 10px ${getHeaderBarColor(type)}`,
          }} 
        />
        
        {/* Category & Domain */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', marginTop: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Badge variant={getTypeVariant(type)}>[ {type.toUpperCase()} ]</Badge>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
              | {domain.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255, 133, 161, 0.12)', padding: '3px 9px', borderRadius: '14px', border: '1px solid rgba(255, 133, 161, 0.35)' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FF85A1' }}>💖 {matchScore}%</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 800,
          fontSize: '1.05rem',
          color: '#ffffff',
          marginBottom: '4px',
          lineHeight: 1.3,
          transition: 'color 200ms ease',
        }} className="group-hover:text-[var(--primary)] line-clamp-2">
          {title}
        </h3>

        {/* Organization & Location */}
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', margin: 0, marginBottom: '12px' }}>
          {organization} &nbsp;•&nbsp; <span style={{ textTransform: 'uppercase', color: 'var(--text-muted)' }}>📍 {location}</span>
        </p>

        {/* Stipend / Salary */}
        {stipend && (
          <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#10B981', marginBottom: '16px', fontWeight: 700 }}>
            💰 {stipend}
          </div>
        )}
        
        {/* Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(244, 196, 48, 0.15)', gap: '8px' }}>
          <button
            type="button"
            onClick={handleAskAI}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '12px',
              border: '1px solid rgba(255, 133, 161, 0.4)', background: 'rgba(255, 133, 161, 0.12)',
              color: '#FF85A1', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            <Sparkles size={12} /> 🦇✨ Ask Batty
          </button>

          <button
            type="button"
            onClick={handleApplyClick}
            className="cute-button-gold"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: '12px',
              border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer'
            }}
          >
            Apply Directly 💖 <ExternalLink size={11} />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
