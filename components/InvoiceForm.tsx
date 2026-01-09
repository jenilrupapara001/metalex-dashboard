
import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, Client } from '../types';
import { 
  SYSTEMS, 
  GLAZING_OPTIONS, 
  PROFILES, 
  FINISHES, 
  HARDWARE_KITS, 
  DEFAULT_TERMS, 
  ICONS 
} from '../constants';
import { geminiService } from '../services/geminiService';

interface InvoiceFormProps {
  clients: Client[];
  initialInvoice?: Partial<Invoice>;
  onSave: (invoice: Invoice) => void;
  onPreview: (invoice: Invoice) => void;
  onCancel: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ clients, initialInvoice, onSave, onPreview, onCancel }) => {
  const [items, setItems] = useState<Partial<InvoiceItem>[]>(initialInvoice?.items || []);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  
  const [meta, setMeta] = useState({
    id: initialInvoice?.id || Math.random().toString(36).substr(2, 9),
    invoiceNumber: initialInvoice?.invoiceNumber || `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: initialInvoice?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    preparedBy: initialInvoice?.preparedBy || 'Admin User',
    clientId: initialInvoice?.clientId || '',
    freight: initialInvoice?.freight || 0,
    discount: initialInvoice?.discount || 0,
    cgstRate: initialInvoice?.cgstRate || 9,
    sgstRate: initialInvoice?.sgstRate || 9,
    status: initialInvoice?.status || 'Draft',
  });

  const selectedClient = clients.find(c => c.id === meta.clientId);

  const calculateInvoice = () => {
    const subtotal = items.reduce((acc, i) => acc + (i.total || 0), 0);
    const totalAfterDiscount = subtotal - meta.discount;
    const cgst = (totalAfterDiscount * meta.cgstRate) / 100;
    const sgst = (totalAfterDiscount * meta.sgstRate) / 100;
    const grandTotal = totalAfterDiscount + cgst + sgst + meta.freight;

    return { subtotal, grandTotal };
  };

  const addItem = () => {
    const newItem: Partial<InvoiceItem> = {
      id: Math.random().toString(36).substr(2, 9),
      position: `00${items.length + 1} ROOM`,
      quantity: 1,
      width: 1200,
      height: 1500,
      areaSqft: 19.375,
      pricePerSqft: 450,
      total: 8718.75,
      description: 'Standard Window Unit',
      technicalDetails: {
        system: SYSTEMS[0],
        profiles: PROFILES[0],
        glazing: GLAZING_OPTIONS[0],
        hardware: HARDWARE_KITS[0],
        finish: FINISHES[0],
        type: 'Window'
      }
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, updates: any) => {
    const newItems = [...items];
    const current = { ...newItems[index], ...updates };

    if (updates.technicalDetails) {
      current.technicalDetails = { ...newItems[index].technicalDetails, ...updates.technicalDetails };
    }

    const w = current.width || 0;
    const h = current.height || 0;
    const area = (w * h) / 92903.04;
    current.areaSqft = area;
    current.total = area * (current.pricePerSqft || 0) * (current.quantity || 1);

    newItems[index] = current;
    setItems(newItems);
  };

  const removeItem = (id: string) => setItems(items.filter(item => item.id !== id));

  const generateAIDescription = async (index: number) => {
    const item = items[index];
    if (!item) return;

    setLoadingAI(item.id || '');
    const desc = await geminiService.generateTechnicalDescription({
      system: item.technicalDetails?.system || '',
      width: item.width || 0,
      height: item.height || 0,
      type: item.technicalDetails?.type || 'Window',
      glazing: item.technicalDetails?.glazing || ''
    });

    updateItem(index, { description: desc });
    setLoadingAI(null);
  };

  const insertFormat = (idx: number, type: string) => {
    const item = items[idx];
    if (!item || !item.description) return;
    
    let newDesc = item.description;
    if (type === 'bold') newDesc = `**${newDesc}**`;
    if (type === 'list') newDesc = `• ${newDesc}`;
    
    updateItem(idx, { description: newDesc });
  };

  const { subtotal, grandTotal } = calculateInvoice();

  const handleAction = (type: 'save' | 'preview') => {
    const finalInvoice: Invoice = {
      ...meta,
      clientId: meta.clientId,
      clientName: selectedClient?.name || 'Unknown Client',
      clientAddress: selectedClient?.address || '',
      items: items as InvoiceItem[],
      subtotal,
      grandTotal,
      igstRate: 0,
      termsAndConditions: DEFAULT_TERMS,
      status: meta.status as any,
    };
    if (type === 'save') onSave(finalInvoice);
    else onPreview(finalInvoice);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full px-8 py-6 pb-10">
      <div className="lg:w-80 space-y-6 flex-shrink-0 no-print">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ICONS.Dashboard className="text-blue-600" />
            Basic Info
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Select Client</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={meta.clientId}
                onChange={e => setMeta({...meta, clientId: e.target.value})}
              >
                <option value="">-- Choose Client --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {selectedClient && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-[11px]">
                <p className="font-bold text-blue-800">{selectedClient.name}</p>
                <p className="text-blue-600 line-clamp-2">{selectedClient.address}</p>
                <p className="text-blue-600">GST: {selectedClient.gstin || 'N/A'}</p>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Quotation #</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none" 
                value={meta.invoiceNumber}
                onChange={e => setMeta({...meta, invoiceNumber: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm outline-none"
                value={meta.status}
                onChange={e => setMeta({...meta, status: e.target.value as any})}
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white space-y-4">
           <h3 className="font-bold flex items-center gap-2"><ICONS.Invoice className="text-blue-400" /> Totals</h3>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase">Freight</label>
               <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm" value={meta.freight} onChange={e => setMeta({...meta, freight: parseFloat(e.target.value) || 0})} />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase">Discount</label>
               <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm" value={meta.discount} onChange={e => setMeta({...meta, discount: parseFloat(e.target.value) || 0})} />
             </div>
             <div className="pt-4 border-t border-slate-800 mt-4 flex justify-between items-center">
               <span className="font-bold">Grand Total</span>
               <span className="font-bold text-xl text-blue-400">₹{grandTotal.toLocaleString()}</span>
             </div>
           </div>
           <div className="grid grid-cols-2 gap-2">
             <button onClick={() => handleAction('preview')} className="py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition text-sm">Preview</button>
             <button onClick={() => handleAction('save')} className="py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition shadow-lg text-sm">Save</button>
           </div>
           <button onClick={onCancel} className="w-full py-2 text-slate-500 hover:text-white transition text-xs font-medium uppercase">Cancel Editing</button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-lg"><ICONS.Plus className="text-blue-600" /></span>
              Quotation Items
            </h2>
            <button onClick={addItem} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-700 transition">
              <ICONS.Plus className="w-4 h-4" /> Add Position
            </button>
          </div>

          <div className="space-y-8">
            {items.map((item, idx) => (
              <div key={item.id} className="group relative border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all shadow-sm">
                <button onClick={() => removeItem(item.id!)} className="absolute -top-3 -right-3 p-2 bg-white border border-red-100 text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                  <ICONS.Trash />
                </button>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                  <div className="col-span-1"><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Pos</label><input className="w-full border-b border-slate-200 focus:border-blue-500 outline-none bg-transparent py-1 font-semibold" value={item.position} onChange={e => updateItem(idx, { position: e.target.value })} /></div>
                  <div className="col-span-1"><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">W (mm)</label><input type="number" className="w-full border-b border-slate-200 focus:border-blue-500 outline-none bg-transparent py-1 font-semibold" value={item.width} onChange={e => updateItem(idx, { width: parseInt(e.target.value) || 0 })} /></div>
                  <div className="col-span-1"><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">H (mm)</label><input type="number" className="w-full border-b border-slate-200 focus:border-blue-500 outline-none bg-transparent py-1 font-semibold" value={item.height} onChange={e => updateItem(idx, { height: parseInt(e.target.value) || 0 })} /></div>
                  <div className="col-span-1"><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Qty</label><input type="number" className="w-full border-b border-slate-200 focus:border-blue-500 outline-none bg-transparent py-1 font-semibold" value={item.quantity} onChange={e => updateItem(idx, { quantity: parseInt(e.target.value) || 0 })} /></div>
                  <div className="col-span-1"><label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Rate</label><input type="number" className="w-full border-b border-slate-200 focus:border-blue-500 outline-none bg-transparent py-1 font-semibold" value={item.pricePerSqft} onChange={e => updateItem(idx, { pricePerSqft: parseFloat(e.target.value) || 0 })} /></div>
                  <div className="col-span-1 text-right font-bold text-slate-800">₹{item.total?.toLocaleString()}</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">System</label><select className="w-full bg-slate-50 p-2 rounded-lg text-sm border-none" value={item.technicalDetails?.system} onChange={e => updateItem(idx, { technicalDetails: { system: e.target.value } })}>{SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Glazing</label><select className="w-full bg-slate-50 p-2 rounded-lg text-sm border-none" value={item.technicalDetails?.glazing} onChange={e => updateItem(idx, { technicalDetails: { glazing: e.target.value } })}>{GLAZING_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Finish</label><select className="w-full bg-slate-50 p-2 rounded-lg text-sm border-none" value={item.technicalDetails?.finish} onChange={e => updateItem(idx, { technicalDetails: { finish: e.target.value } })}>{FINISHES.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase">Hardware</label><select className="w-full bg-slate-50 p-2 rounded-lg text-sm border-none" value={item.technicalDetails?.hardware} onChange={e => updateItem(idx, { technicalDetails: { hardware: e.target.value } })}>{HARDWARE_KITS.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                         <label className="text-[10px] font-bold text-slate-400 uppercase">Technical Description</label>
                         <div className="flex gap-2">
                           <button onClick={() => insertFormat(idx, 'bold')} className="p-1 hover:bg-slate-100 rounded text-[9px] font-black border border-slate-200">B</button>
                           <button onClick={() => insertFormat(idx, 'list')} className="p-1 hover:bg-slate-100 rounded text-[9px] font-black border border-slate-200">• List</button>
                           <button onClick={() => generateAIDescription(idx)} disabled={loadingAI === item.id} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-bold hover:bg-purple-200 flex items-center gap-1 transition-colors disabled:opacity-50">
                             <ICONS.Wand className="w-3 h-3" /> {loadingAI === item.id ? '...' : 'AI'}
                           </button>
                         </div>
                       </div>
                       <textarea rows={4} className="w-full bg-slate-50 p-4 rounded-lg text-xs border border-transparent focus:border-blue-200 outline-none leading-relaxed font-mono" value={item.description} onChange={e => updateItem(idx, { description: e.target.value })} placeholder="Opening details..." />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
