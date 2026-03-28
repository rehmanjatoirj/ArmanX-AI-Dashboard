import { cn } from '../../lib/cn';
import type { Agent } from '../../types';

interface StatusBadgeProps {
  status: Agent['status'];
}

const statusClasses: Record<Agent['status'], string> = {
  running: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30 light:text-emerald-600',
  paused: 'bg-amber-500/15 text-amber-300 ring-amber-400/30 light:text-amber-600',
  error: 'bg-rose-500/15 text-rose-300 ring-rose-400/30 light:text-rose-600',
  idle: 'bg-slate-500/15 text-slate-300 ring-slate-400/20 light:text-slate-600',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1',
      statusClasses[status],
    )}
  >
    {status}
  </span>
);
