import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  List, 
  Grid, 
  Edit2, 
  Trash2, 
  Lightbulb, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  image: string;
  status: boolean;
}

export default function MenuManagement() {
  // --- States ---
  const [items, setItems] = useState<MenuItem[]>([]); // Real items will go here
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const categories = [
    { name: 'All Items', icon: List },
    { name: 'Main Course', icon: List },
    { name: 'Appetizers', icon: List },
    { name: 'Desserts', icon: List },
    { name: 'Beverages', icon: List },
  ];

  // Dummy functions for actions
  const toggleStatus = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: !item.status } : item
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Menu Management</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your restaurant offerings, pricing, and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-slate-900 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Plus size={18} /> Add New Item
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</h3>
            <div className="flex flex-col gap-1">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    activeCategory === cat.name 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <cat.icon size={18} />
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="mb-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Filters</h3>
              <div className="flex flex-col gap-4 px-2">
                {['In Stock Only', 'Popular Items', 'Discounted Items'].map((filter, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="size-4 rounded border-slate-300 text-primary focus:ring-primary transition-all" 
                    />
                    <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{filter}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pro Tip Card */}
          <div className="rounded-2xl bg-slate-900 p-6 text-white overflow-hidden relative shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-primary" />
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Pro Tip</p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">Quickly update stock levels by toggling the status switch directly in the menu list.</p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Lightbulb size={120} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* List Controls */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button className="px-5 py-2 text-xs font-black uppercase tracking-widest text-primary bg-primary/10 rounded-lg">Active Items</button>
              <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Archived</button>
              <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Drafts</button>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">View:</span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'text-primary bg-primary/10 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-primary bg-primary/10 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Grid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Image</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Name & SKU</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Price</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.length > 0 ? items.map((item, i) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="h-14 w-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm text-slate-300 flex items-center justify-center font-bold text-[10px]">
                          {item.image ? <img src={item.image} className="h-full w-full object-cover" alt={item.name} /> : 'NO IMG'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{item.name}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">{item.sku}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={item.status} 
                            onChange={() => toggleStatus(item.id)}
                          />
                          <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                        </label>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                          <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center opacity-20">
                          <List size={40} className="mb-4" />
                          <p className="text-sm font-black uppercase tracking-[0.2em]">No menu items found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-5">
              <span className="text-xs font-bold text-slate-400">Showing {items.length} items</span>
              <div className="flex items-center gap-1">
                <button className="size-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-primary"><ChevronLeft size={16} /></button>
                <button className="size-8 rounded-lg bg-primary text-xs font-black text-slate-900 shadow-sm">1</button>
                <button className="size-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-primary"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Items" value={items.length.toLocaleString()} subText="+0 this month" color="text-primary" icon={<Plus size={20} />} bgColor="bg-primary/10" />
            <StatCard label="Active Categories" value={categories.length - 1} subText="Steady" color="text-blue-500" icon={<List size={20} />} bgColor="bg-blue-500/10" />
            <StatCard label="Out of Stock" value={items.filter(i => !i.status).length} subText="Requires attention" color="text-red-600" icon={<AlertTriangle size={20} />} bgColor="bg-red-500/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Component ---
const StatCard = ({ label, value, subText, color, icon, bgColor }: any) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</span>
      <div className={`p-2 ${bgColor} rounded-lg ${color}`}>{icon}</div>
    </div>
    <p className={`text-3xl font-black ${color === 'text-red-600' ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
    <p className={`text-[10px] ${color} font-black uppercase tracking-widest mt-2`}>{subText}</p>
  </div>
);