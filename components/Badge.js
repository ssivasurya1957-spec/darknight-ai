import React from 'react';

export default function Badge({ children, variant = 'blue', className = '' }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-[rgba(0,217,255,0.1)] text-[var(--accent-cyan)] border border-[rgba(0,217,255,0.2)]';
      case 'green':
        return 'bg-[rgba(34,197,94,0.1)] text-[var(--success)] border border-[rgba(34,197,94,0.2)]';
      case 'amber':
        return 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]';
      case 'red':
        return 'bg-[rgba(255,77,103,0.1)] text-[var(--danger)] border border-[rgba(255,77,103,0.2)]';
      case 'blue':
      default:
        return 'bg-[rgba(59,130,246,0.1)] text-[var(--primary)] border border-[rgba(59,130,246,0.2)]';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${getVariantStyles()} ${className}`}>
      {children}
    </span>
  );
}
