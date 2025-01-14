import api from './api';

export interface DeviceCredentials {
  id: number;
  device_id: number;
  username: string;
  password: string;
  ssh_key?: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceCredentialsCreate {
  device_id: number;
  username: string;
  password: string;
  ssh_key?: string;
}

export interface DeviceCredentialsUpdate {
  username?: string;
  password?: string;
  ssh_key?: string;
}

const deviceCredentialsService = {
  getCredentials: async (deviceId: number): Promise<DeviceCredentials> => {
    const response = await api.get<DeviceCredentials>(`/api/device-credentials/${deviceId}`);
    return response.data;
  },

  createCredentials: async (credentials: DeviceCredentialsCreate): Promise<DeviceCredentials> => {
    const response = await api.post<DeviceCredentials>('/api/device-credentials', credentials);
    return response.data;
  },

  updateCredentials: async (deviceId: number, credentials: DeviceCredentialsUpdate): Promise<DeviceCredentials> => {
    const response = await api.put<DeviceCredentials>(`/api/device-credentials/${deviceId}`, credentials);
    return response.data;
  },

  deleteCredentials: async (deviceId: number): Promise<void> => {
    await api.delete(`/api/device-credentials/${deviceId}`);
  },
};

export default deviceCredentialsService;
