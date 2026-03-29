import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { Leads } from './pages/Leads';
import { Sequences } from './pages/Sequences';
import { Settings } from './pages/Settings';
import { useAgentStore } from './store/agentStore';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/agents': 'Agents',
  '/leads': 'Leads',
  '/sequences': 'Sequences',
  '/settings': 'Settings',
};

const getTitle = (pathname: string) => {
  if (pathname.startsWith('/agents')) {
    return 'Agents';
  }

  return titles[pathname] ?? 'Dashboard';
};

const getInitialTheme = (): 'dark' | 'light' => {
  const stored = localStorage.getItem('armanx_theme');
  return stored === 'light' ? 'light' : 'dark';
};

const AppShell = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const agents = useAgentStore((state) => state.agents);
  const fetchAll = useAgentStore((state) => state.fetchAll);
  const runningAgents = useMemo(() => agents.filter((agent) => agent.status === 'running').length, [agents]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('armanx_theme', theme);
  }, [theme]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">
          <TopBar
            title={getTitle(location.pathname)}
            runningAgents={runningAgents}
            theme={theme}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:id" element={<Agents />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/sequences" element={<Sequences />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => <AppShell />;

export default App;
