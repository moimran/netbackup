import { DeviceGroup } from '../types';
import api from './api';

interface UpdateDeviceGroupPayload {
  id: string;
  data: Partial<DeviceGroup>;
}

const deviceGroupsService = {
  getAll: async (): Promise<DeviceGroup[]> => {
    const response = await api.get<DeviceGroup[]>('/api/device-groups');
    return response.data;
  },

  getById: async (id: string): Promise<DeviceGroup> => {
    const response = await api.get<DeviceGroup>(`/api/device-groups/${id}`);
    return response.data;
  },

  create: async (deviceGroup: Omit<DeviceGroup, 'id' | 'created_at' | 'updated_at'>): Promise<DeviceGroup> => {
    const response = await api.post<DeviceGroup>('/api/device-groups', deviceGroup);
    return response.data;
  },

  update: async ({ id, data }: UpdateDeviceGroupPayload): Promise<DeviceGroup> => {
    const response = await api.put<DeviceGroup>(`/api/device-groups/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/device-groups/${id}`);
  },

  addDevice: async (groupId: string, deviceId: string): Promise<DeviceGroup> => {
    const response = await api.post<DeviceGroup>(
      `/api/device-groups/${groupId}/devices`, 
      { device_id: deviceId }
    );
    return response.data;
  },

  removeDevice: async (groupId: string, deviceId: string): Promise<void> => {
    await api.delete(`/api/device-groups/${groupId}/devices/${deviceId}`);
  },
};

export default deviceGroupsService;
