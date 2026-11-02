import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-bronze ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-md border ${
              error ? 'border-status-red focus:ring-status-red/20' : 'border-black/15 focus:border-bronze focus:ring-2 focus:ring-bronze/20'
            } bg-white px-3.5 py-2.5 pr-10 text-sm text-charcoal outline-none transition-all duration-200 cursor-pointer ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-mutedgray">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-status-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
