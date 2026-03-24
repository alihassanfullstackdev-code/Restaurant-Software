import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Layout } from 'lucide-react';

import { Floor } from '../../types';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableNumber: string, floorId: number) => Promise<void>;
  floors?: Floor[];
  activeFloorId?: number | null;
}

export default function AddTableModal({ isOpen, onClose, onAdd, floors = [], activeFloorId }: AddTableModalProps) {
  const [tableNumber, setTableNumber] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const defaultFloor = activeFloorId ? String(activeFloorId) : (floors?.[0]?.id ? String(floors[0].id) : '');
      setSelectedFloor(defaultFloor);
      setTableNumber('');
    }
  }, [isOpen, activeFloorId, floors]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-[450px] rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 italic">Add New Table</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full"><X /></button>
        </div>

        <div className="space-y-6">
          <select 
            className="w-full p-5 bg-slate-50 border-2 rounded-[1.5rem] font-bold"
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
          >
            <option value="">Select Floor</option>
            {Array.isArray(floors) && floors.length > 0 ? floors.map((f: any) => (
              <option key={f.id} value={String(f.id)}>{f.name}</option>
            )) : <option value="" disabled>No floors available</option>}
          </select>

          <input 
            type="text" 
            placeholder="Table Number (e.g. T-10)"
            className="w-full p-5 bg-slate-50 border-2 rounded-[1.5rem] font-bold"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
        </div>

        <button 
          disabled={!tableNumber.trim() || !selectedFloor || isSubmitting || floors.length === 0}
          onClick={async () => {
            if (!tableNumber.trim() || !selectedFloor || floors.length === 0) return;
            setIsSubmitting(true);
            try {
              await onAdd(tableNumber.trim(), Number(selectedFloor));
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="w-full mt-10 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase hover:bg-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Table'}
        </button>
      </div>
    </div>
  );
}