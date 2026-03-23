import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FileManager from './pages/FileManager';
import Shared from './pages/Shared';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import PublicShare from './pages/PublicShare';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 lg:p-12 min-h-screen">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0F172A',
              color: '#fff',
              borderRadius: '16px',
              padding: '12px 24px',
              fontWeight: 600
            }
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/s/:token" element={<PublicShare />} />
          
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />
          <Route path="/shared" element={<ProtectedRoute><Shared /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
