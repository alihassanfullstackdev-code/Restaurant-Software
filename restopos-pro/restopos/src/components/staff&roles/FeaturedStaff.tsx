import React from 'react';
import { Star } from 'lucide-react';

export default function FeaturedStaff() {
  return (
    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
      <div className="relative z-10">
        <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Staff of the Month</h4>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="size-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 group-hover:border-primary/50 transition-all duration-500 group-hover:rotate-12">
            <Star size={24} />
          </div>
          <div>
            <p className="text-lg font-black text-white/30 tracking-tight leading-none italic">Pending Audit...</p>
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest mt-1">Performance Data Required</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-all">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Orders Done</p>
            <p className="text-xl font-black text-white/10 group-hover:text-white/40">---</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-all">
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Avg Rating</p>
            <p className="text-xl font-black text-white/10 group-hover:text-white/40">---</p>
          </div>
        </div>
      </div>
      
      {/* Dynamic Background Glow */}
      <div className="absolute -right-12 -bottom-12 size-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/15 transition-all duration-700"></div>
    </div>
  );
}