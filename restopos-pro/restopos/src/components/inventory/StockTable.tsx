import React from 'react';
import { ArrowDownCircle, Trash2 } from 'lucide-react';


export const StockTable = ({ inventory, onAction }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-slate-50/50 border-b border-slate-100">
        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <th className="px-8 py-6">Product</th>
          <th className="px-8 py-6">Availability</th>
          <th className="px-8 py-6">Status</th>
          <th className="px-8 py-6 text-right">Inventory Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {inventory.map((item) => (
          <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-8 py-6">
              <span className="block font-black text-slate-900">{item.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
            </td>
            <td className="px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.is_low ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${(item.current_stock / item.max_capacity) * 100}%` }}
                  />
                </div>
                <span className="font-black text-sm">{item.current_stock} {item.unit}</span>
              </div>
            </td>
            <td className="px-8 py-6">
              {item.is_low ? (
                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase ring-1 ring-red-100 animate-pulse">Critical</span>
              ) : (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase ring-1 ring-emerald-100">Optimal</span>
              )}
            </td>
            <td className="px-8 py-6 text-right space-x-2">
              <button 
                onClick={() => onAction(item, 'in')}
                className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all" title="Add Stock"
              >
                <ArrowDownCircle size={20} />
              </button>
              <button 
                onClick={() => onAction(item, 'waste')}
                className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all" title="Log Waste"
              >
                <Trash2 size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);