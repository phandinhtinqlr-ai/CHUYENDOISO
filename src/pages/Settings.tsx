import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Settings as SettingsIcon, Plus, Trash2, Edit2, Search, SlidersHorizontal } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useRealtimeConfigs } from '../hooks/useRealtime';

export default function Settings() {
  const { configs, isLoading } = useRealtimeConfigs();

  const [activeTab, setActiveTab] = useState('department');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [formData, setFormData] = useState({ label: '', isActive: true });
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  const tabs = [
    { id: 'department', label: 'Phòng ban' },
    { id: 'taskType', label: 'Loại nhu cầu' },
    { id: 'scope', label: 'Phạm vi' },
    { id: 'systemForm', label: 'Hình thức hệ thống' },
    { id: 'status', label: 'Trạng thái' },
  ];

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createConfig(data),
    onSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.updateConfig(id, data),
    onSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteConfig(id),
    onSuccess: () => {
      setConfigToDelete(null);
    },
  });

  const handleOpenModal = (config?: any) => {
    if (config) {
      setEditingConfig(config);
      setFormData({ label: config.label, isActive: config.isActive });
    } else {
      setEditingConfig(null);
      setFormData({ label: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConfig) {
      updateMutation.mutate({ id: editingConfig.id, data: formData });
    } else {
      createMutation.mutate({ ...formData, type: activeTab });
    }
  };

  const handleDelete = (id: string) => {
    setConfigToDelete(id);
  };

  const confirmDelete = () => {
    if (configToDelete) {
      deleteMutation.mutate(configToDelete);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
    </div>
  );

  const currentConfigs = configs.filter(c => 
    c.type === activeTab && 
    c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cấu hình hệ thống</h1>
            <p className="text-sm text-slate-500">Quản lý các danh mục và tham số của ứng dụng.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0">
          <Card className="border-slate-200/60 shadow-sm sticky top-6">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-500" />
                Danh mục cấu hình
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                    activeTab === tab.id 
                      ? 'bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100/50' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 bg-slate-50/50 pb-4 gap-4">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Danh sách {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}
              </CardTitle>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Tìm kiếm..." 
                    className="pl-9 bg-white border-slate-200/60 h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 shadow-sm shrink-0 h-9" onClick={() => handleOpenModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold w-16 text-center">STT</th>
                      <th className="px-6 py-4 font-semibold">Tên / Giá trị</th>
                      <th className="px-6 py-4 font-semibold w-32">Trạng thái</th>
                      <th className="px-6 py-4 font-semibold text-right w-28">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentConfigs.map((config, index) => (
                      <tr key={config.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 text-center text-slate-400 font-medium">{index + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{config.label}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                            config.isActive 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                              : 'bg-slate-50 text-slate-600 border-slate-200/60'
                          }`}>
                            {config.isActive ? 'Hoạt động' : 'Đã ẩn'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleOpenModal(config)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(config.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {currentConfigs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <SettingsIcon className="w-10 h-10 mb-3 opacity-20" />
                            <p className="text-sm font-medium text-slate-600">Không tìm thấy dữ liệu cấu hình</p>
                            {searchTerm && <p className="text-xs mt-1">Thử thay đổi từ khóa tìm kiếm</p>}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingConfig ? "Chỉnh sửa cấu hình" : "Thêm cấu hình mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tên / Giá trị</label>
            <Input 
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Nhập giá trị..."
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Hoạt động</label>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">Lưu</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!configToDelete}
        onClose={() => setConfigToDelete(null)}
        title="Xác nhận xoá"
      >
        <div className="p-6">
          <p className="text-slate-600 mb-6">
            Bạn có chắc chắn muốn xoá cấu hình này? Hành động này không thể hoàn tác.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfigToDelete(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Đang xoá...' : 'Xoá cấu hình'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
