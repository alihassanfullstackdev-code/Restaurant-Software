import React, { useState } from 'react';
import { X, GitMerge } from 'lucide-react';

export default function MergeModal({ isOpen, onClose, selectedTable, tables, onMerge }: any) {
  const [secondaryId, setSecondaryId] = useState<number | null>(null);

  if (!isOpen || !selectedTable) return null;

  // LOGIC: Sirf wo tables jo Free hain aur kisi group ka hissa nahi hain
  const availableToMerge = tables.filter((t: any) => 
    t.id !== selectedTable.id && 
    t.status === 'available' && 
    t.merge_id === null
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-t-8 border-purple-500">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-800 italic">Merge Table {selectedTable.table_number}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>
        
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Select a free table to link</p>
        
        <div className="grid grid-cols-3 gap-3 mb-8 max-h-[250px] overflow-y-auto p-1">
          {availableToMerge.length > 0 ? (
            availableToMerge.map((table: any) => (
              <button
                key={table.id}
                onClick={() => setSecondaryId(table.id)}
                className={`p-4 rounded-2xl border-2 font-black transition-all ${
                  secondaryId === table.id 
                  ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-md' 
                  : 'border-slate-50 text-slate-400 hover:border-purple-200'
                }`}
              >
                {table.table_number}
              </button>
            ))
          ) : (
            <div className="col-span-3 py-10 text-center text-slate-400 text-xs font-bold uppercase italic">
              No available tables found
            </div>
          )}
        </div>

        <button 
          onClick={() => onMerge(selectedTable.id, secondaryId)}
          disabled={!secondaryId}
          className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-100"
        >
          <GitMerge size={18} /> Confirm Merge
        </button>
      </div>
    </div>
  );
}