import axios from 'axios';
import type { Agent, AuthResponse, FunnelStage, LeadMetrics, LogEntry, Sequence } from '../types';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export const agentApi = {
  getAll: () => api.get<Agent[]>('/agents'),
  getById: (id: string) => api.get<Agent>(`/agents/${id}`),
  create: (data: unknown) => api.post<Agent>('/agents', data),
  update: (id: string, data: unknown) => api.put<Agent>(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`),
  start: (id: string) => api.post(`/agents/${id}/start`),
  pause: (id: string) => api.post(`/agents/${id}/pause`),
  restart: (id: string) => api.post(`/agents/${id}/restart`),
};

export const metricsApi = {
  getDashboard: () => api.get<LeadMetrics>('/metrics/dashboard'),
  getFunnel: () => api.get<FunnelStage[]>('/metrics/funnel'),
  getTopSeqs: () => api.get<Sequence[]>('/metrics/sequences/top'),
};

export const leadsApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/leads', { params }),
  getById: (id: string) => api.get(`/leads/${id}`),
  create: (data: unknown) => api.post('/leads', data),
  bulk: (data: unknown) => api.post('/leads/bulk', data),
  update: (id: string, data: unknown) => api.put(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
  exportCSV: () => api.get('/leads/export/csv', { responseType: 'blob' }),
};

export const logsApi = {
  getAll: (params?: Record<string, unknown>) => api.get<LogEntry[]>('/logs', { params }),
  clear: () => api.delete('/logs'),
};

export const sequencesApi = {
  getAll: () => api.get<Sequence[]>('/sequences'),
  getById: (id: string) => api.get<Sequence>(`/sequences/${id}`),
  create: (data: unknown) => api.post<Sequence>('/sequences', data),
  update: (id: string, data: unknown) => api.put<Sequence>(`/sequences/${id}`, data),
  delete: (id: string) => api.delete(`/sequences/${id}`),
};

export const authApi = {
  register: (data: unknown) => api.post<AuthResponse>('/auth/register', data),
  login: (data: unknown) => api.post<AuthResponse>('/auth/login', data),
  refresh: (data: unknown) => api.post<{ token: string }>('/auth/refresh', data),
  me: () => api.get<{ user: import('../types').AuthUser }>('/auth/me'),
};

export default api;
