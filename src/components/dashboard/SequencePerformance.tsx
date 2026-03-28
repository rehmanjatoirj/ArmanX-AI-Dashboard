import type { Sequence } from '../../types';

interface SequencePerformanceProps {
  sequences: Sequence[];
}

export const SequencePerformance = ({ sequences }: SequencePerformanceProps) => (
  <div className="panel p-6">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-white light:text-slate-900">Top Performing Sequences</h2>
      <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
        Ranked by reply rate to reveal the strongest messaging plays.
      </p>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      {sequences.map((sequence, index) => (
        <div
          key={sequence.id}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5 light:border-slate-200 light:from-slate-50 light:to-white"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-cyan">Rank #{index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-white light:text-slate-900">{sequence.name}</h3>
              <p className="mt-1 text-sm text-slate-400 light:text-slate-500">{sequence.target}</p>
            </div>
            <div className="rounded-2xl bg-brand-teal/15 px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.14em] text-brand-cyan">Reply rate</p>
              <p className="text-xl font-bold text-white light:text-slate-900">{sequence.replyRate}%</p>
            </div>
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Active leads</p>
              <p className="mt-1 text-2xl font-bold text-white light:text-slate-900">{sequence.activeCount}</p>
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10 light:bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-cyan"
                style={{ width: `${Math.min(sequence.replyRate * 2.5, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
