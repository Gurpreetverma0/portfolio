import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const res = await authApi.me();
      setAdmin(res.data.data);
    } catch {
      try {
        localStorage.removeItem('portfolio_admin_token');
      } catch {}
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.data.token) {
      try {
        localStorage.setItem('portfolio_admin_token', res.data.token);
      } catch {}
    }
    setAdmin(res.data.data);
    return res.data.data;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      try {
        localStorage.removeItem('portfolio_admin_token');
      } catch {}
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
