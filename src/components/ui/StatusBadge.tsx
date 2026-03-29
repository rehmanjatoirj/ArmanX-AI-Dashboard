import { cn } from '../../lib/cn';
import type { Agent } from '../../types';

interface StatusBadgeProps {
  status: Agent['status'];
}

const statusClasses: Record<Agent['status'], string> = {
  running: 'status-pill status-running',
  paused: 'status-pill status-paused',
  error: 'status-pill status-error',
};

const dotClasses: Record<Agent['status'], string> = {
  running: 'bg-[#10B981]',
  paused: 'bg-[#FF9800]',
  error: 'bg-[#EF4444]',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={cn(statusClasses[status])}>
    <span className={cn('h-2 w-2 rounded-full', dotClasses[status])} />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);
