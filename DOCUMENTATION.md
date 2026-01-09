# Metalex SaaS - Invoice & Production Management System

A modern, production-ready SaaS platform for invoice generation, client management, and production tracking specifically designed for the aluminium fabrication industry.

## 🚀 Features

### Core Features
- **Invoice Management**: Create, edit, and manage professional quotations/invoices
- **Advanced PDF Generation**: Generate high-quality PDFs with jsPDF and html2canvas
- **Client Management**: Maintain comprehensive client database with GSTIN tracking
- **Reports & Analytics**: Real-time dashboards with revenue tracking and performance metrics
- **Team Collaboration**: Multi-user support with role-based access control
- **Mobile Responsive**: Fully responsive design for desktop, tablet, and mobile

### Advanced Features
- **Email Integration**: Send invoices directly to clients
- **Position Tracking**: Detailed technical specifications for aluminium fabrication items
- **Tax Calculation**: Automatic GST/CGST/SGST/IGST calculations
- **Bank Details**: Integrated bank information management
- **Audit Logs**: Complete audit trail for compliance
- **User Management**: Admin controls for team member access and permissions

## 📋 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Recharts** - Charts & graphs
- **jsPDF + html2canvas** - PDF generation
- **Zustand** - State management

### Backend (Ready for Integration)
- **Node.js/Express** - Server framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication

## 🛠️ Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- PostgreSQL (for backend)

### Setup

1. **Clone and install dependencies**
```bash
npm install
```

2. **Create environment file**
```bash
cp .env.example .env
# Update with your API configuration
```

3. **Run development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📂 Project Structure

```
metalex-saas/
├── components/
│   ├── LoginPage.tsx              # Authentication
│   ├── Navbar.tsx                 # Navigation
│   ├── Dashboard.tsx              # Main dashboard
│   ├── InvoiceForm.tsx            # Invoice creation
│   ├── InvoicePreview.tsx         # Invoice preview
│   ├── InvoicesPage.tsx           # Invoices list
│   ├── ClientsPage.tsx            # Clients management
│   ├── SettingsPage.tsx           # Company settings
│   ├── UserManagementPage.tsx     # Team management
│   ├── ReportsPage.tsx            # Analytics & reports
│   ├── HelpPage.tsx               # Help & documentation
│   └── ErrorBoundary.tsx          # Error handling
├── services/
│   ├── api.ts                     # API client
│   ├── pdfService.ts              # PDF generation
│   └── geminiService.ts           # AI integration
├── prisma/
│   └── schema.prisma              # Database schema
├── App.tsx                        # Root component
├── types.ts                       # TypeScript types
├── config.ts                      # Configuration
└── index.css                      # Global styles
```

## 🔐 Authentication

### Login System
- Email/password authentication
- JWT-based session management
- Role-based access control (SUPER_ADMIN, ADMIN, STAFF)
- Secure token storage

### Roles & Permissions
| Role | Permissions |
|------|---|
| SUPER_ADMIN | Full access, user management |
| ADMIN | Invoice & client management |
| STAFF | View & create invoices |

## 📝 Invoice Features

### Invoice Creation
1. Select client from database
2. Add line items with technical details
3. Automatic calculations
4. Professional PDF generation

## 📊 Reports & Analytics

### Dashboard Metrics
- Total revenue
- Active clients
- Pending deliveries
- Invoice status breakdown

## 🏆 Production Ready

✅ Error boundary for crash prevention
✅ Authentication system
✅ Role-based access control
✅ Advanced PDF generation (jsPDF)
✅ Comprehensive type safety
✅ Professional UI/UX
✅ Responsive design
✅ Complete database schema
✅ API integration ready
✅ Audit logging

## 📦 Building for Production

```bash
npm run build
npm run preview
npm run type-check
```

## 🚀 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

## 🔒 Security

- AES-256 encryption ready
- JWT authentication
- HTTPS-only communication
- SQL injection prevention via Prisma
- XSS protection

## 📞 Support

For support, email support@metalex.com

---

**Made with ❤️ by Metalex Team**

Version: 1.0.0 | Production Ready | Last Updated: January 9, 2026
