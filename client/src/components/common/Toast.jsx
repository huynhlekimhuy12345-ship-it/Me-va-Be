import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 inset-x-4 md:inset-x-auto md:right-5 z-50 flex flex-col gap-2.5 pointer-events-none items-center md:items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm max-w-sm w-full md:w-auto transform transition-all duration-300 animate-in fade-in slide-in-from-top-4',
              toast.type === 'success'
                ? 'bg-white border-pastel-mint-dark text-pastel-text'
                : toast.type === 'error'
                ? 'bg-white border-brand-danger text-pastel-text'
                : 'bg-white border-pastel-pink text-pastel-text'
            )}
          >
            {toast.type === 'success' ? (
              <div className="w-7 h-7 rounded-full bg-pastel-mint flex items-center justify-center text-pastel-mint-deep shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : toast.type === 'error' ? (
              <div className="w-7 h-7 rounded-full bg-brand-danger-light flex items-center justify-center text-brand-danger shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink shrink-0">
                <Info className="w-4 h-4" />
              </div>
            )}

            <div className="flex-1 font-medium text-sm leading-snug">{toast.message}</div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-pastel-muted hover:text-pastel-text p-1 rounded-full"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
