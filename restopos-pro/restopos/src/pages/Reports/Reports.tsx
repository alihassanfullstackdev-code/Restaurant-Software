import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  Calendar, 
  BarChart3, 
  Package, 
  Users, 
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  PieChart,
  CheckCircle2,
  Inbox
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

export default function Reports() {
  // --- States (Empty by default) ---
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeReport, setActiveReport] = useState('Sales Performance');

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Advanced Reports</h1>
          <p className="text-slate-500 font-medium text-sm">Detailed analytics for your restaurant's performance.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <FileText size={16} /> PDF
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Download size={16} /> Excel
          </button>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            <RefreshCw size={18} /> Run Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-black mb-6 flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-900">
              <Calendar size={16} className="text-primary" />
              Date Range
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</label>
                <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold">
                  Select Date
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To</label>
                <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold">
                  Select Date
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="text-[9px] p-2 bg-primary/10 text-primary font-black uppercase tracking-widest rounded-lg">Last 7D</button>
                <button className="text-[9px] p-2 bg-slate-100 text-slate-500 font-black uppercase tracking-widest rounded-lg">Month</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto lg:overflow-visible">
            <h3 className="font-black mb-6 text-[10px] uppercase tracking-widest text-slate-900">Report Type</h3>
            <div className="flex lg:flex-col gap-2 min-w-[500px] lg:min-w-0">
              {[
                { label: 'Sales Performance', icon: BarChart3 },
                { label: 'Inventory Status', icon: Package },
                { label: 'Staff Efficiency', icon: Users },
                { label: 'Financial Summary', icon: Wallet },
              ].map((type, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveReport(type.label)}
                  className={`flex-1 lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${
                    activeReport === type.label 
                      ? 'bg-primary/10 text-slate-900 border-l-4 border-primary' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <type.icon size={18} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Charts Area */}
        <div className="col-span-12 lg:col-span-9 space-y-6 md:space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { label: 'Total Sales', val: '$0.00', color: 'text-slate-900' },
              { label: 'Net Profit', val: '$0.00', color: 'text-primary' },
              { label: 'Avg Ticket', val: '$0.00', color: 'text-slate-900' }
            ].map((m, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                <h2 className={`text-2xl md:text-3xl font-black mt-2 ${m.color}`}>{m.val}</h2>
                <div className="mt-3 text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                   No data available
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[350px] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-lg">Top Products</h3>
                <BarChart3 size={20} className="text-slate-200" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Waiting for data...</p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[350px] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-lg">Distribution</h3>
                <PieChart size={20} className="text-slate-200" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <div className="size-32 rounded-full border-8 border-slate-50 border-dashed mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest">No segments found</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
              <div>
                <h3 className="font-black text-xl">Profit & Loss Summary</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Summary of selected period</p>
              </div>
              <button className="text-primary text-[10px] font-black flex items-center gap-2 uppercase tracking-widest hover:underline">
                Full Ledger <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tableData.length > 0 ? (
                    tableData.map((row, i) => <tr key={i}>{/* Rows */}</tr>)
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <Inbox size={40} className="mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No financial records to display</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-center md:text-left">
        <p>© 2026 SavoryPOS Analytics v4.2.0.</p>
        <div className="flex gap-4 md:gap-8">
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
          <a className="hover:text-primary transition-colors" href="#">Audit Logs</a>
        </div>
      </footer>
    </div>
  );
}