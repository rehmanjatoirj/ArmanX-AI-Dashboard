import { create } from 'zustand';
import { agentApi, logsApi, metricsApi, sequencesApi } from '../services/api';
import type { Agent, LeadMetrics, LogEntry, Sequence } from '../types';

interface AgentStoreState {
  agents: Agent[];
  metrics: LeadMetrics | null;
  logs: LogEntry[];
  sequences: Sequence[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  updateAgentStatus: (id: string, status: Agent['status']) => Promise<void>;
  addLog: (entry: LogEntry) => void;
  clearLogs: () => Promise<void>;
}

export const useAgentStore = create<AgentStoreState>((set, get) => ({
  agents: [],
  metrics: null,
  logs: [],
  sequences: [],
  isLoading: false,
  error: null,
  fetchAll: async () => {
    set({ isLoading: true, error: null });

    try {
      const [agentsRes, metricsRes, logsRes, sequencesRes] = await Promise.all([
        agentApi.getAll(),
        metricsApi.getDashboard(),
        logsApi.getAll({ limit: 50, offset: 0 }),
        sequencesApi.getAll(),
      ]);

      set({
        agents: Array.isArray(agentsRes.data) ? agentsRes.data : [],
        metrics: metricsRes.data,
        logs: Array.isArray(logsRes.data) ? logsRes.data : [],
        sequences: [...(Array.isArray(sequencesRes.data) ? sequencesRes.data : [])].sort((a, b) => b.replyRate - a.replyRate),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load dashboard data.',
        isLoading: false,
      });
    }
  },
  updateAgentStatus: async (id, status) => {
    const previous = get().agents;
    const optimisticStatus = status === 'idle' ? 'running' : status;

    set((state) => ({
      agents: state.agents.map((agent) => (agent.id === id ? { ...agent, status: optimisticStatus } : agent)),
    }));

    try {
      if (status === 'running') {
        await agentApi.start(id);
      } else if (status === 'paused') {
        await agentApi.pause(id);
      } else {
        await agentApi.restart(id);
      }
    } catch (error) {
      set({
        agents: previous,
        error: error instanceof Error ? error.message : 'Unable to update agent status.',
      });
    }
  },
  addLog: (entry) => {
    set((state) => ({ logs: [entry, ...state.logs].slice(0, 50) }));
  },
  clearLogs: async () => {
    try {
      await logsApi.clear();
      set({ logs: [] });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unable to clear logs.',
      });
    }
  },
}));
