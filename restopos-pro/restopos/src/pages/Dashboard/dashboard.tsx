import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  Download, 
  Table as TableIcon,
  Plus
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

// Empty Component for Stats
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}`}>
        <Icon size={24} />
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-black mt-1">{value}</h3>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Ready for real-time data integration.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <Calendar size={18} />
            Today
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid - All set to Zero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today's Revenue" value="$0.00" icon={DollarSign} color="bg-blue-500" />
        <StatCard title="Total Orders" value="0" icon={ShoppingBag} color="bg-purple-500" />
        <StatCard title="Active Tables" value="0 / 0" icon={TableIcon} color="bg-orange-500" />
        <StatCard title="Avg. Ticket Value" value="$0.00" icon={TrendingUp} color="bg-emerald-500" />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Empty Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-8">Sales Analytics</h3>
          <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl">
            <TrendingUp size={40} className="text-slate-200 mb-2" />
            <p className="text-slate-400 text-sm font-medium">No sales data to display</p>
          </div>
        </div>

        {/* Empty Inventory Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-6">Top Selling Items</h3>
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
            <Plus size={32} className="text-slate-300 mb-2" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider text-center px-4">
              Add items to your inventory to see rankings
            </p>
          </div>
        </div>
      </div>

      {/* Empty Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg">Recent Transactions</h3>
        </div>
        <div className="p-12 text-center text-slate-400">
          <p className="text-sm font-medium">No transactions found for the selected period.</p>
        </div>
      </div>
    </div>
  );
}