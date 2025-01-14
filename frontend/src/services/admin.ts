import api from './api';
import { Admin } from '../types';

const adminService = {
  getAll: async (): Promise<Admin[]> => {
    const response = await api.get<Admin[]>('/api/admin/users');
    return response.data;
  },

  create: async (admin: Omit<Admin, 'id' | 'created_at' | 'updated_at'>): Promise<Admin> => {
    const response = await api.post<Admin>('/api/admin/users', admin);
    return response.data;
  },

  update: async (id: string, admin: Partial<Admin>): Promise<Admin> => {
    const response = await api.put<Admin>(`/api/admin/users/${id}`, admin);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },
};

export default adminService;
