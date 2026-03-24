import React, { useState } from 'react';
import { X, Divide, Users, Receipt } from 'lucide-react';

export default function SplitBillModal({ isOpen, onClose, table, onSplit }: any) {
  const [parts, setParts] = useState(2);
  
  // Maan letay hain ke order ka total table object mein aa raha hai
  const totalAmount = table?.current_order?.total_amount || 0;

  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
              <Divide size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 italic">Split Bill</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 text-center border-2 border-dashed border-slate-200">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Amount</p>
          <h2 className="text-4xl font-black text-slate-900">Rs. {totalAmount}</h2>
        </div>

        <div className="space-y-6">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
            <Users size={12} /> Number of Persons
          </label>
          
          <div className="flex items-center gap-6 bg-slate-50 p-3 rounded-[1.5rem] border-2 border-slate-100">
            <button 
              onClick={() => setParts(Math.max(2, parts - 1))}
              className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm text-2xl font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
            > - </button>
            
            <span className="flex-1 text-center text-3xl font-black text-slate-800">{parts}</span>
            
            <button 
              onClick={() => setParts(parts + 1)}
              className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-sm text-2xl font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
            > + </button>
          </div>

          <div className="pt-4 border-t-2 border-slate-50">
            <div className="flex justify-between items-center bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
              <span className="font-bold text-emerald-700">Each Person Pays:</span>
              <span className="text-xl font-black text-emerald-800">Rs. {(totalAmount / parts).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSplit(table.current_order.id, parts)}
          className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
        >
          <Receipt size={18} /> Confirm Split
        </button>
      </div>
    </div>
  );
}