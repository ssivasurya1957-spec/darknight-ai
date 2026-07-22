'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GlassCard from './GlassCard';
import Badge from './Badge';

export default function OpportunityCard({ opportunity, index = 0 }) {
  const { id, type, domain, title, organization, location, deadline, matchScore } = opportunity;

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

  const getBarColor = (type) => {
    switch (type.toLowerCase()) {
      case 'hackathon': return 'var(--accent)';
      case 'internship': return 'var(--primary)';
      case 'job': return 'var(--success)';
      case 'research': return '#F59E0B';
      default: return 'var(--primary)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
    >
      <Link href={`/dashboard/opportunity/${id}`} style={{ textDecoration: 'none' }} className="block h-full">
        <GlassCard className="relative h-full p-5 flex flex-col cursor-pointer overflow-hidden group border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,217,255,0.3)] transition-all">
          {/* Top colored bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-1" 
            style={{ backgroundColor: getBarColor(type) }} 
          />
          
          <div className="flex justify-between items-start mb-3 mt-1">
            <Badge variant={getTypeVariant(type)}>[ {type.toUpperCase()} ]</Badge>
            <span className="text-[0.7rem] font-mono text-[var(--accent)] tracking-wider uppercase">[ {domain} ]</span>
          </div>
          
          <h3 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-[var(--text-secondary)] text-xs font-mono mb-5 flex-grow">{organization}</p>
          
          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-mono text-[var(--text-muted)] uppercase">{location}</span>
              <span className="text-xs font-mono text-[var(--danger)] font-medium">
                [ DEADLINE: {daysLeft}D ]
              </span>
            </div>
            
            <div className="flex items-center gap-1 bg-[rgba(59,130,246,0.1)] px-2.5 py-1 rounded-md border border-[rgba(59,130,246,0.2)]">
              <span className="text-[0.65rem] font-mono text-[var(--text-secondary)]">MATCH</span>
              <span className="text-xs font-mono font-bold text-[var(--primary)]">{matchScore}%</span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
