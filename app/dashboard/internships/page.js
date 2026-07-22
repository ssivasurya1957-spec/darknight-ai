'use client'

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Inbox, ChevronDown } from 'lucide-react';
import OpportunityCard from '@/components/OpportunityCard';
import FilterChips from '@/components/FilterChips';
import { opportunities } from '@/lib/mockData';

const DOMAIN_FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'AI/ML', value: 'Artificial Intelligence' },
  { label: 'Web Dev', value: 'Web Development' },
  { label: 'Data Science', value: 'Data Science' },
  { label: 'Design', value: 'Design' }
];

const STIPEND_FILTERS = [
  { label: 'Any', value: 'Any' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Unpaid', value: 'Unpaid' }
];

export default function InternshipsPage() {
  const [activeDomain, setActiveDomain] = useState('All');
  const [activeStipend, setActiveStipend] = useState('Any');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const internships = useMemo(() => {
    let filtered = opportunities.filter(op => op.type === 'internship');
    
    if (activeDomain !== 'All') {
      filtered = filtered.filter(op => 
        op.domain.toLowerCase().includes(activeDomain.toLowerCase()) || 
        activeDomain.toLowerCase().includes(op.domain.toLowerCase())
      );
    }

    if (activeStipend !== 'Any') {
      filtered = filtered.filter(op => {
        const hasStipend = op.stipend && op.stipend.toLowerCase() !== 'unpaid';
        if (activeStipend === 'Paid') return hasStipend;
        if (activeStipend === 'Unpaid') return !hasStipend;
        return true;
      });
    }
    
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
  }, [activeDomain, activeStipend, searchQuery, sortBy]);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-[36px] text-[var(--text-primary)] mb-2">
          Internships
        </h1>
        <p className="text-[var(--text-secondary)]">
          {internships.length} active internships
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
        <div className="flex-grow max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.05)] rounded-xl py-2.5 pl-10 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[rgba(59,130,246,0.3)] focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all backdrop-blur-md"
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
                      className={`w-full text-left px-4 py-2.5 hover:bg-[rgba(255,255,255,0.05)] transition-colors ${sortBy === opt ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}
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
          <span className="text-sm text-[var(--text-secondary)] min-w-[80px]">Domain:</span>
          <FilterChips 
            filters={DOMAIN_FILTERS} 
            activeFilter={activeDomain} 
            onFilterChange={setActiveDomain} 
          />
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--text-secondary)] min-w-[80px]">Stipend:</span>
          <FilterChips 
            filters={STIPEND_FILTERS} 
            activeFilter={activeStipend} 
            onFilterChange={setActiveStipend} 
          />
        </div>
      </div>

      {internships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((internship, index) => (
            <OpportunityCard 
              key={internship.id} 
              opportunity={internship} 
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
          <h3 className="font-display font-medium text-xl text-[var(--text-primary)] mb-2">No internships found</h3>
          <p className="text-[var(--text-secondary)]">Try adjusting your filters or search query.</p>
        </motion.div>
      )}
    </div>
  );
}
