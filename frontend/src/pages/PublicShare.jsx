import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, File as FileIcon, Clock, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../utils/api';

const PublicShare = () => {
  const { token } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`${API_BASE}/share/info/${token}`);
        setFile(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'This link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [token]);

  const handleDownload = () => {
    window.location.href = `${API_BASE}/share/${token}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
       <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
       <div className="glass p-12 rounded-[3rem] max-w-md w-full animate-slide-up">
          <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-8">{error}</p>
          <a href="/" className="btn-primary inline-block">Go to Home</a>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decor */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

      <div className="glass p-10 md:p-14 rounded-[3rem] max-w-xl w-full relative z-10 animate-slide-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
             <FileIcon size={40} />
          </div>
          
          <h1 className="text-3xl font-extrabold text-white mb-2 truncate w-full px-4">{file.name}</h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-8">Securely Shared via ApnaCloud</p>

          <div className="w-full space-y-4 mb-10">
             <div className="flex justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-slate-400 text-sm">File Size</span>
                <span className="text-white font-bold text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
             </div>
             <div className="flex justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-slate-400 text-sm">Expires</span>
                <span className="text-white font-bold text-sm">{new Date(file.expires_at).toLocaleDateString()}</span>
             </div>
          </div>

          <button 
            onClick={handleDownload}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Download size={24} /> Download File
          </button>
          
          <div className="mt-10 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
             <ShieldCheck size={14} className="text-accent" /> Encrypted & Verified
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicShare;
