import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, PauseCircle, PenSquare, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { sequences } from '../data/mockData';
import type { SequenceStatus } from '../types';

const filters: Array<{ label: string; value: 'all' | SequenceStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Paused', value: 'paused' },
  { label: 'Draft', value: 'draft' },
];

const statusClass: Record<SequenceStatus, string> = {
  active: 'status-pill status-active',
  paused: 'status-pill status-paused',
  draft: 'status-pill status-draft',
};

export const Sequences = () => {
  const [filter, setFilter] = useState<'all' | SequenceStatus>('all');
  const [expanded, setExpanded] = useState<string[]>(sequences.map((sequence) => sequence.id));

  const filteredSequences = useMemo(
    () => sequences.filter((sequence) => (filter === 'all' ? true : sequence.status === filter)),
    [filter],
  );

  const toggleExpanded = (sequenceId: string) => {
    setExpanded((current) =>
      current.includes(sequenceId) ? current.filter((item) => item !== sequenceId) : [...current, sequenceId],
    );
  };

  return (
    <div className="space-y-6">
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Sequences</p>
            <h2 className="mt-2 text-[22px] font-semibold text-[#E8EEF7]">Campaign sequence library</h2>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Sequence
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`filter-pill ${filter === item.value ? 'filter-pill-active' : ''}`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {filteredSequences.map((sequence) => {
          const isExpanded = expanded.includes(sequence.id);
          const completionPercent = sequence.enrolled === 0 ? 0 : Math.round((sequence.completed / sequence.enrolled) * 100);

          return (
            <article key={sequence.id} className="panel">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-[#E8EEF7]">{sequence.name}</h3>
                    <span className="rounded-full border border-[#1E3A5F] px-3 py-1 text-xs font-semibold text-[#7B8FB0]">{sequence.region}</span>
                    <span className="rounded-full border border-[#1E3A5F] px-3 py-1 text-xs font-semibold capitalize text-[#7B8FB0]">{sequence.type}</span>
                    <span className={statusClass[sequence.status]}>{sequence.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#7B8FB0]">{sequence.steps} steps | Next step: {sequence.nextStep}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpanded(sequence.id)}
                  className="rounded-xl border border-[#1E3A5F] p-2 text-[#7B8FB0] hover:bg-[#111827]"
                >
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  { label: 'Enrolled', value: sequence.enrolled.toLocaleString() },
                  { label: 'Completed', value: sequence.completed.toLocaleString() },
                  { label: 'Replied', value: sequence.replied.toLocaleString() },
                  { label: 'Reply Rate', value: sequence.replyRate },
                  { label: 'Open Rate', value: sequence.openRate },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[12px] border border-[#1E3A5F] bg-[#0F172A] p-4">
                    <p className="section-label">{metric.label}</p>
                    <p className="mt-3 text-2xl font-bold text-[#E8EEF7]">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-[#7B8FB0]">
                  <span>Progress</span>
                  <span>{completionPercent}% complete</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#0F172A]">
                  <div className="h-full rounded-full bg-[#0A66C2]" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {sequence.channels.map((channel) => (
                  <span key={channel} className="rounded-full border border-[#1E3A5F] px-3 py-1 text-xs font-semibold text-[#E8EEF7]">
                    {channel}
                  </span>
                ))}
              </div>

              {isExpanded ? (
                <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
                  <div className="rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
                    <p className="section-label">Execution Notes</p>
                    <p className="mt-2 text-sm leading-6 text-[#E8EEF7]">
                      Last updated {sequence.lastUpdated}. This sequence is optimized for {sequence.region} pipeline movement and is
                      currently routing the next touchpoint through {sequence.nextStep}.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="secondary" className="gap-2"><PenSquare className="h-4 w-4" />Edit</Button>
                    <Button variant="secondary" className="gap-2"><PauseCircle className="h-4 w-4" />Pause</Button>
                    <Button variant="secondary" className="gap-2"><Copy className="h-4 w-4" />Duplicate</Button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
};
