import React from 'react';
import { Clock, AlertTriangle, BookOpen, Utensils, Zap } from 'lucide-react'
export interface OrderCardProps {  // <--- Yahan 'export' add karein
  order: any;
  onComplete: (id: string) => void;
}
export const OrderCard: React.FC<OrderCardProps> = ({ order, onComplete }) => {
  const isCritical = order.is_critical || false; 
  
  return (
    /* w-full on mobile, fixed 380px on lg */
    <div className={`flex flex-col w-full lg:w-[380px] h-auto lg:h-[550px] bg-[#111827]/90 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] border-2 
      ${isCritical ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/10 shadow-2xl'} 
      overflow-hidden shrink-0 transition-all duration-300 hover:border-primary/40 group`}>
      
      {/* Header */}
      <div className="p-5 lg:p-7 pb-3 lg:pb-4 flex justify-between items-start">
        <div className="min-w-0">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest mb-2
            ${order.typeLabel === 'DINE-IN' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
            {order.typeLabel}
          </span>
          <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tighter truncate">#{order.id}</h3>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 
          ${isCritical ? 'text-red-400' : 'text-primary'}`}>
          <Clock size={16} className={isCritical ? 'animate-pulse' : ''} />
          <span className="text-sm lg:text-lg font-black font-mono tracking-tighter">{order.time}</span>
        </div>
      </div>

      {/* Items Section */}
      <div className="flex-1 px-5 lg:px-7 py-2 overflow-y-auto max-h-[350px] lg:max-h-none custom-scrollbar">
        <div className="space-y-2 lg:space-y-3">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 lg:gap-4 p-2.5 lg:p-3 rounded-2xl hover:bg-white/5 transition-colors group/item border border-transparent hover:border-white/5">
              <div className={`size-8 lg:size-11 rounded-xl shrink-0 flex items-center justify-center font-black text-sm lg:text-xl
                ${item.isMain ? 'bg-primary text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {item.qty}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 text-sm lg:text-lg leading-none truncate group-hover/item:text-primary transition-colors">
                  {item.name}
                </p>
                {item.notes && <p className="text-[10px] lg:text-xs text-orange-400/80 italic mt-1">{item.notes}</p>}
              </div>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div className="mt-4 p-3 lg:p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
            <p className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1">Kitchen Note</p>
            <p className="text-xs lg:text-sm text-slate-400 leading-tight">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-5 lg:p-7 mt-auto">
        <button 
          onClick={() => onComplete(order.id)}
          className={`w-full py-4 lg:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs transition-all active:scale-95 shadow-xl
            ${isCritical ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-primary text-slate-950 shadow-primary/20 hover:bg-emerald-400'}`}
        >
          Mark as Ready
        </button>
      </div>
    </div>
  );
};