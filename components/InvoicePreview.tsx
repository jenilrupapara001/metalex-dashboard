
import React, { useEffect, useRef } from 'react';
import { Invoice } from '../types';
import PositionPreview, { PositionPreviewHandle } from './PositionPreview';
import useGeneratedImages from './useGeneratedImages';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  // refs for each position preview
  const previewRefs = useRef<Array<React.RefObject<PositionPreviewHandle>>>([]);
  // ensure refs array length matches items
  while (previewRefs.current.length < invoice.items.length) {
    previewRefs.current.push(React.createRef<PositionPreviewHandle>());
  }

  const { images, loading, refresh } = useGeneratedImages(previewRefs.current as any);

  // refresh when invoice items change
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice.items.length]);

  return (
    <div className="bg-white p-0 m-0 w-full text-[11px] print:shadow-none print:border-none print:p-0 print:m-0" style={{ width: '210mm', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm 10mm;
          }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          .page-break {
            page-break-after: always;
            page-break-inside: avoid;
          }
          .no-break {
            page-break-inside: avoid;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        }
        
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div style={{ width: '100%', padding: '15mm 10mm', boxSizing: 'border-box' }}>
      
      {/* Header - Professional Title */}
      <div className="border-b-4 border-orange-600 pb-4 mb-6">
      
      {/* Header - Professional Title */}
      <div className="border-b-4 border-orange-600 pb-4 mb-6">
        <div className="flex justify-between items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">MX</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-orange-600 uppercase tracking-tight">Metalex Aluminium</h1>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Industrial Aluminum Systems</p>
              </div>
            </div>
            <div className="text-slate-600 font-bold space-y-0.5 text-[10px] ml-0">
              <p>📍 105,6 Golden Trade Center, Opp. Mahapooja, Junagadh-362002</p>
              <p>📞 +91 81609 01729 | 📧 metalexaluminium@gmail.com</p>
              <p>🌐 www.metalexaluminium.com | 📋 GSTIN: 24ABCDE1234F1Z5</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-4">
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg font-black uppercase text-[12px] tracking-wider shadow-lg">
              Quotation
            </div>
            <div className="text-[9px] text-slate-600 font-black">
              <p>Document ID: {invoice.invoiceNumber}</p>
              <p>Date: {new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-0 border-2 border-slate-900 mb-8 overflow-hidden rounded-md shadow-sm">
        <div className="border-r-2 border-slate-900 p-6 bg-slate-50/50">
          <p className="font-black mb-3 text-slate-400 uppercase text-[9px] tracking-widest">Billing Entity</p>
          <p className="text-xl font-black text-slate-900 leading-tight">{invoice.clientName}</p>
          <p className="text-slate-600 font-bold mt-2 leading-relaxed text-[11px]">{invoice.clientAddress}</p>
        </div>
        <div className="p-6 flex flex-col justify-center space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="font-black text-slate-400 uppercase text-[9px]">Quotation Reference</span>
            <span className="font-black text-slate-900 text-sm">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="font-black text-slate-400 uppercase text-[9px]">Submission Date</span>
            <span className="font-bold text-slate-900">{new Date(invoice.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-black text-slate-400 uppercase text-[9px]">Commercial Lead</span>
            <span className="font-bold text-slate-900">{invoice.preparedBy}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="space-y-10">
        {invoice.items.map((item, index) => (
          <div key={item.id} className="break-inside-avoid">
            <table className="w-full border-collapse border-2 border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-white text-center font-black uppercase text-[9px] tracking-widest">
                <tr>
                  <th className="p-3 border-r border-slate-700 w-16">Pos.</th>
                  <th className="p-3 border-r border-slate-700 w-24">Unit (Pcs)</th>
                  <th className="p-3 border-r border-slate-700">Structural & Technical Specifications</th>
                  <th className="p-3 border-r border-slate-700 w-28">Net Area (Sqft)</th>
                  <th className="p-3 border-r border-slate-700 w-28">Unit Rate</th>
                  <th className="p-3 w-32">Total Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center border-b-2 border-slate-900 bg-slate-50">
                  <td className="p-3 border-r-2 border-slate-900 font-black text-slate-900">{item.position}</td>
                  <td className="p-3 border-r-2 border-slate-900 font-black text-slate-900">{item.quantity}</td>
                  <td className="p-3 border-r-2 border-slate-900"></td>
                  <td className="p-3 border-r-2 border-slate-900 font-black text-slate-900">{item.areaSqft.toFixed(3)}</td>
                  <td className="p-3 border-r-2 border-slate-900 font-black text-slate-900">₹{item.pricePerSqft.toLocaleString()}</td>
                  <td className="p-3 font-black text-sm text-slate-900 bg-slate-100">₹{item.total.toLocaleString()}</td>
                </tr>
                <tr>
                  <td colSpan={6} className="p-8 bg-white">
                    <div className="flex gap-12 items-start">
                      <div className="flex-shrink-0">
                        {/* Visible PNG preview (extracted from canvas) */}
                        {images && images[index] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={images[index]}
                            alt={`Diagram ${item.position}`}
                            className="w-64 h-auto rounded-md border bg-white"
                          />
                        ) : (
                          // fallback: render PositionPreview visible while image is being generated
                          <PositionPreview
                            ref={previewRefs.current[index]}
                            width={item.width}
                            height={item.height}
                            type={item.technicalDetails.type}
                            className="w-64"
                          />
                        )}
                        {/* Hidden off-screen canvases for reliable PNG extraction */}
                        <div style={{ position: 'absolute', left: -9999, width: 0, height: 0, overflow: 'hidden' }} aria-hidden>
                          <PositionPreview
                            ref={previewRefs.current[index]}
                            width={item.width}
                            height={item.height}
                            type={item.technicalDetails.type}
                            hidePreview
                          />
                        </div>
                      </div>
                      <div className="flex-1 space-y-5">
                        <div className="bg-slate-900 text-white px-4 py-1.5 inline-block rounded-md text-[10px] font-black uppercase tracking-widest mb-2">Technical Summary</div>
                        <p className="font-black text-[15px] text-slate-800 leading-tight border-l-4 border-orange-500 pl-5 py-2 italic bg-slate-50 rounded-r-lg">
                          "{item.description}"
                        </p>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-[11px]">
                          <div>
                            <span className="font-black text-slate-400 uppercase text-[8px] block mb-1">Architecture System</span>
                            <p className="font-bold text-slate-900">{item.technicalDetails.system}</p>
                          </div>
                          <div>
                            <span className="font-black text-slate-400 uppercase text-[8px] block mb-1">Profile Finish</span>
                            <p className="font-bold text-slate-900">{item.technicalDetails.finish}</p>
                          </div>
                          <div>
                            <span className="font-black text-slate-400 uppercase text-[8px] block mb-1">Glazing Specs</span>
                            <p className="font-bold text-slate-900">{item.technicalDetails.glazing}</p>
                          </div>
                          <div>
                            <span className="font-black text-slate-400 uppercase text-[8px] block mb-1">Performance Hardware</span>
                            <p className="font-bold text-slate-900">{item.technicalDetails.hardware}</p>
                          </div>
                        </div>
                        {item.remarks && (
                          <div className="mt-4 p-3 bg-yellow-50 text-[10px] text-yellow-800 rounded-lg border-l-4 border-yellow-400 font-black flex items-center gap-2 shadow-sm">
                            <span className="bg-yellow-400 text-white px-1.5 py-0.5 rounded text-[8px]">NOTE</span>
                            {item.remarks}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-16 flex justify-between items-start gap-12 break-inside-avoid">
        <div className="flex-1 space-y-8">
          <div className="space-y-3">
            <h4 className="font-black text-slate-900 border-b-4 border-orange-600 inline-block mb-2 uppercase text-[10px] tracking-widest">Commercial Terms</h4>
            <ul className="space-y-2 list-disc list-inside text-slate-600 font-bold text-[11px] leading-relaxed">
              {invoice.termsAndConditions?.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>
          
          <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl shadow-inner">
             <h4 className="font-black text-slate-900 uppercase text-[10px] mb-3 tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
               Remittance Instructions
             </h4>
             <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-700">
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase">Bank Authority</p>
                 <p className="font-black text-slate-900">HDFC BANK - JUNAGADH</p>
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase">Beneficiary</p>
                 <p className="font-black text-slate-900">METALEX ALUMINIUM</p>
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase">Account Identifier</p>
                 <p className="font-black text-slate-900">50200012345678</p>
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase">Routing Code (IFSC)</p>
                 <p className="font-black text-slate-900">HDFC0001234</p>
               </div>
             </div>
          </div>
        </div>

        <div className="w-96 space-y-4 bg-slate-900 p-8 rounded-3xl shadow-2xl text-white">
          <div className="space-y-3 border-b border-white/10 pb-4">
            <div className="flex justify-between items-center text-white/60 font-black uppercase text-[9px] tracking-widest">
              <span>Gross Sub-Total</span>
              <span className="text-white text-xs">₹{invoice.subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between items-center text-white/60 font-black uppercase text-[9px] tracking-widest">
              <span>Logistics/Freight</span>
              <span className="text-white text-xs">₹{invoice.freight.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between items-center text-white/60 font-black uppercase text-[9px] tracking-widest">
              <span>CGST (9%)</span>
              <span className="text-white text-xs">₹{(invoice.subtotal * 0.09).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-white/60 font-black uppercase text-[9px] tracking-widest">
              <span>SGST (9%)</span>
              <span className="text-white text-xs">₹{(invoice.subtotal * 0.09).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between items-end mb-2">
              <span className="font-black text-orange-500 uppercase text-[11px] tracking-[0.2em]">Net Payable</span>
              <span className="text-3xl font-black text-white">₹{invoice.grandTotal.toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-white/40 font-black mt-4 uppercase text-right italic border-t border-white/5 pt-3">
              Total Value in Words: <span className="text-white/70">Two Lakh Forty Five Thousand Only</span>
            </p>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-20 flex justify-between items-end break-inside-avoid">
        <div className="text-[10px] text-slate-400 font-bold max-w-[300px]">
          <p>This is a computer-generated commercial offer and does not require a physical signature unless requested by the procurement department.</p>
        </div>
        <div className="text-center">
          <div className="w-64 h-20 flex items-center justify-center opacity-10">
            <span className="text-4xl font-black rotate-[-15deg]">METALEX</span>
          </div>
          <div className="w-64 border-b-2 border-slate-900 mb-3"></div>
          <p className="font-black text-slate-900 uppercase tracking-tight text-[11px]">For Metalex Aluminium</p>
          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">(Authorized Signatory)</p>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
