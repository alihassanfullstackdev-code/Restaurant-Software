import React from 'react';
import { Clock, AlertTriangle, BookOpen } from 'lucide-react';

interface OrderItem {
  qty: number;
  name: string;
  notes?: string;
  isMain?: boolean;
}

interface OrderCardProps {
  order: any;
  onComplete: (id: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onComplete }) => {
  const isDelayed = order.status === 'delayed' || order.status === 'critical';
  
  return (
    <div className={`flex flex-col w-full sm:w-[350px] bg-slate-900/50 rounded-2xl border-t-4 ${isDelayed ? 'border-orange-500' : 'border-primary'} shadow-2xl overflow-hidden shrink-0 transition-all hover:scale-[1.02]`}>
      {/* Card Header */}
      <div className={`p-4 ${isDelayed ? 'bg-orange-500/10' : 'bg-primary/10'} flex justify-between items-center border-b border-white/5`}>
        <div>
          <h3 className="text-lg font-black text-slate-100">{order.id}</h3>
          <p className={`text-[10px] ${isDelayed ? 'text-orange-500' : 'text-primary'} font-black uppercase tracking-widest mt-0.5`}>
            {order.typeLabel}
          </p>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1.5 ${isDelayed ? 'text-orange-500' : 'text-primary'}`}>
            {isDelayed ? <AlertTriangle size={16} /> : <Clock size={16} />}
            <span className="text-sm font-black">{order.time}</span>
          </div>
        </div>
      </div>
      
      {/* Items List */}
      <div className="flex-1 p-5 space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar">
        <div className="space-y-4">
          {order.items.map((item: OrderItem, i: number) => (
            <div key={i} className="flex gap-4">
              <span className={`size-7 rounded-lg shrink-0 ${item.isMain ? 'bg-primary text-slate-900' : 'bg-white/10 text-primary'} flex items-center justify-center font-black text-sm`}>
                {item.qty}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-slate-100 text-sm truncate">{item.name}</p>
                {item.notes && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{item.notes}</p>}
              </div>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Instructions</p>
            <p className="text-[11px] text-slate-300 leading-tight">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 bg-slate-900/80 border-t border-white/5 flex gap-2">
        <button 
          onClick={() => onComplete(order.id)}
          className={`flex-1 ${isDelayed ? 'bg-orange-500' : 'bg-primary'} text-slate-900 font-black py-3 rounded-xl transition-all text-[10px] uppercase tracking-widest active:scale-95`}
        >
          Mark Ready
        </button>
        <button className="px-4 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl transition-colors">
          <BookOpen size={18} />
        </button>
      </div>
    </div>
  );
};