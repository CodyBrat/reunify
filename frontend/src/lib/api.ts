const API_URL = 'https://reunify-eycx.onrender.com/api';
// const API_URL = 'http://localhost:8080/api';

export const api = {
  async post<T = unknown>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST', headers, body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result as T;
  },

  async get<T = unknown>(endpoint: string, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, { method: 'GET', headers });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result as T;
  },

  async put<T = unknown>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT', headers, body: data ? JSON.stringify(data) : undefined,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result as T;
  },

  async patch<T = unknown>(endpoint: string, data?: unknown, token?: string): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH', headers, body: data ? JSON.stringify(data) : undefined,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Request failed');
    return result as T;
  },
};
