import React from 'react';
import { Ingredient } from '../../pages/Inventory/Inventory';
import { InventoryTableRow } from '../../components/inventory/InventoryTableRow';

interface Props {
  inventory: Ingredient[];
  onAction: (item: Ingredient) => void;
  onEdit: (item: Ingredient) => void;
  onDelete: (id: number) => void;
}

export const InventoryTable = ({ inventory, onAction, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      {/* --- Table Header --- */}
      <div className="px-8 py-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-black text-xl uppercase tracking-tighter text-slate-800 italic">
            Store <span className="text-indigo-600">Inventory</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Stock Tracking</p>
        </div>

        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-2 text-slate-400">
            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            Healthy
          </span>
          <span className="flex items-center gap-2 text-slate-400">
            <div className="size-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
            Low Stock
          </span>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-50 bg-white">
              <th className="px-8 py-6">Item Details</th>
              <th className="px-6 py-6">Vendor</th>
              {/* Opening Stock (Grayish for background record) */}
              <th className="px-6 py-6 text-center bg-slate-50/50">Opening</th>
              {/* Current Stock (Indigo for primary focus) */}
              <th className="px-6 py-6 text-center text-indigo-600 bg-indigo-50/30">Current Balance</th>
              <th className="px-6 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  onAction={() => onAction(item)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-black text-slate-300 uppercase text-xs tracking-[0.3em]">Store is empty</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};