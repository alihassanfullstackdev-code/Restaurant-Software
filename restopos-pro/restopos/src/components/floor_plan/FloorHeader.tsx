import React from 'react';
import { Plus } from 'lucide-react';

interface FloorHeaderProps {
  floorName?: string;
  onAddTable?: () => void;
}

export default function FloorHeader({ floorName, onAddTable }: FloorHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-5xl font-black text-slate-800 tracking-tighter italic">
          {floorName || 'Loading...'}
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 ml-1">
          Restaurant Floor Layout
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Legends */}
        <div className="hidden md:flex gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500">
           <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white border border-slate-300"></span> Free</div>
           <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Busy</div>
           <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Group</div>
        </div>

        {/* --- ADD TABLE BUTTON: Permission Logic --- */}
        {onAddTable && (
          <button 
            onClick={onAddTable}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            <Plus size={16} /> Add Table
          </button>
        )}
      </div>
    </div>
  );
}