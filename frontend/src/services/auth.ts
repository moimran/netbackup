import api from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  username: string;
  role: string;
}

const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post<LoginResponse>('/api/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if the API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    } finally {
      window.location.href = '/login';
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  getUserInfo: () => {
    return {
      username: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
    };
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
