import React, { useState, useEffect } from 'react';
import { X, Truck, Phone, User, Mail, MapPin, Loader2, ChevronDown, Activity } from 'lucide-react';
import axios from 'axios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  editData?: any; 
}

export const SupplierModal = ({ isOpen, onClose, onRefresh, editData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    status: 'active'
  });

  const API_BASE_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        contact_person: editData.contact_person || '',
        phone: editData.phone || '',
        email: editData.email || '',
        address: editData.address || '',
        status: editData.status || 'active'
      });
    } else {
      setFormData({ 
        name: '', contact_person: '', phone: '', email: '', address: '', status: 'active' 
      });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await axios.put(`${API_BASE_URL}/suppliers/${editData.id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/suppliers`, formData);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      console.error("Operation failed:", error.response?.data || error.message);
      alert("Error: Please check if all fields are correct and Database is connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
              <Truck size={24} className="text-emerald-400" /> 
              {editData ? 'Edit Supplier' : 'Register Vendor'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Inventory Management System</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Vendor Name & Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Vendor Name</label>
              <div className="relative">
                <Truck className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  required 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 focus:border-slate-900 outline-none font-bold transition-all"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Metro Wholesale"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Account Status</label>
              <div className="relative">
                <Activity className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-10 py-3.5 focus:border-slate-900 outline-none font-bold appearance-none cursor-pointer"
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Contact Person</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 focus:border-slate-900 outline-none font-bold"
                  value={formData.contact_person} 
                  onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  placeholder="Manager Name"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  required 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 focus:border-slate-900 outline-none font-bold"
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+92 300 0000000"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input 
                type="email"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 focus:border-slate-900 outline-none font-bold"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="vendor@example.com"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Office Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <textarea 
                rows={2}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3.5 focus:border-slate-900 outline-none font-bold resize-none"
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Full business address..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                editData ? 'Update Supplier Records' : 'Confirm Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};