import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRealtimeConfigs } from '../hooks/useRealtime';

interface Props {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData: any;
}

export function UpdateProgressForm({ onSubmit, onCancel, initialData }: Props) {
  const { configs } = useRealtimeConfigs();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      progress: initialData.progress,
      status: initialData.status,
      updates: initialData.updates || '',
    },
  });

  const statusOptions = configs.filter(c => c.type === 'status' && c.isActive);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tiến độ (%) <span className="text-red-500">*</span></label>
          <Input 
            type="number" 
            min="0" 
            max="100" 
            {...register('progress', { valueAsNumber: true })} 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng thái <span className="text-red-500">*</span></label>
          <select 
            {...register('status')} 
            className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors"
          >
            {statusOptions.length > 0 ? (
              statusOptions.map(opt => (
                <option key={opt.id} value={opt.label}>{opt.label}</option>
              ))
            ) : (
              <>
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                <option value="Đang triển khai">Đang triển khai</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Quá hạn">Quá hạn</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung cập nhật</label>
        <textarea 
          {...register('updates')} 
          className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors resize-y"
          placeholder="Nhập chi tiết tiến độ công việc, khó khăn vướng mắc (nếu có)..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 border-slate-200 hover:bg-slate-50 text-slate-600">Hủy</Button>
        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 px-6 shadow-md shadow-cyan-500/20">Cập nhật</Button>
      </div>
    </form>
  );
}
