import { Pause, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Agent } from '../../types';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';

interface AgentStatusTableProps {
  agents: Agent[];
  onUpdateStatus: (id: string, status: Agent['status']) => void;
}

const queueLabel = (agent: Agent) => {
  if (agent.queueCount === 0) {
    return '-';
  }

  return agent.type === 'messenger' ? `${agent.queueCount} msgs` : `${agent.queueCount} pending`;
};

export const AgentStatusTable = ({ agents, onUpdateStatus }: AgentStatusTableProps) => (
  <div className="panel overflow-hidden">
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 light:border-slate-200">
      <div>
        <h2 className="text-lg font-semibold text-white light:text-slate-900">Active Agents</h2>
        <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
          Real-time execution health and queue pressure.
        </p>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-white/[0.03] light:bg-slate-50">
          <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
            <th className="px-6 py-4">Agent Name</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Queue</th>
            <th className="px-6 py-4">Last Run</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id} className="border-t border-white/10 text-sm text-slate-300 light:border-slate-200 light:text-slate-600">
              <td className="px-6 py-4">
                <Link
                  to={`/agents/${agent.id}`}
                  className="font-semibold text-white transition hover:text-brand-cyan light:text-slate-900"
                >
                  {agent.name}
                </Link>
              </td>
              <td className="px-6 py-4 capitalize">{agent.type}</td>
              <td className="px-6 py-4">
                <StatusBadge status={agent.status} />
              </td>
              <td className="px-6 py-4">{queueLabel(agent)}</td>
              <td className="px-6 py-4">{agent.lastRunAt}</td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" className="px-3 py-1.5" onClick={() => onUpdateStatus(agent.id, 'running')}>
                    <Play className="mr-1 h-3.5 w-3.5" />
                    Start
                  </Button>
                  <Button variant="ghost" className="px-3 py-1.5" onClick={() => onUpdateStatus(agent.id, 'paused')}>
                    <Pause className="mr-1 h-3.5 w-3.5" />
                    Pause
                  </Button>
                  <Button variant="ghost" className="px-3 py-1.5" onClick={() => onUpdateStatus(agent.id, 'idle')}>
                    <RotateCcw className="mr-1 h-3.5 w-3.5" />
                    Restart
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
