import React, { useState, useEffect } from 'react';
import { 
  Cloud, HardDrive, FileText, Activity, TrendingUp, ChevronRight,
  Plus, Upload, ShieldCheck, Cpu, Zap, Thermometer
} from 'lucide-react';
import { systemService } from '../services/api';
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        systemService.getStats(),
        systemService.getActivity()
      ]);
      setStats(statsRes.data);
      setRecentActions(activityRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (loading) setTimeout(() => setLoading(false), 800);
    }
  };

  if (loading || !stats) return <div className="max-w-7xl mx-auto p-8"><DashboardSkeleton /></div>;

  const usedPercent = parseFloat(stats.storage.percent);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto space-y-12 pb-24"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-6">
        <div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-3"
          >
            Terminal Node: 10.150.250.115
          </motion.p>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none dark:text-white">
            ApnaCloud <span className="text-primary">NAS</span>
          </h1>
        </div>
        <Link to="/files" className="btn-primary group flex items-center gap-4 px-10 py-5 shadow-[0_20px_50px_rgba(37,99,235,0.3)] rounded-[2rem] font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
           <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
           <span>Initialize Stream</span>
        </Link>
      </header>

      {/* Primary Hardware Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 glass rounded-[4rem] p-12 border-white/20 relative overflow-hidden group shadow-2xl dark:bg-slate-900/40">
          <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[120px] group-hover:bg-primary/10 transition-all duration-1000" />
          
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
              <HardDrive className="text-primary" size={32} /> Storage Core
            </h3>
            <div className="px-4 py-2 bg-slate-900/5 dark:bg-white/5 rounded-full border border-slate-900/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Health: 99.9%
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="144" cy="144" r="130" strokeWidth="24" stroke="rgba(203, 213, 225, 0.15)" fill="none" />
                <motion.circle 
                  cx="144" cy="144" r="130" strokeWidth="24" stroke="currentColor" fill="none"
                  strokeDasharray={2 * Math.PI * 130}
                  initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - usedPercent / 100) }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  style={{ strokeLinecap: 'round' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter"
                 >
                    {Math.round(usedPercent)}%
                 </motion.span>
                 <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mt-3">Allocated</span>
              </div>
            </div>

            <div className="flex-1 space-y-8 w-full">
               <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] border border-slate-100/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group/card">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Total Volume</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-primary transition-colors">
                        {(stats.storage.total / (1024**3)).toFixed(1)}<span className="text-lg ml-1">GB</span>
                    </p>
                 </div>
                 <div className="p-8 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] border border-slate-100/50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group/card">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Free Space</p>
                    <p className="text-4xl font-black text-primary tracking-tighter">
                        {(stats.storage.free / (1024**3)).toFixed(1)}<span className="text-lg ml-1">GB</span>
                    </p>
                 </div>
               </div>
               <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-20" />
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="text-primary" size={28} />
                    </div>
                    <div>
                        <p className="text-lg font-black tracking-tight leading-none">Security Node Active</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">End-to-End Encrypted</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-500 group-hover:translate-x-2 transition-transform" />
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
            {/* CPU Monitor */}
            <div className="glass rounded-[3rem] p-10 border-white/20 flex-1 flex flex-col justify-between group relative overflow-hidden dark:bg-slate-900/40">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-all" />
                <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-3xl flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-900/20">
                        <Cpu size={32} />
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.cpu.load}%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CPU Load</p>
                    </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.cpu.load}%` }}
                        className="h-full bg-amber-500 rounded-full"
                    />
                </div>
            </div>

            {/* RAM Monitor */}
            <div className="glass rounded-[3rem] p-10 border-white/20 flex-1 flex flex-col justify-between group relative overflow-hidden dark:bg-slate-900/40">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all" />
                <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/20">
                        <Zap size={32} />
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.memory.percent}%</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RAM Usage</p>
                    </div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-4">
                    <span>{(stats.memory.used / (1024**3)).toFixed(1)}GB Used</span>
                    <span>{(stats.memory.total / (1024**3)).toFixed(1)}GB Total</span>
                </div>
            </div>

            {/* Thermal Node */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex-1 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-500 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="flex items-center justify-between">
                    <Thermometer className="text-red-500" size={32} />
                    <div className="text-right">
                        <p className="text-4xl font-black tracking-tighter">{stats.cpu.temp}°<span className="text-xl">C</span></p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Processor Heat</p>
                    </div>
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed mt-6">
                    Hardware operating within <span className="text-emerald-500">safe thermal limits</span>. Cooling fans active.
                </p>
            </div>
        </div>
      </div>

      <div className="glass rounded-[4rem] p-12 border-white/20 shadow-2xl overflow-hidden relative min-h-[500px] dark:bg-slate-900/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px]" />
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-tighter">
                <Activity className="text-primary" size={32} /> Transmission Log
            </h3>
            <p className="text-xs font-bold text-slate-400 mt-2">Real-time network packet monitoring active.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
             <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Online</span>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <AnimatePresence>
            {recentActions.length > 0 ? recentActions.map((action, i) => (
              <motion.div 
                key={action.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-8 bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-2xl rounded-[2.5rem] border border-transparent hover:border-slate-100 dark:hover:border-white/5 transition-all group"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 border border-slate-100/50 dark:border-white/5">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight group-hover:text-primary transition-colors">{action.details}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                           {new Date(action.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified Link</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node User</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{action.email}</p>
                    </div>
                    <ChevronRight size={22} className="text-slate-200 group-hover:text-primary transition-transform group-hover:translate-x-2" />
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">No activity packets found</div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
