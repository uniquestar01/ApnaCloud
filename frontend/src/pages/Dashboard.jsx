import React, { useState, useEffect } from 'react';
import { 
  Cloud, HardDrive, FileText, Activity, TrendingUp, ChevronRight,
  Plus, Upload, ShieldCheck, Cpu, Zap, Thermometer,
  Grid, List, Trash2, Download, Search, Settings, 
  LayoutDashboard, Share2, LogOut, User, Bell, Menu, X
} from 'lucide-react';
import { fileService, systemService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [filesRes, statsRes] = await Promise.all([
        fileService.getFiles(),
        systemService.getStats()
      ]);
      setFiles(filesRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (loading) setTimeout(() => setLoading(false), 500);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${file.name}...`);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await fileService.uploadFile(formData);
      toast.success('Transmission Complete', { id: toastId });
      fetchData();
    } catch (err) {
      toast.error('Upload Failed', { id: toastId });
    }
  };

  const handleDelete = async (name) => {
    try {
      await fileService.deleteFile(name);
      toast.success('Data Removed');
      fetchData();
    } catch (err) {
      toast.error('Deletion Failed');
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading || !stats) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Cloud className="text-primary" size={48} />
       </motion.div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-black text-white font-['Outfit'] overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="glass-pane border-r border-white/5 z-30 relative overflow-hidden hidden lg:block"
      >
        <div className="p-8 h-full flex flex-col w-[280px]">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Cloud className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tight">ApnaCloud</span>
          </div>

          <nav className="space-y-2 flex-1">
            <SidebarLink icon={<LayoutDashboard size={20}/>} label="Node Status" active />
            <SidebarLink icon={<FileText size={20}/>} label="Storage" />
            <SidebarLink icon={<Share2 size={20}/>} label="Shared Nodes" />
            <SidebarLink icon={<Activity size={20}/>} label="Activity" />
            <SidebarLink icon={<Settings size={20}/>} label="Preferences" />
          </nav>

          <div className="mt-8 p-6 glass-card rounded-3xl border border-white/5">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-slate-500 uppercase">Storage</span>
               <span className="text-[10px] font-black text-primary uppercase">{stats.storage.percent}%</span>
             </div>
             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary" style={{ width: `${stats.storage.percent}%` }} />
             </div>
             <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase">{(stats.storage.free / (1024**3)).toFixed(1)}GB Available</p>
          </div>

          <button className="mt-8 flex items-center gap-4 text-slate-500 hover:text-white transition-colors px-4 py-2">
            <LogOut size={20} />
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative scrollbar-hide">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 glass-pane border-b border-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="relative w-full md:w-96 group">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
             <input 
              type="text" 
              placeholder="Query files in node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-14 py-3 text-sm focus:py-3"
             />
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell size={24} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
              </button>
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                 <div className="text-right">
                    <p className="text-sm font-black tracking-tight">Admin Node</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master Key Access</p>
                 </div>
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
                    <User className="text-primary" size={24} />
                 </div>
              </div>
           </div>
        </header>

        <div className="p-8 lg:p-12 space-y-12 pb-32">
          {/* Hero Hardware Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={<Cpu className="text-amber-500" />} label="CPU Matrix" val={`${stats.cpu.load}%`} color="amber" />
            <StatCard icon={<Zap className="text-emerald-500" />} label="Memory Node" val={`${stats.memory.percent}%`} color="emerald" />
            <StatCard icon={<Thermometer className="text-rose-500" />} label="Thermal Node" val={`${stats.cpu.temp}°C`} color="rose" />
          </section>

          {/* File Explorer Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
             <div>
               <h2 className="text-4xl font-black tracking-tighter mb-2">Node Storage</h2>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Manage decentralized data streams</p>
             </div>

             <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-500 hover:text-white'}`}
                >
                  <Grid size={20} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-500 hover:text-white'}`}
                >
                  <List size={20} />
                </button>
                <div className="w-[1px] h-8 bg-white/5 mx-2" />
                <label className="btn-premium flex items-center gap-3 cursor-pointer py-3 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                   <Upload size={18} />
                   <span className="text-xs uppercase font-black tracking-widest">Upload Data</span>
                   <input type="file" className="hidden" onChange={handleUpload} />
                </label>
             </div>
          </section>

          {/* Files Main Visual */}
          <AnimatePresence mode="wait">
            {filteredFiles.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card rounded-[3rem] p-32 flex flex-col items-center justify-center text-center opacity-50"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                   <Cloud size={48} className="text-slate-700" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">No data packets found</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Initialize a stream to begin storage</p>
              </motion.div>
            ) : viewMode === 'grid' ? (
              <motion.div 
                key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {filteredFiles.map((file, i) => (
                  <motion.div 
                    key={file.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass-card p-6 rounded-[2.5rem] group relative overflow-hidden flex flex-col"
                  >
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500">
                        <FileText size={24} />
                     </div>
                     <h4 className="font-bold text-slate-100 truncate mb-1">{file.name}</h4>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{(file.size / (1024*1024)).toFixed(2)} MB</p>
                     
                     <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/5">
                        <a href={fileService.getDownloadUrl(file.name)} download className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-colors">
                           <Download size={16} />
                        </a>
                        <button onClick={() => handleDelete(file.name)} className="flex-1 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors">
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-[3rem] overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <th className="px-10 py-6">Identity</th>
                        <th className="px-6 py-6 font-bold">Volume</th>
                        <th className="px-6 py-6 text-right">Node Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <FileText size={18} />
                              </div>
                              <span className="font-bold text-slate-200">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm font-black text-slate-500">
                            {(file.size / (1024*1024)).toFixed(2)} MB
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a href={fileService.getDownloadUrl(file.name)} download className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                                   <Download size={16} />
                                </a>
                                <button onClick={() => handleDelete(file.name)} className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? 'bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
    {icon}
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

const StatCard = ({ icon, label, val, color }) => (
  <div className="glass-card p-10 rounded-[3rem] group relative overflow-hidden">
    <div className={`absolute -top-12 -right-12 w-32 h-32 bg-${color}-500/5 blur-3xl group-hover:bg-${color}-500/10 transition-all`} />
    <div className="flex items-center justify-between mb-8">
      <div className={`w-16 h-16 bg-${color}-500/5 rounded-3xl flex items-center justify-center border border-${color}-500/10`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-3xl font-black tracking-tighter">{val}</p>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
