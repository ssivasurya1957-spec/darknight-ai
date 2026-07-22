'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, MapPin, Sparkles, Check, Building2, Globe } from 'lucide-react';

const DOMAINS = ['Artificial Intelligence', 'Web Development', 'Cybersecurity', 'Data Science', 'Cloud Computing', 'FinTech', 'Blockchain'];
const LOCATIONS = ['Bangalore', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Remote'];
const TARGET_COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Upstox', 'Fiverr', 'Zepto', 'NVIDIA'];

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [role, setRole] = useState('student'); // 'student' | 'jobseeker'
  const [selectedDomains, setSelectedDomains] = useState(['Artificial Intelligence', 'Web Development']);
  const [location, setLocation] = useState('Bangalore');
  const [followedCompanies, setFollowedCompanies] = useState(['Google', 'Amazon']);

  const toggleDomain = (d) => {
    setSelectedDomains(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const toggleCompany = (c) => {
    setFollowedCompanies(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleSave = () => {
    const prefs = {
      role,
      domains: selectedDomains,
      location,
      followedCompanies,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('darknight_user_preferences', JSON.stringify(prefs));
    if (onComplete) onComplete(prefs);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{ background: '#0a0a0f', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '24px', padding: '32px', maxWidth: '540px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.1)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '20px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '12px' }}>
              <Sparkles size={14} style={{ marginRight: '6px' }} /> PERSONALIZATION ONBOARDING
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#F5E6C8', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Tailor Your Career Intelligence
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', margin: 0 }}>
              Tell us your status so DarkKnight AI delivers 24/7 real-time opportunities near you.
            </p>
          </div>

          {/* 1. Student vs Job Seeker */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '8px' }}>
              1. Are you a Student or Job Seeker?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px',
                  border: '1px solid', borderColor: role === 'student' ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  background: role === 'student' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.02)',
                  color: role === 'student' ? '#D4AF37' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
                }}
              >
                <GraduationCap size={18} /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole('jobseeker')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '12px',
                  border: '1px solid', borderColor: role === 'jobseeker' ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  background: role === 'jobseeker' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.02)',
                  color: role === 'jobseeker' ? '#D4AF37' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
                }}
              >
                <Briefcase size={18} /> Job Seeker
              </button>
            </div>
          </div>

          {/* 2. Domains of Interest */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '8px' }}>
              2. Select Domain Interests:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {DOMAINS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  style={{
                    padding: '6px 12px', borderRadius: '16px', border: '1px solid',
                    borderColor: selectedDomains.includes(d) ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                    background: selectedDomains.includes(d) ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: selectedDomains.includes(d) ? '#D4AF37' : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)', cursor: 'pointer'
                  }}
                >
                  {selectedDomains.includes(d) && '✓ '} {d}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Location for Local Hackathons & Internships */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '8px' }}>
              3. Preferred Location (for local hackathons & jobs near you):
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '12px', border: '1px solid',
                    borderColor: location === loc ? '#22C55E' : 'rgba(255,255,255,0.08)',
                    background: location === loc ? 'rgba(34,197,94,0.15)' : 'transparent',
                    color: location === loc ? '#22C55E' : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)', cursor: 'pointer'
                  }}
                >
                  <MapPin size={12} /> {loc}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Companies to Follow for Real-time Alert Notification */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '8px' }}>
              4. Follow Companies for Instant Vacancy Alerts:
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {TARGET_COMPANIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCompany(c)}
                  style={{
                    padding: '6px 12px', borderRadius: '12px', border: '1px solid',
                    borderColor: followedCompanies.includes(c) ? '#3B82F6' : 'rgba(255,255,255,0.08)',
                    background: followedCompanies.includes(c) ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: followedCompanies.includes(c) ? '#3B82F6' : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontFamily: 'var(--font-mono)', cursor: 'pointer'
                  }}
                >
                  <Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {c} {followedCompanies.includes(c) ? '🔔' : '+'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}
          >
            Save Preferences & Start AI Matching
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
