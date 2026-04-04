import React, { useState, useEffect } from 'react';
import { X, Layers, DollarSign, Truck, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

// 1. Interface update: item aur editData dono ko handle karein taake confusion na ho
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onSuccess: () => void;
  item?: any | null;      // Parent se 'item' aa raha hai
  editData?: any | null;  // Ya agar 'editData' aa raha hai
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const StockModel = ({ isOpen, onClose, onRefresh, item, editData }: Props) => {
  // Dono mein se jo bhi mil jaye usay 'activeData' keh dein
  const activeData = item || editData;

  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    opening_quantity: 0,
    unit: 'kg',
    min_stock_level: 5,
    price_per_unit: 0,
    supplier_id: '',
  });

  // 1. Load Dropdowns
  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const [supRes, catRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/get-suppliers`),
            axios.get(`${API_BASE_URL}/get-categories`)
          ]);
          setSuppliers(supRes.data || []);
          setCategories(catRes.data || []);
        } catch (err) {
          console.error("Dropdown load error", err);
        }
      };
      loadOptions();
    }
  }, [isOpen]);

  // 2. CRITICAL FIX: Prefill Logic
  // Jab bhi Modal khulay ya 'activeData' change ho, form fill karo
  useEffect(() => {
    if (isOpen) {
      if (activeData) {
        console.log("Prefilling data for:", activeData.name); // Debugging
        setFormData({
          name: activeData.name || '',
          category_id: activeData.category_id?.toString() || '',
          opening_quantity: activeData.current_balance || 0,
          unit: activeData.unit || 'kg',
          min_stock_level: activeData.min_stock_level || 5,
          price_per_unit: activeData.price_per_unit || 0,
          supplier_id: activeData.supplier_id?.toString() || '',
        });
      } else {
        // Reset if adding new
        setFormData({
          name: '', category_id: '', opening_quantity: 0, 
          unit: 'kg', min_stock_level: 5, price_per_unit: 0, supplier_id: ''
        });
      }
    }
  }, [isOpen, activeData]); // Dono par depend karein

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeData?.id) {
        // UPDATE
        await axios.put(`${API_BASE_URL}/stocks/${activeData.id}`, formData);
      } else {
        // CREATE
        await axios.post(`${API_BASE_URL}/stocks`, formData);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Action failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl border border-white overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-10 bg-slate-900 text-white flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-black italic uppercase">
              {activeData ? 'Update' : 'New'} <span className="text-indigo-400">Inventory</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 rounded-2xl hover:bg-indigo-500 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Material Name</label>
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-bold"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Category</label>
              <select required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-bold appearance-none"
                value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <Layers className="absolute right-4 top-[3.3rem] text-slate-300" size={18} />
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Supplier</label>
              <select required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none font-bold appearance-none"
                value={formData.supplier_id} onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}>
                <option value="">Select Vendor</option>
                {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
              </select>
              <Truck className="absolute right-4 top-[3.3rem] text-slate-300" size={18} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Qty</label>
                <input type="number" step="0.01" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-center font-black" 
                  value={formData.opening_quantity} onChange={(e) => setFormData({...formData, opening_quantity: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Unit</label>
                <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 font-bold text-center appearance-none"
                  value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                  <option value="kg">KG</option><option value="ltr">LTR</option><option value="pcs">PCS</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Price / Unit</label>
                <input type="number" className="bg-transparent font-black text-lg w-24 outline-none" 
                  value={formData.price_per_unit} onChange={(e) => setFormData({...formData, price_per_unit: Number(e.target.value)})} />
              </div>
              <div className="text-right">
                 <p className="font-black text-slate-900 leading-none">Rs. {(formData.opening_quantity * formData.price_per_unit).toLocaleString()}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-rose-50 border-2 border-rose-100 rounded-[2rem] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-rose-600 uppercase text-xs">Alert Level</h4>
                  </div>
                </div>
                <input type="number" className="w-20 bg-white border-2 border-rose-200 rounded-xl px-3 py-2 outline-none font-black text-rose-600 text-center" 
                  value={formData.min_stock_level} onChange={(e) => setFormData({...formData, min_stock_level: Number(e.target.value)})} />
              </div>
            </div>

          </div>

          <button disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : (activeData ? 'Update Intelligence' : 'Deploy To Stock')}
          </button>
        </form>
      </div>
    </div>
  );
};