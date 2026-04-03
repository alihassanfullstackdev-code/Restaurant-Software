import React from 'react';
import { Package, AlertCircle, Truck, FileText } from 'lucide-react';

export const InventoryStats = ({ inventory }: { inventory: any[] }) => {
  const lowStockCount = inventory.filter(i => i.isLow).length;
  
  const stats = [
    { label: 'Total Active Ingredients', value: inventory.length, change: '+0%', icon: Package, color: 'bg-primary', lightColor: 'bg-primary/10' },
    { label: 'Low Stock Alerts', value: lowStockCount, change: 'LIVE', icon: AlertCircle, color: 'bg-red-500', lightColor: 'bg-red-50', isCritical: lowStockCount > 0 },
    { label: 'Pending Orders', value: '0', change: 'Active', icon: Truck, color: 'bg-blue-500', lightColor: 'bg-blue-50' },
    { label: 'Waste Value (MTD)', value: '$0.00', change: '0%', icon: FileText, color: 'bg-amber-500', lightColor: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <div key={i} className={`bg-white p-6 rounded-2xl border ${stat.isCritical ? 'border-red-200 ring-4 ring-red-50 animate-pulse' : 'border-slate-200'} shadow-sm`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3 rounded-xl ${stat.lightColor} ${stat.isCritical ? 'text-red-600' : 'text-slate-600'}`}>
              <stat.icon size={24} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${stat.isCritical ? 'text-red-600' : 'text-emerald-600'}`}>{stat.change}</span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
          <p className={`text-2xl font-black mt-1 ${stat.isCritical ? 'text-red-600' : 'text-slate-900'}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
};