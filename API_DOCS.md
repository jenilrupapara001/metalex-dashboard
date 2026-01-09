# Metalex SaaS - API Documentation

## Base URL
```
Production: https://api.metalex.com
Development: http://localhost:3000/api
```

## Authentication

All endpoints require JWT authentication in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Login Endpoint
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

## Invoices API

### List Invoices
```
GET /invoices?page=1&limit=20&status=PAID

Response:
{
  "data": [
    {
      "id": "inv_123",
      "invoiceNumber": "QT-2025-001",
      "clientName": "Client Name",
      "grandTotal": 50000,
      "status": "PAID",
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Get Invoice Details
```
GET /invoices/{id}

Response:
{
  "id": "inv_123",
  "invoiceNumber": "QT-2025-001",
  "date": "2025-01-01",
  "client": {
    "id": "client_1",
    "name": "Client Name",
    "email": "client@example.com",
    "address": "123 Main St"
  },
  "items": [
    {
      "id": "item_1",
      "position": 1,
      "description": "Aluminium Window",
      "quantity": 10,
      "width": 1000,
      "height": 1200,
      "pricePerSqft": 500,
      "total": 50000
    }
  ],
  "subtotal": 50000,
  "cgst": 4500,
  "sgst": 4500,
  "grandTotal": 59000,
  "status": "PAID"
}
```

### Create Invoice
```
POST /invoices
Content-Type: application/json

{
  "invoiceNumber": "QT-2025-001",
  "clientId": "client_1",
  "date": "2025-01-01",
  "items": [
    {
      "description": "Aluminium Window",
      "quantity": 10,
      "width": 1000,
      "height": 1200,
      "pricePerSqft": 500,
      "systemType": "Aluminium",
      "positionType": "WINDOW"
    }
  ],
  "cgstRate": 9,
  "sgstRate": 9,
  "termsAndConditions": ["Payment terms", "Delivery terms"]
}

Response: 201 Created
{
  "id": "inv_123",
  "invoiceNumber": "QT-2025-001",
  ...
}
```

### Update Invoice
```
PUT /invoices/{id}
Content-Type: application/json

{
  "status": "SENT",
  "items": [...],
  ...
}

Response: 200 OK
```

### Delete Invoice
```
DELETE /invoices/{id}

Response: 204 No Content
```

### Generate PDF
```
GET /invoices/{id}/pdf

Response: 
Content-Type: application/pdf
Content-Disposition: attachment; filename="QT-2025-001.pdf"

[PDF Binary Data]
```

### Send Invoice Email
```
POST /invoices/{id}/send
Content-Type: application/json

{
  "email": "client@example.com",
  "message": "Please find attached your quotation"
}

Response: 200 OK
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Clients API

### List Clients
```
GET /clients?page=1&limit=50

Response:
{
  "data": [
    {
      "id": "client_1",
      "name": "THE AAMBAG",
      "email": "hello@aambag.com",
      "phone": "9876543210",
      "gstin": "24AAAAA0000A1Z5"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 50
}
```

### Get Client Details
```
GET /clients/{id}

Response:
{
  "id": "client_1",
  "name": "THE AAMBAG",
  "email": "hello@aambag.com",
  "phone": "9876543210",
  "address": "Sasan, Gir National Park, Gujarat",
  "gstin": "24AAAAA0000A1Z5",
  "invoices": [
    { "id": "inv_1", "invoiceNumber": "QT-2025-001", "grandTotal": 50000 }
  ]
}
```

### Create Client
```
POST /clients
Content-Type: application/json

{
  "name": "NEW CLIENT",
  "email": "client@example.com",
  "phone": "9876543210",
  "address": "123 Main Street",
  "gstin": "24XXXXXX1234Z5"
}

Response: 201 Created
```

### Update Client
```
PUT /clients/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com",
  ...
}

Response: 200 OK
```

### Delete Client
```
DELETE /clients/{id}

Response: 204 No Content
```

## Company API

### Get Company Details
```
GET /company

Response:
{
  "id": "comp_1",
  "name": "Metalex Aluminium",
  "email": "metalex@example.com",
  "phone": "81609 01729",
  "address": "105,6 Golden Trade Center, Junagadh",
  "gstin": "24ABCDE1234F1Z5",
  "bankDetails": {
    "accountName": "METALEX ALUMINIUM",
    "accountNumber": "50200012345678",
    "ifsc": "HDFC0001234",
    "bankName": "HDFC BANK"
  }
}
```

### Update Company
```
PUT /company
Content-Type: application/json

{
  "name": "Updated Company Name",
  "phone": "new-phone-number",
  "bankDetails": {
    "accountName": "New Account Name",
    ...
  }
}

Response: 200 OK
```

## Users API (Admin Only)

### List Users
```
GET /users?page=1&limit=20

Response:
{
  "data": [
    {
      "id": "user_1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 20
}
```

### Create User
```
POST /users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "STAFF",
  "password": "securepassword123"
}

Response: 201 Created
```

### Update User
```
PUT /users/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "ADMIN"
}

Response: 200 OK
```

### Delete User
```
DELETE /users/{id}

Response: 204 No Content
```

## Reports API

### Summary Report
```
GET /reports/summary?startDate=2025-01-01&endDate=2025-01-31

Response:
{
  "totalInvoices": 45,
  "totalRevenue": 1250000,
  "averageInvoiceValue": 27777,
  "paidInvoices": 42,
  "pendingInvoices": 3,
  "activeClients": 15
}
```

### Revenue Report
```
GET /reports/revenue?startDate=2025-01-01&endDate=2025-01-31&groupBy=day

Response:
{
  "data": [
    { "date": "2025-01-01", "revenue": 50000 },
    { "date": "2025-01-02", "revenue": 75000 },
    ...
  ],
  "total": 1250000,
  "average": 40322
}
```

### Client Performance
```
GET /reports/clients?sortBy=revenue&order=desc

Response:
{
  "data": [
    {
      "clientId": "client_1",
      "clientName": "THE AAMBAG",
      "totalInvoices": 12,
      "totalRevenue": 500000,
      "lastInvoiceDate": "2025-01-30"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "details": "Missing required field: email"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Invoice not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Rate Limiting

- **Limit**: 1000 requests per hour per IP
- **Headers**: 
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 999`
  - `X-RateLimit-Reset: 1609459200`

## Webhooks (Enterprise Plan)

### Invoice Created
```
POST your-webhook-url
Content-Type: application/json

{
  "event": "invoice.created",
  "timestamp": "2025-01-01T10:00:00Z",
  "data": {
    "id": "inv_123",
    "invoiceNumber": "QT-2025-001",
    ...
  }
}
```

### Invoice Paid
```
POST your-webhook-url
Content-Type: application/json

{
  "event": "invoice.paid",
  "timestamp": "2025-01-01T10:00:00Z",
  "data": {
    "id": "inv_123",
    "amount": 59000,
    "paymentDate": "2025-01-01"
  }
}
```

## SDK/Client Libraries

### JavaScript/TypeScript
```typescript
import { APIClient } from '@metalex/sdk';

const client = new APIClient({
  apiKey: 'your-api-key',
  baseURL: 'https://api.metalex.com'
});

const invoices = await client.invoices.list();
const pdf = await client.invoices.generatePDF('inv_123');
```

### Python
```python
from metalex import Client

client = Client(api_key='your-api-key')
invoices = client.invoices.list()
pdf = client.invoices.generate_pdf('inv_123')
```

---

Last Updated: January 9, 2026
Version: 1.0.0
