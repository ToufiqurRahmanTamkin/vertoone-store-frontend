import { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getProfile } from '../api/authApi';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getProfile()
        .then((res) => setUser(res.data.user || res.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (credentials) => {
    const res = await loginApi(credentials);
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    toast.success(`Welcome back, ${u.name || u.email}!`);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerApi(data);
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);
    toast.success('Account created successfully!');
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
