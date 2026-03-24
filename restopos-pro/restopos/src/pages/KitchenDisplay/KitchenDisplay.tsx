import React, { useState } from 'react';
import { BookOpen, Cloud, Filter } from 'lucide-react';
import { OrderCard } from '../../components/OrderCard';

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<any[]>([]); // Khali array for real data
  const [activeFilter, setActiveFilter] = useState('All');

  // Order complete handle karne ka function
  const handleComplete = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="-m-4 md:-m-8 flex flex-col h-[calc(100dvh-64px)] bg-[#0a0f18] text-slate-100 overflow-hidden">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 bg-[#0a0f18]/80 backdrop-blur-md px-6 py-4 gap-4 shrink-0">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen size={24} className="animate-pulse" />
            <h2 className="text-xl font-black tracking-tighter uppercase">Kitchen<span className="text-white">OS</span></h2>
          </div>
          
          <nav className="hidden lg:flex items-center gap-6">
            {['Active Orders', 'History', 'Inventory'].map((tab) => (
              <button key={tab} className={`text-[10px] font-black uppercase tracking-widest transition-colors ${tab === 'Active Orders' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters & User */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-1 shrink-0">
            {['All', 'Dine-in', 'Delivery'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 md:px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-primary text-slate-900' : 'text-slate-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase">Chef Ramsey</p>
              <p className="text-[9px] text-primary font-bold uppercase italic">Head Chef</p>
            </div>
            <div className="size-9 rounded-full border-2 border-primary overflow-hidden">
              <img src="https://images.unsplash.com/photo-1583394293214-28dea15ee548?w=100" alt="Chef" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Board - Scrollable Grid */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-gradient-to-b from-transparent to-slate-900/20">
        {orders.length > 0 ? (
          <div className="flex h-full p-4 md:p-8 gap-6 min-w-max">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onComplete={handleComplete} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20">
            <div className="size-20 rounded-full border-4 border-dashed border-slate-500 flex items-center justify-center mb-4">
              <Filter size={32} />
            </div>
            <p className="font-black uppercase tracking-[0.4em] text-sm">Waiting for Orders</p>
          </div>
        )}
      </main>

      {/* Footer Stats */}
      <footer className="bg-[#0a0f18] border-t border-white/5 px-6 py-3 shrink-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <StatBadge color="bg-primary" label="New" count={orders.length} />
            <StatBadge color="bg-orange-500" label="Critical" count={0} />
            <StatBadge color="bg-slate-500" label="Avg Time" count="14m" />
          </div>
          
          <div className="flex items-center gap-4 text-slate-500">
            <div className="flex items-center gap-2">
              <Cloud size={14} className="text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary">Live Sync</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Small helper for footer stats
const StatBadge = ({ color, label, count }: any) => (
  <div className="flex items-center gap-2">
    <div className={`size-2 rounded-full ${color} shadow-lg shadow-current`}></div>
    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{label}: <span className="text-slate-100">{count}</span></span>
  </div>
);