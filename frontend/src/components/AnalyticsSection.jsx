import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
const STATUS_COLORS = {
  Active: '#10b981',
  Inactive: '#f43f5e',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsSection = ({ analyticsData }) => {
  if (!analyticsData) return null;

  const { departmentDistribution = [], statusDistribution = [], monthlyJoiningTrend = [] } = analyticsData;

  const pieData = statusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  const sortedTrendData = [...monthlyJoiningTrend]
    .sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0))
    .map(item => ({
      month: item.month,
      Joined: item.count
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
            <LineIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Monthly Onboarding Trend</h3>
        </div>
        <div className="h-64 w-full">
          {sortedTrendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">No onboarding data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sortedTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJoined" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Joined" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorJoined)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-violet-500/10 rounded-lg text-violet-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Department Size</h3>
        </div>
        <div className="h-64 w-full">
          {departmentDistribution.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">No department data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-200">Status Split</h3>
        </div>
        <div className="h-64 w-full relative">
          {pieData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">No status data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-400 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
};

export default AnalyticsSection;
