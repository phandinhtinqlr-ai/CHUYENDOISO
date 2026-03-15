import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import TaskDetail from '../pages/TaskDetail';
import ActivityLogs from '../pages/ActivityLogs';
import Settings from '../pages/Settings';
import { useAuthStore } from '../store/authStore';
import { Sparkles } from 'lucide-react';

export default function AppRoutes() {
  const { user, isAuthReady, loginWithGoogle } = useAuthStore();

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-slate-900">Ba Na Hills</h1>
          <p className="text-slate-500 mb-6 text-sm">Hệ thống quản lý chuyển đổi số</p>
          <button 
            onClick={() => loginWithGoogle()}
            className="w-full bg-cyan-600 text-white px-4 py-2.5 rounded-lg hover:bg-cyan-700 font-medium transition-colors shadow-md shadow-cyan-500/20"
          >
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="logs" element={<ActivityLogs />} />
          {user.role === 'admin' && (
            <Route path="settings" element={<Settings />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
