'use client'

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div 
      className={`glass-card flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${isFocused ? 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.3)]' : 'border-[rgba(255,255,255,0.05)]'} ${className}`}
      style={{
        background: 'rgba(17,17,17,0.6)',
        backdropFilter: 'blur(40px)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <Search size={18} className="text-[var(--text-secondary)] mr-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="bg-transparent border-none outline-none text-[var(--text-primary)] w-full text-sm placeholder:text-[var(--text-secondary)]"
      />
    </div>
  );
}
