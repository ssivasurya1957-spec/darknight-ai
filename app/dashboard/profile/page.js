'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, User, Check, Phone, LogOut, Edit3, Loader2 } from 'lucide-react';
import { userProfile as mockProfile } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import Badge from '@/components/Badge';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  // Guest session fallback
  const [guestUser, setGuestUser] = useState(null);
  const [waPhone, setWaPhone] = useState('');
  const [waConnected, setWaConnected] = useState(false);
  const [waInput, setWaInput] = useState('');
  const [showWaInput, setShowWaInput] = useState(false);
  const [liConnected, setLiConnected] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [skills, setSkills] = useState(mockProfile.skills);
  const [interests, setInterests] = useState(mockProfile.interests);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) setGuestUser(JSON.parse(stored));
      const waNum = localStorage.getItem('whatsapp_phone');
      if (waNum) { setWaPhone(waNum); setWaConnected(true); }
      const li = localStorage.getItem('linkedin_connected');
      if (li === 'true') setLiConnected(true);

      const savedSkills = localStorage.getItem('user_skills');
      if (savedSkills) setSkills(JSON.parse(savedSkills));
      const savedInterests = localStorage.getItem('user_interests');
      if (savedInterests) setInterests(JSON.parse(savedInterests));
    } catch (e) {}
  }, []);

  const connectWhatsApp = () => {
    if (waInput.replace(/\D/g, '').length < 10) return;
    const num = waInput.replace(/\D/g, '');
    localStorage.setItem('whatsapp_phone', num);
    setWaPhone(num);
    setWaConnected(true);
    setShowWaInput(false);
    const msg = encodeURIComponent('🦇 DarkKnight AI: WhatsApp successfully connected for career alerts!');
    window.open(`https://api.whatsapp.com/send?phone=91${num}&text=${msg}`, '_blank');
  };

  const connectLinkedIn = () => {
    localStorage.setItem('linkedin_connected', 'true');
    setLiConnected(true);
    // In production: window.location.href = '/api/auth/signin/linkedin';
    alert('LinkedIn connected! AI job search will now include LinkedIn job results.');
  };

  const handleSignOut = async () => {
    localStorage.removeItem('darknight_user');
    if (session) {
      await signOut({ callbackUrl: '/login' });
    } else {
      window.location.href = '/login';
    }
  };

  const saveSkills = () => {
    localStorage.setItem('user_skills', JSON.stringify(skills));
    localStorage.setItem('user_interests', JSON.stringify(interests));
    setEditMode(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill('');
  };

  const removeSkill = (s) => setSkills(skills.filter(sk => sk !== s));

  // Determine active user
  const activeUser = session?.user || guestUser;
  const displayName = activeUser?.name || 'Guest';
  const displayEmail = activeUser?.email || '';
  const provider = session?.user?.provider || guestUser?.provider || 'guest';
  const avatarUrl = session?.user?.image;

  const getInitials = (name) => {
    if (!name) return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
        <Loader2 size={32} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading your profile...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col items-center space-y-8">

        {/* Avatar & Header */}
        <motion.div variants={containerVariants} className="flex flex-col items-center">
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid rgba(212,175,55,0.5)', boxShadow: '0 0 30px rgba(212,175,55,0.3)' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #B8960C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: '#000', border: '3px solid rgba(212,175,55,0.5)', boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}>
                {getInitials(displayName)}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', borderRadius: '50%', background: '#22C55E', border: '2px solid #040406', boxShadow: '0 0 10px #22C55E' }} />
          </div>

          <h1 className="text-3xl font-clash text-white mb-1">{displayName}</h1>
          <p className="text-[var(--text-secondary)] text-lg mb-2">{mockProfile.university} · {mockProfile.graduationYear}</p>
          {displayEmail && (
            <p className="font-mono text-sm text-[var(--text-muted)] bg-[rgba(255,255,255,0.03)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)] mb-3">
              {displayEmail}
            </p>
          )}

          {/* Provider badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#D4AF37', textTransform: 'uppercase' }}>
            {provider === 'google' && '🔵 Google Account'}
            {provider === 'github' && '⚫ GitHub Account'}
            {provider === 'guest' && '👤 Guest Mode'}
            {!provider && '👤 Guest Mode'}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={containerVariants} className="flex flex-wrap justify-center gap-4 w-full">
          {[['12', 'saved'], ['8', 'applied'], ['95%', 'match']].map(([val, label]) => (
            <GlassCard key={label} className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
              <div className={`text-2xl font-clash ${label === 'match' ? 'text-[var(--primary)]' : 'text-white'} mb-1`}>{val}</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{label}</div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={containerVariants} className="w-full">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="font-satoshi font-medium text-lg text-white lowercase tracking-wide">skills</h2>
            <button onClick={() => editMode ? saveSkills() : setEditMode(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)', background: 'transparent', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer' }}>
              {editMode ? <><Check size={12} /> Save</> : <><Edit3 size={12} /> Edit</>}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                {skill}
                {editMode && <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>×</button>}
              </span>
            ))}
          </div>
          {editMode && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Add skill..." style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none' }} />
              <button onClick={addSkill} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'rgba(59,130,246,0.2)', color: '#3B82F6', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>+ Add</button>
            </div>
          )}
        </motion.div>

        {/* Interests */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge key={index} variant="cyan" className="px-3 py-1.5 text-xs">{interest}</Badge>
            ))}
          </div>
        </motion.div>

        {/* Connected Accounts */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">
            connected accounts
          </h2>
          <GlassCard className="p-0 overflow-hidden" hover={false}>

            {/* Primary auth */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: provider === 'google' ? 'rgba(66,133,244,0.12)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {provider === 'google' ? (
                    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  ) : provider === 'github' ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  ) : (
                    <User size={18} style={{ color: '#888' }} />
                  )}
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#e8e8e8', fontWeight: 500, textTransform: 'capitalize' }}>{provider !== 'guest' ? `${provider} Account` : 'Guest User'}</span>
                  {displayEmail && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{displayEmail}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Active</span>
              </div>
            </div>

            {/* LinkedIn Connect */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(10,102,194,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#e8e8e8', fontWeight: 500 }}>LinkedIn</span>
                  <span style={{ fontSize: '0.72rem', color: liConnected ? '#0A66C2' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {liConnected ? 'Connected · Personalized job matches enabled' : 'Connect to enable LinkedIn job matching'}
                  </span>
                </div>
              </div>
              {liConnected ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0A66C2', fontSize: '0.82rem' }}>
                  <Check size={16} /> Connected
                </div>
              ) : (
                <button onClick={connectLinkedIn}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(10,102,194,0.4)', background: 'rgba(10,102,194,0.08)', color: '#0A66C2', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 600 }}>
                  Connect
                </button>
              )}
            </div>

            {/* GitHub Connect */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#e8e8e8', fontWeight: 500 }}>GitHub</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Connect to sync developer repositories & skills
                  </span>
                </div>
              </div>
              <button onClick={() => alert('GitHub connected! Developer profile synced.')}
                style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 600 }}>
                Connect
              </button>
            </div>

            {/* WhatsApp Connect */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(37,211,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={18} style={{ color: '#25D366' }} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#e8e8e8', fontWeight: 500 }}>WhatsApp Alerts</span>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: waConnected ? '#25D366' : 'var(--text-muted)' }}>
                      {waConnected ? `+91 ${waPhone.slice(-10)} · Alerts enabled` : 'Connect for real-time job alerts'}
                    </span>
                  </div>
                </div>
                {waConnected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25D366', fontSize: '0.82rem' }}>
                    <Check size={16} /> Connected
                  </div>
                ) : (
                  <button onClick={() => setShowWaInput(!showWaInput)}
                    style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(37,211,102,0.4)', background: 'rgba(37,211,102,0.08)', color: '#25D366', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 600 }}>
                    Connect
                  </button>
                )}
              </div>
              {showWaInput && !waConnected && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '10px', padding: '0 12px' }}>
                    <Phone size={14} style={{ color: '#25D366' }} />
                    <input type="tel" placeholder="10-digit number" value={waInput}
                      onChange={e => setWaInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', padding: '10px 0' }} />
                  </div>
                  <button onClick={connectWhatsApp} disabled={waInput.replace(/\D/g, '').length < 10}
                    style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: waInput.replace(/\D/g, '').length >= 10 ? '#25D366' : 'rgba(255,255,255,0.05)', color: waInput.replace(/\D/g, '').length >= 10 ? '#000' : '#555', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, cursor: waInput.replace(/\D/g, '').length >= 10 ? 'pointer' : 'default' }}>
                    Connect
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={containerVariants} className="w-full">
          <button onClick={handleSignOut}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.15s' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </motion.div>

      </motion.div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
