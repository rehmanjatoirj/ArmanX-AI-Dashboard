import { Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import type { LogEntry } from '../../types';
import { Button } from '../ui/Button';

interface ActivityLogProps {
  logs: LogEntry[];
  onClear: () => void;
}

const tagStyles: Record<LogEntry['tag'], string> = {
  Lead: 'bg-sky-500/15 text-sky-300 ring-sky-400/25 light:text-sky-600',
  Outreach: 'bg-brand-teal/20 text-emerald-300 ring-brand-teal/25 light:text-emerald-600',
  Error: 'bg-rose-500/15 text-rose-300 ring-rose-400/25 light:text-rose-600',
  System: 'bg-violet-500/15 text-violet-300 ring-violet-400/25 light:text-violet-600',
};

export const ActivityLog = ({ logs, onClear }: ActivityLogProps) => {
  const renderedLogs = useMemo(() => logs.slice(0, 12), [logs]);

  return (
    <div className="panel flex h-full flex-col p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white light:text-slate-900">Live Activity Log</h2>
          <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
            Streaming events from scraping, messaging, and automation jobs.
          </p>
        </div>
        <Button variant="ghost" onClick={onClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear log
        </Button>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1">
        {renderedLogs.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-slate-50"
          >
            <div className="flex items-center justify-between gap-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tagStyles[entry.tag]}`}>
                {entry.tag}
              </span>
              <span className="text-xs text-slate-500">{entry.timestamp}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300 light:text-slate-700">{entry.message}</p>
          </div>
        ))}

        {renderedLogs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400 light:border-slate-300 light:text-slate-500">
            Activity log cleared. New events will appear automatically.
          </div>
        )}
      </div>
    </div>
  );
};
