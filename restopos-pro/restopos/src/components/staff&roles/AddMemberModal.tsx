import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { X, Upload, CheckCircle2, Loader2 } from 'lucide-react';

interface AddMemberModalProps {
  onClose: () => void;
  onRefresh: () => void;
  initialData?: any; // 🔥 Optional prop for Edit mode
}

interface FormDataType {
  full_name: string;
  email: string;
  phone_number: string;
  role_id: string;
  salary: string;
  joining_date: string;
  status: string;
  cnic_number: string;
  address: string;
  emergency_contact: string;
  profile_image: File | null;
  cnic_front_image: File | null;
  cnic_back_image: File | null;
}

interface Role {
  id: number;
  role_name: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function AddMemberModal({ onClose, onRefresh, initialData }: AddMemberModalProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormDataType>({
    full_name: '', email: '', phone_number: '', role_id: '',
    salary: '', joining_date: '', status: 'active',
    cnic_number: '', address: '', emergency_contact: '',
    profile_image: null, cnic_front_image: null, cnic_back_image: null
  });

  // 1. Fetch Roles & Fill Data for Edit Mode
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${API_URL}/staff-roles`);
        setRoles(res.data);
      } catch (err) {
        setError("Failed to load roles from database");
      }
    };

    fetchRoles();

    // 🔥 Edit Mode: Agar initialData hai toh state update karo
    if (initialData) {
      setFormData({
        ...initialData,
        role_id: initialData.role_id?.toString() || '',
        // File fields ko null rakhenge kyunki hum string path ko File object nahi bana saktay
        profile_image: null,
        cnic_front_image: null,
        cnic_back_image: null
      });
    }
  }, [initialData]);

  const handleCNICChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 13) val = val.slice(0, 13);
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`;
    }
    setFormData({ ...formData, cnic_number: formatted });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormDataType) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    
    // 🔥 Sabhi fields append karo, files sirf tab append karo jab wo change hon
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        // Agar key file hai toh sirf tab append karo jab wo File object ho (not null/string)
        if (['profile_image', 'cnic_front_image', 'cnic_back_image'].includes(key)) {
          if (value instanceof File) {
            data.append(key, value);
          }
        } else {
          data.append(key, value as string);
        }
      }
    });

    try {
      if (initialData) {
        // 🔥 Edit Request: Method Spoofing for Laravel
        data.append('_method', 'PUT');
        await axios.post(`${API_URL}/staff/${initialData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Add Request
        await axios.post(`${API_URL}/staff`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onRefresh();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Check fields and try again");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map(r => ({ value: r.id.toString(), label: r.role_name }));
  
  // React Select Default Value for Edit Mode
  const defaultRole = roleOptions.find(opt => opt.value === formData.role_id);

  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#f8fafc',
      borderColor: state.isFocused ? '#FFC107' : '#f1f5f9',
      borderRadius: '0.75rem',
      padding: '3px',
      '&:hover': { borderColor: '#FFC107' }
    })
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tight text-slate-900">
              {initialData ? 'Update Staff Member' : 'Add New Staff'}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Employee Personal & Work Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {error && <div className="col-span-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold italic uppercase tracking-tighter flex items-center gap-2">
            <Loader2 className="animate-spin" size={12} /> {error}
          </div>}

          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Full Name</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Email Address</label>
            <input type="email" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Designation</label>
            <Select 
              options={roleOptions} 
              styles={customStyles} 
              value={defaultRole}
              placeholder="Select Role..." 
              onChange={(opt: any) => setFormData({...formData, role_id: opt?.value || ''})} required 
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">CNIC Number</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm"
              value={formData.cnic_number} onChange={handleCNICChange} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Phone Number</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm"
              value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Emergency Contact</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm"
              value={formData.emergency_contact} onChange={e => setFormData({...formData, emergency_contact: e.target.value})} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Monthly Salary (PKR)</label>
            <input type="number" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm"
              value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Joining Date</label>
            <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm text-slate-500"
              value={formData.joining_date} onChange={e => setFormData({...formData, joining_date: e.target.value})} required />
          </div>

          <div className="col-span-2">
            <label className="text-[10px] font-black uppercase ml-1 mb-1 block text-slate-400">Home Address</label>
            <input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 font-medium text-sm"
              value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
          </div>

          <div className="col-span-2 grid grid-cols-3 gap-3 mt-2">
            {[
              { id: 'profile_image', label: 'Profile' },
              { id: 'cnic_front_image', label: 'CNIC Front' },
              { id: 'cnic_back_image', label: 'CNIC Back' }
            ].map((file) => (
              <label key={file.id} className={`flex flex-col items-center justify-center p-3 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${formData[file.id as keyof FormDataType] instanceof File ? 'border-primary bg-primary/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                {formData[file.id as keyof FormDataType] instanceof File ? <CheckCircle2 className="text-primary" size={18} /> : <Upload className="text-slate-300" size={18} />}
                <span className="text-[8px] font-black uppercase text-slate-500 mt-1">{file.label}</span>
                <input type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, file.id as keyof FormDataType)} />
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading} className="col-span-2 bg-primary mt-4 p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 text-slate-900 flex items-center justify-center gap-2">
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? 'Processing...' : initialData ? 'Update Member' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}