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
          'bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm transition-all hover:shadow hover:border-slate-300',
          className
        )
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
