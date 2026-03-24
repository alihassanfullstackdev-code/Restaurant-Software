import React from 'react';
import { BookOpen } from 'lucide-react';

interface HeaderProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  setLoading: (loading: boolean) => void;
  // Nayi props add ki hain
  currentView: 'active' | 'history'; 
  setView: (view: 'active' | 'history') => void;
}

export const KitchenHeader: React.FC<HeaderProps> = ({ 
  activeFilter, 
  setActiveFilter, 
  setLoading,
  currentView,
  setView 
}) => {
  const filters = ['All', 'Dine-in', 'Delivery', 'Takeaway'];

  return (
    <header className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 bg-[#0a0f18]/80 backdrop-blur-md px-6 py-4 gap-4 shrink-0">
      <div className="flex items-center gap-6 w-full md:w-auto">
        <div className="flex items-center gap-3 text-emerald-500">
          <BookOpen size={24} className="animate-pulse text-primary" />
          <h2 className="text-xl font-black tracking-tighter uppercase">Kitchen<span className="text-white">OS</span></h2>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-6">
          <button 
            onClick={() => setView('active')}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentView === 'active' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Active Orders
          </button>
          <button 
            onClick={() => setView('history')}
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentView === 'history' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
          >
            History
          </button>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 cursor-not-allowed opacity-50">
            Inventory
          </button>
        </nav>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        {/* Filter Buttons - Sirf Active Orders mein dikhayein (Optional) */}
        {currentView === 'active' && (
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-1 shrink-0">
                {filters.map(f => (
                <button 
                    key={f}
                    onClick={() => { 
                    setLoading(true); 
                    setActiveFilter(f); // Jab ye change hoga, useEffect fetchOrders dobara call karega
                    }}
                    className={`px-4 md:px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f ? 'bg-primary text-slate-900' : 'text-slate-400'
                    }`}
                >
                    {f}
                </button>
                ))}
          </div>
        )}
        
        <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-white">Chef Ali</p>
            <p className="text-[9px] text-primary font-bold uppercase italic leading-none">Head Chef</p>
          </div>
         <img 
            src="https://ui-avatars.com/api/?name=Ali+Hassan&background=10b981&color=fff" 
            alt="Chef Ali" 
            className="w-full h-full object-cover" 
            />
      </div>
    </div>
    </header>
  );
};