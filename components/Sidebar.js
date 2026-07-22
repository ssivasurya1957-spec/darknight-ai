'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Search, Trophy, GraduationCap, 
  Briefcase, BookOpen, MessageSquare, Bell, User, Settings, FileText
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', href: '/dashboard' },
    { icon: Search, label: 'SEARCH', href: '/dashboard/search' },
    { icon: Trophy, label: 'HACKATHONS', href: '/dashboard/hackathons' },
    { icon: GraduationCap, label: 'INTERNSHIPS', href: '/dashboard/internships' },
    { icon: Briefcase, label: 'JOBS', href: '/dashboard/jobs' },
    { icon: BookOpen, label: 'RESEARCH', href: '/dashboard/research' },
    { icon: MessageSquare, label: 'AI CHAT', href: '/dashboard/chat' },
    { icon: FileText, label: 'RESUME', href: '/dashboard/resume' },
    { icon: Bell, label: 'ALERTS', href: '/dashboard/notifications' },
  ];

  const bottomItems = [
    { icon: User, label: 'PROFILE', href: '/dashboard/profile' },
    { icon: Settings, label: 'SETTINGS', href: '/dashboard/settings' },
  ];

  const mobileVisiblePaths = ['/dashboard', '/dashboard/search', '/dashboard/chat', '/dashboard/notifications', '/dashboard/profile'];

  const renderNavItem = (item) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    
    return (
      <Link href={item.href} key={item.href} style={{ textDecoration: 'none', width: '100%', position: 'relative' }} className="group">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 0',
          margin: '0 auto',
          borderRadius: '12px',
          backgroundColor: isActive ? 'rgba(255, 0, 127, 0.15)' : 'transparent',
          border: isActive ? '1px solid rgba(255, 0, 127, 0.4)' : '1px solid transparent',
          boxShadow: isActive ? '0 0 20px rgba(255, 0, 127, 0.25)' : 'none',
          transition: 'all 250ms ease',
        }}>
          {isActive && (
            <motion.div 
              layoutId="activeTab"
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '24px',
                background: 'linear-gradient(180deg, #FF007F, #00F5FF)',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
                boxShadow: '0 0 12px #FF007F',
              }}
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <Icon 
            size={19} 
            strokeWidth={2}
            style={{
              color: isActive ? '#FF007F' : 'var(--text-secondary)',
              marginBottom: '3px',
              transition: 'color 250ms ease',
            }}
          />
          <span style={{
            fontSize: '0.58rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: isActive ? '#FFD700' : 'var(--text-secondary)',
            textAlign: 'center',
          }}>
            {item.label}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        width: '84px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(12, 9, 24, 0.95)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255, 0, 127, 0.25)',
        zIndex: 40,
        padding: '20px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }} className="hidden md:flex">
        {/* Colorful Bat Logo */}
        <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '1.7rem',
              background: 'linear-gradient(135deg, #FF007F 0%, #FFD700 50%, #00F5FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 0 10px rgba(255, 0, 127, 0.5))',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
            }}>
              🦇✨
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', overflowY: 'auto' }} className="no-scrollbar">
          {navItems.map(renderNavItem)}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', paddingTop: '12px', borderTop: '1px solid rgba(255, 0, 127, 0.2)' }}>
          {bottomItems.map(renderNavItem)}
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(12, 9, 24, 0.96)',
        backdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(255, 0, 127, 0.3)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
      }} className="md:hidden">
        {[...navItems, ...bottomItems]
          .filter(item => mobileVisiblePaths.includes(item.href))
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link href={item.href} key={item.href} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '64px', height: '100%', position: 'relative' }}>
                <Icon 
                  size={18} 
                  strokeWidth={2}
                  style={{
                    marginBottom: '2px',
                    color: isActive ? '#FF007F' : 'var(--text-secondary)',
                  }} 
                />
                <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: isActive ? '#FFD700' : 'var(--text-secondary)' }}>
                  {item.label}
                </span>
              </Link>
            );
        })}
      </nav>
    </>
  );
}
