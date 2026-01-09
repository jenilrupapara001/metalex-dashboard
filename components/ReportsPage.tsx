import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, FileText, Users, DollarSign, Download, Filter } from 'lucide-react';
import { Invoice } from '../types';

interface ReportsPageProps {
  invoices: Invoice[];
  clients: any[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ invoices, clients }) => {
  const [dateRange, setDateRange] = useState('month');
  const [selectedClient, setSelectedClient] = useState<string>('all');

  // Calculate statistics
  const filteredInvoices = selectedClient === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.clientId === selectedClient);

  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const avgInvoiceValue = filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0;
  const paidInvoices = filteredInvoices.filter(inv => inv.status === 'Paid').length;
  const pendingInvoices = filteredInvoices.filter(inv => inv.status === 'Sent').length;

  // Revenue by client
  const revenueByClient = clients.map(client => ({
    name: client.name,
    revenue: filteredInvoices
      .filter(inv => inv.clientId === client.id)
      .reduce((sum, inv) => sum + inv.grandTotal, 0),
    invoices: filteredInvoices.filter(inv => inv.clientId === client.id).length,
  }));

  // Invoice status breakdown
  const statusData = [
    { name: 'Paid', value: filteredInvoices.filter(inv => inv.status === 'Paid').length, color: '#10b981' },
    { name: 'Sent', value: filteredInvoices.filter(inv => inv.status === 'Sent').length, color: '#3b82f6' },
    { name: 'Draft', value: filteredInvoices.filter(inv => inv.status === 'Draft').length, color: '#f59e0b' },
    { name: 'Cancelled', value: filteredInvoices.filter(inv => inv.status === 'Cancelled').length, color: '#ef4444' },
  ];

  // Monthly revenue
  const monthlyData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full px-8 py-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-orange-600" />
          Reports & Analytics
        </h1>
        <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 flex items-center gap-2 transition">
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-wrap gap-4 items-center">
        <Filter className="w-5 h-5 text-slate-600" />
        <div>
          <label className="text-sm font-semibold text-slate-700">Time Period:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="ml-2 px-3 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-700">Client:</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="ml-2 px-3 py-1 border border-slate-300 rounded-lg text-sm"
          >
            <option value="all">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          color="bg-green-600"
        />
        <StatCard
          icon={FileText}
          label="Total Invoices"
          value={filteredInvoices.length}
          color="bg-blue-600"
        />
        <StatCard
          icon={Users}
          label="Active Clients"
          value={clients.length}
          color="bg-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Invoice"
          value={`₹${avgInvoiceValue.toLocaleString('en-IN')}`}
          color="bg-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Client */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-900 mb-4">Revenue by Client</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByClient}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#ea580c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-900 mb-4">Invoice Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="font-black text-slate-900 mb-4">Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} dot={{ fill: '#ea580c', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-black text-slate-900">Top Clients Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Invoices</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Revenue</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {revenueByClient.map((client) => (
                <tr key={client.name} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{client.name}</td>
                  <td className="px-6 py-4 text-slate-600">{client.invoices}</td>
                  <td className="px-6 py-4 font-semibold text-orange-600">₹{client.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
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

export default ReportsPage;
