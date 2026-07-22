'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';
import Badge from './Badge';

export default function OpportunityCard({ opportunity, index = 0 }) {
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

  const handleAskAI = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const prompt = `Help me prepare for ${title} at ${organization} (${domain}). What skills should I highlight on my resume?`;
    window.location.href = `/dashboard/chat?prompt=${encodeURIComponent(prompt)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
    >
      <Link href={`/dashboard/opportunity/${id}`} style={{ textDecoration: 'none' }} className="block h-full">
        <GlassCard 
          style={{
            position: 'relative',
            height: '100%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(212, 175, 55, 0.08)', padding: '2px 7px', borderRadius: '6px', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>MATCH</span>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>{matchScore}%</span>
            </div>
          </div>
          
          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
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
            {organization} &nbsp;•&nbsp; <span style={{ textTransform: 'uppercase', color: 'var(--text-muted)' }}>{location}</span>
          </p>

          {/* Stipend / Salary */}
          {stipend && (
            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#22C55E', marginBottom: '16px', fontWeight: 600 }}>
              {stipend}
            </div>
          )}
          
          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(212, 175, 55, 0.1)', gap: '8px' }}>
            <button
              onClick={handleAskAI}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.1)',
                color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Sparkles size={12} /> Ask AI
            </button>

            <a
              href={link || '#'}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000',
                fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none'
              }}
            >
              Apply <ExternalLink size={11} />
            </a>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
