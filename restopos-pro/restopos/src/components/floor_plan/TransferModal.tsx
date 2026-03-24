import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';

export default function TransferModal({ isOpen, onClose, selectedTable, availableTables, onTransfer }: any) {
  const [targetTableId, setTargetTableId] = useState<number | null>(null);

  if (!isOpen || !selectedTable) return null;

  // Filter out the current table and only show 'available' tables
  const validTransferTargets = availableTables.filter((t: any) => 
    t.id !== selectedTable.id && 
    t.status === 'available'
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-sans">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-800 italic">Transfer Table</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="bg-indigo-50 p-4 rounded-2xl mb-6 flex items-center gap-4 border border-indigo-100">
           <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-black">
             {selectedTable.table_number}
           </div>
           <ArrowRightLeft className="text-indigo-300" />
           <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">Select target table</p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto p-1">
          {validTransferTargets.length > 0 ? (
            validTransferTargets.map((table: any) => (
              <button
                key={table.id}
                onClick={() => setTargetTableId(table.id)}
                className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                  targetTableId === table.id 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md' 
                  : 'border-slate-50 text-slate-400 hover:border-indigo-200'
                }`}
              >
                {table.table_number}
              </button>
            ))
          ) : (
            <div className="col-span-3 py-10 text-center text-slate-400 text-xs font-bold uppercase italic">
              No free tables available
            </div>
          )}
        </div>

        <button 
          onClick={() => onTransfer(selectedTable.id, targetTableId)}
          disabled={!targetTableId}
          className="w-full mt-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-xl shadow-slate-200"
        >
          Process Transfer
        </button>
      </div>
    </div>
  );
}