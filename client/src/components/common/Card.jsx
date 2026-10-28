import React from 'react';
import { cn } from '../../lib/utils';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-5',
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-card border border-pastel-border/60 shadow-card transition-all duration-300',
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-card-hover cursor-pointer' : '',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
