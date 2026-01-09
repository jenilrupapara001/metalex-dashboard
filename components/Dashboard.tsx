
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  stats: DashboardStats;
  onCreateNew: () => void;
  onViewInvoice: (id: string) => void;
}

const mockChartData = [
  { name: 'Jan', revenue: 420000 },
  { name: 'Feb', revenue: 380000 },
  { name: 'Mar', revenue: 560000 },
  { name: 'Apr', revenue: 490000 },
  { name: 'May', revenue: 610000 },
  { name: 'Jun', revenue: 850000 },
];

const Dashboard: React.FC<DashboardProps> = ({ stats, onCreateNew, onViewInvoice }) => {
  return (
    <div className="space-y-8 w-full px-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Overview</p>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Production Analytics</h1>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-500/30 font-black text-sm active:scale-95"
        >
          <ICONS.Plus className="w-5 h-5" />
          Create New Quotation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Quotes', value: stats.totalInvoices, icon: ICONS.Invoice, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Current Revenue', value: `₹${stats.monthlyRevenue.toLocaleString()}`, icon: ICONS.Dashboard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Clients', value: stats.activeClients, icon: ICONS.Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'In Production', value: stats.pendingDeliveries, icon: ICONS.Dashboard, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Growth & Performance
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 900, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 900, fill: '#94a3b8'}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[10, 10, 10, 10]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Recent Flow
            </h2>
            <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</button>
          </div>
          <div className="space-y-5">
            {[
              { id: 'i1', num: '8821', client: 'THE AAMBAG', location: 'SASAN', val: '2,45,000', status: 'Paid' },
              { id: 'i2', num: '8822', client: 'RELIANCE IND.', location: 'JAMNAGAR', val: '5,12,000', status: 'Draft' },
              { id: 'i3', num: '8823', client: 'THE AAMBAG', location: 'JUNAGADH', val: '89,400', status: 'Sent' },
              { id: 'i4', num: '8824', client: 'PRIVATE VILLA', location: 'VERAVAL', val: '1,20,000', status: 'Paid' },
            ].map((i, idx) => (
              <button 
                key={idx} 
                onClick={() => onViewInvoice(i.id)}
                className="w-full text-left group flex justify-between items-center p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 active:scale-95"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-black text-[10px] group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600 transition-all">#{i.num}</div>
                  <div>
                    <p className="font-black text-slate-800 text-sm tracking-tight">{i.client}</p>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">{i.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-sm">₹{i.val}</p>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                    i.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                    i.status === 'Sent' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>{i.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
