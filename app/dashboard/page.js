'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import OpportunityCard from '@/components/OpportunityCard';
import { opportunities as mockOpportunities, stats as mockStats } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const [userName, setUserName] = useState('ALEX CHEN');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setUserName(parsed.name.toUpperCase());
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
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const topOpportunities = mockOpportunities.slice(0, 6);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        padding: '24px 32px 64px',
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
      }}
    >
      {/* 1. Header Section */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '2.5rem',
            color: '#F5E6C8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: 0,
            textShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
          }}>
            {getTimeGreeting()}, {userName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', letterSpacing: '0.1em' }}>
              🦇 SYSTEM TIME: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--primary)',
          backgroundColor: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '8px 16px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <ShieldCheck size={16} />
          <span>WAYNE TECH CLEARANCE // LEVEL 4</span>
        </div>
      </motion.div>

      {/* 2. Stats Grid */}
      <motion.div variants={itemVariants} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}>
        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ INDEX ]</span>
            <LayoutDashboard size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              2458
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '6px' }}>▲ Good today</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ NEW TODAY ]</span>
            <TrendingUp size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              142
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '6px' }}>▲ 5 high match</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ EXPIRING SOON ]</span>
            <Clock size={18} style={{ color: 'var(--warning)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              37
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--warning)', marginTop: '6px' }}>Action required</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ AI COMPATIBILITY ]</span>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              78%
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: '6px' }}>Optimized profile</div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 3. Trending Opportunities */}
      <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🦇 <span>BUILDING OPPORTUNITIES</span>
          </h2>
          <Link href="/dashboard/search" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            VIEW ALL <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {topOpportunities.map((opp, idx) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={idx} />
          ))}
        </div>
      </motion.div>

      {/* 4. Wayne AI Match Report */}
      <motion.div variants={itemVariants}>
        <GlassCard style={{ padding: '28px 32px', border: '1px solid rgba(212, 175, 55, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              🦇
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: '#F5E6C8', textTransform: 'uppercase', margin: 0 }}>WAYNE AI MATCH REPORT</h3>
              <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', margin: 0, marginTop: '2px', letterSpacing: '0.08em' }}>REAL-TIME CAREER AGENT SYNTHESIS</p>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            Based on your active skills profile in <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Machine Learning</span>, <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Python</span>, and <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>React</span>, the system has identified <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>12 high-compatibility matches</span>. 3 top-tier hackathons have deadlines remaining this week.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/dashboard/internships" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              [ INTERNSHIPS ]
            </Link>
            <Link href="/dashboard/hackathons" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              [ UPCOMING HACKATHONS ]
            </Link>
            <Link href="/dashboard/research" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              [ RESEARCH GRANTS ]
            </Link>
          </div>
        </GlassCard>
      </motion.div>

      {/* Bottom Bat Quote */}
      <div style={{ textAlign: 'center', paddingTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
        🦇 "You don't need a cape. You need a plan."
      </div>
    </motion.div>
  );
}
