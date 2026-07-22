'use client'

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Inbox, ChevronDown } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import FilterChips from '@/components/FilterChips';
import { opportunities } from '@/lib/mockData';

const DOMAIN_FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'Software Eng', value: 'Software Engineering' },
  { label: 'AI/ML', value: 'Artificial Intelligence' },
  { label: 'Cloud', value: 'Cloud' },
  { label: 'Cybersecurity', value: 'Cybersecurity' }
];

const EXPERIENCE_FILTERS = [
  { label: 'Any', value: 'Any' },
  { label: 'Entry', value: 'Entry' },
  { label: 'Mid', value: 'Mid' },
  { label: 'Senior', value: 'Senior' }
];

export default function JobsPage() {
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeExperience, setActiveExperience] = useState('Any');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const jobs = useMemo(() => {
    let filtered = opportunities.filter(op => op.type === 'job');
    
    if (activeDomain !== 'All') {
      filtered = filtered.filter(op => 
        op.domain.toLowerCase().includes(activeDomain.toLowerCase()) || 
        activeDomain.toLowerCase().includes(op.domain.toLowerCase())
      );
    }
    
    // In a real app we'd filter by actual experience fields
    // Here we'll just mock it or skip it since mockData doesn't have experience field consistently
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(op => 
        op.title.toLowerCase().includes(q) || 
        op.organization.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'Newest') {
        return new Date(b.postedDate) - new Date(a.postedDate);
      } else if (sortBy === 'Deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortBy === 'Match Score') {
        return b.matchScore - a.matchScore;
      }
      return 0;
    });

    return filtered;
  }, [activeDomain, activeExperience, searchQuery, sortBy]);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-[36px] text-[var(--text-primary)] mb-2">
          Jobs
        </h1>
        <p className="text-[var(--text-secondary)]">
          {jobs.length} active jobs
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
        <div className="flex-grow max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[rgba(34,197,94,0.3)] focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all backdrop-blur-md"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.05)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors backdrop-blur-md"
            >
              <span>Sort: {sortBy}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isSortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-[#171717] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden z-20 shadow-2xl"
                >
                  {['Newest', 'Deadline', 'Match Score'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-[rgba(255,255,255,0.05)] transition-colors ${sortBy === opt ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-secondary)] min-w-[90px]">Domain:</span>
          <FilterChips 
            filters={DOMAIN_FILTERS} 
            activeFilter={activeDomain} 
            onFilterChange={setActiveDomain} 
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-secondary)] min-w-[90px]">Experience:</span>
          <FilterChips 
            filters={EXPERIENCE_FILTERS} 
            activeFilter={activeExperience} 
            onFilterChange={setActiveExperience} 
          />
        </div>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <OpportunityCard 
              key={job.id} 
              opportunity={job} 
              index={index} 
            />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-[var(--text-secondary)]" />
          </div>
          <h3 className="font-display font-medium text-xl text-[var(--text-primary)] mb-2">No jobs found</h3>
          <p className="text-[var(--text-secondary)]">Try adjusting your filters or search query.</p>
        </motion.div>
      )}
    </div>
  );
}
