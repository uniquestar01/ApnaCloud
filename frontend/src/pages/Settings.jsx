import React, { useState } from 'react';
import { 
  User, Lock, Shield, Server, Bell, 
  ChevronRight, Save, Database, HardDrive, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = () => {
    toast.success('Configuration synced successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'storage', label: 'Storage Sync', icon: Database },
    { id: 'server', label: 'Raspberry Pi', icon: Server },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <header className="mb-12">
        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">System Preferences</p>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cloud Settings</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Nav */}
        <aside className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100'}
              `}
            >
              <div className="flex items-center gap-4">
                <tab.icon size={20} />
                <span className="font-bold text-sm tracking-tight">{tab.label}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3">
          <div className="glass rounded-[3rem] p-10 border-white/20 min-h-[500px] flex flex-col justify-between">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-slide-up">
                <h3 className="text-2xl font-black text-slate-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Display Name</label>
                    <input type="text" placeholder="Sakshi" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-primary transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
                    <input type="email" placeholder="admin@apnacloud.me" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-primary transition-all" />
                  </div>
                </div>
                <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center gap-6">
                   <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-black">S</div>
                   <div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight">Active Professional License</h4>
                      <p className="text-sm text-primary font-bold">Your ApnaCloud instance is currently on the stable production build.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-slide-up">
                <h3 className="text-2xl font-black text-slate-900">Security & Authentication</h3>
                <div className="space-y-4">
                  <button className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-6 flex items-center justify-between hover:border-primary transition-all group">
                     <div className="flex items-center gap-4 text-left">
                        <Shield className="text-primary" size={24} />
                        <div>
                          <p className="font-black text-slate-900">Two-Factor Authentication</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Enhance your cloud safety</p>
                        </div>
                     </div>
                     <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500">Disabled</span>
                  </button>
                  <button className="w-full bg-white border-2 border-slate-100 rounded-[2rem] p-6 flex items-center justify-between hover:border-primary transition-all group">
                     <div className="flex items-center gap-4 text-left">
                        <Lock className="text-primary" size={24} />
                        <div>
                          <p className="font-black text-slate-900">Change Root Password</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Last changed 14 days ago</p>
                        </div>
                     </div>
                     <ChevronRight className="text-slate-200 group-hover:text-primary transition-all" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'server' && (
              <div className="space-y-8 animate-slide-up">
                <h3 className="text-2xl font-black text-slate-900">Raspberry Pi Topology</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                      <div className="flex items-center justify-between mb-8">
                         <Server className="text-primary" />
                         <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                      </div>
                      <p className="text-sky-400 font-black text-2xl">10.150.250.115</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Active Network Interface</p>
                   </div>
                   <div className="p-8 border-2 border-slate-100 rounded-[2.5rem] flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                         <RefreshCcw className="text-primary" size={18} />
                         <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Auto-Sync Protocol</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">The server is automatically mirroring all encrypted data blocks from the HDD.</p>
                   </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-10 border-t border-slate-100 flex items-center justify-between">
               <p className="text-xs font-bold text-slate-400 italic">Version 2.4.0 (Production Stable)</p>
               <button onClick={handleSave} className="btn-primary flex items-center gap-2 shadow-xl shadow-primary/20 px-8 py-4">
                  <Save size={20} />
                  <span>Update Configuration</span>
               </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
