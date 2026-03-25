import React from 'react';
import { Search, List, Package, Lightbulb } from 'lucide-react';

export const MenuSidebar = ({ categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery }: any) => (
  <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Search Menu</h3>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="e.g. Zinger Burger" 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h3 className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</h3>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => setActiveCategory('All')}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
        >
          <List size={18} /> All Items
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id.toString())}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeCategory === cat.id.toString() ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
          >
            <Package size={18} /> {cat.name}
          </button>
        ))}
      </div>
    </div>

    <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-amber-400" />
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Quick Tip</p>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">Out of stock? Just toggle the status switch to hide it from POS instantly.</p>
      </div>
    </div>
  </aside>
);