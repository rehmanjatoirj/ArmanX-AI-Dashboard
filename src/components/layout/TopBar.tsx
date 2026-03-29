import { Menu, Moon, SunMedium } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopBarProps {
  title: string;
  runningAgents: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
}

export const TopBar = ({ title, runningAgents, theme, onToggleTheme, onOpenSidebar }: TopBarProps) => (
  <header className="sticky top-0 z-20 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#1E3A5F] bg-[#0f172a]/92 px-5 py-4 backdrop-blur-xl light:border-slate-200 light:bg-white/90">
    <div className="flex items-center gap-3">
      <button
        className="rounded-xl p-2 text-[#7B8FB0] transition hover:bg-[#111827] hover:text-[#E8EEF7] lg:hidden light:text-slate-700 light:hover:bg-slate-100"
        onClick={onOpenSidebar}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[#E8EEF7] light:text-slate-900">{title}</h1>
        <p className="text-sm text-[#7B8FB0] light:text-slate-500">ArmanX AI LinkedIn orchestration command center</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 light:border-emerald-500/20 light:text-emerald-600">
        <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-emerald-400" />
        Live
      </div>
      <div className="rounded-full border border-[#0A66C2]/30 bg-[#0A66C2]/10 px-4 py-2 text-sm font-medium text-[#E8EEF7]">
        {runningAgents} agents running
      </div>
      <Button variant="ghost" className="rounded-full px-3" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  </header>
);
