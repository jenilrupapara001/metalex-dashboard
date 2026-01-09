import React, { useState } from 'react';
import { Invoice } from '../types';
import InvoicePreview from './InvoicePreview';
import { PDFService } from '../services/pdfService';

interface InvoicePageProps {
  invoice: Invoice;
  onBack?: () => void;
}

/**
 * InvoicePage: Complete end-to-end invoice preview + PDF download flow
 * 
 * Features:
 * - Displays professional A4 invoice preview
 * - Generates production-grade PDF with embedded diagrams (scale:2, PNG quality)
 * - Handles PDF download with proper naming
 * - Shows loading states and error handling
 */
const InvoicePage: React.FC<InvoicePageProps> = ({ invoice, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate PDF from the invoice preview element
      const pdfBlob = await PDFService.generateInvoicePDF(invoice, 'Your Company Name');

      // Create filename with invoice number and client name
      const filename = `${invoice.invoiceNumber}_${invoice.clientName.replace(/[^a-z0-9]/gi, '_')}.pdf`;

      // Trigger download
      PDFService.downloadPDF(pdfBlob, filename);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate PDF';
      setError(message);
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with controls */}
      <div className="flex items-center justify-between bg-white shadow-md px-8 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900">
            Invoice {invoice.invoiceNumber}
          </h1>
          <span className="text-sm text-gray-500">
            {invoice.clientName}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {error && (
            <div className="px-4 py-2 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              isGenerating
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              '📥 Download PDF'
            )}
          </button>
        </div>
      </div>

      {/* Invoice preview area - scrollable */}
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <div className="mx-auto" style={{ maxWidth: '210mm' }}>
          {/* This is the element that html2canvas will capture for PDF generation */}
          <div id="invoice-preview" className="print:m-0 print:p-0">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>

      {/* Footer with info */}
      <div className="bg-white border-t border-gray-200 px-8 py-4 text-center text-sm text-gray-600">
        <p>
          Invoice created on {new Date(invoice.date).toLocaleDateString()} •
          {' '}PDF generation uses production-grade scaling (2x) for print quality
        </p>
      </div>
    </div>
  );
};

export default InvoicePage;
