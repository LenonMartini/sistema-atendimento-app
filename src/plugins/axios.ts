import axios from 'axios';
import { useLoadingStore } from '../stores/loading';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pa_access_token');
  const tenantId = localStorage.getItem('pa_tenant_id');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (tenantId) config.headers['x-tenant-id'] = tenantId;

  // Liga o spinner global pra toda requisição — desligado no interceptor de
  // resposta abaixo (sucesso ou erro). Usa contador (ver stores/loading.ts)
  // pra aguentar várias chamadas concorrentes sem esconder o spinner cedo
  // demais.
  useLoadingStore().start();

  return config;
});

api.interceptors.response.use(
  (response) => {
    useLoadingStore().stop();
    return response;
  },
  (error) => {
    useLoadingStore().stop();
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('pa:unauthorized'));
    }
    return Promise.reject(error);
  },
);
