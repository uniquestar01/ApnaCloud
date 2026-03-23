import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Trash2, History, Shield, 
  Search, ExternalLink, Loader2, Key, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/system/activity')
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      toast.error('Identity sync failed');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      toast.success(`${newUser.email} authorized`);
      setNewUser({ email: '', password: '', role: 'user' });
      fetchData();
    } catch (err) {
      toast.error('Protocol failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-7xl mx-auto"
    >
      <header className="mb-12">
        <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Command Center</p>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Administration</h1>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-1 space-y-8">
          <div className="glass rounded-[2.5rem] p-10 border-white/20 shadow-xl">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <UserPlus className="text-primary" /> New Access Node
            </h3>
            <form onSubmit={createUser} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all" size={18} />
                <input 
                  type="email" 
                  placeholder="Official Email"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all" size={18} />
                <input 
                  type="password" 
                  placeholder="Master Key"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-black text-slate-900 focus:outline-none focus:border-primary transition-all"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="user">Agent</option>
                <option value="admin">Administrator</option>
              </select>
              <button className="w-full btn-primary py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                 Authorize
              </button>
            </form>
          </div>

          <div className="glass rounded-[2.5rem] p-10 border-white/20 shadow-xl overflow-hidden">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <Users className="text-primary" /> Authorized Nodes
            </h3>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-5 bg-white/60 hover:bg-white rounded-3xl border border-slate-100 transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs uppercase tracking-tighter">
                         {u.email[0]}
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-800 tracking-tight">{u.email.split('@')[0]}</p>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{u.role}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="glass rounded-[3rem] p-12 border-white/20 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <History className="text-primary" size={28} /> Network Audit
              </h3>
              <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-slate-900/20">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" /> Live Trace
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {logs.slice(0, 8).map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="p-6 bg-white/60 hover:bg-white border border-slate-50 rounded-[2rem] transition-all hover:shadow-2xl flex items-center justify-between group cursor-default"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                         <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight leading-snug">{log.details}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(log.timestamp).toLocaleString()} • Verified 
                        </p>
                      </div>
                    </div>
                    <ExternalLink size={18} className="text-slate-100 group-hover:text-primary transition-all" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
