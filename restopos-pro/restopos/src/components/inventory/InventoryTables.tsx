import React from 'react';
import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, AlertTriangle, Package, Truck } from 'lucide-react';
import { Ingredient } from '../../pages/Inventory/Inventory';

interface Props {
  inventory: Ingredient[];
  onAction: (item: Ingredient, mode: 'in' | 'out' | 'waste') => void;
  onEdit: (item: Ingredient) => void;
  onDelete: (id: number) => void;
}

export const InventoryTable = ({ inventory, onAction, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
      <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-black text-lg uppercase tracking-tight">Stock Inventory</h3>
        <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-emerald-500"/> In Stock</span>
          <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-500"/> Low Stock</span>
          <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-rose-500"/> Out</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-400 border-b border-slate-50">
              <th className="px-8 py-5">Item & Category</th>
              <th className="px-6 py-5">Supplier</th>
              <th className="px-6 py-5">Current Stock</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Name & Category */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${getStatusBg(item.status)}`}>
                        <Package size={18} className={getStatusColor(item.status)} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                          {item.category?.name || 'Uncategorized'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Supplier Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Truck size={14} className="text-slate-300" />
                      {item.supplier?.name || 'No Vendor'}
                    </div>
                  </td>

                  {/* Stock Quantity */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900">
                        {item.quantity} <span className="text-xs font-medium text-slate-400 uppercase tracking-tighter">{item.unit}</span>
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Min: {item.min_stock_level} {item.unit}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusBadgeStyles(item.status)}`}>
                      {item.status === 'low_stock' && <AlertTriangle size={10} />}
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-8 py-5">
                    <div className="flex justify-end items-center gap-2">
                      {/* Stock In/Out Buttons */}
                      <button 
                        onClick={() => onAction(item, 'in')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                        title="Stock In"
                      >
                        <ArrowUpCircle size={20} />
                      </button>
                      <button 
                        onClick={() => onAction(item, 'out')}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Stock Out"
                      >
                        <ArrowDownCircle size={20} />
                      </button>
                      
                      <div className="w-px h-6 bg-slate-100 mx-1" />

                      {/* Edit/Delete */}
                      <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-300 uppercase text-xs tracking-[0.2em]">Inventory is empty</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper Functions for Dynamic Styling
const getStatusColor = (status: string) => {
  if (status === 'low_stock') return 'text-amber-500';
  if (status === 'out_of_stock') return 'text-rose-500';
  return 'text-emerald-500';
};

const getStatusBg = (status: string) => {
  if (status === 'low_stock') return 'bg-amber-50';
  if (status === 'out_of_stock') return 'bg-rose-50';
  return 'bg-emerald-50';
};

const getStatusBadgeStyles = (status: string) => {
  if (status === 'low_stock') return 'bg-amber-50 text-amber-600 border-amber-100';
  if (status === 'out_of_stock') return 'bg-rose-50 text-rose-600 border-rose-100';
  return 'bg-emerald-50 text-emerald-600 border-emerald-100';
};