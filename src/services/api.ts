import { Task, ActivityLog, Notification, SystemConfig } from '../types';
import { initialTasks, initialLogs, initialConfigs } from './mockData';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would use Supabase client.
// For this demo, we use localStorage to simulate a database.

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private getStorage<T>(key: string, initialData: T): T {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }

  private setStorage<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    await delay(300);
    return this.getStorage<Task[]>('tasks', initialTasks);
  }

  async getTask(id: string): Promise<Task | undefined> {
    await delay(200);
    const tasks = await this.getTasks();
    return tasks.find(t => t.id === id);
  }

  async createTask(task: Omit<Task, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await delay(400);
    const tasks = await this.getTasks();
    
    // Generate Code DXS-XXXX
    const counter = parseInt(localStorage.getItem('task_counter') || '3') + 1;
    localStorage.setItem('task_counter', counter.toString());
    const code = `DXS-${counter.toString().padStart(4, '0')}`;

    const newTask: Task = {
      ...task,
      id: uuidv4(),
      code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.setStorage('tasks', [...tasks, newTask]);
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await delay(400);
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    this.setStorage('tasks', tasks);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await delay(400);
    const tasks = await this.getTasks();
    this.setStorage('tasks', tasks.filter(t => t.id !== id));
  }

  // Logs
  async getLogs(taskId?: string): Promise<ActivityLog[]> {
    await delay(200);
    const logs = this.getStorage<ActivityLog[]>('logs', initialLogs);
    if (taskId) return logs.filter(l => l.taskId === taskId);
    return logs;
  }

  async createLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const logs = await this.getLogs();
    const newLog: ActivityLog = {
      ...log,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.setStorage('logs', [newLog, ...logs]);
    return newLog;
  }

  // Configs
  async getConfigs(): Promise<SystemConfig[]> {
    await delay(200);
    return this.getStorage<SystemConfig[]>('configs', initialConfigs);
  }

  async createConfig(config: Omit<SystemConfig, 'id'>): Promise<SystemConfig> {
    await delay(300);
    const configs = await this.getConfigs();
    const newConfig: SystemConfig = {
      ...config,
      id: uuidv4(),
    };
    this.setStorage('configs', [...configs, newConfig]);
    return newConfig;
  }

  async updateConfig(id: string, updates: Partial<SystemConfig>): Promise<SystemConfig> {
    await delay(300);
    const configs = await this.getConfigs();
    const index = configs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Config not found');

    const updatedConfig = {
      ...configs[index],
      ...updates,
    };

    configs[index] = updatedConfig;
    this.setStorage('configs', configs);
    return updatedConfig;
  }

  async deleteConfig(id: string): Promise<void> {
    await delay(300);
    const configs = await this.getConfigs();
    this.setStorage('configs', configs.filter(c => c.id !== id));
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    await delay(200);
    return this.getStorage<Notification[]>('notifications', [
      {
        id: '1',
        userId: 'admin',
        title: 'Nhiệm vụ mới',
        message: 'Bạn được giao nhiệm vụ "Triển khai hệ thống CRM"',
        isRead: false,
        type: 'info',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'admin',
        title: 'Cập nhật tiến độ',
        message: 'Nhiệm vụ "Tích hợp thanh toán" đã hoàn thành 100%',
        isRead: true,
        type: 'success',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: '3',
        userId: 'admin',
        title: 'Cảnh báo quá hạn',
        message: 'Nhiệm vụ "Báo cáo tháng 10" đã quá hạn 2 ngày',
        isRead: false,
        type: 'warning',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      }
    ]);
  }
}

export const api = new ApiService();
