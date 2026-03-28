import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { FunnelStage } from '../../types';

interface FunnelChartProps {
  data: FunnelStage[];
}

export const FunnelChart = ({ data }: FunnelChartProps) => {
  const chartData = data.map((item, index) => {
    const previous = index === 0 ? item.count : data[index - 1].count;
    const conversion = previous === 0 ? 0 : (item.count / previous) * 100;

    return {
      ...item,
      conversion: index === 0 ? 100 : conversion,
    };
  });

  return (
    <div className="panel p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white light:text-slate-900">Outreach Funnel</h2>
        <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
          Stage-to-stage performance across the current outreach cycle.
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 12, left: 32, bottom: 10 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="stage"
              width={130}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              className="text-slate-300 light:text-slate-600"
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#121A34',
                color: '#fff',
              }}
              formatter={(value: number, _name, payload) => [
                `${value.toLocaleString()} (${payload.payload.conversion.toFixed(1)}%)`,
                'Count',
              ]}
            />
            <Bar dataKey="count" radius={[0, 18, 18, 0]} barSize={30}>
              {chartData.map((entry) => (
                <Cell key={entry.stage} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {chartData.map((item) => (
          <div key={item.stage} className="rounded-2xl border border-white/10 bg-white/5 p-3 light:border-slate-200 light:bg-slate-50">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.stage}</p>
            <p className="mt-2 text-xl font-bold text-white light:text-slate-900">{item.count.toLocaleString()}</p>
            <p className="text-sm text-slate-400 light:text-slate-500">{item.conversion.toFixed(1)}% conversion</p>
          </div>
        ))}
      </div>
    </div>
  );
};
