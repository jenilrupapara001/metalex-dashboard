import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, InvoiceItem } from '../types';

export class PDFService {
  static async generateInvoicePDF(invoice: Invoice, companyName: string): Promise<Blob> {
    const element = document.getElementById('invoice-preview');
    if (!element) {
      throw new Error('Invoice preview element not found');
    }

    try {
      // Use scale 1 and JPEG compression for smaller file size
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      });

      // Convert to JPEG with compression instead of PNG for smaller size
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `${invoice.invoiceNumber}_${invoice.clientName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      return pdf.output('blob');
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  static downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async sendPDFEmail(
    invoice: Invoice,
    pdfBlob: Blob,
    recipientEmail: string
  ): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('invoice', new File([pdfBlob], `${invoice.invoiceNumber}.pdf`));
      formData.append('recipient', recipientEmail);
      formData.append('invoiceNumber', invoice.invoiceNumber);
      formData.append('clientName', invoice.clientName);

      const response = await fetch('/api/emails/send', {
        method: 'POST',
        body: formData,
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  static generateInvoiceReport(invoices: Invoice[]): {
    totalRevenue: number;
    avgInvoiceValue: number;
    totalInvoices: number;
    byStatus: Record<string, number>;
  } {
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const avgInvoiceValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    const byStatus = invoices.reduce(
      (acc, inv) => ({
        ...acc,
        [inv.status]: (acc[inv.status as keyof typeof acc] || 0) + 1,
      }),
      {} as Record<string, number>
    );

    return {
      totalRevenue,
      avgInvoiceValue,
      totalInvoices: invoices.length,
      byStatus,
    };
  }
}
