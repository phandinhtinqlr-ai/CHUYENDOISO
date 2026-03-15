import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import TaskDetail from '../pages/TaskDetail';
import ActivityLogs from '../pages/ActivityLogs';
import Settings from '../pages/Settings';
import { useAuthStore } from '../store/authStore';

export default function AppRoutes() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <button 
            onClick={() => useAuthStore.getState().loginAsAdmin()}
            className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
          >
            Đăng nhập Demo
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
