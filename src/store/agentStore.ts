import { create } from 'zustand';
import { agents, dashboardStats, sequences } from '../data/mockData';
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
  agents,
  metrics: {
    scrapedToday: dashboardStats.connectionsToday,
    connectionsSent: dashboardStats.totalConnections,
    replyRate: dashboardStats.replyRate,
    meetingsBooked: dashboardStats.convertedLeads,
    deltas: {
      scraped: 18,
      connections: 12,
      replyRate: 23.4,
      meetings: 2,
    },
  },
  logs: dashboardStats.recentActivity.map((entry, index) => ({
    id: `activity-${index + 1}`,
    timestamp: entry.time,
    tag: index % 4 === 0 ? 'Lead' : index % 4 === 1 ? 'Outreach' : index % 4 === 2 ? 'System' : 'Error',
    message: entry.event,
  })),
  sequences: sequences.map((sequence) => ({
    id: sequence.id,
    name: sequence.name,
    replyRate: Number.parseFloat(sequence.replyRate),
    activeCount: sequence.enrolled,
    target: `${sequence.region} ${sequence.type}`,
  })),
  isLoading: false,
  error: null,
  fetchAll: async () => {
    set((state) => ({ ...state, isLoading: false, error: null }));
  },
  updateAgentStatus: async (id, status) => {
    const previous = get().agents;

    set((state) => ({
      agents: state.agents.map((agent) => (agent.id === id ? { ...agent, status } : agent)),
    }));

    void previous;
  },
  addLog: (entry) => {
    set((state) => ({ logs: [entry, ...state.logs].slice(0, 50) }));
  },
  clearLogs: async () => {
    set({ logs: [] });
  },
}));
