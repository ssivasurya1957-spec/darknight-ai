'use client'

import React from 'react';
import { motion } from 'framer-motion';

export default function FilterChips({ filters = [], activeFilter, onFilterChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              relative px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-300
              ${isActive 
                ? 'text-white' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent border border-[rgba(255,255,255,0.05)] hover:border-[rgba(59,130,246,0.2)]'
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilterChip"
                className="absolute inset-0 bg-[var(--primary)] rounded-full -z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
