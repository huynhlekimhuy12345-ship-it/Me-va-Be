import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className = '', variant = 'rect', ...props }) {
  const variants = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4 w-full',
    card: 'rounded-card h-72 w-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-pastel-border/60 relative overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-card p-3 border border-pastel-border/60 shadow-soft flex flex-col gap-3">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export default Skeleton;
