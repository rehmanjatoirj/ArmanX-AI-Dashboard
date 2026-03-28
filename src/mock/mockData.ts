import type { Agent, FunnelStage, LeadMetrics, LogEntry, Sequence } from '../types';

export const mockMetrics: LeadMetrics = {
  scrapedToday: 1247,
  connectionsSent: 384,
  replyRate: 24.3,
  meetingsBooked: 11,
  deltas: {
    scraped: 18,
    connections: 9,
    replyRate: 6.1,
    meetings: -2,
  },
};

export const mockFunnel: FunnelStage[] = [
  { stage: 'Prospects Found', count: 1247, color: '#00D4FF' },
  { stage: 'Requests Sent', count: 798, color: '#00C2E5' },
  { stage: 'Accepted', count: 384, color: '#1D9E75' },
  { stage: 'Replied', count: 303, color: '#EF8A43' },
  { stage: 'Meetings Booked', count: 11, color: '#F05A5A' },
];

export const mockAgents: Agent[] = [
  {
    id: 'lead-gen-agent',
    name: 'Lead Gen Agent',
    type: 'scraper',
    status: 'running',
    queueCount: 47,
    lastRunAt: '2 min ago',
  },
  {
    id: 'outreach-agent',
    name: 'Outreach Agent',
    type: 'messenger',
    status: 'running',
    queueCount: 212,
    lastRunAt: 'Just now',
  },
  {
    id: 'content-agent',
    name: 'Content Agent',
    type: 'publisher',
    status: 'paused',
    queueCount: 0,
    lastRunAt: '1 hr ago',
  },
  {
    id: 'recruiter-agent',
    name: 'Recruiter Agent',
    type: 'sourcer',
    status: 'error',
    queueCount: 0,
    lastRunAt: '30 min ago',
  },
];

export const mockSequences: Sequence[] = [
  {
    id: 'seq-founder-gcc',
    name: 'Founder Outreach GCC',
    replyRate: 31.8,
    activeCount: 126,
    target: 'Dubai startup founders',
  },
  {
    id: 'seq-saas-pakistan',
    name: 'B2B SaaS Pakistan',
    replyRate: 27.4,
    activeCount: 94,
    target: 'Lahore and Karachi SaaS leads',
  },
  {
    id: 'seq-talent-middle-east',
    name: 'Recruiting MENA Tech',
    replyRate: 22.9,
    activeCount: 63,
    target: 'Senior engineers in UAE and KSA',
  },
  {
    id: 'seq-agency-growth',
    name: 'Agency Growth Sprint',
    replyRate: 19.6,
    activeCount: 82,
    target: 'Marketing agency owners',
  },
];

export const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: '09:42:11',
    tag: 'Lead',
    message: 'Imported 46 fresh profiles matching fintech founders in Dubai.',
  },
  {
    id: 'log-2',
    timestamp: '09:39:02',
    tag: 'Outreach',
    message: 'Outreach Agent sent 18 personalized requests to Riyadh prospects.',
  },
  {
    id: 'log-3',
    timestamp: '09:34:18',
    tag: 'System',
    message: 'Sequence warmup rules updated for high-volume messenger accounts.',
  },
  {
    id: 'log-4',
    timestamp: '09:28:55',
    tag: 'Error',
    message: 'Recruiter Agent hit a proxy timeout while sourcing AI engineers.',
  },
  {
    id: 'log-5',
    timestamp: '09:21:33',
    tag: 'Lead',
    message: 'New lead cluster created for Amman-based product managers.',
  },
];

const liveMessages: Array<Pick<LogEntry, 'tag' | 'message'>> = [
  {
    tag: 'Lead',
    message: 'Najma Khan list refreshed with 23 new ecommerce operators from Karachi.',
  },
  {
    tag: 'Outreach',
    message: 'Ameen Al-Harthi replied positively and requested a meeting link.',
  },
  {
    tag: 'System',
    message: 'Safety throttle reduced send rate on one account to protect deliverability.',
  },
  {
    tag: 'Error',
    message: 'Content Agent failed to generate a post draft for Arabic localization.',
  },
  {
    tag: 'Lead',
    message: 'Sana Yousaf pipeline enriched with firmographic data from Lahore startups.',
  },
];

export const createMockLogEntry = (): LogEntry => {
  const sample = liveMessages[Math.floor(Math.random() * liveMessages.length)];
  const now = new Date();

  return {
    id: `log-${now.getTime()}`,
    timestamp: now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    tag: sample.tag,
    message: sample.message,
  };
};
