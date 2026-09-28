import { FC, ReactNode } from 'react';
import { Card } from '../common/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    label: string;
    isPositive?: boolean;
  };
  action?: ReactNode;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  action,
}) => {
  return (
    <Card className="relative overflow-hidden group hover:border-slate-300 transition-all bg-white">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>

      {(trend || action) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          {trend && (
            <span
              className={`text-xs font-semibold flex items-center gap-1 ${
                trend.isPositive === true
                  ? 'text-emerald-600'
                  : trend.isPositive === false
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {trend.label}
            </span>
          )}
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
    </Card>
  );
};
