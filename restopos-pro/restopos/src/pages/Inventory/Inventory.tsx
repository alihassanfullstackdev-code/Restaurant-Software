import React, { useState } from 'react';
import { 
  Package, 
  AlertCircle, 
  Truck, 
  FileText, 
  Plus, 
  Trash2, 
  Filter, 
  Download,
  ChevronRight,
  ChevronLeft,
  MapPin,
  HelpCircle
} from 'lucide-react';

// --- Types ---
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: string;
  level: number; // 0 to 100
  icon: any;
  isLow: boolean;
}

interface Supplier {
  name: string;
  type: string;
  icon: any;
}

interface HistoryItem {
  date: string;
  title: string;
  meta: string;
  color: string;
}

export default function Inventory() {
  // --- States (Empty by default) ---
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Stats calculation logic (Example)
  const stats = [
    { label: 'Total Active Ingredients', value: inventory.length || '0', change: '+0%', icon: Package, color: 'bg-primary', lightColor: 'bg-primary/10' },
    { label: 'Low Stock Alerts', value: inventory.filter(i => i.isLow).length || '0', change: 'LIVE', icon: AlertCircle, color: 'bg-red-500', lightColor: 'bg-red-50', isCritical: inventory.some(i => i.isLow) },
    { label: 'Pending Orders', value: '0', change: 'Active', icon: Truck, color: 'bg-blue-500', lightColor: 'bg-blue-50' },
    { label: 'Waste Value (MTD)', value: '$0.00', change: '0% vs LY', icon: FileText, color: 'bg-amber-500', lightColor: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Inventory & Raw Materials</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-primary" />
            Main Kitchen Warehouse • Updated Just Now
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-sm font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95">
            <Trash2 size={18} />
            <span className="hidden xs:inline">Waste Log</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-slate-900 text-sm font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
            <Plus size={20} />
            Add New
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.isCritical ? 'border-red-200 ring-4 ring-red-50 animate-pulse' : 'border-slate-200'} shadow-sm`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl ${stat.lightColor} ${stat.isCritical ? 'text-red-600' : 'text-slate-600'}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.isCritical ? 'text-red-600' : 'text-emerald-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${stat.isCritical ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-lg">Stock Inventory Levels</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><Filter size={20} /></button>
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><Download size={20} /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto overflow-y-hidden">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <th className="px-6 py-5">Ingredient Name</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Current Stock</th>
                    <th className="px-6 py-5">Level</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {inventory.length > 0 ? inventory.map((item, i) => (
                    <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${item.isLow ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.isLow ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                            <item.icon size={20} />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold block text-slate-900 truncate">{item.name}</span>
                            {item.isLow && <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">Low Stock</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap">
                          {item.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-black ${item.isLow ? 'text-red-600' : 'text-slate-900'}`}>{item.stock}</td>
                      <td className="px-6 py-4 min-w-[120px]">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`${item.isLow ? 'bg-red-500' : 'bg-primary'} h-2 rounded-full transition-all duration-1000`} 
                            style={{ width: `${item.level}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                          item.isLow 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                            : 'text-primary hover:underline'
                        }`}>
                          {item.isLow ? 'Order Now' : 'Restock'}
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center opacity-20">
                          <Package size={48} className="mb-4" />
                          <p className="font-black uppercase tracking-[0.2em] text-sm">No items in warehouse</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Showing {inventory.length} items</span>
              <div className="flex items-center gap-6">
                <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-300 transition-colors"><ChevronLeft size={20} /></button>
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Page 1</span>
                <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panels */}
        <div className="flex flex-col gap-8">
          {/* Supplier Management */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-black text-lg text-slate-900">Top Suppliers</h3>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">All</button>
            </div>
            <div className="p-4 space-y-3">
              {suppliers.length > 0 ? suppliers.map((supplier, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-primary/30 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4 text-left">
                    <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary shrink-0 transition-colors">
                      <supplier.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 truncate max-w-[120px]">{supplier.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{supplier.type}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                </button>
              )) : (
                <p className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest opacity-50">No suppliers listed</p>
              )}
            </div>
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h3 className="font-black text-lg text-slate-900">Recent History</h3>
            </div>
            <div className="p-6">
              {history.length > 0 ? (
                <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
                  {history.map((item, i) => (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[41px] top-1 size-5 rounded-full ${item.color} border-4 border-white shadow-sm`}></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.date}</p>
                      <p className="text-sm font-black text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">{item.meta}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 opacity-30">
                  <FileText size={32} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No recent activity</p>
                </div>
              )}
              <button className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors border-t border-slate-50 mt-6">
                Full History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Help - Mobile Optimized */}
      <button className="fixed right-6 bottom-6 md:right-8 md:bottom-8 size-12 md:size-14 rounded-full bg-primary text-slate-900 shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50">
        <HelpCircle size={24} />
      </button>
    </div>
  );
}