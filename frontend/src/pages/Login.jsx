import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, Mail, Key, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
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
      await login(email, password);
      toast.success('Authentication Wave Verified');
      navigate('/');
    } catch (err) {
      toast.error('Identity Mismatch Detected');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-slate-50 to-slate-50">
      
      {/* Background Cinematic Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary blur-[160px] rounded-full animate-pulse" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400 blur-[140px] rounded-full opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10 text-center group">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.4)] mb-6 transition-all group-hover:scale-110 group-hover:rotate-6">
            <Cloud className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">ApnaCloud</h1>
          <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">Secure Data Terminal</p>
        </div>

        <div className="glass rounded-[3rem] p-10 border-white/40 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.1)]">
          <p className="text-center text-sm font-bold text-slate-400 mb-8 px-4 leading-relaxed">Please authenticate with your private credentials to access your Raspberry Pi storage node.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 relative group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Point</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all" size={20} />
                <input 
                  type="email" 
                  placeholder="admin@apnacloud.me"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 relative group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Master Key</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-16 pr-6 py-5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full h-16 mt-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl relative overflow-hidden group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm uppercase tracking-widest">Verifying Identity...</span>
                </>
              ) : (
                <>
                  <span className="text-sm uppercase tracking-widest">Initiate Access</span>
                  <div className="absolute right-0 top-0 h-full w-12 bg-primary/20 flex items-center justify-center transition-all group-hover:w-full">
                     <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 text-primary">
                <ShieldCheck size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest">Encrypted SSL Transmission</p>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter text-center">
                Access is restricted to authorized personnel only. <br/> IP Logged: 10.150.250.115
             </p>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center relative z-10">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Powered by Raspberry Pi 4 Node Architecture</p>
      </footer>
    </div>
  );
};

export default Login;
