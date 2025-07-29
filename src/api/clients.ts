import axios from 'axios';
import type { Client } from '../types/clients';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE ?? `http://localhost:4000/api`
// const API_BASE = `http://localhost:4000/api`;

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  console.log(cfg.headers.Authorization);
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      toast.error('Session expired – please log in again');
    }
    return Promise.reject(err);
  },
);

export async function getAllClients(): Promise<Client[]> {
  const { data } = await api.get<Client[]>('/clients/all');
  return data;
}

export const addClient = (c: Client) => api.post('/clients', c);
export const updateClient = (c: Client) => api.put(`/clients/${c.id}`, c);
export const deleteClient = (id: string) => api.delete(`/clients/${id}`);
