import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: any;
  onUpdate: (id: any, delta: number) => void;
  onRemove: (id: any) => void; 
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-2">
      <div className="flex flex-col">
        <span className="font-bold text-xs text-slate-800">{item.name}</span>
        <span className="text-[10px] text-slate-400 font-medium">${Number(item.price).toFixed(2)}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
          <button 
            onClick={() => onUpdate(item.id, -1)}
            className="p-1 hover:bg-white rounded-md transition-colors text-slate-500"
          >
            <Minus size={12} />
          </button>
          <span className="text-xs font-black min-w-[12px] text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdate(item.id, 1)}
            className="p-1 hover:bg-white rounded-md transition-colors text-slate-500"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* FIXED: ID pass karna zaroori hai */}
        <button 
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Remove Item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};