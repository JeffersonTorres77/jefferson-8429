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
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
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
              'w-full bg-slate-900 border text-slate-100 placeholder-slate-500 rounded-lg px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightIcon ? 'pr-10' : 'pr-3.5',
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
                : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-slate-700',
              disabled && 'opacity-50 cursor-not-allowed bg-slate-950',
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
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
