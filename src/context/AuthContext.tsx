import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import {
  apiFetch,
  ApiError,
  clearToken,
  getToken,
  setToken
} from '../lib/api';
import type { User } from '../types';

interface TokenResponse {
  access_token: string;
}

type ApiClient = <T>(
  path: string,
  options?: RequestInit
) => Promise<T>;

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, code: string) => Promise<User>;
  logout: () => void;
  apiFetch: ApiClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setCurrentToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    apiFetch<User>('/api/auth/me')
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser);
      })
      .catch(() => {
        clearToken();
        if (!cancelled) {
          setCurrentToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (email: string, code: string) => {
    const response = await apiFetch<TokenResponse>('/api/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
    setToken(response.access_token);
    setCurrentToken(response.access_token);
    const currentUser = await apiFetch<User>('/api/auth/me');
    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setCurrentToken(null);
    setUser(null);
  }, []);

  const authenticatedFetch = useCallback<ApiClient>(async (path, options) => {
    try {
      return await apiFetch(path, options);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearToken();
        setCurrentToken(null);
        setUser(null);
      }
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      apiFetch: authenticatedFetch
    }),
    [user, token, loading, login, logout, authenticatedFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
