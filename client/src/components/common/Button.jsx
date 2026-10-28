import React from 'react';
import { cn } from '../../lib/utils';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-display font-semibold transition-all duration-200 select-none cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px]';

  const variants = {
    primary: 'bg-brand-pink text-white hover:bg-brand-pink-hover shadow-soft hover:shadow-pink-glow focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2',
    secondary: 'bg-white text-pastel-text border-2 border-brand-pink hover:bg-brand-pink-light shadow-soft focus-visible:ring-2 focus-visible:ring-brand-pink',
    danger: 'bg-brand-danger text-white hover:bg-brand-danger-hover shadow-soft focus-visible:ring-2 focus-visible:ring-brand-danger',
    mint: 'bg-pastel-mint text-pastel-mint-deep hover:bg-pastel-mint-dark/40 shadow-soft focus-visible:ring-2 focus-visible:ring-pastel-mint-dark',
    outline: 'bg-white text-pastel-text border border-pastel-border hover:bg-pastel-cream-warm hover:border-pastel-pink shadow-soft',
    ghost: 'bg-transparent text-pastel-text hover:bg-pastel-pink/30 hover:text-brand-pink-deep',
    link: 'bg-transparent text-brand-pink hover:underline min-h-0 p-0',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 min-h-[38px]',
    md: 'text-sm px-5 py-2.5 rounded-full gap-2 min-h-[44px]',
    lg: 'text-base px-7 py-3 rounded-full gap-2.5 min-h-[48px]',
    icon: 'p-2.5 rounded-full min-h-[44px] min-w-[44px]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={cn('w-4 h-4 shrink-0', size === 'lg' ? 'w-5 h-5' : '')} />
      ) : null}
      <span>{children}</span>
      {!loading && IconRight ? (
        <IconRight className={cn('w-4 h-4 shrink-0', size === 'lg' ? 'w-5 h-5' : '')} />
      ) : null}
    </button>
  );
}
export default Button;
