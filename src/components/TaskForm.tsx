import React from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên công việc'),
  department: z.string().min(1, 'Vui lòng chọn phòng ban'),
  type: z.string().min(1, 'Vui lòng chọn loại nhu cầu'),
  scope: z.string().min(1, 'Vui lòng chọn phạm vi'),
  systemForm: z.string().min(1, 'Vui lòng chọn hình thức'),
  assignee: z.string().min(1, 'Vui lòng nhập người phụ trách'),
  startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: Partial<FormData>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: Props) {
  const { register, handleSubmit, formState: { errors } } = useRHForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      status: 'Chưa bắt đầu',
      progress: 0,
    } as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên công việc <span className="text-red-500">*</span></label>
        <Input 
          {...register('name')} 
          placeholder="Nhập tên công việc" 
          className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phòng ban <span className="text-red-500">*</span></label>
          <Input 
            {...register('department')} 
            placeholder="VD: Phòng IT" 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.department && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.department.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Người phụ trách <span className="text-red-500">*</span></label>
          <Input 
            {...register('assignee')} 
            placeholder="Nhập tên người phụ trách" 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.assignee && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.assignee.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày bắt đầu <span className="text-red-500">*</span></label>
          <Input 
            type="date" 
            {...register('startDate')} 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.startDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.startDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày hoàn thành <span className="text-red-500">*</span></label>
          <Input 
            type="date" 
            {...register('endDate')} 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.endDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Loại nhu cầu <span className="text-red-500">*</span></label>
          <Input 
            {...register('type')} 
            placeholder="VD: Phần mềm" 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.type && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.type.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phạm vi <span className="text-red-500">*</span></label>
          <Input 
            {...register('scope')} 
            placeholder="VD: Toàn công ty" 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.scope && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.scope.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hình thức <span className="text-red-500">*</span></label>
          <Input 
            {...register('systemForm')} 
            placeholder="VD: Web App" 
            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
          {errors.systemForm && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.systemForm.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 border-slate-200 hover:bg-slate-50 text-slate-600">Hủy</Button>
        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 px-6 shadow-md shadow-cyan-500/20">Lưu nhiệm vụ</Button>
      </div>
    </form>
  );
}
