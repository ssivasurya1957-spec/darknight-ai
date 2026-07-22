'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Clock, Sparkles, ArrowRight, Terminal } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import OpportunityCard from '@/components/OpportunityCard';
import { opportunities as mockOpportunities, stats as mockStats } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Alex Chen');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUserName(parsed.name);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'good morning';
    if (hour < 18) return 'good afternoon';
    return 'good evening';
  };

  const topOpportunities = mockOpportunities.slice(0, 6);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        padding: '32px 32px 64px',
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      }}
    >
      {/* 1. Header Section */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="bat-hud-tag">
              [ WAYNE TECH DATABASE // SYNCED ]
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.25rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            {getTimeGreeting()}, {userName}
          </h1>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--accent)',
          backgroundColor: 'rgba(0, 217, 255, 0.08)',
          border: '1px solid rgba(0, 217, 255, 0.25)',
          padding: '8px 16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Terminal size={14} />
          <span>SYSTEM TIME: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
        </div>
      </motion.div>

      {/* 2. Stats Grid */}
      <motion.div variants={itemVariants} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}>
        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(59, 130, 246, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ DATABASE INDEX ]</span>
            <LayoutDashboard size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {mockStats.totalOpportunities || 42}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '6px' }}>+12 indexed today</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(34, 197, 94, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ NEW TODAY ]</span>
            <TrendingUp size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {mockStats.newToday || 8}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '6px' }}>+5 high match score</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ EXPIRING SOON ]</span>
            <Clock size={18} style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {mockStats.deadlinesThisWeek || 6}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--warning)', marginTop: '6px' }}>action required</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(0, 217, 255, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ AI COMPATIBILITY ]</span>
            <Sparkles size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {mockStats.avgMatchScore || 95}%
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginTop: '6px' }}>profile optimized</div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 3. Trending Opportunities Carousel */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            [ TRENDING OPPORTUNITIES ]
          </h2>
          <Link href="/dashboard/search" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            VIEW ALL <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {topOpportunities.map((opp, idx) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={idx} />
          ))}
        </div>
      </motion.div>

      {/* 4. AI Intelligence Summary */}
      <motion.div variants={itemVariants}>
        <GlassCard style={{ padding: '28px 32px', border: '1px solid rgba(0, 217, 255, 0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(0, 217, 255, 0.15)', border: '1px solid rgba(0, 217, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>[ WAYNE AI MATCH REPORT ]</h3>
              <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>REAL-TIME CAREER AGENT SYNTHESIS</p>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
            Based on your active skills profile in <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Machine Learning</span>, <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Python</span>, and <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>React</span>, the system has identified <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>12 high-compatibility matches</span>. 3 top-tier hackathons have deadlines remaining this week.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/dashboard/internships" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', textDecoration: 'none', transition: 'all 200ms ease' }}>
              [ EXPLORE INTERNSHIPS ]
            </Link>
            <Link href="/dashboard/hackathons" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(0, 217, 255, 0.15)', border: '1px solid rgba(0, 217, 255, 0.3)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', textDecoration: 'none', transition: 'all 200ms ease' }}>
              [ UPCOMING HACKATHONS ]
            </Link>
            <Link href="/dashboard/research" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--warning)', textDecoration: 'none', transition: 'all 200ms ease' }}>
              [ RESEARCH GRANTS ]
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
