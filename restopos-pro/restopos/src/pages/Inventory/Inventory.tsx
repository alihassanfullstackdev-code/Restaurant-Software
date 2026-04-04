import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, MapPin, RefreshCcw, Loader2 } from 'lucide-react';
import { InventoryStats } from '../../components/inventory/InventoryStats';
import { InventoryTable } from '../../components/inventory/InventoryTables';
import { IssuedModelStock } from '../../components/inventory/IssuedModelStock';
import { StockActionModal } from '../../components/inventory/StockActionModal';
import { StockModel } from '../../components/inventory/StockModel'; // <-- Ensure this import

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export interface Ingredient {
  id: number;
  name: string;
  opening_quantity: number; // Updated
  issued_quantity: number;  // Updated
  current_balance: number;   // Updated
  unit: string;
  min_stock_level: number;
  price_per_unit: number;
  total_price: number;
  category_id: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  category?: { id: number; name: string };
  supplier?: { id: number; name: string };
}

export default function Inventory() {
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATES
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false); // Separate state for kitchen issue
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const [activeMode, setActiveMode] = useState<'in' | 'out' | 'waste' | 'issue'>('in');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/stocks`);
      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- API: Kitchen Issue ---
  const handleIssueToKitchen = async (item: Ingredient, amount: number, notes: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/inventory/issued`, {
        stock_id: item.id,
        quantity: amount,
        notes: notes
      });
      if (res.data.status === 'success') {
        fetchData();
        setIsIssueModalOpen(false); // Close specific modal
        setSelectedItem(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Transfer fail ho gaya");
    }
  };

  // --- API: In/Out/Waste Transactions ---
  const handleTransactionSubmit = async (id: number, type: string, qty: number, reason: string) => {
    try {
      await axios.post(`${API_BASE_URL}/stocks/${id}/transaction`, { type, quantity: qty, reason });
      setIsActionModalOpen(false);
      fetchData();
    } catch (error: any) { alert(error.response?.data?.message || "Transaction failed"); }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm("Zaroori Note: Kya aap waqai is item ko hatana chahte hain?")) {
      try {
        await axios.delete(`${API_BASE_URL}/stocks/${id}`);
        fetchData();
      } catch (error) { alert("Delete failed."); }
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8 min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 px-2">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
            Inventory <span className="text-indigo-600">&</span> Stock
          </h1>
          <p className="text-slate-500 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <MapPin size={14} className="text-indigo-600" /> Faisalabad Kitchen Hub
          </p>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={fetchData} className="p-4 bg-white border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
            <RefreshCcw size={20} className={`${loading ? 'animate-spin' : 'text-slate-400'}`} />
          </button>
          <button 
            onClick={() => { setSelectedItem(null); setIsAddModalOpen(true); }} 
            className="flex-1 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-black transition-all"
          >
            <Plus size={20} className="text-indigo-400 mr-2 inline" /> Register New Item
          </button>
        </div>
      </div>

      <InventoryStats inventory={inventory} />

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading && inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="font-black text-slate-300 uppercase text-xs tracking-widest">Syncing Data...</p>
          </div>
        ) : (
          <InventoryTable
            inventory={inventory}
            onAction={(item) => { 
                setSelectedItem(item); 
                setIsIssueModalOpen(true); // Open Kitchen Modal
            }}
            onEdit={(item) => { 
                setSelectedItem(item); 
                setIsAddModalOpen(true); // Open Add/Edit Modal
            }}
            onDelete={handleDeleteItem}
          />
        )}
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. ADD / EDIT MODAL */}
      <StockModel 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onRefresh={fetchData}
        onSuccess={fetchData} 
        item={selectedItem} // Add Edit functionality support
      />

      {/* 2. KITCHEN ISSUE MODAL */}
      <IssuedModelStock
        item={selectedItem}
        isOpen={isIssueModalOpen}
        onClose={() => {
          setIsIssueModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={async (amount, notes) => {
          if (selectedItem) await handleIssueToKitchen(selectedItem, amount, notes);
        }}
      />

      {/* 3. OTHER ACTIONS (In/Out/Waste) */}
      <StockActionModal 
        isOpen={isActionModalOpen} 
        item={selectedItem} 
        mode={activeMode} 
        onClose={() => setIsActionModalOpen(false)} 
        onSuccess={handleTransactionSubmit} 
      />
    </div>
  );
}