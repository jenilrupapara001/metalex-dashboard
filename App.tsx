
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import ClientsPage from './components/ClientsPage';
import InvoicesPage from './components/InvoicesPage';
import SettingsPage from './components/SettingsPage';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './components/LoginPage';
import UserManagementPage from './components/UserManagementPage';
import ReportsPage from './components/ReportsPage';
import HelpPage from './components/HelpPage';
import { ICONS } from './constants';
import { Invoice, Client, Company, DashboardStats } from './types';
import { PDFService } from './services/pdfService';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients' | 'settings' | 'invoiceForm' | 'preview' | 'reports' | 'users' | 'help'>('dashboard');
  const [printPending, setPrintPending] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const [clients, setClients] = useState<Client[]>([]);

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [company, setCompany] = useState<Company>({
    id: 'mx-hq',
    name: 'Metalex Aluminium',
    address: '105,6 Golden Trade Center, Opp. Mahapooja, Junagadh-362002',
    phone: '81609 01729',
    email: 'metalexaluminium@gmail.com',
    website: 'www.metalexaluminium.com',
    gstin: '24ABCDE1234F1Z5',
    bankDetails: {
      accountName: 'METALEX ALUMINIUM',
      accountNumber: '50200012345678',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC BANK'
    },
    subscriptionPlan: 'PRO'
  });

  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | undefined>();

  // PDF Download Trigger Logic - using jsPDF service
  const handleGeneratePDF = async (invoice: Invoice) => {
    try {
      setIsGeneratingPDF(true);
      const pdfBlob = await PDFService.generateInvoicePDF(invoice, company.name);
      const filename = `${invoice.invoiceNumber}_${invoice.clientName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      PDFService.downloadPDF(pdfBlob, filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    if (printPending && previewInvoice) {
      // Force preview tab to ensure the DOM is rendered for the print engine
      if (activeTab !== 'preview') {
        setActiveTab('preview');
        return; 
      }

      const originalTitle = document.title;
      // Set title to control the default PDF filename
      document.title = `${previewInvoice.invoiceNumber}_${previewInvoice.clientName.replace(/[^a-z0-9]/gi, '_')}`;

      const timer = setTimeout(() => {
        window.print();
        setPrintPending(false);
        document.title = originalTitle;
      }, 800); 

      return () => clearTimeout(timer);
    }
  }, [printPending, previewInvoice, activeTab]);

  const stats: DashboardStats = {
    totalInvoices: invoices.length,
    activeClients: clients.length,
    monthlyRevenue: invoices.reduce((acc, inv) => acc + (inv.status === 'Paid' ? inv.grandTotal : 0), 0),
    pendingDeliveries: invoices.filter(i => i.status === 'Sent').length,
  };

  const handleSaveInvoice = (inv: Invoice) => {
    const exists = invoices.find(i => i.id === inv.id);
    if (exists) {
      setInvoices(invoices.map(i => i.id === inv.id ? inv : i));
    } else {
      setInvoices([inv, ...invoices]);
    }
    setActiveTab('invoices');
  };

  const handleAddClient = (client: Client) => setClients([...clients, client]);
  const handleDeleteClient = (id: string) => setClients(clients.filter(c => c.id !== id));
  const handleDeleteInvoice = (id: string) => setInvoices(invoices.filter(i => i.id !== id));

  const triggerDownload = (inv: Invoice) => {
    setPreviewInvoice(inv);
    setPrintPending(true);
  };

  const handleLogin = (email: string, password: string) => {
    // TODO: Replace with actual API authentication
    console.log('Login attempt:', email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          userName="Admin User"
          userRole="SUPER_ADMIN"
        />

        <main className="flex-1 overflow-auto w-full">
          <div className="w-full">
            {activeTab === 'dashboard' && (
              <Dashboard 
                stats={stats} 
                onCreateNew={() => { setEditingInvoice(undefined); setActiveTab('invoiceForm'); }} 
                onViewInvoice={(invId) => {
                  const inv = invoices.find(i => i.id === invId);
                  if (inv) { setPreviewInvoice(inv); setActiveTab('preview'); }
                }}
              />
            )}
            
            {activeTab === 'invoices' && (
              <InvoicesPage 
                invoices={invoices} 
                onEdit={(inv) => { setPreviewInvoice(inv); setActiveTab('invoiceForm'); }}
                onPreview={(inv) => { setPreviewInvoice(inv); setActiveTab('preview'); }}
                onDelete={handleDeleteInvoice}
                onNew={() => { setEditingInvoice(undefined); setActiveTab('invoiceForm'); }}
              />
            )}

            {activeTab === 'invoiceForm' && (
              <InvoiceForm 
                clients={clients}
                initialInvoice={editingInvoice}
                onSave={handleSaveInvoice}
                onPreview={(inv) => { setPreviewInvoice(inv); setActiveTab('preview'); }}
                onCancel={() => setActiveTab('invoices')}
              />
            )}

            {activeTab === 'clients' && (
              <ClientsPage 
                clients={clients} 
                onAddClient={handleAddClient} 
                onDeleteClient={handleDeleteClient} 
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage 
                invoices={invoices}
                clients={clients}
              />
            )}

            {activeTab === 'users' && (
              <UserManagementPage />
            )}

            {activeTab === 'settings' && (
              <SettingsPage 
                company={company} 
                onUpdate={setCompany} 
              />
            )}

            {activeTab === 'help' && (
              <HelpPage />
            )}

            {activeTab === 'preview' && previewInvoice && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full px-8 py-6">
                <div className="flex justify-between items-center w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <button onClick={() => setActiveTab('invoices')} className="text-slate-500 font-black flex items-center gap-2 hover:text-slate-900 transition text-xs uppercase tracking-tight">← Back to List</button>
                  <div className="flex gap-4">
                    <button onClick={() => handleSaveInvoice(previewInvoice)} className="bg-slate-100 text-slate-800 px-6 py-2.5 rounded-xl font-black border border-slate-200 hover:bg-slate-200 transition text-sm">Save Record</button>
                    <button 
                      onClick={() => handleGeneratePDF(previewInvoice)} 
                      disabled={isGeneratingPDF}
                      className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition text-sm flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      {isGeneratingPDF ? 'Generating...' : 'Download PDF (Optimized)'}
                    </button>
                  </div>
                </div>
                <div id="invoice-preview" className="w-full">
                  <InvoicePreview invoice={previewInvoice} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
