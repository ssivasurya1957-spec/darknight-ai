'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { opportunities } from '@/lib/mockData';
import OpportunityCard from '@/components/OpportunityCard';

const FILTERS = ['All', 'Jobs', 'Internships', 'Hackathons', 'Research'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const lowercaseQuery = debouncedQuery.toLowerCase();
    
    const filtered = opportunities.filter((opp) => {
      const matchesFilter = activeFilter === 'All' || opp.type.toLowerCase() === activeFilter.toLowerCase().replace(/s$/, '');
      if (!matchesFilter) return false;

      const searchableText = `${opp.title} ${opp.organization} ${opp.domain} ${opp.skills?.join(' ')}`.toLowerCase();
      return searchableText.includes(lowercaseQuery);
    });

    setResults(filtered);
    setIsSearching(false);
  }, [debouncedQuery, activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col min-h-[calc(100vh-80px)]">
      {/* Search Header */}
      <div className="w-full max-w-3xl mx-auto mb-8 space-y-6">
        <div className="relative">
          <div className={`glass-card flex items-center px-6 py-4 rounded-xl transition-all duration-300 ${query ? 'shadow-[0_0_20px_rgba(59,130,246,0.2)] border-[rgba(59,130,246,0.4)]' : 'border-[rgba(255,255,255,0.05)]'}`} style={{ background: 'rgba(17,17,17,0.6)', backdropFilter: 'blur(40px)', borderWidth: '1px' }}>
            <Search size={24} className="text-[var(--primary)] mr-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search opportunities, skills, companies..."
              className="bg-transparent border-none outline-none text-[var(--text-primary)] w-full text-lg placeholder:text-[var(--text-secondary)] font-medium"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                activeFilter === filter
                  ? 'bg-[var(--primary)] text-white border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        {!debouncedQuery ? (
          <div className="h-full flex flex-col items-center justify-center mt-20 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--primary)] opacity-20 blur-xl rounded-full" />
              <div className="w-20 h-20 bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center relative z-10">
                <Search size={32} className="text-[var(--primary)]" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[var(--text-secondary)] text-lg">
              <span>start typing to discover opportunities</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1 h-5 bg-[var(--primary)] inline-block rounded-full"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-[var(--text-secondary)] font-mono text-sm">
              showing {results.length} results for "{debouncedQuery}"
            </div>
            
            {results.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {results.map((opp) => (
                  <motion.div key={opp.id} variants={itemVariants}>
                    <OpportunityCard opportunity={opp} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-[rgba(17,17,17,0.6)] border border-[rgba(255,255,255,0.08)] rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-xl font-clash text-white mb-2">no opportunities found</h3>
                <p className="text-[var(--text-secondary)]">try adjusting your search or filters for "{debouncedQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
