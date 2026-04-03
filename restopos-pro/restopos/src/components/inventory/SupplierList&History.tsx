import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';

export const SidePanels = ({ suppliers, history }: { suppliers: any[], history: any[] }) => (
  <div className="flex flex-col gap-8">
    {/* Suppliers */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h3 className="font-black text-lg text-slate-900">Top Suppliers</h3>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest">All</button>
      </div>
      <div className="p-4 space-y-3">
        {suppliers.map((s, i) => (
          <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-primary/30 hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary"><s.icon size={20} /></div>
              <div className="text-left"><p className="text-sm font-black text-slate-900">{s.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{s.type}</p></div>
            </div>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
    </div>

    {/* History */}
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/30"><h3 className="font-black text-lg text-slate-900">Recent History</h3></div>
      <div className="p-6">
        {history.length > 0 ? (
          <div className="relative pl-8 border-l-2 border-slate-100 space-y-8">
            {history.map((item, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[41px] top-1 size-5 rounded-full ${item.color} border-4 border-white shadow-sm`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{item.date}</p>
                <p className="text-sm font-black text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{item.meta}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 opacity-30"><FileText size={32} className="mx-auto mb-2" /><p className="text-[10px] font-black uppercase tracking-widest">Empty</p></div>
        )}
      </div>
    </div>
  </div>
);