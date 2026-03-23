import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm border-b border-slate-200 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
              Welcome back, {user?.email?.split('@')[0]}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900">{user?.role?.toUpperCase()}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
