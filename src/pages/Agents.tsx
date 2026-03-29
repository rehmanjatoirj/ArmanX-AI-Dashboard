import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarChart3, Megaphone, MessageSquare, PauseCircle, PlayCircle, Rocket, Search, Users, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { agents as mockAgents } from '../data/mockData';
import type { Agent } from '../types';

const filters: Array<{ label: string; value: 'all' | Agent['status'] }> = [
  { label: 'All', value: 'all' },
  { label: 'Running', value: 'running' },
  { label: 'Paused', value: 'paused' },
  { label: 'Error', value: 'error' },
];

const typeIcons: Record<Agent['type'], React.ComponentType<{ className?: string }>> = {
  scraping: Search,
  outreach: MessageSquare,
  publishing: Megaphone,
  recruiting: Users,
  analytics: BarChart3,
};

const miniActivity = [
  'Cycle completed without rate-limit warning',
  'Daily targeting refreshed from ICP segments',
  'Reply parsing pipeline synced to CRM',
];

export const Agents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | Agent['status']>('all');
  const [selectedId, setSelectedId] = useState<string | null>(id ?? null);

  useEffect(() => {
    setSelectedId(id ?? null);
  }, [id]);

  const filteredAgents = useMemo(
    () => mockAgents.filter((agent) => (filter === 'all' ? true : agent.status === filter)),
    [filter],
  );

  const selectedAgent = useMemo(
    () => mockAgents.find((agent) => agent.id === selectedId) ?? null,
    [selectedId],
  );

  const openAgent = (agentId: string) => {
    setSelectedId(agentId);
    navigate(`/agents/${agentId}`);
  };

  const closeDrawer = () => {
    setSelectedId(null);
    navigate('/agents');
  };

  return (
    <div className="space-y-6">
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">Agent Operations</p>
            <h2 className="mt-2 text-[22px] font-semibold text-[#E8EEF7]">8 Agents Total</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                className={`filter-pill ${filter === item.value ? 'filter-pill-active' : ''}`}
                onClick={() => setFilter(item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#0F172A] text-xs uppercase tracking-[0.08em] text-[#7B8FB0]">
              <tr>
                <th className="px-6 py-4 font-semibold">Agent Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Region</th>
                <th className="px-6 py-4 font-semibold">Leads Today</th>
                <th className="px-6 py-4 font-semibold">Success Rate</th>
                <th className="px-6 py-4 font-semibold">Usage Bar</th>
                <th className="px-6 py-4 font-semibold">Last Ping</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map((agent, index) => {
                const usagePercent = Math.min(100, (agent.used / agent.dailyLimit) * 100);
                const TypeIcon = typeIcons[agent.type];

                return (
                  <tr
                    key={agent.id}
                    className="cursor-pointer border-t border-[#1E3A5F] transition hover:bg-[#0F172A]"
                    style={{ backgroundColor: index % 2 === 0 ? 'rgba(17, 24, 39, 0.95)' : 'rgba(15, 23, 42, 0.92)' }}
                    onClick={() => openAgent(agent.id)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-[#E8EEF7]">{agent.name}</div>
                        <div className="mt-1 text-xs text-[#7B8FB0]">{agent.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#E8EEF7]">
                      <TypeIcon className="mr-2 inline h-4 w-4" />
                      {agent.type}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={agent.status} /></td>
                    <td className="px-6 py-4 text-[#7B8FB0]">{agent.region}</td>
                    <td className="px-6 py-4 font-semibold text-[#E8EEF7]">{agent.leadsToday}</td>
                    <td className="px-6 py-4 text-[#7B8FB0]">{agent.successRate}%</td>
                    <td className="px-6 py-4">
                      <div className="w-40">
                        <div className="flex items-center justify-between text-xs text-[#7B8FB0]">
                          <span>{agent.used}/{agent.dailyLimit}</span>
                          <span>{Math.round(usagePercent)}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#0A0F1E]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${usagePercent}%`, backgroundColor: agent.status === 'error' ? '#EF4444' : '#0A66C2' }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#7B8FB0]">{agent.lastPing}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="rounded-xl border border-[#1E3A5F] px-3 py-2 text-xs font-semibold text-[#E8EEF7] hover:bg-[#111827]"
                        onClick={(event) => {
                          event.stopPropagation();
                          openAgent(agent.id);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {selectedAgent ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-[#1E3A5F] bg-[#0A0F1E] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Agent Detail</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#E8EEF7]">{selectedAgent.name}</h3>
                <p className="mt-2 text-sm text-[#7B8FB0]">{selectedAgent.targetICP}</p>
              </div>
              <button type="button" onClick={closeDrawer} className="rounded-xl border border-[#1E3A5F] p-2 text-[#7B8FB0] hover:bg-[#111827]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusBadge status={selectedAgent.status} />
              {selectedAgent.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[#1E3A5F] px-3 py-1 text-xs font-semibold text-[#7B8FB0]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="panel-muted p-4">
                <p className="section-label">Leads Today</p>
                <p className="mt-3 text-3xl font-bold text-[#E8EEF7]">{selectedAgent.leadsToday}</p>
              </div>
              <div className="panel-muted p-4">
                <p className="section-label">Leads Total</p>
                <p className="mt-3 text-3xl font-bold text-[#E8EEF7]">{selectedAgent.leadsTotal.toLocaleString()}</p>
              </div>
              <div className="panel-muted p-4">
                <p className="section-label">Success Rate</p>
                <p className="mt-3 text-3xl font-bold text-[#E8EEF7]">{selectedAgent.successRate}%</p>
              </div>
              <div className="panel-muted p-4">
                <p className="section-label">Platform</p>
                <p className="mt-3 text-lg font-semibold text-[#E8EEF7]">{selectedAgent.platform}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
                <p className="section-label">Region</p>
                <p className="mt-2 text-sm text-[#E8EEF7]">{selectedAgent.region}</p>
              </div>
              <div className="rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
                <p className="section-label">Next Run</p>
                <p className="mt-2 text-sm text-[#E8EEF7]">{selectedAgent.nextRun}</p>
              </div>
            </div>

            <div className="mt-6 rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
              <div className="flex items-center justify-between text-sm text-[#7B8FB0]">
                <span>Usage</span>
                <span>{selectedAgent.used}/{selectedAgent.dailyLimit}</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#0A0F1E]">
                <div
                  className="h-full rounded-full bg-[#0A66C2]"
                  style={{ width: `${Math.min(100, (selectedAgent.used / selectedAgent.dailyLimit) * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="gap-2">
                <PauseCircle className="h-4 w-4" />
                Pause Agent
              </Button>
              <Button className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Run Now
              </Button>
            </div>

            <div className="mt-6 rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-[#F5C518]" />
                <p className="text-sm font-semibold text-[#E8EEF7]">Mini Activity Log</p>
              </div>
              <div className="mt-4 space-y-3">
                {miniActivity.map((entry, index) => (
                  <div key={entry} className="rounded-xl border border-[#1E3A5F] bg-[#0F172A] p-3 text-sm text-[#7B8FB0]">
                    <span className="mr-2 text-[#E8EEF7]">0{index + 1}</span>
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
};
