import { DeviceCredential } from '../types';
import api from './api';

interface UpdateDeviceCredentialPayload {
  id: string;
  data: Partial<DeviceCredential>;
}

const deviceCredentialsService = {
  getAll: async (): Promise<DeviceCredential[]> => {
    const response = await api.get<DeviceCredential[]>('/api/device-credentials');
    return response.data;
  },

  getById: async (id: string): Promise<DeviceCredential> => {
    const response = await api.get<DeviceCredential>(`/api/device-credentials/${id}`);
    return response.data;
  },

  create: async (credential: Omit<DeviceCredential, 'id' | 'created_at' | 'updated_at'>): Promise<DeviceCredential> => {
    const response = await api.post<DeviceCredential>('/api/device-credentials', credential);
    return response.data;
  },

  update: async ({ id, data }: UpdateDeviceCredentialPayload): Promise<DeviceCredential> => {
    const response = await api.put<DeviceCredential>(`/api/device-credentials/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/device-credentials/${id}`);
  },
};

export default deviceCredentialsService;
