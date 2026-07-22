'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ExternalLink, Sparkles, Trophy, Users, Code, Lightbulb, Send, Loader2 } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import { opportunities } from '@/lib/mockData';

export default function HackathonsPage() {
  const [userLocation, setUserLocation] = useState('Bangalore');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'map' | 'toolkit'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toolkit State
  const [themeInput, setThemeInput] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    try {
      const prefs = localStorage.getItem('darknight_user_preferences');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.location) setUserLocation(parsed.location);
      }
    } catch (e) {}
  }, []);

  const hackathons = opportunities.filter(op => op.type === 'hackathon');
  const filteredHackathons = hackathons.filter(op => 
    op.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const analyzeHackathonProblem = async () => {
    if (!themeInput.trim()) return;
    setIsAnalyzing(true);
    setAiAnalysis('');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Analyze this Hackathon Problem Statement / Theme: "${themeInput}". 
Provide a winning hackathon strategy covering:
1. Core Innovation & Key Feature
2. Best Tech Stack to build in 24 hours
3. 60-Second Elevator Pitch for Judges
4. How to stand out against competitors.`
          }],
          userProfile: { name: 'Hackathon Contender' }
        })
      });
      const data = await res.json();
      if (data.reply) setAiAnalysis(data.reply);
    } catch (err) {
      setAiAnalysis('AI analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              🏆 Hackathons & Local Meetups
            </h1>
            <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: '20px', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
              LIVE EVENTS
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Location set to <strong style={{ color: '#22C55E' }}>{userLocation}</strong> · Discover near you or build remotely
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.15)' }}>
          <button
            onClick={() => setActiveTab('browse')}
            style={{
              padding: '8px 16px', borderRadius: '10px', border: 'none',
              background: activeTab === 'browse' ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: activeTab === 'browse' ? '#D4AF37' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            All Events
          </button>
          <button
            onClick={() => setActiveTab('map')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none',
              background: activeTab === 'map' ? 'rgba(34,197,94,0.15)' : 'transparent',
              color: activeTab === 'map' ? '#22C55E' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <MapPin size={14} /> Google Maps Venues
          </button>
          <button
            onClick={() => setActiveTab('toolkit')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: 'none',
              background: activeTab === 'toolkit' ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: activeTab === 'toolkit' ? '#3B82F6' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Sparkles size={14} /> AI Winner Toolkit
          </button>
        </div>
      </div>

      {/* ── TAB 1: BROWSE HACKATHONS ── */}
      {activeTab === 'browse' && (
        <div>
          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(10,10,16,0.95)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '12px 18px', marginBottom: '24px' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search hackathons by domain, location, or host..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
            {filteredHackathons.map((opp, i) => (
              <OpportunityCard key={opp.id} opportunity={opp} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: GOOGLE MAPS VENUES ── */}
      {activeTab === 'map' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          {/* Google Maps Embed iframe */}
          <div style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', overflow: 'hidden', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} style={{ color: '#22C55E' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                  Interactive Venue Map — Near {userLocation}
                </span>
              </div>
              <a
                href={`https://www.google.com/maps/search/hackathon+venues+near+${encodeURIComponent(userLocation)}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#22C55E', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Open Google Maps <ExternalLink size={12} />
              </a>
            </div>
            <iframe
              title="Google Maps Hackathon Venues"
              width="100%"
              height="440"
              style={{ border: 0, flex: 1 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=hackathon+venue+${encodeURIComponent(userLocation)}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
            />
          </div>

          {/* Venues sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: '#F5E6C8', textTransform: 'uppercase', margin: 0 }}>
              Physical Venues ({userLocation})
            </h3>
            {hackathons.map(h => (
              <div key={h.id} style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '14px' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.88rem', color: '#fff' }}>{h.title}</h4>
                <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{h.organization}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#22C55E', marginBottom: '8px' }}>
                  <MapPin size={12} /> {h.mapQuery || h.location}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.mapQuery || h.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textDecoration: 'none' }}
                >
                  Get Directions <ExternalLink size={10} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: AI HACKATHON WINNING TOOLKIT ── */}
      {activeTab === 'toolkit' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Analyzer */}
          <div style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#fff', margin: 0, textTransform: 'uppercase' }}>
                  Problem Statement Analyzer
                </h3>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Paste hackathon prompt → AI generates winning strategy
                </span>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="Paste hackathon problem statement or theme here... (e.g., Build an AI solution for sustainable energy tracking)"
              value={themeInput}
              onChange={e => setThemeInput(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.25)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'vertical', marginBottom: '14px', boxSizing: 'border-box' }}
            />

            <button
              onClick={analyzeHackathonProblem}
              disabled={isAnalyzing || !themeInput.trim()}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', cursor: isAnalyzing ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isAnalyzing ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
              {isAnalyzing ? 'Analyzing Theme...' : 'Generate Winning Pitch & Architecture'}
            </button>
          </div>

          {/* AI Output / Teammates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'rgba(10,10,16,0.9)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '20px', padding: '20px', flex: 1, maxHeight: '480px', overflowY: 'auto' }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#D4AF37', textTransform: 'uppercase', margin: '0 0 12px' }}>
                ⚡ AI Strategy Blueprint
              </h4>
              {aiAnalysis ? (
                <div style={{ fontSize: '0.85rem', color: '#e8e8e8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {aiAnalysis}
                </div>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  Enter a theme on the left to generate your hackathon architecture, pitch deck script, and tech stack recommendations.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
