import { create } from 'zustand';
import { Invoice } from '../types';
import { InvoiceAPI } from '../services/apiService';

interface InvoiceStore {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchInvoices: (page?: number, limit?: number, filters?: any) => Promise<void>;
  fetchInvoiceById: (id: string) => Promise<void>;
  createInvoice: (invoice: Invoice) => Promise<Invoice | null>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  clearError: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,

  fetchInvoices: async (page = 1, limit = 10, filters) => {
    set({ loading: true, error: null });
    try {
      const response = await InvoiceAPI.getAll(page, limit, filters);
      set({ invoices: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchInvoiceById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const invoice = await InvoiceAPI.getById(id);
      set({ currentInvoice: invoice, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createInvoice: async (invoice: Invoice) => {
    set({ loading: true, error: null });
    try {
      const newInvoice = await InvoiceAPI.create(invoice);
      set((state) => ({
        invoices: [newInvoice, ...state.invoices],
        currentInvoice: newInvoice,
        loading: false,
      }));
      return newInvoice;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  updateInvoice: async (id: string, invoice: Partial<Invoice>) => {
    set({ loading: true, error: null });
    try {
      const updated = await InvoiceAPI.update(id, invoice);
      set((state) => ({
        invoices: state.invoices.map((inv) => (inv._id === id ? updated : inv)),
        currentInvoice: state.currentInvoice?._id === id ? updated : state.currentInvoice,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteInvoice: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await InvoiceAPI.delete(id);
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv._id !== id),
        currentInvoice: state.currentInvoice?._id === id ? null : state.currentInvoice,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),

  clearError: () => set({ error: null }),
}));
