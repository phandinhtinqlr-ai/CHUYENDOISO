import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, ListTodo, History, Settings, Bell, LogOut, User as UserIcon, ChevronRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { format } from 'date-fns';

export default function MainLayout() {
  const { user, logout, loginAsAdmin, loginAsViewer } = useAuthStore();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getNotifications(),
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'viewer'] },
    { name: 'Nhiệm vụ', path: '/tasks', icon: ListTodo, roles: ['admin', 'viewer'] },
    { name: 'Lịch sử', path: '/logs', icon: History, roles: ['admin', 'viewer'] },
    { name: 'Cấu hình', path: '/settings', icon: Settings, roles: ['admin'] },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#0f172a] to-[#0f172a]/95 text-slate-300 flex flex-col border-r border-slate-800/50 shadow-xl z-20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-full h-64 bg-cyan-500/10 blur-[80px] -z-10 pointer-events-none" />
        
        <div className="p-6">
          <Link to="/" className="group flex flex-col gap-1 transition-transform hover:scale-[1.02]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">Ba Na Hills</h1>
            </div>
            <h2 className="text-xs font-medium text-cyan-400/90 uppercase tracking-wider mt-2">Chuyển đổi số</h2>
            <p className="text-[10px] text-slate-500 font-mono">by Phan Đình Tín</p>
          </Link>
        </div>
        
        <nav className="flex-1 px-3 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
          {navItems.filter(item => item.roles.includes(user?.role || '')).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ring-1 ring-cyan-500/20" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-3 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-slate-700">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-400 truncate font-medium">{user?.role === 'admin' ? 'Administrator' : 'Viewer'}</p>
            </div>
          </div>
          
          {/* Demo role switcher */}
          <div className="flex gap-2 mb-3">
            <button onClick={loginAsAdmin} className={cn("flex-1 text-[10px] uppercase tracking-wider font-semibold py-1.5 rounded transition-colors", user?.role === 'admin' ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>Admin</button>
            <button onClick={loginAsViewer} className={cn("flex-1 text-[10px] uppercase tracking-wider font-semibold py-1.5 rounded transition-colors", user?.role === 'viewer' ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-400 hover:bg-slate-700")}>Viewer</button>
          </div>

          <button 
            onClick={logout}
            className="flex items-center justify-center w-full gap-2 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay pointer-events-none z-0"></div>
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-slate-100 to-transparent -z-10 pointer-events-none"></div>

        {/* Header */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
              {navItems.find(item => item.path === location.pathname)?.name || 'Chi tiết'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Thông báo</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                        {unreadCount} mới
                      </span>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={cn(
                              "p-4 hover:bg-slate-50 transition-colors cursor-pointer",
                              !notification.isRead && "bg-cyan-50/30"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "mt-0.5 p-1.5 rounded-full",
                                notification.type === 'info' ? "bg-blue-100 text-blue-600" :
                                notification.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                                "bg-amber-100 text-amber-600"
                              )}>
                                {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                                <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                                <p className="text-xs text-slate-400 mt-1.5">
                                  {format(new Date(notification.createdAt), 'HH:mm - dd/MM/yyyy')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600">Không có thông báo nào</p>
                        <p className="text-xs text-slate-400 mt-1">Bạn đã xem hết tất cả thông báo.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
