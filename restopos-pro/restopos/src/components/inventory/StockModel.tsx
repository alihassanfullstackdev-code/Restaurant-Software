import React, { useState, useEffect } from 'react';
import { X, Package, Layers, Hash, Weight, DollarSign, Truck, Calendar, ChevronDown, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  editData?: any;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const StockModal = ({ isOpen, onClose, onRefresh, editData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    quantity: 0,
    unit: 'kg',
    min_stock_level: 5,
    price_per_unit: 0,
    total_price: 0,
    supplier_id: '',
    expiry_date: '',
    status: 'in_stock'
  });

  // 1. Auto-calculate total price
  useEffect(() => {
    const total = (formData.quantity || 0) * (formData.price_per_unit || 0);
    setFormData(prev => ({ ...prev, total_price: total }));
  }, [formData.quantity, formData.price_per_unit]);

  // 2. Fetch Dropdown Data (Suppliers & Categories)
  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        try {
          const [supRes, catRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/suppliers`),
            axios.get(`${API_BASE_URL}/categories`)
          ]);
          setSuppliers(supRes.data);
          setCategories(catRes.data);
        } catch (err) {
          console.error("Error loading form options:", err);
        }
      };
      loadOptions();
    }
  }, [isOpen]);

  // 3. Handle Edit vs New Mode
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        ...editData,
        category_id: editData.category_id || '',
        supplier_id: editData.supplier_id || '',
        expiry_date: editData.expiry_date || ''
      });
    } else if (!editData && isOpen) {
      setFormData({
        name: '', category_id: '', quantity: 0, unit: 'kg',
        min_stock_level: 5, price_per_unit: 0, total_price: 0,
        supplier_id: '', expiry_date: '', status: 'in_stock'
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        await axios.put(`${API_BASE_URL}/stocks/${editData.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/stocks`, formData);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Check your inputs and try again!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[150] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl border border-white relative overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-10 bg-slate-900 text-white flex justify-between items-center relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.3em]">
              <Sparkles size={12} /> Stock Intelligence
            </div>
            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
              {editData ? 'Update' : 'Register'} <span className="text-primary">Inventory</span>
            </h3>
          </div>
          <button onClick={onClose} className="size-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            <div className="md:col-span-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block tracking-widest group-focus-within:text-primary">
                <Package size={14} className="inline mr-2" /> Material Name
              </label>
              <input required className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none font-bold transition-all"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Basmati Rice" />
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block tracking-widest">
                <Layers size={14} className="inline mr-2" /> Category
              </label>
              <select required className="w-full appearance-none bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none font-bold cursor-pointer transition-all"
                value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="relative group">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block tracking-widest">
                <Truck size={14} className="inline mr-2" /> Supplier
              </label>
              <select required className="w-full appearance-none bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none font-bold cursor-pointer transition-all"
                value={formData.supplier_id} onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}>
                <option value="">Select Vendor</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block tracking-widest">Qty</label>
                <input type="number" step="0.01" required className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-4 py-4 focus:border-slate-900 outline-none font-black text-center" 
                  value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block tracking-widest">Unit</label>
                <select className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-4 py-4 focus:border-slate-900 outline-none font-bold text-center appearance-none"
                  value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                  <option value="kg">KG</option><option value="ltr">LTR</option><option value="pcs">PCS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block tracking-widest">Expiry Date</label>
              <input type="date" className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none font-bold" 
                value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} />
            </div>

            <div className="md:col-span-2 bg-slate-50 rounded-[2rem] p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border border-slate-100">
               <div>
                 <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Price Per Unit</label>
                 <div className="relative">
                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input type="number" step="0.01" className="w-full bg-white border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:border-slate-900 outline-none font-black text-lg" 
                     value={formData.price_per_unit} onChange={(e) => setFormData({...formData, price_per_unit: Number(e.target.value)})} />
                 </div>
               </div>
               <div className="flex flex-col justify-center items-end px-4">
                 <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Total Value</span>
                 <span className="text-3xl font-black text-slate-900 tracking-tighter">Rs. {formData.total_price.toLocaleString()}</span>
               </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-rose-50/50 border-2 border-rose-100 rounded-[2rem] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200">
                    <AlertCircle size={20} />
                  </div>
                  <h4 className="font-black text-rose-600 uppercase text-xs tracking-wider">Alert Level</h4>
                </div>
                <input type="number" className="w-32 bg-white border-2 border-rose-200 rounded-xl px-4 py-3 focus:border-rose-500 outline-none font-black text-rose-600 text-center text-xl" 
                  value={formData.min_stock_level} onChange={(e) => setFormData({...formData, min_stock_level: Number(e.target.value)})} />
              </div>
            </div>
          </div>

          <button disabled={loading} className="group relative w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] overflow-hidden shadow-2xl transition-all active:scale-[0.98] disabled:opacity-70">
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" size={24} /> : (editData ? 'Update Intelligence' : 'Deploy To Stock')}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};