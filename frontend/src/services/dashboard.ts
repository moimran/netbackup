import api from './api';

export interface DashboardStats {
  total_devices: number;
  active_devices: number;
  inactive_devices: number;
  total_backups: number;
  successful_backups: number;
  failed_backups: number;
  recent_activities: Array<{
    id: string;
    device_name: string;
    status: string;
    message: string;
    created_at: string;
  }>;
}

const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      console.log('Fetching dashboard stats...'); // Debug log
      const response = await api.get<DashboardStats>('/api/dashboard/stats');
      console.log('Dashboard stats response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error); // Debug log
      throw error;
    }
  },
};

export default dashboardService;
