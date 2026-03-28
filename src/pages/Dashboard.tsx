import { useEffect, useState } from 'react';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { AgentStatusTable } from '../components/dashboard/AgentStatusTable';
import { FunnelChart } from '../components/dashboard/FunnelChart';
import { MetricCard } from '../components/dashboard/MetricCard';
import { SequencePerformance } from '../components/dashboard/SequencePerformance';
import { useAgentMetrics } from '../hooks/useAgentMetrics';
import { metricsApi } from '../services/api';
import { useAgentStore } from '../store/agentStore';
import type { FunnelStage } from '../types';

export const Dashboard = () => {
  const { agents, logs, sequences, metrics, isLoading, error, clearLogs, updateAgentStatus } = useAgentStore();
  const { error: metricsError } = useAgentMetrics();
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);

  useEffect(() => {
    const loadFunnel = async () => {
      const response = await metricsApi.getFunnel();
      setFunnel(response.data);
    };

    void loadFunnel();
  }, []);

  if (isLoading && !metrics) {
    return (
      <div className="panel p-10 text-center text-slate-300 light:text-slate-600">
        Loading dashboard intelligence...
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel border-rose-500/20 p-10 text-center text-rose-300 light:text-rose-600">{error}</div>
    );
  }

  if (metricsError && !metrics) {
    return (
      <div className="panel border-rose-500/20 p-10 text-center text-rose-300 light:text-rose-600">
        {metricsError}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Leads Scraped Today" value={metrics.scrapedToday.toLocaleString()} delta={metrics.deltas.scraped} />
        <MetricCard
          label="Connection Requests Sent"
          value={metrics.connectionsSent.toLocaleString()}
          delta={metrics.deltas.connections}
        />
        <MetricCard label="Reply Rate" value={`${metrics.replyRate}%`} delta={metrics.deltas.replyRate} />
        <MetricCard label="Meetings Booked" value={metrics.meetingsBooked.toString()} delta={metrics.deltas.meetings} suffix="" />
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.35fr,0.95fr]">
        <FunnelChart data={funnel} />
        <ActivityLog logs={logs} onClear={clearLogs} />
      </section>

      <section>
        <AgentStatusTable agents={agents} onUpdateStatus={updateAgentStatus} />
      </section>

      <section>
        <SequencePerformance sequences={sequences} />
      </section>
    </div>
  );
};
