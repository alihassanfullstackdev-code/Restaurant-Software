import React from 'react';
import { Flame, Link2, Clock } from 'lucide-react';

interface OccupiedListProps {
  tables: any[];
  onSelectTable: (table: any) => void;
  selectedId?: number;
}

export default function OccupiedList({ tables, onSelectTable, selectedId }: OccupiedListProps) {
  // Sirf occupied ya merged tables nikaalni hain
  const activeTables = tables.filter(t => t.status === 'occupied' || t.merge_id !== null);

  if (activeTables.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Active Sessions ({activeTables.length})
        </h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
        {activeTables.map((table) => {
          const isSelected = selectedId === table.id;
          const isMerged = table.merge_id !== null;

          return (
            <button
              key={table.id}
              onClick={() => onSelectTable(table)}
              className={`flex-shrink-0 min-w-[160px] p-4 rounded-[1.5rem] border-2 text-left transition-all duration-300 active:scale-95 ${
                isSelected 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200' 
                  : isMerged
                    ? 'bg-purple-50 border-purple-100 text-purple-700 hover:border-purple-300'
                    : 'bg-white border-white text-slate-700 shadow-sm hover:border-rose-200 shadow-slate-200/50'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-black italic tracking-tighter">T-{table.table_number}</span>
                {isMerged ? (
                  <Link2 size={14} className={isSelected ? 'text-purple-300' : 'text-purple-400'} />
                ) : (
                  <Flame size={14} className={isSelected ? 'text-rose-400' : 'text-rose-500'} />
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                   <Clock size={10} /> 12 MINS
                </div>
                {isMerged && (
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-100 text-purple-600'}`}>
                    LINKED
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}