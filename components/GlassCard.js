'use client'

import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, onClick, style = {} }) {
  return (
    <motion.div
      className={`glass-card ${className}`}
      style={style}
      whileHover={hover ? { y: -2, boxShadow: '0 0 30px rgba(59,130,246,.08)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
