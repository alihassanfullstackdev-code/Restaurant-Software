import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, 
  Loader2, 
  RefreshCcw, 
  UtensilsCrossed, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface KitchenItem {
  stock_id: number;
  item_name: string;
  category_name: string;
  total_qty: number;
  unit: string;
  last_issued_at: string;
}

export const KitchenInventory = () => {
  const [items, setItems] = useState<KitchenItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKitchenData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/kitchen-stock`);
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching kitchen inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 lg:p-12 text-slate-200 font-sans">
      {/* --- Top Navigation / Header --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            <UtensilsCrossed className="text-indigo-500" size={36} />
            Kitchen <span className="text-slate-500">Pantry</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">
            Real-time Issued Stock Monitoring
          </p>
        </div>

        <button 
          onClick={fetchKitchenData}
          className="group flex items-center gap-3 bg-slate-800/50 hover:bg-indigo-600 p-2 pr-6 rounded-2xl border border-slate-700 hover:border-indigo-400 transition-all active:scale-95"
        >
          <div className="bg-slate-700 group-hover:bg-indigo-500 p-3 rounded-xl transition-colors">
            <RefreshCcw size={20} className={`${loading ? 'animate-spin' : ''}`} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-white">Refresh Stock</span>
        </button>
      </div>

      {/* --- Main Content --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Syncing with Main Store...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item.stock_id} 
              className="bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-[2.5rem] transition-all group hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)]"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="size-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                  <Package size={24} />
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Issued</div>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-4xl font-black text-white tracking-tighter">{item.total_qty}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase italic">{item.unit}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.category_name}</p>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{item.item_name}</h3>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter italic">
                    Recv: {new Date(item.last_issued_at).toLocaleDateString()}
                  </span>
                </div>
                <button className="text-indigo-500 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto text-center py-40 opacity-40">
          <div className="bg-slate-800 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <Package size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase italic italic">Pantry is Empty</h2>
          <p className="text-xs font-bold mt-2 uppercase tracking-widest">No stock has been issued to the kitchen yet.</p>
        </div>
      )}
    </div>
  );
};