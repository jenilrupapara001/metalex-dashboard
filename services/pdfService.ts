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
      // Production-grade: scale 2 for crisp output, PNG for superior quality in PDFs
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        windowWidth: 1024,
        windowHeight: 1400,
      });

      // Use PNG for best print quality
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 10; // 5mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
      heightLeft -= pageHeight - 10; // account for margins

      // Additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 5, position + 5, imgWidth, imgHeight);
        heightLeft -= pageHeight - 10;
      }

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
