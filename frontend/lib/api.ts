import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface APIResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    execution_time_ms: number;
  };
  error?: string | null;
}

export const endpoints = {
  analytics: {
    dashboard: () => api.get<APIResponse<any>>('/analytics/dashboard'),
  },
  ml: {
    predictSla: (data: any) => api.post<APIResponse<any>>('/ml/predict-sla', data),
    predictFailure: (data: any) => api.post<APIResponse<any>>('/ml/predict-failure', data),
    detectAnomaly: (data: any) => api.post<APIResponse<any>>('/ml/detect-anomaly', data),
  },
  transactions: {
    list: (skip = 0, limit = 50) => api.get<APIResponse<any>>(`/transactions/?skip=${skip}&limit=${limit}`),
  },
  clients: {
    list: (skip = 0, limit = 50, search = "") => api.get<APIResponse<any>>(`/clients/?skip=${skip}&limit=${limit}&search=${search}`),
  },
  risk: {
    overview: () => api.get<APIResponse<any>>('/risk/overview'),
  }
};
