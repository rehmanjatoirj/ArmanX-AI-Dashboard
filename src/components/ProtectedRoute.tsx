import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-navy px-6 text-slate-100 light:bg-slate-50 light:text-slate-900">
        <div className="panel flex items-center gap-3 px-6 py-4">
          <span className="h-3 w-3 rounded-full bg-brand-cyan animate-pulse-soft" />
          Checking your session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
