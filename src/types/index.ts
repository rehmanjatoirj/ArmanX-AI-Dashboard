export interface Agent {
  id: string;
  name: string;
  type: 'scraper' | 'messenger' | 'publisher' | 'sourcer';
  status: 'running' | 'paused' | 'error' | 'idle';
  queueCount: number;
  lastRunAt: string;
}

export interface LeadMetrics {
  scrapedToday: number;
  connectionsSent: number;
  replyRate: number;
  meetingsBooked: number;
  deltas: {
    scraped: number;
    connections: number;
    replyRate: number;
    meetings: number;
  };
}

export interface FunnelStage {
  stage: string;
  count: number;
  color: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tag: 'Lead' | 'Outreach' | 'Error' | 'System';
  message: string;
}

export interface Sequence {
  id: string;
  name: string;
  replyRate: number;
  activeCount: number;
  target: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}
