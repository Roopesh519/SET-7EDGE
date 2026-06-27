import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import tokenManager from '../utils/tokenManager';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refreshUser: async () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    tokenManager.clearToken();
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setUser(null);
        return null;
      }

      const response = await api.get('/auth/me');
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const token = response.data.token;
    const userData = response.data.user;

    if (!token) {
      throw new Error('Login response did not include a token.');
    }

    tokenManager.setToken(token);
    setUser(userData || null);
    return response.data;
  };

  const register = async ({ username, email, password }) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  };

  useEffect(() => {
    const initializeUser = async () => {
      const token = tokenManager.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch (error) {
        tokenManager.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        user,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
