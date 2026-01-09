import { Invoice } from '../types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Invoice API service - handles all CRUD operations with MongoDB backend
 */
export class InvoiceAPI {
  static async create(invoice: Invoice): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    const { data } = await response.json();
    return data;
  }

  static async getAll(page = 1, limit = 10, filters?: { status?: string; clientName?: string }) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters?.status) params.append('status', filters.status);
    if (filters?.clientName) params.append('clientName', filters.clientName);

    const response = await fetch(`${API_BASE}/invoices?${params}`);
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  }

  static async getById(id: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/invoices/${id}`);
    if (!response.ok) throw new Error('Invoice not found');
    const { data } = await response.json();
    return data;
  }

  static async getByInvoiceNumber(invoiceNumber: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/invoices/number/${invoiceNumber}`);
    if (!response.ok) throw new Error('Invoice not found');
    const { data } = await response.json();
    return data;
  }

  static async update(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to update invoice');
    const { data } = await response.json();
    return data;
  }

  static async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/invoices/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete invoice');
  }

  static async updateStatus(id: string, status: string): Promise<Invoice> {
    const response = await fetch(`${API_BASE}/invoices/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update invoice status');
    const { data } = await response.json();
    return data;
  }

  static async search(query: string): Promise<Invoice[]> {
    const response = await fetch(`${API_BASE}/invoices/search/query?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    const { data } = await response.json();
    return data;
  }
}

/**
 * Client API service
 */
export class ClientAPI {
  static async create(client: any) {
    const response = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to create client');
    const { data } = await response.json();
    return data;
  }

  static async getAll(page = 1, limit = 10) {
    const response = await fetch(`${API_BASE}/clients?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  }

  static async getById(id: string) {
    const response = await fetch(`${API_BASE}/clients/${id}`);
    if (!response.ok) throw new Error('Client not found');
    const { data } = await response.json();
    return data;
  }

  static async update(id: string, client: any) {
    const response = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to update client');
    const { data } = await response.json();
    return data;
  }

  static async delete(id: string) {
    const response = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete client');
  }
}
