import { Admin } from '../types';
import api from './api';

export const adminsApi = {
  getAll: async () => {
    const response = await api.get<Admin[]>('/admins/');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Admin>(`/admins/${id}/`);
    return response.data;
  },

  create: async (admin: Omit<Admin, 'id' | 'lastLogin' | 'createdAt'>) => {
    const response = await api.post<Admin>('/admins/', admin);
    return response.data;
  },

  update: async (id: string, admin: Partial<Admin>) => {
    const response = await api.put<Admin>(`/admins/${id}/`, admin);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/admins/${id}/`);
  },
};
