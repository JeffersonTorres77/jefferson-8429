import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className,
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={twMerge(
            clsx(
              'w-full bg-white border text-slate-900 placeholder-slate-400 rounded-lg px-3.5 py-2.5 text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                : 'border-slate-300 focus:border-primary-600 focus:ring-primary-500/20 hover:border-slate-400',
              disabled && 'opacity-60 cursor-not-allowed bg-slate-100',
              className
            )
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-slate-500 mt-1">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
