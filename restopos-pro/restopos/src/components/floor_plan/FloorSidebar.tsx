import React from 'react';
import { 
  MoveHorizontal, 
  GitMerge, 
  Split, 
  LogOut, 
  Edit3, 
  Trash2,
  Receipt,
  Divide,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ResturantTable } from '../../types';

interface FloorSidebarProps {
  selectedTable: ResturantTable | null;
  onAction: (type: 'transfer' | 'merge' | 'split' | 'unmerge') => void;
  onEdit?: () => void;
  fetchData: () => void;
  onStartOrder?: (tableId: number) => void;
}

export default function FloorSidebar({ selectedTable, onAction, onEdit, fetchData, onStartOrder }: FloorSidebarProps) {
  
  const handleDelete = async () => {
    if (!selectedTable) return;
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Table will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/tables/${selectedTable.id}`);
        Swal.fire('Deleted!', 'Table has been removed.', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Error', 'Could not delete table', 'error');
      }
    }
  };

  if (!selectedTable) {
    return (
      <aside className="w-full lg:w-96 bg-white border-l border-slate-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Receipt className="text-slate-300" size={32} />
        </div>
        <p className="text-slate-400 font-medium">Select a table to see details</p>
      </aside>
    );
  }

  const isOccupied = selectedTable.status === 'occupied';

  return (
    <aside className="w-full lg:w-96 bg-white border-l border-slate-200 p-8 flex flex-col shadow-2xl z-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">
            Table {selectedTable.table_number}
          </h2>
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-2 ${
            isOccupied ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {selectedTable.status}
          </span>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <>
              <button onClick={onEdit} className="p-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all">
                <Edit3 size={18} />
              </button>
              <button onClick={handleDelete} className="p-3 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-2xl transition-all text-rose-500">
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Operations</p>
        
        {/* Transfer Button */}
        <button 
          onClick={() => onAction('transfer')}
          className="w-full flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group"
        >
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-blue-500">
            <MoveHorizontal size={20} />
          </div>
          <span className="font-bold text-sm text-left flex-1">Transfer Table</span>
        </button>

        {/* Merge Button */}
        <button 
          onClick={() => onAction('merge')}
          className="w-full flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 hover:bg-indigo-600 hover:text-white transition-all group"
        >
          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-indigo-500">
            <GitMerge size={20} />
          </div>
          <span className="font-bold text-sm text-left flex-1">Merge Tables</span>
        </button>

        {/* Unmerge Button (Visible when merged) */}
        {selectedTable?.merge_id && (
          <button 
            onClick={() => onAction('unmerge')}
            className="w-full flex items-center gap-4 p-5 rounded-[2rem] bg-slate-50 hover:bg-amber-500 hover:text-white transition-all group"
          >
            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-amber-500">
              <RefreshCw size={20} />
            </div>
            <span className="font-bold text-sm text-left flex-1">Unmerge Table</span>
          </button>
        )}

        {/* Split Bill Button (Visible only when Occupied) */}
        {isOccupied && (
          <button 
            onClick={() => onAction('split')}
            className="w-full flex items-center gap-4 p-5 rounded-[2rem] bg-rose-50 hover:bg-rose-600 hover:text-white transition-all group"
          >
            <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-rose-500">
              <Divide size={20} className="text-rose-500 group-hover:text-white" />
            </div>
            <span className="font-bold text-sm text-left flex-1">Split Bill</span>
          </button>
        )}
      </div>

      {/* Footer Action: POS Integration */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <button 
          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl"
          onClick={() => {
            const tableToUse = selectedTable.merge_id || selectedTable.id;
            if (onStartOrder) {
              onStartOrder(tableToUse);
            } else {
              window.location.href = `/pos/order/${tableToUse}`;
            }
          }}
        >
          {isOccupied ? 'View Order' : 'Start New Order'}
          <LogOut size={18} className="rotate-180" />
        </button>
      </div>
    </aside>
  );
}