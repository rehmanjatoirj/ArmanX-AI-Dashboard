import { useEffect, useState } from 'react';
import { metricsApi } from '../services/api';
import { useAgentStore } from '../store/agentStore';
import type { LeadMetrics } from '../types';

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
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch metrics.');
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
