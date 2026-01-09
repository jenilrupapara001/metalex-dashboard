# Quick Start Guide - Metalex SaaS with MongoDB & PDF

## 🚀 Start in 5 Minutes

### Step 1: Install MongoDB (If Not Already Installed)

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Or use MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env.local`: `MONGODB_URI=mongodb+srv://...`

### Step 2: Configure Backend

```bash
# Navigate to project directory
cd /path/to/metalex-saas

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Create/update .env.local with:
MONGODB_URI=mongodb://localhost:27017/metalex-saas
PORT=5000
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start Services

**Terminal 1 - Start Backend Server:**
```bash
npm run server
```
Output should show:
```
✓ MongoDB connected successfully
✓ Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend (in new terminal):**
```bash
npm run dev
```
Output should show:
```
  VITE v6.4.1  ready in XXX ms
  ➜  Local:   http://localhost:3000/
```

### Step 4: Test the Flow

1. Open http://localhost:3000 in browser
2. Navigate to "Quotations" page
3. Click "Create New Quote"
4. Fill in invoice details
5. Click "Save" (data goes to MongoDB!)
6. Refresh page - data persists ✨
7. Click invoice and then "Download PDF" - generates A4-formatted PDF

---

## 📊 What's Working Now

### Database Persistence ✅
- All invoices saved to MongoDB
- Data survives page refresh
- Full search and filtering

### PDF Generation ✅
- Proper A4 formatting (210×297mm)
- 15mm top/bottom, 10mm side margins
- Smart page breaking (no content cutoff)
- 2x scale for crisp print quality
- PNG format for superior quality

### API Endpoints ✅
| Method | Endpoint | Action |
|--------|----------|--------|
| GET | `/api/invoices` | List all (paginated) |
| POST | `/api/invoices` | Create new |
| GET | `/api/invoices/:id` | Get by ID |
| PUT | `/api/invoices/:id` | Update |
| DELETE | `/api/invoices/:id` | Delete |
| PATCH | `/api/invoices/:id/status` | Change status |

---

## 🐛 Troubleshooting

### "MongoDB connection refused"
```bash
# Check if MongoDB is running
brew services list | grep mongodb
# If not running, start it:
brew services start mongodb-community
```

### "Cannot GET /api/invoices"
- Ensure backend server is running (`npm run server`)
- Check port 5000 is available
- Verify API_BASE in services/apiService.ts

### "Invoice preview element not found"
- Ensure <div id="invoice-preview"> exists in page
- Wait for page to load fully before clicking Download

### Data not persisting
- Check `.env.local` has MONGODB_URI set
- Verify MongoDB is actually connected (check server logs)
- Try restarting services

---

## 📁 Key Files Modified

```
✅ New Backend
  server/index.js                 - Express server
  server/models/Invoice.js        - MongoDB Invoice schema
  server/models/Client.js         - MongoDB Client schema
  server/routes/invoices.js       - Invoice API routes
  server/routes/clients.js        - Client API routes

✅ New Frontend Services
  services/apiService.ts          - API client
  stores/invoiceStore.ts          - Zustand state management

✅ Enhanced PDF
  services/pdfService.ts          - Improved pagination & A4 layout
  components/InvoicePreview.tsx   - A4-ready template

✅ Configuration
  .env.local                       - MongoDB URI
  vite.config.ts                  - API proxy
  package.json                     - npm scripts
  types.ts                         - Updated for MongoDB
```

---

## 🔑 Environment Variables

Create `.env.local`:
```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/metalex-saas

# Backend
PORT=5000

# Frontend
VITE_API_BASE_URL=http://localhost:5000/api
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 💾 Sample Invoice Creation

```typescript
const invoice: Invoice = {
  invoiceNumber: 'INV-2024-001',
  clientName: 'Acme Corporation',
  clientAddress: '123 Main St, City, State',
  date: new Date().toISOString(),
  preparedBy: 'John Doe',
  items: [
    {
      id: '1',
      position: 'POS-1',
      quantity: 5,
      description: 'Aluminum Window System',
      width: 1200,
      height: 800,
      areaSqft: 105.3,
      pricePerSqft: 500,
      total: 52650,
      technicalDetails: {
        system: 'Sliding Window',
        finish: 'Powder Coated',
        glazing: 'Double Glazing',
        hardware: 'Stainless Steel',
        type: 'Window'
      }
    }
  ],
  subtotal: 52650,
  freight: 1500,
  tax: 4737,
  grandTotal: 58887,
  status: 'draft',
  termsAndConditions: [
    'Payment due within 30 days',
    'Valid for 10 days',
    'Freight FOB'
  ]
};

// Save to MongoDB
await useInvoiceStore.getState().createInvoice(invoice);
```

---

## 🎯 Next Steps

1. **Data Migration**: Import existing invoices from JSON
2. **Authentication**: Add user login/auth
3. **Email**: Setup email notifications
4. **Deployment**: Deploy to production (Vercel + MongoDB Atlas)
5. **Analytics**: Add business dashboard

---

## 📞 Support

Check `BACKEND_SETUP.md` for detailed documentation
All API responses follow: `{ success: boolean, data?: any, error?: string }`
