import { useState, useEffect } from 'react';
import authService from '../services/auth';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  role: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => ({
    isAuthenticated: !!localStorage.getItem('access_token'),
    token: localStorage.getItem('access_token'),
    username: localStorage.getItem('username'),
    role: localStorage.getItem('role'),
  }));

  useEffect(() => {
    // Update localStorage when authState changes
    if (authState.token) {
      localStorage.setItem('access_token', authState.token);
      if (authState.username) localStorage.setItem('username', authState.username);
      if (authState.role) localStorage.setItem('role', authState.role);
    } else {
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
  }, [authState]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      setAuthState({
        isAuthenticated: true,
        token: response.access_token,
        username: response.username,
        role: response.role,
      });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        token: null,
        username: null,
        role: null,
      });
    }
  };

  const getIsAuthenticated = () => {
    return authState.isAuthenticated;
  };

  return {
    token: authState.token,
    username: authState.username,
    role: authState.role,
    login,
    logout,
    isAuthenticated: getIsAuthenticated,
  };
}
