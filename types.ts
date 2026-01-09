
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF'
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string;
  gstin?: string;
  bankDetails?: BankDetails;
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  gstin?: string;
}

export interface InvoiceItem {
  id: string;
  position: string;
  quantity: number;
  description: string;
  width: number;
  height: number;
  areaSqft: number;
  pricePerSqft: number;
  total: number;
  technicalDetails: {
    system: string;
    profiles: string;
    glazing: string;
    hardware: string;
    finish: string;
    type: 'Window' | 'Door' | 'Slider' | 'Fixed' | 'Ventilator';
  };
  remarks?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  preparedBy: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  freight: number;
  discount: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
  termsAndConditions: string[];
}

export interface DashboardStats {
  totalInvoices: number;
  activeClients: number;
  monthlyRevenue: number;
  pendingDeliveries: number;
}
