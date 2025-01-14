import { Device } from '../types';
import api from './api';

interface UpdateDevicePayload {
  id: number;
  data: Partial<Device>;
}

const devicesService = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get<Device[]>('/api/devices');
    return response.data;
  },

  getById: async (id: number): Promise<Device> => {
    const response = await api.get<Device>(`/api/devices/${id}`);
    return response.data;
  },

  create: async (device: Omit<Device, 'id' | 'created_at' | 'updated_at'>): Promise<Device> => {
    const response = await api.post<Device>('/api/devices', device);
    return response.data;
  },

  update: async ({ id, data }: UpdateDevicePayload): Promise<Device> => {
    const response = await api.put<Device>(`/api/devices/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/devices/${id}`);
  },
};

export default devicesService;
