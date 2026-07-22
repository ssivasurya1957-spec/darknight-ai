'use client'

import React from 'react';
import { motion } from 'framer-motion';

export default function GlowButton({ children, variant = 'primary', onClick, className = '', disabled = false, type = 'button', size = 'md' }) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border border-[rgba(255,255,255,0.1)] bg-transparent hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-primary)]';
      case 'ghost':
        return 'bg-transparent hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent border';
      case 'danger':
        return 'bg-[rgba(255,77,103,0.1)] hover:bg-[rgba(255,77,103,0.2)] text-[var(--danger)] border border-[rgba(255,77,103,0.2)]';
      case 'primary':
      default:
        return 'bg-[var(--primary)] text-white font-medium border border-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]';
    }
  };

  return (
    <motion.button
      type={type}
      className={`btn rounded-md transition-colors ${getVariantStyles()} ${sizeClasses[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
    >
      {children}
    </motion.button>
  );
}
