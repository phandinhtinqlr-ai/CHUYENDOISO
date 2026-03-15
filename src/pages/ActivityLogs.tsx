import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { format } from 'date-fns';
import { History, Activity } from 'lucide-react';
import { useRealtimeLogs } from '../hooks/useRealtime';

export default function ActivityLogs() {
  const { logs, isLoading } = useRealtimeLogs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-600" />
            Lịch sử hoạt động
          </h1>
          <p className="text-slate-500 mt-1">Theo dõi các thay đổi và cập nhật trên hệ thống</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Thời gian</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Người dùng</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Hành động</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Chi tiết thay đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">{format(new Date(log.createdAt), 'HH:mm')}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{format(new Date(log.createdAt), 'dd/MM/yyyy')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">{log.userName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {log.before && (
                          <div className="flex items-start gap-2 text-slate-500">
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400 w-8">Từ:</span>
                            <span className="line-through decoration-slate-300">{log.before}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2 text-slate-900">
                          <span className="text-xs font-medium uppercase tracking-wider text-cyan-600 w-8">Sang:</span>
                          <span className="font-medium">{log.after}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <Activity className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-medium text-slate-900">Chưa có hoạt động nào</p>
                        <p className="text-sm">Hệ thống chưa ghi nhận lịch sử thay đổi nào.</p>
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
  );
}
