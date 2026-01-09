
import React, { useState, useRef } from 'react';
import { Client } from '../types';
import { ICONS } from '../constants';

interface ClientsPageProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ clients, onAddClient, onDeleteClient }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState<Partial<Client>>({ name: '', address: '', phone: '', email: '', gstin: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name) {
      onAddClient({ ...newClient, id: `c-${Date.now()}` } as Client);
      setNewClient({ name: '', address: '', phone: '', email: '', gstin: '' });
      setIsAdding(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.gstin && c.gstin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Bulk importing client records from ${file.name}. This is a simulated operational flow.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 w-full px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Administrative Module</p>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Client Infrastructure</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleImportClick}
            className="bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition font-black text-sm shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Bulk Import
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`${isAdding ? 'bg-slate-800' : 'bg-blue-600'} text-white px-8 py-3 rounded-2xl flex items-center gap-2 hover:opacity-90 transition shadow-xl font-black text-sm active:scale-95`}
          >
            <ICONS.Plus className={`w-5 h-5 transition-transform ${isAdding ? 'rotate-45' : ''}`} /> 
            {isAdding ? 'Dismiss Editor' : 'Register New Client'}
          </button>
        </div>
      </div>

      {/* Registration Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-blue-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mb-8 border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">New Entity Registration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Client / Company Name</label>
              <input 
                required 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 shadow-sm" 
                placeholder="e.g. METALEX INDUSTRIES"
                value={newClient.name} 
                onChange={e => setNewClient({...newClient, name: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Number</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 shadow-sm" 
                placeholder="+91 00000 00000"
                value={newClient.phone} 
                onChange={e => setNewClient({...newClient, phone: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">GSTIN Number</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-slate-800 shadow-sm uppercase font-mono" 
                placeholder="24AAAAA0000A1Z5"
                value={newClient.gstin} 
                onChange={e => setNewClient({...newClient, gstin: e.target.value})} 
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Physical / Billing Address</label>
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 shadow-sm" 
                placeholder="Street name, Building, City, State..."
                value={newClient.address} 
                onChange={e => setNewClient({...newClient, address: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Email</label>
              <input 
                type="email" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-800 shadow-sm" 
                placeholder="contact@entity.com"
                value={newClient.email} 
                onChange={e => setNewClient({...newClient, email: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-slate-50 flex justify-end gap-6">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="px-6 py-4 font-black text-slate-400 hover:text-slate-600 transition text-sm uppercase tracking-widest"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all active:scale-95"
            >
              Save Entity Record
            </button>
          </div>
        </form>
      )}

      {/* Search and Database Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 w-full max-w-xl">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search by keyword (Name, Phone, Email, GST)..." 
               className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none focus:border-blue-400 transition-all shadow-inner"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
             />
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Database Context</p>
             <p className="text-sm font-black text-slate-800">{filteredClients.length} Records Visualized</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Entity Identity</th>
                <th className="px-10 py-6">Operational Contact</th>
                <th className="px-10 py-6">GSTIN Record</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <ICONS.Users className="w-16 h-16 mb-4" />
                      <p className="text-slate-500 font-black uppercase tracking-widest italic">No client records found.</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-base group-hover:text-blue-600 transition-colors">{client.name}</p>
                        <p className="text-xs text-slate-400 font-bold mt-1 line-clamp-1">{client.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-700">{client.phone}</p>
                      {client.email && <p className="text-[10px] text-blue-500 font-black uppercase tracking-tight">{client.email}</p>}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="bg-white border-2 border-slate-100 text-slate-600 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest group-hover:border-blue-100 group-hover:text-blue-700 transition-colors font-mono uppercase">
                      {client.gstin || 'UNREGISTERED'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-3 bg-white rounded-2xl border-2 border-slate-50 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition shadow-sm">
                          <ICONS.Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => { if(confirm(`Archive ${client.name}?`)) onDeleteClient(client.id); }} className="p-3 bg-white rounded-2xl border-2 border-slate-50 text-slate-400 hover:text-red-500 hover:border-red-100 transition shadow-sm">
                          <ICONS.Trash className="w-5 h-5" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
