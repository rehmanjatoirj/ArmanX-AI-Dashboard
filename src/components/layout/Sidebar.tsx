import { Bot, LayoutDashboard, Settings, Users, Workflow, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { dashboardStats } from '../../data/mockData';
import { cn } from '../../lib/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/agents', label: 'Agents', icon: Bot },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/sequences', label: 'Sequences', icon: Workflow },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const healthColor =
  dashboardStats.automationHealth >= 95 ? 'text-[#10B981]' : dashboardStats.automationHealth >= 80 ? 'text-[#FF9800]' : 'text-[#EF4444]';

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    <div
      className={cn(
        'fixed inset-0 z-30 bg-slate-950/60 transition-opacity lg:hidden',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onClose}
    />
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-[#1E3A5F] bg-[#0A0F1E]/98 p-6 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 light:border-slate-200 light:bg-white/95',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="mb-10 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-white light:text-slate-900">
          ArmanX <span className="text-[#0A66C2]">AI</span>
        </Link>
        <button
          className="rounded-xl p-2 text-[#7B8FB0] transition hover:bg-[#111827] hover:text-white lg:hidden light:hover:bg-slate-100 light:hover:text-slate-900"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl border-l-[3px] border-transparent px-4 py-3 text-sm font-medium text-[#7B8FB0] transition hover:bg-[#111827] hover:text-[#E8EEF7] light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900',
                  isActive && 'border-l-[#0A66C2] bg-[#111827] text-[#0A66C2] light:text-slate-900',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[12px] border border-[#1E3A5F] bg-[#111827] p-5">
        <p className="section-label text-[#7B8FB0]">Automation Health</p>
        <p className={cn('mt-3 text-3xl font-bold', healthColor)}>{dashboardStats.automationHealth}%</p>
        <p className="mt-2 text-sm text-[#7B8FB0]">
          {dashboardStats.agentsRunning} agents running | {dashboardStats.totalLeads} leads tracked | Last sync: just now
        </p>
      </div>
    </aside>
  </>
);
