'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, ExternalLink, MapPin, Clock, DollarSign, Wifi, Star, Briefcase, Code, Trophy, FlaskConical, Zap, Sparkles, Send, Bell } from 'lucide-react';
import ApplyAssistantModal from '@/components/ApplyAssistantModal';

const PLATFORM_COLORS = {
  LinkedIn: '#0A66C2',
  Naukri: '#FF7555',
  Indeed: '#2557A7',
  Internshala: '#36A8DA',
  Devfolio: '#5B3CC4',
  HackerEarth: '#2C3E50',
  Upwork: '#14A800',
  Fiverr: '#1DBF73',
  AngelList: '#000000',
  Wellfound: '#FB6514',
  Unstop: '#FF4B55',
  Kaggle: '#20BEFF',
};

const TYPE_CONFIG = {
  job: { label: 'Full-Time', color: '#3B82F6', icon: <Briefcase size={12} /> },
  internship: { label: 'Internship', color: '#22C55E', icon: <Code size={12} /> },
  hackathon: { label: 'Hackathon', color: '#8B5CF6', icon: <Trophy size={12} /> },
  research: { label: 'Research', color: '#F59E0B', icon: <FlaskConical size={12} /> },
  freelance: { label: 'Freelance', color: '#14A800', icon: <Zap size={12} /> },
};

const FILTERS = ['All', 'Jobs', 'Internships', 'Hackathons', 'Research', 'Freelance'];

const TARGET_COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Upstox', 'Fiverr', 'Zepto', 'NVIDIA'];

