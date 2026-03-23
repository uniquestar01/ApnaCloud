import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, Rocket, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use the simplified login endpoint provided by user
      const res = await fetch('http://10.150.250.115:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Simulating the context login for session management
        localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.role }));
        localStorage.setItem('token', 'simulated-token'); // Simple session
        window.location.href = '/';
        toast.success('Welcome to the Future');
      } else {
        toast.error(data.error || 'Invalid Identity');
      }
    } catch (err) {
      toast.error('Network node unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-black">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-pane p-10 md:p-12 rounded-[3rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(37,99,235,0.2)]">
          <header className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30"
            >
              <Rocket className="text-white" size={36} />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">ApnaCloud</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Initialize Secure Node</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Node Mail</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-14"
                  placeholder="admin@apnacloud.me"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-14"
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium w-full text-white text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.4)] glow-hover"
            >
               {loading ? <Loader2 className="animate-spin" size={20} /> : (
                 <>
                   Sign In To Node <ArrowRight size={18} />
                 </>
               )}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <ShieldCheck className="text-blue-500" size={14} /> Encrypted Transmission
             </div>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
