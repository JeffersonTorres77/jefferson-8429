import { ReactNode, FC } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  action,
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-slate-900/90 backdrop-blur-sm border border-slate-800/80 rounded-xl p-6 shadow-xl shadow-black/20 transition-all hover:border-slate-700/80',
          className
        )
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/60">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
