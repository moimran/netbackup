import api from './api';
import { Admin } from '../types';

export interface AdminCreate {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  status: 'active' | 'inactive';
}

export interface AdminUpdate {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'super_admin';
  status?: 'active' | 'inactive';
}

const adminService = {
  getAll: async (skip: number = 0, limit: number = 100): Promise<Admin[]> => {
    const response = await api.get<Admin[]>(`/api/admins?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string): Promise<Admin> => {
    const response = await api.get<Admin>(`/api/admins/${id}`);
    return response.data;
  },

  create: async (admin: AdminCreate): Promise<Admin> => {
    const response = await api.post<Admin>('/api/admins', admin);
    return response.data;
  },

  update: async (id: string, admin: AdminUpdate): Promise<Admin> => {
    const response = await api.put<Admin>(`/api/admins/${id}`, admin);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/admins/${id}`);
  },
};

export default adminService;
