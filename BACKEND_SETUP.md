# Metalex SaaS - MongoDB Data Persistence & PDF Generation

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas connection)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure MongoDB:**
   - Edit `.env.local` with your MongoDB URI:
     ```
     MONGODB_URI=mongodb://localhost:27017/metalex-saas
     # OR for MongoDB Atlas:
     # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metalex-saas
     ```

3. **Start the server:**
   ```bash
   npm run server
   ```
   Server will start on `http://localhost:5000`

4. **In another terminal, start the frontend:**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:3000`

### Combined Development
To run both server and frontend simultaneously:
```bash
npm run dev:all
```
(Requires `concurrently` package)

---

## Backend Architecture

### API Endpoints

#### Invoices
- `GET /api/invoices` - List all invoices (paginated)
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice by MongoDB ID
- `GET /api/invoices/number/:invoiceNumber` - Get invoice by invoice number
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/status` - Update invoice status
- `GET /api/invoices/search/query?q=term` - Search invoices

#### Clients
- `GET /api/clients` - List all clients (paginated)
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Data Models

#### Invoice Schema
```javascript
{
  invoiceNumber: String (unique, indexed),
  clientName: String,
  clientAddress: String,
  date: Date,
  preparedBy: String,
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected',
  items: [{
    id: String,
    position: Number,
    quantity: Number,
    description: String,
    width: Number,
    height: Number,
    areaSqft: Number,
    pricePerSqft: Number,
    total: Number,
    technicalDetails: Object,
    remarks: String
  }],
  subtotal: Number,
  freight: Number,
  tax: Number,
  grandTotal: Number,
  termsAndConditions: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Client Schema
```javascript
{
  name: String,
  email: String (unique, indexed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  gstin: String,
  pan: String,
  invoices: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Integration

### Zustand Store (`stores/invoiceStore.ts`)
State management for invoices with automatic database persistence:
- `fetchInvoices()` - Load invoices from database
- `createInvoice()` - Create new invoice in database
- `updateInvoice()` - Update existing invoice
- `deleteInvoice()` - Delete invoice
- `setCurrentInvoice()` - Set active invoice for preview/editing

### API Service (`services/apiService.ts`)
HTTP client for communication with backend:
- `InvoiceAPI.create()`, `getAll()`, `getById()`, `update()`, `delete()`, etc.
- `ClientAPI.create()`, `getAll()`, `getById()`, `update()`, `delete()`

### Usage Example
```typescript
import { useInvoiceStore } from '@/stores/invoiceStore';

function MyComponent() {
  const { invoices, loading, fetchInvoices } = useInvoiceStore();
  
  useEffect(() => {
    fetchInvoices(1, 10, { status: 'draft' });
  }, []);
  
  return (
    <div>
      {loading ? 'Loading...' : invoices.map(inv => <InvoiceRow key={inv._id} invoice={inv} />)}
    </div>
  );
}
```

---

## PDF Generation Features

### Improvements Implemented
1. **Proper A4 Formatting:**
   - Page margins: 15mm top/bottom, 10mm left/right
   - Content area: 210mm × 297mm (A4 size)
   - Pagination with smart page breaking

2. **High-Quality Output:**
   - Scale: 2x (double resolution for crisp printing)
   - Format: PNG (preserves quality better than JPEG)
   - No image cropping or bleeding between pages

3. **Production-Ready CSS:**
   - Print media queries for exact formatting
   - Color accuracy preservation
   - Page break handling for multi-page documents

### Usage
```typescript
import { PDFService } from '@/services/pdfService';

const blob = await PDFService.generateInvoicePDF(invoice, 'Company Name');
PDFService.downloadPDF(blob, `${invoice.invoiceNumber}.pdf`);
```

---

## Data Persistence Features

### Automatic Database Storage
- All invoices saved to MongoDB automatically
- No data loss on page refresh
- Full CRUD operations supported
- Search and filtering capabilities

### Migration from Mock Data
1. The frontend still supports mock data for development
2. To use real database:
   - Ensure MongoDB is running
   - Server must be started (`npm run server`)
   - API calls will automatically persist to database

### Example: Creating an Invoice with Database Persistence
```typescript
const invoice: Invoice = {
  invoiceNumber: 'INV-2024-001',
  clientName: 'Acme Corp',
  clientAddress: '123 Main St',
  // ... other fields
};

const savedInvoice = await useInvoiceStore.getState().createInvoice(invoice);
// savedInvoice._id will contain MongoDB ObjectId
```

---

## Troubleshooting

### Connection Issues
```
Error: MongoDB connection failed
→ Check MONGODB_URI in .env.local
→ Ensure MongoDB is running (local or Atlas)
→ Check network connectivity
```

### API Not Found
```
Error: Cannot POST /api/invoices
→ Ensure server is running on port 5000
→ Check Vite proxy configuration
→ Verify API_BASE in services/apiService.ts
```

### PDF Generation Issues
```
"Invoice preview element not found"
→ Ensure <div id="invoice-preview"> exists in InvoicePage
→ Wait for images to load before PDF generation
```

---

## Environment Variables

```env
# Frontend
VITE_API_BASE_URL=http://localhost:5000/api

# Backend
MONGODB_URI=mongodb://localhost:27017/metalex-saas
PORT=5000
```

---

## File Structure
```
project/
├── server/
│   ├── index.js              # Express server entry point
│   ├── models/
│   │   ├── Invoice.js        # Invoice MongoDB schema
│   │   └── Client.js         # Client MongoDB schema
│   └── routes/
│       ├── invoices.js       # Invoice API endpoints
│       └── clients.js        # Client API endpoints
├── services/
│   ├── apiService.ts         # Frontend API client
│   └── pdfService.ts         # PDF generation service
├── stores/
│   └── invoiceStore.ts       # Zustand state management
└── components/
    ├── InvoicePage.tsx       # Invoice preview + PDF download
    ├── InvoicePreview.tsx    # A4-ready invoice layout
    └── InvoicesPage.tsx      # Invoice list
```

---

## Performance Tips

1. **Pagination:** Use `limit=10` to fetch invoices in batches
2. **Indexing:** Database has indexes on `invoiceNumber` and `clientName`
3. **Search:** Use `/api/invoices/search/query` for full-text search
4. **Caching:** Frontend stores queries in Zustand - no double fetches

---

## Security Notes

⚠️ This is a development setup. For production:
- Add authentication/JWT middleware
- Validate input with schemas
- Use environment variables for secrets
- Enable CORS properly
- Add rate limiting
- Use HTTPS for MongoDB Atlas
