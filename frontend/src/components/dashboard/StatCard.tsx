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
    <Card className="relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      {(trend || action) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          {trend && (
            <span
              className={`text-xs font-medium flex items-center gap-1 ${
                trend.isPositive === true
                  ? 'text-emerald-400'
                  : trend.isPositive === false
                  ? 'text-rose-400'
                  : 'text-slate-400'
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
