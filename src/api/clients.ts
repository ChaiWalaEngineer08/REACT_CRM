import axios from 'axios';
import type { Client } from '../types/clients';
import { toast } from 'react-toastify';


// read the base URL from Vite’s env vars.
// TS knows import.meta.env.VITE_API_BASE is a string | undefined.
const API_BASE = 'https://reactcrm-production-e5f6.up.railway.app/api'

export const api = axios.create({ baseURL: API_BASE })

/* attach bearer token from AuthContext/localStorage */
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  console.log(cfg.headers.Authorization)
  return cfg;
});



api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      toast.error("Session expired – please log in again");
      // optional: redirect to /login here
    }
    return Promise.reject(err);
  }
);



export async function getAllClients(): Promise<Client[]> {
  const { data } = await api.get<Client[]>('/clients/all'); // <-- baseURL + "/clients"
  return data;                                  // ← just the array
}

export const addClient    = (c: Client)     => api.post('/clients', c);
export const updateClient = (c: Client)     => api.put(`/clients/${c.id}`, c);
export const deleteClient = (id: string)    => api.delete(`/clients/${id}`);
