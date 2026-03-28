import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { connectSocket, disconnectSocket } from '../lib/socket';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    disconnectSocket();
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const syncAuth = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem('token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
    connectSocket(nextToken);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authApi.login({ email, password });
      syncAuth(response.data.token, response.data.user);
    },
    [syncAuth],
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const response = await authApi.register({ email, password, fullName });
      syncAuth(response.data.token, response.data.user);
    },
    [syncAuth],
  );

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.me();
        setUser(response.data.user);
        connectSocket(token);
      } catch (_error) {
        localStorage.removeItem('token');
        disconnectSocket();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrapAuth();
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
      isLoading,
    }),
    [isLoading, login, logout, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};
