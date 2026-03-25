import React from 'react';
import { Plus, Download } from 'lucide-react';

interface MenuHeaderProps {
  onAddClick: () => void;
  onExport: () => void; // <--- Interface mein add karein
}

export const MenuHeader = ({ onAddClick, onExport }: MenuHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-black uppercase text-slate-800">Menu Management</h1>
      
      <div className="flex gap-3">
        {/* Export Button */}
        <button 
          onClick={onExport} // <--- Yeh onClick yahan hona chahiye
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          Export CSV
        </button>

        {/* Add Product Button */}
        <button 
          onClick={onAddClick}
          className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
};