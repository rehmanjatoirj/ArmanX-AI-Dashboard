import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { leads } from '../data/mockData';
import type { LeadRecord, LeadStatus } from '../types';

const filters: Array<{ label: string; value: 'all' | LeadStatus }> = [
  { label: 'All', value: 'all' },
  { label: 'Hot', value: 'hot' },
  { label: 'Warm', value: 'warm' },
  { label: 'Cold', value: 'cold' },
  { label: 'Converted', value: 'converted' },
];

const sortOptions = ['Score', 'Date', 'Status'] as const;
type SortOption = (typeof sortOptions)[number];

const leadStatusClass: Record<LeadStatus, string> = {
  hot: 'status-pill status-hot',
  warm: 'status-pill status-warm',
  cold: 'status-pill status-cold',
  converted: 'status-pill status-converted',
};

const leadStatusLabel: Record<LeadStatus, string> = {
  hot: 'Hot',
  warm: 'Warm',
  cold: 'Cold',
  converted: 'Converted',
};

const scoreColor = (score: number) => {
  if (score < 50) return '#EF4444';
  if (score < 75) return '#FF9800';
  return '#10B981';
};

export const Leads = () => {
  const [filter, setFilter] = useState<'all' | LeadStatus>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('Score');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  const filteredLeads = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const result = leads
      .filter((lead) => (filter === 'all' ? true : lead.status === filter))
      .filter((lead) =>
        normalized.length === 0
          ? true
          : lead.name.toLowerCase().includes(normalized) || lead.company.toLowerCase().includes(normalized),
      );

    const sorted = [...result];
    if (sortBy === 'Score') sorted.sort((a, b) => b.score - a.score);
    else if (sortBy === 'Date') sorted.sort((a, b) => new Date(b.connectedDate).getTime() - new Date(a.connectedDate).getTime());
    else {
      const rank: Record<LeadStatus, number> = { hot: 0, warm: 1, cold: 2, converted: 3 };
      sorted.sort((a, b) => rank[a.status] - rank[b.status]);
    }

    return sorted;
  }, [filter, search, sortBy]);

  return (
    <div className="space-y-6">
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Lead Pipeline</p>
            <h2 className="mt-2 text-[22px] font-semibold text-[#E8EEF7]">12 Total | 4 Hot | 4 Warm | 2 Cold | 2 Converted</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-[12px] border border-[#1E3A5F] bg-[#0F172A] px-4 py-3">
            <Search className="h-4 w-4 text-[#7B8FB0]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or company"
              className="w-full bg-transparent text-sm text-[#E8EEF7] outline-none placeholder:text-[#7B8FB0]"
            />
          </label>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="rounded-[12px] border border-[#1E3A5F] bg-[#0F172A] px-4 py-3 text-sm text-[#E8EEF7] outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                Sort by: {option}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredLeads.map((lead) => {
          const initials = lead.name.split(' ').map((part) => part[0]).slice(0, 2).join('');

          return (
            <article key={lead.id} className="panel">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: scoreColor(lead.score) }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#E8EEF7]">{lead.name}</h3>
                    <p className="text-sm text-[#7B8FB0]">{lead.title} | {lead.company}</p>
                    <p className="mt-1 text-xs text-[#7B8FB0]">{lead.location}</p>
                  </div>
                </div>
                <span className={leadStatusClass[lead.status]}>{leadStatusLabel[lead.status]}</span>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-[#7B8FB0]">
                  <span>Score</span>
                  <span>{lead.score}/100</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#0F172A]">
                  <div className="h-full rounded-full" style={{ width: `${lead.score}%`, backgroundColor: scoreColor(lead.score) }} />
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div>
                  <p className="section-label">Source Agent</p>
                  <p className="mt-1 text-[#E8EEF7]">{lead.source}</p>
                </div>
                <div>
                  <p className="section-label">Last Activity</p>
                  <p className="mt-1 text-[#E8EEF7]">{lead.lastActivity}</p>
                </div>
                <div>
                  <p className="section-label">Follow-up Date</p>
                  <p className="mt-1 text-[#E8EEF7]">{lead.followUpDate}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {lead.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full border border-[#1E3A5F] px-2.5 py-1 text-xs font-semibold text-[#7B8FB0]">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button variant="secondary" onClick={() => setSelectedLead(lead)}>View Details</Button>
              </div>
            </article>
          );
        })}
      </section>

      {selectedLead ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-[#1E3A5F] bg-[#0A0F1E] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Lead Detail</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#E8EEF7]">{selectedLead.name}</h3>
                <p className="mt-2 text-sm text-[#7B8FB0]">{selectedLead.title} | {selectedLead.company}</p>
              </div>
              <button type="button" onClick={() => setSelectedLead(null)} className="rounded-xl border border-[#1E3A5F] p-2 text-[#7B8FB0] hover:bg-[#111827]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className={leadStatusClass[selectedLead.status]}>{leadStatusLabel[selectedLead.status]}</span>
              {selectedLead.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#1E3A5F] px-3 py-1 text-xs font-semibold text-[#7B8FB0]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="panel-muted p-4"><p className="section-label">Email</p><p className="mt-2 text-sm text-[#E8EEF7]">{selectedLead.email}</p></div>
              <div className="panel-muted p-4"><p className="section-label">Phone</p><p className="mt-2 text-sm text-[#E8EEF7]">{selectedLead.phone}</p></div>
              <div className="panel-muted p-4"><p className="section-label">Connected Date</p><p className="mt-2 text-sm text-[#E8EEF7]">{selectedLead.connectedDate}</p></div>
              <div className="panel-muted p-4"><p className="section-label">Follow-up</p><p className="mt-2 text-sm text-[#E8EEF7]">{selectedLead.followUpDate}</p></div>
              <div className="panel-muted p-4"><p className="section-label">LinkedIn</p><p className="mt-2 text-sm text-[#E8EEF7]">{selectedLead.linkedinUrl}</p></div>
              <div className="panel-muted p-4"><p className="section-label">Source</p><p className="mt-2 text-sm text-[#E8EEF7]">{selectedLead.source}</p></div>
            </div>

            <div className="mt-6 rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
              <p className="section-label">Last Activity</p>
              <p className="mt-2 text-sm leading-6 text-[#E8EEF7]">{selectedLead.lastActivity}</p>
            </div>

            <div className="mt-6 rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
              <p className="section-label">Notes</p>
              <p className="mt-2 text-sm leading-6 text-[#E8EEF7]">{selectedLead.notes}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button>Add to Sequence</Button>
              <Button variant="secondary">Open in CRM</Button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};
