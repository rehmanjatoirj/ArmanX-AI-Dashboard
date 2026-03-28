import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/cn';

interface MetricCardProps {
  label: string;
  value: string;
  delta: number;
  suffix?: string;
}

export const MetricCard = ({ label, value, delta, suffix = '%' }: MetricCardProps) => {
  const isPositive = delta >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400 light:text-slate-500">{label}</p>
          <p className="mt-4 text-3xl font-bold tracking-tight text-white light:text-slate-900">{value}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1',
            isPositive
              ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25 light:text-emerald-600'
              : 'bg-rose-500/15 text-rose-300 ring-rose-400/25 light:text-rose-600',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {isPositive && delta > 0 ? '+' : ''}
          {delta}
          {suffix}
        </span>
      </div>
    </div>
  );
};
