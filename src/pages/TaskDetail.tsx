import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Upload, Save, FileText, Link as LinkIcon, Image as ImageIcon, Clock, User, Building2, Tag, CheckCircle2, AlertCircle, PlayCircle, FileUp, Edit } from 'lucide-react';
import { Modal } from '../components/Modal';
import { UpdateProgressForm } from '../components/UpdateProgressForm';
import { cn } from '../utils/cn';

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ['tasks', id],
    queryFn: () => api.getTask(id!),
    enabled: !!id,
  });

  const { data: logs = [] } = useQuery({
    queryKey: ['logs', id],
    queryFn: () => api.getLogs(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: any) => api.updateTask(id!, updates),
    onSuccess: (updatedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
      queryClient.invalidateQueries({ queryKey: ['logs', id] });
      setIsEditing(false);
      
      // Log progress update
      if (variables.progress !== task?.progress) {
        api.createLog({
          taskId: id!,
          userId: user?.id || '',
          userName: user?.name || '',
          action: 'Cập nhật tiến độ',
          before: `${task?.progress}%`,
          after: `${variables.progress}%`,
        });
      }
      
      // Log status update
      if (variables.status !== task?.status) {
        api.createLog({
          taskId: id!,
          userId: user?.id || '',
          userName: user?.name || '',
          action: 'Cập nhật trạng thái',
          before: task?.status || '',
          after: variables.status,
        });
      }
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
    </div>
  );
  
  if (!task) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <AlertCircle className="w-12 h-12 text-slate-300" />
      <p className="text-lg font-medium text-slate-600">Không tìm thấy nhiệm vụ</p>
      <Button variant="outline" onClick={() => navigate(-1)}>Quay lại</Button>
    </div>
  );

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="flex items-start sm:items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mt-1 sm:mt-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-mono font-semibold border border-slate-200">
                {task.code}
              </span>
              <Badge variant={
                task.status === 'Hoàn thành' ? 'success' :
                task.status === 'Đang triển khai' ? 'warning' :
                task.status === 'Quá hạn' ? 'destructive' : 'secondary'
              } className="px-2.5 py-1 text-xs">
                {task.status === 'Hoàn thành' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                {task.status === 'Đang triển khai' && <PlayCircle className="w-3 h-3 mr-1 inline" />}
                {task.status === 'Quá hạn' && <AlertCircle className="w-3 h-3 mr-1 inline" />}
                {task.status}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">{task.name}</h1>
          </div>
        </div>
        
        {isAdmin && !isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            className="bg-cyan-600 hover:bg-cyan-700 shadow-md shadow-cyan-500/20 w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Cập nhật tiến độ
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Card */}
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white p-6 border-b border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Tiến độ tổng thể</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-slate-900 tracking-tight">{task.progress}%</span>
                    <span className="text-sm text-slate-500 font-medium">hoàn thành</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 mb-1">Cập nhật lần cuối</p>
                  <p className="text-sm font-medium text-slate-700">
                    {logs.length > 0 ? format(new Date(logs[0].createdAt), 'dd/MM/yyyy HH:mm') : 'Chưa có'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                    task.progress === 100 ? "bg-emerald-500" : "bg-cyan-500"
                  )}
                  style={{ width: `${task.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-400" />
                Nội dung cập nhật mới nhất
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                {task.updates || <span className="text-slate-400 italic">Chưa có thông tin cập nhật tiến độ.</span>}
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Tag className="w-5 h-5 mr-2 text-cyan-600" />
                Thông tin chi tiết
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Phòng ban</p>
                    <p className="text-sm font-semibold text-slate-900">{task.department}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Người phụ trách</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {task.assignee.charAt(0)}
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{task.assignee}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600 mt-0.5">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Loại nhu cầu</p>
                    <p className="text-sm font-semibold text-slate-900">{task.type}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Hình thức hệ thống</p>
                    <p className="text-sm font-semibold text-slate-900">{task.systemForm}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Ngày bắt đầu</p>
                    <p className="text-sm font-semibold text-slate-900">{format(new Date(task.startDate), 'dd/MM/yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Hạn hoàn thành</p>
                    <p className="text-sm font-semibold text-slate-900">{format(new Date(task.endDate), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments Card */}
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <FileUp className="w-5 h-5 mr-2 text-cyan-600" />
                Tài liệu đính kèm
              </CardTitle>
              {isAdmin && (
                <Button variant="outline" size="sm" className="h-8 border-slate-200 hover:bg-slate-100">
                  <Upload className="w-3.5 h-3.5 mr-2" />
                  Tải lên
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600 mb-1">Chưa có tài liệu đính kèm</p>
                <p className="text-xs text-slate-400 text-center max-w-xs">
                  Upload các tài liệu liên quan, hình ảnh, hoặc file báo cáo tiến độ tại đây.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm sticky top-6">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-cyan-600" />
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {logs.map((log, i) => (
                  <div key={log.id} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-6 last:pb-0">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-cyan-500 shadow-sm"></div>
                    <div className="mb-1 text-sm flex flex-col">
                      <span className="font-semibold text-slate-900">{log.userName}</span>
                      <span className="text-slate-600 font-medium">{log.action}</span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2 font-medium">
                      {format(new Date(log.createdAt), 'HH:mm - dd/MM/yyyy')}
                    </div>
                    {(log.before || log.after) && (
                      <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 shadow-sm">
                        {log.before && (
                          <div className="flex items-start text-slate-500 mb-1">
                            <span className="w-10 text-xs uppercase tracking-wider font-semibold opacity-70 mt-0.5">Từ:</span>
                            <span className="line-through">{log.before}</span>
                          </div>
                        )}
                        {log.after && (
                          <div className="flex items-start text-slate-900 font-medium">
                            <span className="w-10 text-xs uppercase tracking-wider font-semibold text-cyan-600 opacity-70 mt-0.5">Đến:</span>
                            <span>{log.after}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">Chưa có lịch sử hoạt động</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Cập nhật tiến độ nhiệm vụ"
      >
        <UpdateProgressForm 
          initialData={task}
          onSubmit={(data) => updateMutation.mutate(data)}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
    </div>
  );
}
