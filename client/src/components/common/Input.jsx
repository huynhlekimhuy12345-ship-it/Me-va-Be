import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    iconRight: IconRight,
    className = '',
    containerClassName = '',
    required = false,
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-pastel-text flex items-center gap-1">
          {label}
          {required && <span className="text-brand-pink font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-pastel-muted pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 min-h-[44px] transition-all duration-200 placeholder:text-pastel-muted/60',
            'focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 focus:outline-none',
            error ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20' : '',
            Icon ? 'pl-10' : '',
            IconRight ? 'pr-10' : '',
            className
          )}
          {...props}
        />

        {IconRight && (
          <div className="absolute right-3.5 text-pastel-muted">
            <IconRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-brand-danger font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-pastel-muted mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
