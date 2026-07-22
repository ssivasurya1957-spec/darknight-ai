'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';
import { userProfile } from '@/lib/mockData';
import GlassCard from '@/components/GlassCard';
import GlowButton from '@/components/GlowButton';
import Badge from '@/components/Badge';

export default function ProfilePage() {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center space-y-8"
      >
        {/* Avatar & Header */}
        <motion.div variants={containerVariants} className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent-cyan)] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-4 border-2 border-[rgba(255,255,255,0.1)] relative">
            <span className="text-white text-2xl font-bold font-clash">{getInitials(userProfile.name)}</span>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-[var(--success)] rounded-full border-2 border-[var(--bg)] shadow-[0_0_10px_var(--success)]" />
          </div>
          
          <h1 className="text-3xl font-clash text-white mb-1">{userProfile.name}</h1>
          <p className="text-[var(--text-secondary)] text-lg mb-2">{userProfile.university} • {userProfile.graduationYear}</p>
          <p className="font-mono text-sm text-[var(--text-muted)] bg-[rgba(255,255,255,0.03)] px-3 py-1 rounded-full border border-[rgba(255,255,255,0.05)]">
            {userProfile.email}
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={containerVariants} className="flex flex-wrap justify-center gap-4 w-full">
          <GlassCard className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
            <div className="text-2xl font-clash text-white mb-1">12</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">saved</div>
          </GlassCard>
          <GlassCard className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
            <div className="text-2xl font-clash text-white mb-1">8</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">applied</div>
          </GlassCard>
          <GlassCard className="flex-1 min-w-[120px] py-4 px-2 text-center" hover={false}>
            <div className="text-2xl font-clash text-[var(--primary)] mb-1">95%</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">match</div>
          </GlassCard>
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">skills</h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill, index) => (
              <Badge key={index} variant="blue" className="px-3 py-1.5 text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">interests</h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.interests.map((interest, index) => (
              <Badge key={index} variant="cyan" className="px-3 py-1.5 text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Linked Accounts Section */}
        <motion.div variants={containerVariants} className="w-full">
          <h2 className="font-satoshi font-medium text-lg text-white mb-4 lowercase tracking-wide border-b border-[rgba(255,255,255,0.05)] pb-2">linked accounts</h2>
          <GlassCard className="p-0 overflow-hidden" hover={false}>
            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center text-[var(--success)]">
                  <MessageSquare size={16} />
                </div>
                <span className="text-[var(--text-primary)]">WhatsApp</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
                <span className="text-sm text-[var(--text-secondary)]">Connected</span>
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[rgba(59,130,246,0.1)] flex items-center justify-center text-[var(--primary)]">
                  <Mail size={16} />
                </div>
                <span className="text-[var(--text-primary)]">Email</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">{userProfile.email}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={containerVariants} className="pt-6 w-full flex justify-center">
          <GlowButton variant="outline" className="w-full max-w-xs">
            Edit Profile
          </GlowButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
