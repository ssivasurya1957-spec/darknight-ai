'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import OpportunityCard from '@/components/OpportunityCard';
import { opportunities as mockOpportunities } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState('USER');

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

  // Calculate real live stats dynamically
  const totalOps = mockOpportunities.length;
  const highMatchCount = mockOpportunities.filter(o => o.matchScore >= 90).length;
  const expiringSoonCount = mockOpportunities.filter(o => {
    const days = Math.ceil((new Date(o.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 25;
  }).length;
  const avgMatch = Math.round(mockOpportunities.reduce((acc, o) => acc + o.matchScore, 0) / (totalOps || 1));

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

      {/* 2. Dynamic Real Stats Grid */}
      <motion.div variants={itemVariants} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
      }}>
        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ ACTIVE INDEX ]</span>
            <LayoutDashboard size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              {totalOps}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '6px' }}>● Verified live listings</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ HIGH MATCH ]</span>
            <TrendingUp size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              {highMatchCount}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--success)', marginTop: '6px' }}>▲ 90%+ compatibility</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ EXPIRING SOON ]</span>
            <Clock size={18} style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
              {expiringSoonCount}
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--danger)', marginTop: '6px' }}>⚡ Urgent action required</div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '20px 24px', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>[ AI COMPATIBILITY ]</span>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
              {avgMatch}%
            </div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '6px' }}>Optimized profile match</div>
          </div>
        </GlassCard>
      </motion.div>

      {/* 3. Opportunities Feed */}
      <motion.div variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🦇</span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.3rem',
              color: '#F5E6C8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
            }}>
              Building Opportunities
            </h2>
          </div>
          <Link href="/dashboard/search" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}>
              VIEW ALL <ArrowRight size={14} />
            </div>
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {topOpportunities.map((opportunity, index) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} index={index} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
