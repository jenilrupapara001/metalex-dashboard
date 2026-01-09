import { config } from '../config';

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = config.API_BASE_URL;
    this.token = localStorage.getItem(config.AUTH_TOKEN_KEY);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(config.AUTH_TOKEN_KEY, token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(config.AUTH_TOKEN_KEY);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient();

// Invoice endpoints
export const invoiceAPI = {
  list: () => apiClient.get('/invoices'),
  get: (id: string) => apiClient.get(`/invoices/${id}`),
  create: (data: any) => apiClient.post('/invoices', data),
  update: (id: string, data: any) => apiClient.put(`/invoices/${id}`, data),
  delete: (id: string) => apiClient.delete(`/invoices/${id}`),
  generatePDF: (id: string) => apiClient.get(`/invoices/${id}/pdf`),
  send: (id: string, email: string) => apiClient.post(`/invoices/${id}/send`, { email }),
};

// Client endpoints
export const clientAPI = {
  list: () => apiClient.get('/clients'),
  get: (id: string) => apiClient.get(`/clients/${id}`),
  create: (data: any) => apiClient.post('/clients', data),
  update: (id: string, data: any) => apiClient.put(`/clients/${id}`, data),
  delete: (id: string) => apiClient.delete(`/clients/${id}`),
};

// Company endpoints
export const companyAPI = {
  get: () => apiClient.get('/company'),
  update: (data: any) => apiClient.put('/company', data),
};

// User endpoints
export const userAPI = {
  list: () => apiClient.get('/users'),
  get: (id: string) => apiClient.get(`/users/${id}`),
  create: (data: any) => apiClient.post('/users', data),
  update: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => {
    apiClient.clearToken();
  },
  getCurrentUser: () => apiClient.get('/auth/me'),
};

// Reports endpoints
export const reportsAPI = {
  summary: () => apiClient.get('/reports/summary'),
  invoices: (startDate: string, endDate: string) =>
    apiClient.get(`/reports/invoices?startDate=${startDate}&endDate=${endDate}`),
  revenue: (startDate: string, endDate: string) =>
    apiClient.get(`/reports/revenue?startDate=${startDate}&endDate=${endDate}`),
};
