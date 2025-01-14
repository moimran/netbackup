import { Location } from '../types';
import api from './api';

interface UpdateLocationPayload {
  id: number;
  data: Partial<Location>;
}

const locationsService = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get<Location[]>('/api/locations');
    return response.data;
  },

  getBySiteId: async (siteId: number): Promise<Location[]> => {
    const response = await api.get<Location[]>(`/api/locations/site/${siteId}`);
    return response.data;
  },

  getById: async (id: number): Promise<Location> => {
    const response = await api.get<Location>(`/api/locations/${id}`);
    return response.data;
  },

  create: async (location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location> => {
    const response = await api.post<Location>('/api/locations', location);
    return response.data;
  },

  update: async ({ id, data }: UpdateLocationPayload): Promise<Location> => {
    const response = await api.put<Location>(`/api/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/locations/${id}`);
  },
};

export default locationsService;
