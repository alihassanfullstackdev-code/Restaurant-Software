import React, { useState, useEffect } from 'react';
import { X, Save, Hash, Users, Activity } from 'lucide-react';

export default function EditTableModal({ isOpen, onClose, table, onUpdate }: any) {
  const [formData, setFormData] = useState({ table_number: '', seating_capacity: 4, status: 'available' });

  useEffect(() => {
    if (table) {
      setFormData({
        table_number: table.table_number || '',
        seating_capacity: table.seating_capacity || 4,
        status: table.status || 'available'
      });
    }
  }, [table]);

  if (!isOpen || !table) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-800 italic">Modify Table</h3>
          <button onClick={onClose} className="p-2 hover:rotate-90 transition-all"><X /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onUpdate(table.id, formData); }} className="space-y-8">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1">Table Name</label>
            <input 
              type="text" 
              value={formData.table_number}
              onChange={(e) => setFormData({...formData, table_number: e.target.value})}
              className="w-full p-5 bg-slate-50 border-2 rounded-[1.5rem] font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1">Live Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-5 bg-slate-50 border-2 rounded-[1.5rem] font-bold"
            >
              <option value="available">🟢 Available</option>
              <option value="occupied">🔴 Occupied</option>
              <option value="dirty">🟠 Dirty</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block ml-1">Max Capacity</label>
            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[1.5rem] border-2">
              <button type="button" onClick={() => setFormData({...formData, seating_capacity: Math.max(1, formData.seating_capacity - 1)})} className="w-12 h-12 bg-white rounded-xl shadow-sm font-black">-</button>
              <span className="flex-1 text-center font-black">{formData.seating_capacity}</span>
              <button type="button" onClick={() => setFormData({...formData, seating_capacity: formData.seating_capacity + 1})} className="w-12 h-12 bg-white rounded-xl shadow-sm font-black">+</button>
            </div>
          </div>

          <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase shadow-xl hover:bg-indigo-600 transition-all">
            Update Changes
          </button>
        </form>
      </div>
    </div>
  );
}