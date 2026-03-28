import { Bot, LayoutDashboard, Settings, Users, Workflow, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
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
        'fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/10 bg-[#091126]/95 p-6 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 light:border-slate-200 light:bg-white/95',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="mb-10 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-white light:text-slate-900">
          ArmanX <span className="text-brand-teal">AI</span>
        </Link>
        <button
          className="rounded-2xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden light:hover:bg-slate-100 light:hover:text-slate-900"
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
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white light:text-slate-600 light:hover:bg-slate-100 light:hover:text-slate-900',
                  isActive && 'bg-gradient-to-r from-brand-teal/20 to-brand-cyan/10 text-white ring-1 ring-brand-cyan/20 light:text-slate-900',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-brand-teal/20 bg-gradient-to-br from-brand-teal/15 to-brand-cyan/10 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-brand-cyan">Automation Health</p>
        <p className="mt-3 text-3xl font-bold text-white light:text-slate-900">98.4%</p>
        <p className="mt-2 text-sm text-slate-300 light:text-slate-600">LinkedIn pipelines are stable across GCC and Pakistan campaigns.</p>
      </div>
    </aside>
  </>
);
