import React from 'react';
import { Clock, Hash, Utensils, Bike, ShoppingBag } from 'lucide-react';

interface FooterProps {
  orderCount: number;
  criticalCount: number;
  counts: {
    dineIn: number;
    delivery: number;
    takeaway: number;
  };
}

export const KitchenFooter: React.FC<FooterProps> = ({ orderCount, criticalCount, counts }) => {
  return (
    <footer className="bg-[#0a0f18]/90 border-t border-white/5 p-4 px-8 backdrop-blur-xl flex justify-between items-center shrink-0">
      
      {/* Real-time Counts per Category */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2 group">
          <div className="size-2 rounded-full bg-blue-500 group-hover:animate-ping" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Dine-in: <span className="text-white ml-1 font-black">{counts.dineIn}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 group">
          <div className="size-2 rounded-full bg-purple-500 group-hover:animate-ping" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Delivery: <span className="text-white ml-1 font-black">{counts.delivery}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 group">
          <div className="size-2 rounded-full bg-orange-500 group-hover:animate-ping" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Takeaway: <span className="text-white ml-1 font-black">{counts.takeaway}</span>
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">Total Active</p>
            <p className="text-2xl font-black text-white leading-none">{orderCount}</p>
          </div>
          <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
             <Hash size={20} className="text-primary" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] font-black text-red-500/50 uppercase tracking-tighter leading-none mb-1">Critical (15m+)</p>
            <p className="text-2xl font-black text-red-500 leading-none">{criticalCount}</p>
          </div>
          <div className="size-10 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
             <Clock size={20} className="text-red-500 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};