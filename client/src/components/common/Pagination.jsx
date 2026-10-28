import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and +/- 1 neighbors
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={cn('flex items-center justify-center gap-1.5 py-6', className)} aria-label="Phân trang">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-full border border-pastel-border/80 text-pastel-text bg-white hover:bg-pastel-cream disabled:opacity-30 disabled:pointer-events-none transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`dots-${idx}`} className="px-2 text-pastel-muted font-bold select-none">
              ...
            </span>
          );
        }

        const isActive = p === currentPage;
        return (
          <button
            key={p}
            onClick={() => handlePageClick(p)}
            className={cn(
              'font-display font-bold text-sm min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-all',
              isActive
                ? 'bg-brand-pink text-white shadow-pink-glow scale-105'
                : 'bg-white text-pastel-text border border-pastel-border/80 hover:bg-pastel-cream'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded-full border border-pastel-border/80 text-pastel-text bg-white hover:bg-pastel-cream disabled:opacity-30 disabled:pointer-events-none transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
        aria-label="Trang sau"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default Pagination;
