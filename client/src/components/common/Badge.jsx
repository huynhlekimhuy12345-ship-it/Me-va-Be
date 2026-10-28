import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) {
  const variants = {
    default: 'bg-pastel-pink/40 text-brand-pink-deep border border-brand-pink/30',
    primary: 'bg-brand-pink text-white',
    new: 'bg-pastel-mint text-pastel-mint-deep border border-pastel-mint-dark/40 font-semibold',
    sale: 'bg-brand-pink text-white font-bold tracking-tight shadow-sm',
    hot: 'bg-pastel-yellow text-amber-900 border border-pastel-yellow-dark/50 font-bold',
    'low-stock': 'bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold',
    'out-of-stock': 'bg-gray-100 text-gray-500 border border-gray-300 line-through',
    // Order status badges
    pending: 'bg-pastel-yellow text-amber-800 border border-amber-300',
    confirmed: 'bg-pastel-mint text-emerald-800 border border-emerald-300',
    shipping: 'bg-sky-100 text-sky-800 border border-sky-300',
    completed: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold',
    canceled: 'bg-rose-100 text-rose-700 border border-rose-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 rounded-full gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-display leading-none select-none',
        variants[variant] || variants.default,
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
