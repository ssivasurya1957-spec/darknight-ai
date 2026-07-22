'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Search, Trophy, GraduationCap, 
  Briefcase, BookOpen, MessageSquare, Bell, User, Settings 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: Search, label: 'Search', href: '/dashboard/search' },
    { icon: Trophy, label: 'Hackathons', href: '/dashboard/hackathons' },
    { icon: GraduationCap, label: 'Internships', href: '/dashboard/internships' },
    { icon: Briefcase, label: 'Jobs', href: '/dashboard/jobs' },
    { icon: BookOpen, label: 'Research', href: '/dashboard/research' },
    { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  ];

  const bottomItems = [
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const mobileVisiblePaths = ['/dashboard', '/dashboard/search', '/dashboard/chat', '/dashboard/notifications', '/dashboard/profile'];

  const renderNavItem = (item) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    
    return (
      <Link href={item.href} key={item.href} style={{ textDecoration: 'none', width: '100%', position: 'relative' }} className="group">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '44px',
          width: '44px',
          margin: '0 auto',
          borderRadius: '12px',
          backgroundColor: isActive ? 'rgba(0, 217, 255, 0.12)' : 'transparent',
          border: isActive ? '1px solid rgba(0, 217, 255, 0.3)' : '1px solid transparent',
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
                width: '3px',
                height: '28px',
                backgroundColor: 'var(--accent)',
                borderTopRightRadius: '4px',
                borderBottomRightRadius: '4px',
                boxShadow: '0 0 10px var(--accent)',
              }}
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <Icon 
            size={20} 
            strokeWidth={1.5}
            style={{
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'color 250ms ease',
            }}
          />
        </div>
        
        {/* Tooltip for desktop */}
        <div style={{
          position: 'absolute',
          left: '100%',
          marginLeft: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '6px 12px',
          backgroundColor: '#101015',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: '#ffffff',
          whiteSpace: 'nowrap',
          zIndex: 50,
        }} className="hidden group-hover:block pointer-events-none">
          [ {item.label.toUpperCase()} ]
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        width: '80px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 40,
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }} className="hidden md:flex">
        <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: '#ffffff',
              letterSpacing: '-0.05em',
            }}>
              DK<span style={{ color: 'var(--accent)' }}>.</span>
            </div>
          </Link>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', overflowY: 'auto' }}>
          {navItems.map(renderNavItem)}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
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
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
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
                  size={20} 
                  strokeWidth={1.5}
                  style={{
                    marginBottom: '4px',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  }} 
                />
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {item.label}
                </span>
              </Link>
            );
        })}
      </nav>
    </>
  );
}
