import { Site } from '../types';
import api from './api';

interface UpdateSitePayload {
  id: number;
  data: Partial<Site>;
}

const sitesService = {
  getAll: async (): Promise<Site[]> => {
    const response = await api.get<Site[]>('/api/sites');
    return response.data;
  },

  getById: async (id: number): Promise<Site> => {
    const response = await api.get<Site>(`/api/sites/${id}`);
    return response.data;
  },

  create: async (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site> => {
    const response = await api.post<Site>('/api/sites', site);
    return response.data;
  },

  update: async ({ id, data }: UpdateSitePayload): Promise<Site> => {
    const response = await api.put<Site>(`/api/sites/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/sites/${id}`);
  },
};

export default sitesService;
