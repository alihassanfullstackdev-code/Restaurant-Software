import React from 'react';
import { Plus, Edit3, Trash2, UtensilsCrossed } from 'lucide-react';

export const MenuCard = ({ item, onAdd, onEdit, onDelete }: any) => {
  // Laravel Storage ka Base URL
  const baseUrl = "http://127.0.0.1:8000/storage/";

  return (
    <div className="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
      
      {/* Image Section */}
      <div className="relative h-44 w-full overflow-hidden rounded-[2rem] mb-4 bg-slate-100 flex items-center justify-center">
        {item.image ? (
          <img 
            src={`${baseUrl}${item.image}`} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            onError={(e) => {
              // Agar DB mein path hai par file missing hai, toh icon dikhayein
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) parent.classList.add('bg-emerald-50');
            }}
          />
        ) : (
          // Agar database mein image field null hai
          <div className="flex flex-col items-center opacity-20">
            <UtensilsCrossed size={40} className="text-emerald-600" />
            <span className="text-[8px] font-black uppercase mt-2">No Image</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Price Tag Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-xl">
          <span className="text-sm font-black text-slate-900">${Number(item.price).toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button onClick={onEdit} className="p-3 bg-white text-blue-600 rounded-2xl hover:scale-110 transition-transform shadow-xl">
            <Edit3 size={18} />
          </button>
          <button onClick={onDelete} className="p-3 bg-white text-red-600 rounded-2xl hover:scale-110 transition-transform shadow-xl">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-2">
        <h3 className="font-bold text-slate-800 text-lg truncate mb-1">{item.name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {item.category?.name || 'General'}
          </span>
          <button onClick={onAdd} className="h-10 w-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:rotate-90 transition-all shadow-lg">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};