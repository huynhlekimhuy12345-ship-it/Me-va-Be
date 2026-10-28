import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    options = [],
    className = '',
    containerClassName = '',
    required = false,
    id,
    placeholder = 'Chọn một mục...',
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-pastel-text flex items-center gap-1">
          {label}
          {required && <span className="text-brand-pink font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 min-h-[44px] pr-10 appearance-none transition-all duration-200 cursor-pointer',
            'focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 focus:outline-none',
            error ? 'border-brand-danger focus:border-brand-danger' : '',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-pastel-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="text-xs text-brand-danger font-medium mt-0.5">{error}</p>}
    </div>
  );
});

export default Select;
