import React from 'react';
import { ChefHat, Edit3, Trash2, Package } from 'lucide-react';
import { Ingredient } from '../../pages/Inventory/Inventory';

interface Props {
  item: Ingredient;
  onAction: () => void;
  onEdit: (item: Ingredient) => void;
  onDelete: (id: number) => void;
}

export const InventoryTableRow = ({ item, onAction, onEdit, onDelete }: Props) => {
  return (
    <tr className="group hover:bg-slate-50/80 transition-colors">
      {/* Item Details */}
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
            <Package size={20} />
          </div>
          <div>
            <div className="font-black text-slate-800 uppercase italic leading-none">{item.name}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1.5">{item.category?.name || 'General'}</div>
          </div>
        </div>
      </td>

      {/* Vendor */}
      <td className="px-6 py-5">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">{item.supplier?.name || 'N/A'}</div>
      </td>

      {/* Opening Quantity */}
      <td className="px-6 py-5 text-center font-bold text-slate-400">
        <span className="text-sm">{item.opening_quantity}</span>
        <span className="text-[9px] uppercase ml-1">{item.unit}</span>
      </td>

      {/* Current Balance (Highlighted) */}
      <td className="px-6 py-5 text-center bg-indigo-50/20">
        <div className="font-black text-indigo-600 text-lg leading-none">
          {item.current_balance}
        </div>
        <div className="text-[9px] font-black text-indigo-400 uppercase mt-1">
          {item.unit}
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-5">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
          item.status === 'in_stock' ? 'bg-emerald-100 text-emerald-600' : 
          item.status === 'low_stock' ? 'bg-amber-100 text-amber-600' : 
          'bg-rose-100 text-rose-600'
        }`}>
          {item.status?.replace('_', ' ')}
        </div>
      </td>

      {/* Actions */}
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onAction}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
            title="Issue to Kitchen"
          >
            <ChefHat size={16} />
          </button>
          <button 
            onClick={() => onEdit(item)}
            className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-2.5 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};