function JobCard({ job, index, onApplyAssistant }) {
  const typeConfig = TYPE_CONFIG[job.type] || TYPE_CONFIG.job;
  const platformColor = PLATFORM_COLORS[job.platform] || '#888';

  const handleAskAI = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const prompt = `Help me prepare for ${job.title} at ${job.organization}. What skills should I highlight?`;
    window.location.href = `/dashboard/chat?prompt=${encodeURIComponent(prompt)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: 'rgba(10,10,16,0.9)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      whileHover={{ borderColor: 'rgba(212,175,55,0.4)', y: -2 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '3px 8px', borderRadius: '20px', fontSize: '0.65rem',
              background: `${typeConfig.color}22`, color: typeConfig.color,
              border: `1px solid ${typeConfig.color}44`, fontFamily: 'var(--font-mono)',
            }}>
              {typeConfig.icon} {typeConfig.label}
            </span>
            <span style={{
              padding: '3px 8px', borderRadius: '20px', fontSize: '0.65rem',
              background: `${platformColor}22`, color: platformColor,
              border: `1px solid ${platformColor}44`, fontFamily: 'var(--font-mono)',
            }}>
              {job.platform}
            </span>
            {job.isRemote && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '20px', fontSize: '0.65rem', background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)', fontFamily: 'var(--font-mono)' }}>
                <Wifi size={10} /> Remote
              </span>
            )}
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#F5E6C8', margin: '0 0 4px', lineHeight: 1.3 }}>
            {job.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            {job.organization}
          </p>
        </div>

        {job.matchScore && (
          <div style={{
            textAlign: 'center', padding: '6px 10px', borderRadius: '10px',
            background: job.matchScore >= 85 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${job.matchScore >= 85 ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: job.matchScore >= 85 ? '#D4AF37' : '#fff' }}>
              {job.matchScore}%
            </div>
            <div style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>match</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {job.location}</span>}
        {job.experience && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={12} /> {job.experience}</span>}
        {job.postedAt && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {job.postedAt}</span>}
      </div>

      {(job.salary || job.stipend) && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', alignSelf: 'flex-start' }}>
          <DollarSign size={14} style={{ color: '#22C55E' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#22C55E', fontWeight: 600 }}>
            {job.type === 'internship' ? job.stipend || job.salary : job.salary}
          </span>
        </div>
      )}

      {job.description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {job.description}
        </p>
      )}

      {job.skills && job.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {job.skills.map((s) => (
            <span key={s} style={{ padding: '2px 8px', borderRadius: '16px', fontSize: '0.68rem', background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: 'var(--font-mono)' }}>
              {s}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handleAskAI}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.1)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Sparkles size={12} /> Ask AI
          </button>
          <button
            onClick={() => onApplyAssistant(job)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <Send size={12} /> Apply Assistant
          </button>
        </div>

        <a
          href={job.applyUrl || job.link || '#'}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}
        >
          Apply <ExternalLink size={11} />
        </a>
      </div>
    </motion.div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('preferred'); // 'preferred' | 'explore'
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedJobForAssistant, setSelectedJobForAssistant] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) setUserProfile(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const runSearch = async (q, filter) => {
    if (!q.trim()) {
      setJobs([]);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch('/api/ai/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          filters: filter !== 'All' ? filter : null,
          userSkills: userProfile?.skills || [],
        }),
      });

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val, activeFilter), 600);
  };

  const highMatchJobs = jobs.filter(j => (j.matchScore || 80) >= 80);
  const alternativeJobs = jobs.filter(j => (j.matchScore || 80) < 80);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 80px' }}>
      
      <ApplyAssistantModal
        isOpen={!!selectedJobForAssistant}
        onClose={() => setSelectedJobForAssistant(null)}
        opportunity={selectedJobForAssistant}
      />

      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              🔍 24/7 Batty AI Scanner 🦇💖✨
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Real-time Gemini AI & API Aggregator · Live vacancies at Google, Microsoft, Upstox, Fiverr & Amazon 💖
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {TARGET_COMPANIES.map(c => (
              <button
                key={c}
                onClick={() => { setQuery(c); runSearch(c, activeFilter); }}
                className="cute-badge cute-badge-pink cursor-pointer"
                style={{ fontSize: '0.7rem' }}
              >
                🔔 {c} Watchlist
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(10,8,16,0.95)', border: '1px solid rgba(255,133,161,0.3)', borderRadius: '16px', padding: '14px 20px', marginBottom: '16px', boxShadow: '0 0 25px rgba(255,133,161,0.1)' }}>
          {isSearching
            ? <RefreshCw size={20} style={{ color: '#F4C430', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            : <Search size={20} style={{ color: '#FF85A1', flexShrink: 0 }} />
          }
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search dream roles, skills, or companies (e.g. Google AI, Upstox Backend, Fiverr Remote)..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e8e8e8', fontSize: '1rem', fontFamily: 'inherit' }}
            autoFocus
          />
        </div>

        {/* Tabs: Preferred vs Explore All */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(244,196,48,0.25)' }}>
            <button
              onClick={() => setActiveTab('preferred')}
              style={{
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                background: activeTab === 'preferred' ? 'linear-gradient(135deg, rgba(244,196,48,0.25), rgba(255,133,161,0.2))' : 'transparent',
                color: activeTab === 'preferred' ? '#F4C430' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'
              }}
            >
              ✨ Dream High Matches 💖
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              style={{
                padding: '8px 16px', borderRadius: '10px', border: 'none',
                background: activeTab === 'explore' ? 'rgba(255,133,161,0.2)' : 'transparent',
                color: activeTab === 'explore' ? '#FF85A1' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer'
              }}
            >
              🌸 Explore Low Preference Field 🎀
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); if (query.trim()) runSearch(query, f); }}
                style={{
                  padding: '5px 12px', borderRadius: '16px', border: '1px solid',
                  borderColor: activeFilter === f ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                  background: activeFilter === f ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: activeFilter === f ? '#D4AF37' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!hasSearched && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F5E6C8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Search Any Target Role or Company
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '460px', margin: '0 auto 20px', fontFamily: 'var(--font-mono)' }}>
              Agentic scanner searches live hiring platforms with direct apply links, salary ranges, and 1-click cover letter assistant.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Amazon Data Scientist', 'Google Core Systems', 'Microsoft ML Engineer', 'Upstox FinTech', 'Fiverr AI Specialist'].map(s => (
                <button key={s} onClick={() => { setQuery(s); runSearch(s, activeFilter); }}
                  style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.06)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {isSearching && (
          <div style={{ textAlign: 'center', paddingTop: '50px' }}>
            <RefreshCw size={32} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Scanning live endpoints & Gemini agent across Google, Microsoft, Amazon, Upstox, Fiverr...
            </p>
          </div>
        )}

        {hasSearched && !isSearching && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {activeTab === 'preferred' ? (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#F5E6C8', textTransform: 'uppercase', marginBottom: '14px' }}>
                  🎯 Primary Preference Matches ({highMatchJobs.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                  {highMatchJobs.map((job, i) => (
                    <JobCard key={job.id || i} job={job} index={i} onApplyAssistant={setSelectedJobForAssistant} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '14px' }}>
                  🌐 Explore All / Low Preference Field Bucket ({alternativeJobs.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                  {alternativeJobs.map((job, i) => (
                    <JobCard key={job.id || i} job={job} index={i} onApplyAssistant={setSelectedJobForAssistant} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
