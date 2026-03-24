import React from 'react';

interface FloorSwitcherProps {
  floors: any[];
  activeId: number | null;
  onSelect: (id: number) => void;
}

export default function FloorSwitcher({ floors, activeId, onSelect }: FloorSwitcherProps) {
  return (
    <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3 overflow-x-auto pb-2">
      {floors.map(f => (
        <button 
          key={f.id} 
          onClick={() => onSelect(f.id)} 
          className={`text-[10px] sm:text-xs px-4 sm:px-10 py-3 sm:py-4 rounded-2xl font-black uppercase transition-all shadow-md whitespace-nowrap
            ${activeId === f.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
        >
          {f.name}
        </button>
      ))}
    </div>
  );
}