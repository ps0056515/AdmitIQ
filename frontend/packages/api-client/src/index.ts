/// <reference types="vite/client" />

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(text || response.statusText, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: AuthUser }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiFetch<AuthUser>('/api/v1/auth/me'),
};

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string | null;
  tenant?: { id: string; name: string; slug: string };
}

export const dashboardApi = {
  kpis: () => apiFetch<Record<string, number>>('/api/v1/dashboard/kpis'),
  queue: () => apiFetch<unknown[]>('/api/v1/dashboard/queue'),
};

export const leadsApi = {
  list: () => apiFetch<unknown[]>('/api/v1/leads'),
  get: (id: string) => apiFetch<unknown>(`/api/v1/leads/${id}`),
};

export const campaignsApi = {
  list: () => apiFetch<unknown[]>('/api/v1/campaigns'),
};

export const callsApi = {
  list: () => apiFetch<unknown[]>('/api/v1/calls'),
};

export const internalApi = {
  tenants: () => apiFetch<unknown[]>('/api/v1/internal/tenants'),
  tenantHealth: (id: string) => apiFetch<unknown>(`/api/v1/internal/tenants/${id}/health`),
};
