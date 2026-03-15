import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Filter, ListTodo } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { TaskForm } from '../components/TaskForm';
import { cn } from '../utils/cn';

export default function Tasks() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createTask({
      ...data,
      status: 'Chưa bắt đầu',
      progress: 0,
      updates: '',
      finalResult: '',
    }),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreateModalOpen(false);
      api.createLog({
        taskId: newTask.id,
        userId: user?.id || '',
        userName: user?.name || '',
        action: 'Tạo nhiệm vụ',
        before: '',
        after: 'Đã tạo mới',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setTaskToDelete(null);
    },
  });

  const handleDelete = (id: string) => {
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete);
      api.createLog({
        taskId: taskToDelete,
        userId: user?.id || '',
        userName: user?.name || '',
        action: 'Xoá nhiệm vụ',
        before: '',
        after: 'Đã xoá',
      });
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Danh sách nhiệm vụ</h1>
          <p className="text-sm text-slate-500">Quản lý và theo dõi tiến độ các hạng mục chuyển đổi số.</p>
        </div>
        {user?.role === 'admin' && (
          <Button className="bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/20" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo nhiệm vụ
          </Button>
        )}
      </div>

      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Tìm kiếm mã, tên nhiệm vụ..." 
              className="pl-9 bg-white border-slate-200/60 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/60 rounded-md shadow-sm text-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 font-medium">Trạng thái:</span>
              <select 
                className="bg-transparent border-none outline-none text-slate-900 font-medium cursor-pointer"
                value={statusFilter}
                onChange={(e) => setSearchParams(e.target.value ? { status: e.target.value } : {})}
              >
                <option value="">Tất cả</option>
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                <option value="Đang triển khai">Đang triển khai</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Quá hạn">Quá hạn</option>
              </select>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Mã NV</th>
                  <th className="px-6 py-4 font-semibold">Tên công việc</th>
                  <th className="px-6 py-4 font-semibold">Phòng ban</th>
                  <th className="px-6 py-4 font-semibold">Phụ trách</th>
                  <th className="px-6 py-4 font-semibold">Tiến độ</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-mono">{task.code}</span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-800" title={task.name}>{task.name}</td>
                    <td className="px-6 py-4 text-slate-500">{task.department}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {task.assignee.charAt(0)}
                        </div>
                        <span className="text-slate-700">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-full bg-slate-100 rounded-full h-2 max-w-[100px] overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              task.progress === 100 ? "bg-emerald-500" : "bg-cyan-500"
                            )}
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-slate-600">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        task.status === 'Hoàn thành' ? 'success' :
                        task.status === 'Đang triển khai' ? 'warning' :
                        task.status === 'Quá hạn' ? 'destructive' : 'secondary'
                      }>
                        {task.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <Link to={`/tasks/${task.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {user?.role === 'admin' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ListTodo className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-base font-medium text-slate-600">Không tìm thấy nhiệm vụ nào</p>
                        <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Tạo nhiệm vụ mới"
      >
        <TaskForm 
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Xác nhận xoá"
      >
        <div className="p-6">
          <p className="text-slate-600 mb-6">
            Bạn có chắc chắn muốn xoá nhiệm vụ này? Dữ liệu liên quan cũng sẽ bị xoá và không thể khôi phục.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setTaskToDelete(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Đang xoá...' : 'Xoá nhiệm vụ'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
