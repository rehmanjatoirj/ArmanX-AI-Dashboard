import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Agents } from './pages/Agents';
import { Leads } from './pages/Leads';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
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
  const { isAuthenticated } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const agents = useAgentStore((state) => state.agents);
  const fetchAll = useAgentStore((state) => state.fetchAll);
  const runningAgents = useMemo(() => agents.filter((agent) => agent.status === 'running').length, [agents]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchAll();
    }
  }, [fetchAll, isAuthenticated]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('armanx_theme', theme);
  }, [theme]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents"
              element={
                <ProtectedRoute>
                  <Agents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agents/:id"
              element={
                <ProtectedRoute>
                  <Agents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sequences"
              element={
                <ProtectedRoute>
                  <Sequences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <AppShell />
  </AuthProvider>
);

export default App;
