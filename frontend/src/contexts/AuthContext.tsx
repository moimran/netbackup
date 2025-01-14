import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  role: string | null;
  username: string | null;
  login: (data: { access_token: string; role: string; username: string }) => void;
  logout: () => void;
  hasPermission: (requiredRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_HIERARCHY = {
  'read_only': 0,
  'admin': 1,
  'super_admin': 2,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for existing auth data
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedRole && storedUsername) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setRole(storedRole);
      setUsername(storedUsername);
    }
  }, []);

  const login = (data: { access_token: string; role: string; username: string }) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('username', data.username);

    setIsAuthenticated(true);
    setToken(data.access_token);
    setRole(data.role);
    setUsername(data.username);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');

    setIsAuthenticated(false);
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  const hasPermission = (requiredRole: string): boolean => {
    if (!role || !ROLE_HIERARCHY.hasOwnProperty(role) || !ROLE_HIERARCHY.hasOwnProperty(requiredRole)) {
      return false;
    }
    return ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] >= 
           ROLE_HIERARCHY[requiredRole as keyof typeof ROLE_HIERARCHY];
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        role,
        username,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
