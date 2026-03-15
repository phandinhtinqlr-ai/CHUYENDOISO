import { Task, ActivityLog, Notification, SystemConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const initialTasks: Task[] = [
  {
    id: '1',
    code: 'DXS-0001',
    department: 'Phòng IT',
    name: 'Xây dựng hệ thống quản lý nhân sự',
    type: 'Phần mềm',
    scope: 'Toàn công ty',
    systemForm: 'Web App',
    assignee: 'Nguyễn Văn A',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    status: 'Đang triển khai',
    progress: 45,
    updates: 'Đã hoàn thành module đăng nhập',
    finalResult: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'DXS-0002',
    department: 'Phòng Nhân Sự',
    name: 'Số hoá hồ sơ nhân viên',
    type: 'Số hoá tài liệu',
    scope: 'Phòng Nhân Sự',
    systemForm: 'File Server',
    assignee: 'Trần Thị B',
    startDate: '2023-11-01',
    endDate: '2023-11-30',
    status: 'Hoàn thành',
    progress: 100,
    updates: 'Đã scan xong 100% hồ sơ',
    finalResult: 'Link thư mục hồ sơ',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'DXS-0003',
    department: 'Phòng Kế Toán',
    name: 'Tích hợp hoá đơn điện tử',
    type: 'Tích hợp hệ thống',
    scope: 'Phòng Kế Toán',
    systemForm: 'API',
    assignee: 'Lê Văn C',
    startDate: '2023-09-01',
    endDate: '2023-10-15',
    status: 'Quá hạn',
    progress: 80,
    updates: 'Đang chờ đối tác cung cấp API key',
    finalResult: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const initialLogs: ActivityLog[] = [
  {
    id: '1',
    taskId: '1',
    userId: 'admin-1',
    userName: 'Phan Đình Tín',
    action: 'Cập nhật tiến độ',
    before: '0%',
    after: '45%',
    createdAt: new Date().toISOString(),
  }
];

export const initialConfigs: SystemConfig[] = [
  { id: uuidv4(), type: 'department', value: 'Phòng IT', label: 'Phòng IT', isActive: true, order: 1 },
  { id: uuidv4(), type: 'department', value: 'Phòng Nhân Sự', label: 'Phòng Nhân Sự', isActive: true, order: 2 },
  { id: uuidv4(), type: 'department', value: 'Phòng Kế Toán', label: 'Phòng Kế Toán', isActive: true, order: 3 },
  { id: uuidv4(), type: 'status', value: 'Chưa bắt đầu', label: 'Chưa bắt đầu', isActive: true, order: 1 },
  { id: uuidv4(), type: 'status', value: 'Đang triển khai', label: 'Đang triển khai', isActive: true, order: 2 },
  { id: uuidv4(), type: 'status', value: 'Hoàn thành', label: 'Hoàn thành', isActive: true, order: 3 },
  { id: uuidv4(), type: 'status', value: 'Quá hạn', label: 'Quá hạn', isActive: true, order: 4 },
];
