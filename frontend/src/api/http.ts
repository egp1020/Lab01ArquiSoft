import axios from "axios";
import type { ApiError } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class HttpError extends Error {
  readonly status: number;
  readonly payload?: ApiError;

  constructor(status: number, message: string, payload?: ApiError) {
    super(message);
    this.status = status;
    this.payload = payload;
    Object.setPrototypeOf(this, HttpError.prototype);
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
      const status  = error.response?.status ?? 500;
      const data    = error.response?.data;
      const message =
          (typeof data === "object" && data !== null && "message" in data
              ? (data as ApiError).message
              : null) ??
          (typeof data === "string" && data.trim() !== "" ? data : null) ??
          error.message ??
          "Error inesperado";

      const payload = typeof data === "object" && data !== null
          ? (data as ApiError)
          : undefined;

      return Promise.reject(new HttpError(status, message, payload));
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