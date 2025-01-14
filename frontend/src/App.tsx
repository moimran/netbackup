import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProviderWrapper } from './theme/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import DeviceGroups from './pages/DeviceGroups';
import DeviceCredentials from './pages/DeviceCredentials';
import Sites from './pages/Sites';
import Locations from './pages/Locations';
import BackupHistory from './pages/BackupHistory';
import Admin from './pages/Admin';
import { useAuth } from './hooks/useAuth';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Auth Guard Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return auth.isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/devices" element={<Devices />} />
                      <Route path="/device-groups" element={<DeviceGroups />} />
                      <Route path="/device-credentials" element={<DeviceCredentials />} />
                      <Route path="/sites" element={<Sites />} />
                      <Route path="/locations" element={<Locations />} />
                      <Route path="/backup-history" element={<BackupHistory />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProviderWrapper>
    </QueryClientProvider>
  );
};

export default App;
