import { useEffect, useState } from 'react';
import { dashboardStats } from '../data/mockData';
import { metricsApi } from '../services/api';
import { useAgentStore } from '../store/agentStore';
import type { LeadMetrics } from '../types';

const fallbackMetrics: LeadMetrics = {
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
};

export const useAgentMetrics = () => {
  const [metrics, setMetrics] = useState<LeadMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storeMetrics = useAgentStore((state) => state.metrics);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        const response = await metricsApi.getDashboard();

        if (isMounted) {
          setMetrics(response.data);
          useAgentStore.setState({ metrics: response.data });
          setError(null);
          setIsLoading(false);
        }
      } catch (_err) {
        if (isMounted) {
          setMetrics(fallbackMetrics);
          useAgentStore.setState({ metrics: fallbackMetrics });
          setError(null);
          setIsLoading(false);
        }
      }
    };

    void fetchMetrics();
    const intervalId = window.setInterval(fetchMetrics, 10000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return { metrics: storeMetrics ?? metrics, isLoading, error };
};
