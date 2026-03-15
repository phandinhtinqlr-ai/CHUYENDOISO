import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, ListTodo, TrendingUp, ArrowUpRight } from 'lucide-react';

const COLORS = ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl">
        <p className="text-sm font-medium text-slate-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            Số lượng: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
    </div>
  );

  const total = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'Đang triển khai').length;
  const completed = tasks.filter(t => t.status === 'Hoàn thành').length;
  const overdue = tasks.filter(t => t.status === 'Quá hạn').length;

  const byDepartment = tasks.reduce((acc, task) => {
    acc[task.department] = (acc[task.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptData = Object.entries(byDepartment).map(([name, value]) => ({ name, value }));

  const byType = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-sm text-slate-500">Theo dõi tiến độ chuyển đổi số toàn diện theo thời gian thực.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-slate-200/60 overflow-hidden relative" 
          onClick={() => navigate('/tasks')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                <ListTodo className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tổng nhiệm vụ</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{total}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 border-slate-200/60 overflow-hidden relative" 
          onClick={() => navigate('/tasks?status=Đang triển khai')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Đang triển khai</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{inProgress}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-slate-200/60 overflow-hidden relative" 
          onClick={() => navigate('/tasks?status=Hoàn thành')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Hoàn thành</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{completed}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="group cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 border-slate-200/60 overflow-hidden relative" 
          onClick={() => navigate('/tasks?status=Quá hạn')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-rose-400 to-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/30">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Quá hạn</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{overdue}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              Phân bổ nhiệm vụ theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="url(#colorValue)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-slate-800">Cơ cấu loại số hoá</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-slate-600 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
