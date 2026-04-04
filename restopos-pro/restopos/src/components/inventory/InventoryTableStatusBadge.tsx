import React from 'react';

interface BadgeProps {
  status: string;
}

export const InventoryTableStatusBadge = ({ status }: BadgeProps) => {
  const isLow = status === 'low_stock';
  
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-colors ${
      isLow 
        ? 'bg-amber-50 text-amber-600 border-amber-100' 
        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
    }`}>
      {status.replace('_', ' ')}
    </span>
  );
};