// Environment configuration for Metalex SaaS
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Authentication
  AUTH_TOKEN_KEY: 'metalex_auth_token',
  AUTH_USER_KEY: 'metalex_user',
  
  // Features
  FEATURES: {
    ENABLE_PDF_EXPORT: true,
    ENABLE_EMAIL_SEND: true,
    ENABLE_ADVANCED_REPORTS: true,
    ENABLE_API_ACCESS: false, // Enabled only for ENTERPRISE
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
  
  // File Upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'image/png', 'image/jpeg'],
  },
  
  // Subscription Plans
  SUBSCRIPTION_PLANS: {
    BASIC: {
      name: 'Basic',
      price: 499,
      invoicesPerMonth: 50,
      users: 1,
      storage: '1GB',
    },
    PRO: {
      name: 'Professional',
      price: 1499,
      invoicesPerMonth: -1, // Unlimited
      users: 5,
      storage: '50GB',
      features: ['Advanced Reports', 'Email Integration', 'API Access'],
    },
    ENTERPRISE: {
      name: 'Enterprise',
      price: 'Custom',
      invoicesPerMonth: -1,
      users: -1,
      storage: 'Unlimited',
      features: ['Everything in Pro', 'Custom Integration', 'Dedicated Support'],
    },
  },
  
  // Tax Rates (GST for India)
  TAX_RATES: {
    CGST: 9,
    SGST: 9,
    IGST: 18,
  },
  
  // Currency
  CURRENCY: {
    code: 'INR',
    symbol: '₹',
  },
} as const;

export type Config = typeof config;
