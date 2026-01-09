import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Invoice, InvoiceItem } from '../types';

/**
 * Production-grade PDF service with proper A4 pagination, margins, and formatting
 */
export class PDFService {
  // A4 dimensions in mm
  private static readonly A4_WIDTH = 210;
  private static readonly A4_HEIGHT = 297;
  private static readonly MARGIN_TOP = 15;
  private static readonly MARGIN_BOTTOM = 15;
  private static readonly MARGIN_LEFT = 10;
  private static readonly MARGIN_RIGHT = 10;

  static async generateInvoicePDF(invoice: Invoice, companyName: string): Promise<Blob> {
    const element = document.getElementById('invoice-preview');
    if (!element) {
      throw new Error('Invoice preview element not found');
    }

    try {
      // Capture with high scale for crisp output on print
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        windowWidth: 1024,
        windowHeight: 1400,
        imageTimeout: 0,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        precision: 10,
      });

      const contentWidth = this.A4_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT;
      const contentHeight = this.A4_HEIGHT - this.MARGIN_TOP - this.MARGIN_BOTTOM;
      
      // Calculate image dimensions to fit content area
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      let yPosition = this.MARGIN_TOP;
      let remainingHeight = imgHeight;
      let isFirstPage = true;

      while (remainingHeight > 0) {
        if (!isFirstPage) {
          pdf.addPage();
          yPosition = this.MARGIN_TOP;
        }

        // How much of the image can fit on this page
        const fitHeight = Math.min(remainingHeight, contentHeight);
        
        // Source coordinates (which part of the image to crop)
        const sourceY = imgHeight - remainingHeight;
        const sourceHeight = (fitHeight * canvas.width) / contentWidth;
        
        // Create a cropped canvas for this page
        const pageCanvas = document.createElement('canvas');
        const ctx = pageCanvas.getContext('2d');
        if (!ctx) throw new Error('Failed to get canvas context');

        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;
        ctx.drawImage(
          canvas,
          0,
          sourceY * (canvas.height / imgHeight),
          canvas.width,
          sourceHeight,
          0,
          0,
          canvas.width,
          sourceHeight
        );

        const pageImgData = pageCanvas.toDataURL('image/png');
        pdf.addImage(
          pageImgData,
          'PNG',
          this.MARGIN_LEFT,
          yPosition,
          contentWidth,
          fitHeight
        );

        remainingHeight -= fitHeight;
        isFirstPage = false;
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
