import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800"
        >
          <Box className="space-y-6">
            <div className="text-center">
              <Typography 
                variant="h4" 
                className="font-semibold text-gray-900 dark:text-white"
              >
                NetBackup Admin
              </Typography>
              <Typography 
                variant="body1" 
                className="mt-2 text-gray-600 dark:text-gray-300"
              >
                Sign in to your account
              </Typography>
            </div>

            {error && (
              <Alert 
                severity="error" 
                className="rounded-md"
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white dark:bg-gray-700"
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white dark:bg-gray-700"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md"
              >
                Sign In
              </Button>
            </form>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
