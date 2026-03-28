import { useAgentStore } from '../store/agentStore';

export const Sequences = () => {
  const sequences = useAgentStore((state) => state.sequences);

  return (
    <div className="space-y-6">
      <div className="panel p-8">
        <h2 className="text-2xl font-bold text-white light:text-slate-900">Sequences</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 light:text-slate-500">
          Review sequence effectiveness, targeting strategy, and active volume before plugging in your live campaign APIs.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {sequences.map((sequence) => (
          <div key={sequence.id} className="panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white light:text-slate-900">{sequence.name}</h3>
                <p className="mt-1 text-sm text-slate-400 light:text-slate-500">{sequence.target}</p>
              </div>
              <div className="rounded-2xl bg-brand-cyan/10 px-3 py-2 text-brand-cyan">{sequence.replyRate}%</div>
            </div>
            <p className="mt-5 text-sm text-slate-300 light:text-slate-600">
              Active audience count: <span className="font-semibold text-white light:text-slate-900">{sequence.activeCount}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
