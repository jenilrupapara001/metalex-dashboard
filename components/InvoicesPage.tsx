
import React from 'react';
import { Invoice } from '../types';
import { ICONS } from '../constants';

interface InvoicesPageProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onPreview: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const InvoicesPage: React.FC<InvoicesPageProps> = ({ invoices, onEdit, onPreview, onDelete, onNew }) => {
  return (
    <div className="space-y-6 w-full px-8 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quotation Repository</h1>
          <p className="text-slate-500 text-sm font-medium">History and status of all industrial window/door quotations</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-black shadow-xl shadow-blue-500/30 active:scale-95"
        >
          <ICONS.Plus className="w-5 h-5" /> Create New Quote
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-6">Identity</th>
              <th className="px-8 py-6">Client Entity</th>
              <th className="px-8 py-6">Commercial Value</th>
              <th className="px-8 py-6">Lifecycle Status</th>
              <th className="px-8 py-6 text-right">Operational Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 && (
              <tr><td colSpan={5} className="p-20 text-center">
                <div className="flex flex-col items-center opacity-40">
                  <ICONS.Invoice className="w-12 h-12 mb-4" />
                  <p className="text-slate-500 font-bold italic">No quotations indexed in the current tenant.</p>
                </div>
              </td></tr>
            )}
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <p className="font-black text-slate-900 text-sm tracking-tight">{inv.invoiceNumber}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{new Date(inv.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-700 text-sm">{inv.clientName}</p>
                </td>
                <td className="px-8 py-5">
                  <p className="font-black text-slate-900 text-sm">₹{inv.grandTotal.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{inv.items.length} units specified</p>
                </td>
                <td className="px-8 py-5">
                   <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                     inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                     inv.status === 'Draft' ? 'bg-slate-50 text-slate-600 border-slate-100' :
                     inv.status === 'Sent' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-700 border-red-100'
                   }`}>
                     {inv.status}
                   </span>
                </td>
                <td className="px-8 py-5 text-right">
                   <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => onPreview(inv)} 
                        className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm" 
                        title="View Detailed Quote"
                      >
                        <ICONS.Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(inv)} 
                        className="p-2.5 bg-white rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 transition shadow-sm" 
                        title="Edit Structure"
                      >
                        <ICONS.Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Permanently delete this record?')) onDelete(inv.id); }} 
                        className="p-2.5 bg-white rounded-xl border border-slate-200 text-red-500 hover:bg-red-50 transition shadow-sm" 
                        title="Archive/Delete"
                      >
                        <ICONS.Trash className="w-4 h-4" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesPage;
