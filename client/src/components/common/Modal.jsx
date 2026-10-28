import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  showClose = true,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pastel-text/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog content */}
      <div
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-2xl border border-pastel-border/80 overflow-hidden transform transition-all z-10 animate-in fade-in zoom-in-95 duration-200',
          maxWidth
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-pastel-border/60 bg-pastel-cream/40">
          <h3 className="text-lg font-display font-bold text-pastel-text">{title}</h3>
          {showClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-pastel-muted hover:text-pastel-text hover:bg-pastel-pink/40 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
