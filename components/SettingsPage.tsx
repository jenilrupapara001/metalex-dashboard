
import React, { useState } from 'react';
import { Company } from '../types';
import { ICONS } from '../constants';

interface SettingsPageProps {
  company: Company;
  onUpdate: (company: Company) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ company, onUpdate }) => {
  const [profile, setProfile] = useState(company);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdate(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 w-full px-8 py-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Configuration</h1>
          <p className="text-slate-500 text-sm">SaaS Preferences & Company Billing Identity</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-slate-900 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg"
        >
          {saved ? <><ICONS.Check className="w-4 h-4" /> Changes Applied</> : 'Update Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
             <h3 className="font-bold text-slate-800 flex items-center gap-2"><ICONS.Settings className="text-blue-600" /> Identity Details</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-400 uppercase">Legal Name</label>
                 <input className="w-full p-2 bg-slate-50 border rounded-lg outline-none" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-400 uppercase">GSTIN</label>
                 <input className="w-full p-2 bg-slate-50 border rounded-lg outline-none" value={profile.gstin} onChange={e => setProfile({...profile, gstin: e.target.value})} />
               </div>
               <div className="space-y-1 col-span-2">
                 <label className="text-xs font-bold text-slate-400 uppercase">Registered Address</label>
                 <textarea className="w-full p-2 bg-slate-50 border rounded-lg outline-none" rows={3} value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
               </div>
             </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
             <h3 className="font-bold text-slate-800 flex items-center gap-2"><ICONS.Dashboard className="text-blue-600" /> Banking Setup</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Bank Name</label><input className="w-full p-2 bg-slate-50 border rounded-lg outline-none" value={profile.bankDetails?.bankName} onChange={e => setProfile({...profile, bankDetails: { ...profile.bankDetails!, bankName: e.target.value }})} /></div>
               <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Account Name</label><input className="w-full p-2 bg-slate-50 border rounded-lg outline-none" value={profile.bankDetails?.accountName} onChange={e => setProfile({...profile, bankDetails: { ...profile.bankDetails!, accountName: e.target.value }})} /></div>
               <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">Account Number</label><input className="w-full p-2 bg-slate-50 border rounded-lg outline-none" value={profile.bankDetails?.accountNumber} onChange={e => setProfile({...profile, bankDetails: { ...profile.bankDetails!, accountNumber: e.target.value }})} /></div>
               <div className="space-y-1"><label className="text-xs font-bold text-slate-400 uppercase">IFSC Code</label><input className="w-full p-2 bg-slate-50 border rounded-lg outline-none" value={profile.bankDetails?.ifsc} onChange={e => setProfile({...profile, bankDetails: { ...profile.bankDetails!, ifsc: e.target.value }})} /></div>
             </div>
          </section>
        </div>

        <div className="space-y-6">
           <div className="bg-blue-600 p-6 rounded-2xl shadow-xl text-white space-y-4 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="font-bold relative">SaaS Subscription</h3>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-md">
                <p className="text-xs font-bold uppercase opacity-60">Current Plan</p>
                <p className="text-2xl font-black">{profile.subscriptionPlan} Pro</p>
              </div>
              <ul className="text-xs space-y-2 opacity-80 font-medium">
                <li>• Unlimited Quotations</li>
                <li>• AI Technical Writing Enabled</li>
                <li>• Multi-Tenant Storage</li>
              </ul>
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-black text-xs uppercase shadow-lg">Manage Billing</button>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800">Support Context</h3>
              <p className="text-xs text-slate-500">System Version: v2.4.1 Production</p>
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-black">1.4k</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">PDF Generates</p>
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-lg text-center">
                  <p className="text-lg font-black">32GB</p>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Storage Used</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
