import { useMemo } from 'react';
import { Activity, ArrowUpRight, BarChart3, Bot, MessageSquareText, Zap } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { dashboardStats } from '../data/mockData';

const chartData = dashboardStats.weeklyLabels.map((label, index) => ({
  label,
  value: dashboardStats.weeklyChart[index],
}));

const activityDotColors = ['#10B981', '#0A66C2', '#F5C518', '#FF4C7F'];

const statCards = [
  {
    label: 'Agents Running',
    value: dashboardStats.agentsRunning,
    subtitle: `${dashboardStats.agentsPaused} paused | ${dashboardStats.agentsError} error`,
    icon: Bot,
    accent: 'text-[#10B981]',
    live: true,
  },
  {
    label: 'Total Leads',
    value: dashboardStats.totalLeads,
    subtitle: `${dashboardStats.hotLeads} hot | ${dashboardStats.warmLeads} warm | ${dashboardStats.coldLeads} cold`,
    icon: Zap,
    accent: 'text-[#F5C518]',
  },
  {
    label: 'Messages Delivered',
    value: dashboardStats.messagesDelivered.toLocaleString(),
    subtitle: `+${dashboardStats.replyRate}% reply rate`,
    icon: MessageSquareText,
    accent: 'text-[#0A66C2]',
  },
  {
    label: 'Post Impressions',
    value: dashboardStats.postImpressions.toLocaleString(),
    subtitle: 'Up 22% this week',
    icon: BarChart3,
    accent: 'text-[#8B5CF6]',
  },
];

const quickStats = [
  { label: 'Connections Today', value: dashboardStats.connectionsToday.toLocaleString() },
  { label: 'Total Connections', value: dashboardStats.totalConnections.toLocaleString() },
  { label: 'Profile Views', value: dashboardStats.profileViews.toLocaleString() },
  { label: 'Reply Rate', value: `${dashboardStats.replyRate}%` },
];

export const Dashboard = () => {
  const maxRegionLeads = useMemo(
    () => Math.max(...dashboardStats.regionBreakdown.map((item) => item.leads)),
    [],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.label} className="panel">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">{card.label}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <p className="text-4xl font-bold text-[#E8EEF7]">{card.value}</p>
                    {card.live ? <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[#10B981]" /> : null}
                  </div>
                  <p className="mt-2 text-sm text-[#7B8FB0]">{card.subtitle}</p>
                </div>
                <div className={`rounded-xl border border-[#1E3A5F] bg-[#0F172A] p-3 ${card.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr,1fr]">
        <article className="panel">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Weekly Impressions</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#E8EEF7]">Campaign momentum over 8 weeks</h2>
            </div>
            <div className="rounded-full border border-[#1E3A5F] bg-[#0F172A] px-3 py-2 text-sm text-[#7B8FB0]">
              <span className="font-semibold text-[#E8EEF7]">Peak:</span> 7,100
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid vertical={false} stroke="rgba(123, 143, 176, 0.12)" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#7B8FB0', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#7B8FB0', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(10, 102, 194, 0.08)' }}
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #1E3A5F',
                    borderRadius: '12px',
                    color: '#E8EEF7',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Impressions']}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#0A66C2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="mb-5">
            <p className="section-label">Region Breakdown</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#E8EEF7]">Lead volume by market</h2>
          </div>
          <div className="space-y-4">
            {dashboardStats.regionBreakdown.map((item) => (
              <div key={item.region} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#E8EEF7]">{item.region}</span>
                  <span className="text-[#7B8FB0]">{item.leads}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#0F172A]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(item.leads / maxRegionLeads) * 100}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr,0.95fr]">
        <article className="panel">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="section-label">Recent Activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#E8EEF7]">Automation feed</h2>
            </div>
            <span className="status-pill status-running">
              <span className="pulse-dot h-2 w-2 rounded-full bg-[#10B981]" />
              Live
            </span>
          </div>
          <div className="overflow-hidden rounded-[12px] border border-[#1E3A5F]">
            {dashboardStats.recentActivity.map((item, index) => (
              <div
                key={`${item.time}-${item.event}`}
                className="flex items-start gap-4 px-4 py-4"
                style={{ backgroundColor: index % 2 === 0 ? 'rgba(15, 23, 42, 0.78)' : 'rgba(17, 24, 39, 0.92)' }}
              >
                <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: activityDotColors[index % activityDotColors.length] }} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#7B8FB0]">{item.time}</div>
                  <p className="mt-1 text-sm leading-6 text-[#E8EEF7]">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="mb-5">
            <p className="section-label">Quick Stats</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#E8EEF7]">Snapshot</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickStats.map((item) => (
              <div key={item.label} className="rounded-[12px] border border-[#1E3A5F] bg-[#0F172A] p-4">
                <p className="section-label">{item.label}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-3xl font-bold text-[#E8EEF7]">{item.value}</p>
                  <ArrowUpRight className="h-4 w-4 text-[#0A66C2]" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-[12px] border border-[#1E3A5F] bg-[#0F172A] p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-[#F5C518]" />
              <div>
                <p className="text-sm font-semibold text-[#E8EEF7]">Automation Health</p>
                <p className="text-sm text-[#7B8FB0]">{dashboardStats.automationHealth}% healthy across all active campaigns.</p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};
