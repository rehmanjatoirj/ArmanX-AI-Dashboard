export type AgentType = 'scraping' | 'outreach' | 'publishing' | 'recruiting' | 'analytics';
export type AgentStatus = 'running' | 'paused' | 'error';
export type LeadStatus = 'hot' | 'warm' | 'cold' | 'converted';
export type SequenceStatus = 'active' | 'paused' | 'draft';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  region: string;
  leadsToday: number;
  leadsTotal: number;
  successRate: number;
  lastPing: string;
  targetICP: string;
  dailyLimit: number;
  used: number;
  nextRun: string;
  platform: string;
  tags: string[];
  queueCount?: number;
  lastRunAt?: string;
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

export interface LeadRecord {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  status: LeadStatus;
  score: number;
  source: string;
  email: string;
  phone: string;
  connectedDate: string;
  lastActivity: string;
  tags: string[];
  linkedinUrl: string;
  notes: string;
  followUpDate: string;
}

export interface SequenceRecord {
  id: string;
  name: string;
  status: SequenceStatus;
  steps: number;
  enrolled: number;
  completed: number;
  replied: number;
  replyRate: string;
  openRate: string;
  region: string;
  type: 'outreach' | 'recruiting' | 're-engagement';
  lastUpdated: string;
  nextStep: string;
  channels: string[];
}

export interface DashboardStats {
  automationHealth: number;
  agentsRunning: number;
  agentsPaused: number;
  agentsError: number;
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  convertedLeads: number;
  totalConnections: number;
  connectionsToday: number;
  messagesDelivered: number;
  replyRate: number;
  profileViews: number;
  postImpressions: number;
  weeklyChart: number[];
  weeklyLabels: string[];
  regionBreakdown: Array<{
    region: string;
    leads: number;
    color: string;
  }>;
  recentActivity: Array<{
    time: string;
    event: string;
  }>;
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
