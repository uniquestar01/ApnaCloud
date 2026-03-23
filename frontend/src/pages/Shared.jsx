import React, { useState, useEffect } from 'react';
import { 
  Share2, Link, Clock, Trash2, ExternalLink, 
  ShieldCheck, ArrowRight, Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Shared = () => {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      const res = await api.get('/share');
      setShares(res.data);
    } catch (err) {
      toast.error('Data sync failed');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const revokeShare = async (id) => {
    try {
      await api.delete(`/share/${id}`);
      toast.success('Access Revoked Successfully');
      fetchShares();
    } catch (err) {
      toast.error('Protocol reversal failed');
    }
  };

  const copyToClipboard = (token, direct = false) => {
    const url = direct ? `http://10.150.250.115:5000/share/${token}` : `${window.location.origin}/s/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Vector link copied to buffer!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      <header className="mb-12">
        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Public Channels</p>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Shared Links</h1>
      </header>

      <div className="glass rounded-[3rem] p-12 border-white/20 shadow-2xl relative min-h-[500px]">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="w-20 h-20 bg-slate-200 rounded-[2rem]" />
          </div>
        ) : shares.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <Share2 size={56} className="text-slate-200 mb-6" />
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">No Active Streams.</h3>
            <p className="text-slate-400 font-medium text-sm mt-3">Generate a share link in the File Manager to begin distribution.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <AnimatePresence>
              {shares.map((share) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={share.id} 
                  className="bg-white/60 hover:bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all hover:shadow-2xl group cursor-default"
                >
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                           <ShieldCheck size={28} />
                        </div>
                        <div>
                           <h4 className="font-black text-xl text-slate-800 truncate max-w-[200px] tracking-tight">{share.file_name}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Encrypted Link</p>
                        </div>
                     </div>
                     <button onClick={() => revokeShare(share.id)} className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <Trash2 size={22} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group/link cursor-pointer hover:border-primary transition-all" onClick={() => copyToClipboard(share.token)}>
                        <div className="flex items-center gap-3 truncate flex-1">
                           <Link className="text-primary flex-shrink-0" size={18} />
                           <span className="text-xs font-bold text-slate-500 truncate lowercase tracking-tighter">/s/{share.token}</span>
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase ml-4 opacity-0 group-hover/link:opacity-100 transition-all">Copy UI</span>
                     </div>
                     
                     <div className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group/link cursor-pointer hover:border-emerald-500 transition-all" onClick={() => copyToClipboard(share.token, true)}>
                        <div className="flex items-center gap-3 truncate flex-1">
                           <Download className="text-emerald-500 flex-shrink-0" size={18} />
                           <span className="text-xs font-bold text-slate-500 truncate lowercase tracking-tighter">/share/{share.token}</span>
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase ml-4 opacity-0 group-hover/link:opacity-100 transition-all">Copy Direct</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Shared;
