import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  loginAsAdmin: () => void;
  loginAsViewer: () => void;
  logout: () => void;
}

const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Phan Đình Tín',
  role: 'admin',
  email: 'admin@banahills.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
};

const MOCK_VIEWER: User = {
  id: 'viewer-1',
  name: 'Nhân viên Xem',
  role: 'viewer',
  email: 'viewer@banahills.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viewer'
};

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_ADMIN, // Default to admin for demo
  setUser: (user) => set({ user }),
  loginAsAdmin: () => set({ user: MOCK_ADMIN }),
  loginAsViewer: () => set({ user: MOCK_VIEWER }),
  logout: () => set({ user: null }),
}));
