import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'bronze' | 'beige' | 'success' | 'warning' | 'danger' | 'charcoal' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'beige',
  size = 'md',
  className = '',
}) => {
  const variants = {
    bronze: 'bg-bronze/15 text-bronze-dark border border-bronze/30',
    beige: 'bg-beige/40 text-charcoal border border-beige',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-red-50 text-red-800 border border-red-200',
    charcoal: 'bg-charcoal text-ivory',
    outline: 'border border-charcoal/20 text-charcoal',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold tracking-wider uppercase rounded',
    md: 'text-xs px-2.5 py-1 font-medium rounded-full',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
