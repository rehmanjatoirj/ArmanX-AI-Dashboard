import { useParams } from 'react-router-dom';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAgentStore } from '../store/agentStore';

export const Agents = () => {
  const { id } = useParams();
  const agents = useAgentStore((state) => state.agents);
  const selected = id ? agents.find((agent) => agent.id === id) : null;

  return (
    <div className="space-y-6">
      <div className="panel p-8">
        <h2 className="text-2xl font-bold text-white light:text-slate-900">Agents</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400 light:text-slate-500">
          Manage scraping, outreach, publishing, and recruiting agents from a unified operational workspace.
        </p>
      </div>

      {selected ? (
        <div className="panel p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-brand-cyan">Agent Details</p>
              <h3 className="mt-2 text-3xl font-bold text-white light:text-slate-900">{selected.name}</h3>
            </div>
            <StatusBadge status={selected.status} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-slate-50">
              <p className="text-sm text-slate-400 light:text-slate-500">Type</p>
              <p className="mt-2 text-xl font-semibold capitalize text-white light:text-slate-900">{selected.type}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-slate-50">
              <p className="text-sm text-slate-400 light:text-slate-500">Queue</p>
              <p className="mt-2 text-xl font-semibold text-white light:text-slate-900">{selected.queueCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 light:border-slate-200 light:bg-slate-50">
              <p className="text-sm text-slate-400 light:text-slate-500">Last Run</p>
              <p className="mt-2 text-xl font-semibold text-white light:text-slate-900">{selected.lastRunAt}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel p-8 text-sm text-slate-400 light:text-slate-500">
          Select an agent from the dashboard table to view deeper operational details here.
        </div>
      )}
    </div>
  );
};
