export type Role = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  code: string;
  department: string;
  name: string;
  type: string;
  scope: string;
  systemForm: string;
  assignee: string;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  updates: string;
  finalResult: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskAsset {
  id: string;
  taskId: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  action: string;
  before: string;
  after: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  link?: string;
}

export interface SystemConfig {
  id: string;
  type: 'department' | 'taskType' | 'scope' | 'systemForm' | 'status' | 'priority' | 'projectGroup';
  value: string;
  label: string;
  isActive: boolean;
  order: number;
}
