import type { ApiError } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

type JsonBody = Record<string, unknown> | unknown[];

export class HttpError extends Error {
  readonly status: number;
  readonly payload?: ApiError;

  constructor(status: number, message: string, payload?: ApiError) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function http<T>(
  path: string,
  options?: Omit<RequestInit, 'body'> & { body?: JsonBody }
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let payload: ApiError | undefined;
    try {
      payload = (await response.json()) as ApiError;
    } catch {
      payload = undefined;
    }

    throw new HttpError(
      response.status,
      payload?.message ?? 'Unexpected request error',
      payload
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
