import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Folder, Share2, Settings, Users, LogOut, Cloud, ChevronRight, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Folder, label: 'My Files', path: '/files' },
    { icon: Share2, label: 'Shared', path: '/shared' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ icon: Users, label: 'Admin', path: '/admin' });
  }

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 glass dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transition-all duration-500">
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Cloud className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">ApnaCloud</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium NAS</p>
          </div>
        </div>
        <button onClick={toggleTheme} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
           {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-400" />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="transition-colors" />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-4 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {user?.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email.split('@')[0]}</p>
            <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-tighter">{user?.role} NODE</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          Logout Terminal
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
