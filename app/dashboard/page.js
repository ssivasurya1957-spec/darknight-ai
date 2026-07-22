'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Clock, Sparkles, ArrowRight, Heart, Star } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import OpportunityCard from '@/components/OpportunityCard';
import { opportunities as mockOpportunities } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState('BAT-AGENT');

  useEffect(() => {
    try {
      if (session?.user?.name) {
        setUserName(session.user.name.toUpperCase());
        return;
      }
      const stored = localStorage.getItem('darknight_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUserName(parsed.name.toUpperCase());
      }
    } catch (e) {
      console.error(e);
    }
  }, [session]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING, CUTIE';
    if (hour < 18) return 'GOOD AFTERNOON, CUTIE';
    return 'GOOD EVENING, CUTIE';
  };

  // Calculate real live stats dynamically
  const totalOps = mockOpportunities.length;
  const highMatchCount = mockOpportunities.filter(o => o.matchScore >= 90).length;
  const expiringSoonCount = mockOpportunities.filter(o => {
    const days = Math.ceil((new Date(o.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 25;
  }).length;
  const avgMatch = Math.round(mockOpportunities.reduce((acc, curr) => acc + curr.matchScore, 0) / (totalOps || 1));

  return (
    <motion.div 
      className="space-y-8 max-w-7xl mx-auto px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Cute Mushy Batcave Welcome Hero Header */}
      <motion.div variants={itemVariants} className="cute-card p-6 md:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(255,133,161,0.06) 100%)' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="cute-badge cute-badge-pink mb-3">
              <Sparkles size={14} /> {getTimeGreeting()} 🦇💖
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#F5E6C8', margin: '0 0 6px' }}>
              WELCOME TO THE BATCAVE, {userName}! 🦇✨
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontFamily: 'var(--font-sans)', margin: 0 }}>
              Your cute Batty AI Agent is scanning Google, Microsoft, Upstox & Fiverr 24/7 with love 💖
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/search" className="cute-button-gold px-5 py-3 flex items-center gap-2 text-sm font-bold no-underline">
              <Sparkles size={16} /> Explore Opportunities 💖
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Cute Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="cute-card p-5">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live Opportunities</span>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(244,196,48,0.12)', color: '#F4C430' }}>
              <LayoutDashboard size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F5E6C8', margin: '12px 0 2px' }}>{totalOps}</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontFamily: 'var(--font-mono)' }}>⚡ 24/7 Agentic Scan Active</div>
        </GlassCard>

        <GlassCard className="cute-card p-5">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>High Dream Matches</span>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(255,133,161,0.15)', color: '#FF85A1' }}>
              <Heart size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F5E6C8', margin: '12px 0 2px' }}>{highMatchCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#FF85A1', fontFamily: 'var(--font-mono)' }}>💖 90%+ Match Score</div>
        </GlassCard>

        <GlassCard className="cute-card p-5">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expiring Soon</span>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F5E6C8', margin: '12px 0 2px' }}>{expiringSoonCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>⏳ Apply This Week</div>
        </GlassCard>

        <GlassCard className="cute-card p-5">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Compatibility</span>
            <div style={{ padding: '8px', borderRadius: '12px', background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F5E6C8', margin: '12px 0 2px' }}>{avgMatch}%</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', fontFamily: 'var(--font-mono)' }}>✨ Powered by Gemini AI</div>
        </GlassCard>
      </motion.div>

      {/* Featured Dream Opportunities */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cute-badge cute-badge-pink">
              <Star size={14} /> Top Picked For You 🦇💖
            </div>
          </div>
          <Link href="/dashboard/search" className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1 no-underline">
            View All ({totalOps}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockOpportunities.slice(0, 6).map((op) => (
            <OpportunityCard key={op.id} opportunity={op} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
