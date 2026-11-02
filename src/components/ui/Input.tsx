import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal/80 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-bronze ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-mutedgray">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-md border ${
              error ? 'border-status-red focus:ring-status-red/20' : 'border-black/15 focus:border-bronze focus:ring-2 focus:ring-bronze/20'
            } bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-mutedgray/60 outline-none transition-all duration-200 ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-mutedgray">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-status-red">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-mutedgray">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
