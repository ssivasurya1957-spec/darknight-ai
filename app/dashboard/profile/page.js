'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Globe, User, Check, Phone } from 'lucide-react';
import { userProfile as mockProfile } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import GlowButton from '@/components/GlowButton';
import Badge from '@/components/Badge';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [waPhone, setWaPhone] = useState('');
  const [waConnected, setWaConnected] = useState(false);
  const [waInput, setWaInput] = useState('');
  const [showWaInput, setShowWaInput] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) setUser(JSON.parse(stored));
      const waNum = localStorage.getItem('whatsapp_phone');
      if (waNum) { setWaPhone(waNum); setWaConnected(true); }
    } catch (e) {}
  }, []);

  const connectWhatsApp = () => {
    if (!waInput.trim() || waInput.replace(/\D/g, '').length < 10) return;
    const num = waInput.replace(/\D/g, '');
    localStorage.setItem('whatsapp_phone', num);
    setWaPhone(num);
    setWaConnected(true);
    setShowWaInput(false);
    // Open WhatsApp to confirm
    const msg = encodeURIComponent('🦇 DarkKnight AI: Your WhatsApp has been successfully connected for career alerts!');
    window.open(`https://api.whatsapp.com/send?phone=91${num}&text=${msg}`, '_blank');
  };

  const displayName = user?.name || mockProfile.name;
  const displayEmail = user?.email || mockProfile.email;
  const provider = user?.provider;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center space-y-8"
      >
        {/* Avatar & Header */}
        <motion.div variants={containerVariants} className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8960C] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4 border-2 border-[rgba(212,175,55,0.3)] relative">
            <span className="text-black text-2xl font-bold font-clash">{getInitials(displayName)}</span>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--success)] rounded-full border-2 border-[#040406] shadow-[0_0_10px_var(--success)]" />
          </div>
          
          <h1 className="text-3xl font-clash text-white mb-1">{displayName}</h1>
          <p className="text-[var(--text-secondary)] text-lg mb-2">{mockProfile.university} • {mockProfile.graduationYear}</p>
          {displayEmail && (
            <p className="font-mono text-sm text-[var(--text-muted)] bg-[rgba(255,255,255,0.03)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)]">
              {displayEmail}
            </p>
          )}
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={containerVariants} className="flex flex-wrap justify-center gap-4 w-full">
          <GlassCard className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
            <div className="text-2xl font-clash text-white mb-1">12</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">saved</div>
          </GlassCard>
          <GlassCard className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
            <div className="text-2xl font-clash text-white mb-1">8</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">applied</div>
          </GlassCard>
          <GlassCard className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
            <div className="text-2xl font-clash text-[var(--primary)] mb-1">95%</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">match</div>
          </GlassCard>
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">skills</h2>
          <div className="flex flex-wrap gap-2">
            {mockProfile.skills.map((skill, index) => (
              <Badge key={index} variant="blue" className="px-3 py-1.5 text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">interests</h2>
          <div className="flex flex-wrap gap-2">
            {mockProfile.interests.map((interest, index) => (
              <Badge key={index} variant="cyan" className="px-3 py-1.5 text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Linked Accounts Section */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">linked accounts</h2>
          <GlassCard className="p-0 overflow-hidden" hover={false}>

            {/* Auth Provider */}
            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: provider === 'google' ? 'rgba(234,67,53,0.12)' : provider === 'linkedin' ? 'rgba(10,102,194,0.12)' : provider === 'github' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)' }}>
                  {provider === 'google' && <Globe size={16} style={{ color: '#EA4335' }} />}
                  {provider === 'linkedin' && <svg viewBox="0 0 24 24" width="16" height="16" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                  {provider === 'github' && <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>}
                  {provider === 'whatsapp' && <MessageSquare size={16} style={{ color: '#25D366' }} />}
                  {provider === 'guest' && <User size={16} style={{ color: '#888' }} />}
                  {!provider && <User size={16} style={{ color: '#888' }} />}
                </div>
                <div>
                  <span className="text-[var(--text-primary)] capitalize block">{provider || 'Guest'} Account</span>
                  {displayEmail && <span className="text-xs text-[var(--text-muted)] font-mono">{displayEmail}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
                <span className="text-sm text-[var(--text-secondary)]">Active</span>
              </div>
            </div>

            {/* WhatsApp Connect */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(37,211,102,0.1)' }}>
                    <MessageSquare size={16} style={{ color: '#25D366' }} />
                  </div>
                  <div>
                    <span className="text-[var(--text-primary)] block">WhatsApp Alerts</span>
                    {waConnected
                      ? <span className="text-xs text-[#25D366] font-mono">+91 {waPhone.slice(-10)}</span>
                      : <span className="text-xs text-[var(--text-muted)] font-mono">Not connected</span>
                    }
                  </div>
                </div>
                {waConnected ? (
                  <div className="flex items-center space-x-2">
                    <Check size={16} style={{ color: '#25D366' }} />
                    <span className="text-sm" style={{ color: '#25D366' }}>Connected</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowWaInput(!showWaInput)}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(37,211,102,0.4)', background: 'rgba(37,211,102,0.08)', color: '#25D366', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
                  >
                    Connect WhatsApp
                  </button>
                )}
              </div>

              {showWaInput && !waConnected && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '10px', padding: '0 12px' }}>
                    <Phone size={14} style={{ color: '#25D366' }} />
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={waInput}
                      onChange={e => setWaInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e8e8e8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', padding: '10px 0' }}
                    />
                  </div>
                  <button
                    onClick={connectWhatsApp}
                    disabled={waInput.replace(/\D/g, '').length < 10}
                    style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: waInput.replace(/\D/g, '').length >= 10 ? '#25D366' : 'rgba(255,255,255,0.05)', color: waInput.replace(/\D/g, '').length >= 10 ? '#000' : '#555', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, cursor: waInput.replace(/\D/g, '').length >= 10 ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={containerVariants} className="pt-6 w-full flex justify-center">
          <GlowButton variant="outline" className="w-full max-w-xs">
            Edit Profile
          </GlowButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
