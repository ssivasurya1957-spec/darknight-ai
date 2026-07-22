'use client'

import React, { useState, useEffect } from 'react';
import { Bell, Terminal } from 'lucide-react';
import SearchInput from './SearchInput';
import Link from 'next/link';

export default function Topbar({ title = 'Dashboard' }) {
  const [userName, setUserName] = useState('Alex Chen');
  const [userInitials, setUserInitials] = useState('AC');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('darknight_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setUserName(parsed.name);
          const parts = parsed.name.trim().split(' ');
          const init = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2);
          setUserInitials(init.toUpperCase());
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[rgba(10,10,10,0.85)] backdrop-blur-xl border-b border-[rgba(0,217,255,0.15)]">
      <div className="flex items-center gap-3">
        <span className="bat-hud-tag hidden sm:inline-block">
          [ STATUS // ONLINE ]
        </span>
        <h1 className="font-display font-semibold text-lg text-white tracking-wide uppercase">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <div className="w-full md:w-64 max-w-md hidden sm:block">
          <SearchInput placeholder="[ SEARCH SYSTEM DATABASE ]" />
        </div>
        
        <Link href="/dashboard/notifications" className="relative p-2 text-[var(--text-secondary)] hover:text-white transition-colors rounded-xl hover:bg-[rgba(255,255,255,0.05)] border border-transparent hover:border-[rgba(0,217,255,0.2)]">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />
        </Link>
        
        <Link href="/dashboard/profile" className="flex items-center gap-2 text-decoration-none">
          <div className="w-8 h-8 rounded-lg bg-[rgba(0,217,255,0.15)] border border-[rgba(0,217,255,0.3)] flex items-center justify-center text-xs font-mono font-bold text-[var(--accent)] hover:shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all">
            {userInitials}
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)] hidden md:inline-block">
            {userName}
          </span>
        </Link>
      </div>
    </header>
  );
}
