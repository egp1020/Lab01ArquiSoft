import axios from "axios";
import type { ApiError } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export class HttpError extends Error {
  readonly status: number;
  readonly payload?: ApiError;

  constructor(status: number, message: string, payload?: ApiError) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': "application/json"
  },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status ?? 500;
      const payload = error.response?.data as ApiError | undefined;

      const message =
          payload?.message ??
          error.message ??
          "Unexpected request error"

      return Promise.reject(new HttpError(status, message, payload))
    }
);

export const http = {
  get: async <T>(path: string): Promise<T> => {
    const res = await api.get<T>(path);
    return res.data;
  },

  post: async <T>(path: string, body?: unknown): Promise<T> => {
    const res = await api.post<T>(path, body);
    return res.data;
  },

  put: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await api.put<T>(path, body);
    return res.data;
  },

  patch: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await api.patch<T>(path, body);
    return res.data;
  },

  delete: async <T>(path: string): Promise<T> => {
    const res = await api.delete<T>(path);
    return res.data;
  }
};