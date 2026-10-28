import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  position = 'right', // 'right' or 'bottom'
  width = 'max-w-md w-full',
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pastel-text/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 max-w-full flex pl-10 z-10',
          position === 'bottom' ? 'inset-x-0 bottom-0 top-auto pl-0 pt-10' : ''
        )}
      >
        <div
          className={cn(
            'w-screen bg-white shadow-2xl flex flex-col',
            position === 'right'
              ? 'rounded-l-3xl h-full ' + width
              : 'rounded-t-3xl max-h-[85vh] w-full pb-safe'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-pastel-border/60 bg-pastel-cream/40 shrink-0">
            <h3 className="text-lg font-display font-bold text-pastel-text">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-pastel-muted hover:text-pastel-text hover:bg-pastel-pink/40 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {/* Optional Footer */}
          {footer && (
            <div className="p-5 border-t border-pastel-border/60 bg-pastel-cream/30 shrink-0 pb-safe">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
