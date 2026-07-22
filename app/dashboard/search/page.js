'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, ExternalLink, MapPin, Clock, DollarSign, Wifi, Star, Briefcase, Code, Trophy, FlaskConical, Zap } from 'lucide-react';

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

const PLATFORMS_DISPLAY = [
  { name: 'LinkedIn', color: '#0A66C2' },
  { name: 'Naukri', color: '#FF7555' },
  { name: 'Indeed', color: '#2557A7' },
  { name: 'Internshala', color: '#36A8DA' },
  { name: 'Devfolio', color: '#5B3CC4' },
  { name: 'Upwork', color: '#14A800' },
  { name: 'Fiverr', color: '#1DBF73' },
  { name: 'HackerEarth', color: '#2C3E50' },
];

function JobCard({ job, index }) {
  const typeConfig = TYPE_CONFIG[job.type] || TYPE_CONFIG.job;
  const platformColor = PLATFORM_COLORS[job.platform] || '#888';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: 'rgba(10,10,16,0.9)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
      whileHover={{ borderColor: 'rgba(212,175,55,0.4)', y: -2 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          {/* Type + Platform badges */}
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

        {/* Match Score */}
        {job.matchScore && (
          <div style={{
            textAlign: 'center', padding: '8px 12px', borderRadius: '12px',
            background: job.matchScore >= 85 ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${job.matchScore >= 85 ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}`,
            flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: job.matchScore >= 85 ? '#D4AF37' : '#fff' }}>
              {job.matchScore}%
            </div>
            <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>match</div>
          </div>
        )}
      </div>

      {/* Details row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
        {job.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} /> {job.location}
          </span>
        )}
        {job.experience && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} /> {job.experience}
          </span>
        )}
        {job.postedAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {job.postedAt}
          </span>
        )}
      </div>

      {/* Salary */}
      {(job.salary || job.stipend) && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', alignSelf: 'flex-start' }}>
          <DollarSign size={14} style={{ color: '#22C55E' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#22C55E', fontWeight: 600 }}>
            {job.type === 'internship' ? job.stipend || job.salary : job.salary}
          </span>
        </div>
      )}

      {/* Description */}
      {job.description && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {job.description}
        </p>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {job.skills.map((s) => (
            <span key={s} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', background: 'rgba(212,175,55,0.08)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)', fontFamily: 'var(--font-mono)' }}>
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {job.deadline && (
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Deadline: {new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        )}
        <a
          href={job.applyUrl || '#'}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #D4AF37, #F5D767)', color: '#000',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700,
            textDecoration: 'none', marginLeft: 'auto', letterSpacing: '0.04em',
          }}
        >
          Apply <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) {
        const u = JSON.parse(stored);
        setUserProfile(u);
        if (u.provider === 'linkedin') setLinkedInConnected(true);
      }
      const liConnected = localStorage.getItem('linkedin_connected');
      if (liConnected === 'true') setLinkedInConnected(true);
    } catch (e) {}
  }, []);

  const runSearch = async (q, filter) => {
    if (!q.trim()) {
      setJobs([]);
      setHasSearched(false);
      return;
    }
    setIsSearching(true);
    setError('');
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
      if (!res.ok || data.error) throw new Error(data.error || 'Search failed');
      setJobs(data.jobs || []);
    } catch (err) {
      setError('AI job search temporarily unavailable. Please try again.');
      setJobs([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val, activeFilter), 700);
  };

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    if (query.trim()) runSearch(query, f);
  };

  const handleLinkedInConnect = () => {
    localStorage.setItem('linkedin_connected', 'true');
    setLinkedInConnected(true);
    if (query.trim()) runSearch(query + ' linkedin', activeFilter);
    else alert('LinkedIn connected! Now search for jobs to get LinkedIn-specific results.');
  };

  const filteredJobs = activeFilter === 'All'
    ? jobs
    : jobs.filter(j => j.type?.toLowerCase() === activeFilter.toLowerCase().replace(/s$/, ''));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: '#F5E6C8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            🔍 AI Job Intelligence
          </h1>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#22C55E', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)' }}>
            LIVE · Powered by Gemini
          </span>
        </div>

        {/* Platform badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {PLATFORMS_DISPLAY.map(p => (
            <span key={p.name} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}33`, fontFamily: 'var(--font-mono)' }}>
              {p.name}
            </span>
          ))}
          <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.68rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            +More
          </span>
        </div>

        {/* LinkedIn Connect Banner */}
        {!linkedInConnected && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.3)', marginBottom: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2" style={{ flexShrink: 0 }}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#e8e8e8', fontWeight: 600 }}>Connect LinkedIn for personalized job results</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Get job postings tailored to your LinkedIn profile</p>
              </div>
            </div>
            <button
              onClick={handleLinkedInConnect}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0A66C2', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              Connect LinkedIn
            </button>
          </div>
        )}

        {linkedInConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(10,102,194,0.08)', border: '1px solid rgba(10,102,194,0.2)', marginBottom: '14px', width: 'fit-content' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            <span style={{ fontSize: '0.75rem', color: '#0A66C2', fontFamily: 'var(--font-mono)' }}>LinkedIn Connected — Results include LinkedIn jobs</span>
          </div>
        )}

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(10,10,16,0.95)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '14px', padding: '14px 20px', boxShadow: '0 0 20px rgba(212,175,55,0.06)' }}>
            {isSearching
              ? <RefreshCw size={20} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              : <Search size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            }
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search jobs, internships, hackathons across all platforms..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e8e8e8', fontSize: '1rem', fontFamily: 'inherit' }}
              autoFocus
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              style={{
                padding: '6px 16px', borderRadius: '20px', border: '1px solid',
                borderColor: activeFilter === f ? '#D4AF37' : 'rgba(255,255,255,0.08)',
                background: activeFilter === f ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: activeFilter === f ? '#D4AF37' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {!hasSearched && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#F5E6C8', textTransform: 'uppercase', marginBottom: '8px' }}>
              AI Job Intelligence Engine
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              Type any role, skill, or company. AI searches across LinkedIn, Naukri, Internshala, Devfolio, Upwork, Fiverr, and more in real time.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
              {['React Developer', 'ML Internship', 'DevOps Engineer', 'Hackathon 2026', 'Freelance Designer'].map(s => (
                <button key={s} onClick={() => { setQuery(s); runSearch(s, activeFilter); }}
                  style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.06)', color: '#D4AF37', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {isSearching && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', paddingTop: '60px' }}>
            <RefreshCw size={32} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Scanning LinkedIn, Naukri, Internshala, Devfolio, Upwork...
            </p>
          </motion.div>
        )}

        {error && !isSearching && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '16px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            ⚠ {error}
          </motion.div>
        )}

        {hasSearched && !isSearching && !error && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {filteredJobs.length} results for <strong style={{ color: '#D4AF37' }}>"{query}"</strong>
                {activeFilter !== 'All' && <span> · filtered: {activeFilter}</span>}
              </span>
              <button onClick={() => runSearch(query, activeFilter)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', background: 'transparent', color: '#D4AF37', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {filteredJobs.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '40px', color: 'var(--text-secondary)' }}>
                <p>No results found. Try a different query or filter.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                {filteredJobs.map((job, i) => <JobCard key={job.id || i} job={job} index={i} />)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
