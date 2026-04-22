import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ModalProps {
  roles: any[];
  permissions: any[];
  matrix: any; 
  onClose: () => void;
  refreshData: () => void;
  editData: any | null;
}

export default function UserAddModal({ roles, permissions, matrix, onClose, refreshData, editData }: ModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 1. EDIT MODE: Load Current DB State ---
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        email: editData.email || '',
        password: '', 
      });

      if (editData.role_id) {
        setSelectedRole(editData.role_id.toString());
        
        // FIX: Yahan Matrix merge nahi karni edit ke waqt. 
        // Sirf wahi dikhana hai jo DB mein user ke pass hai.
        const dbPerms = editData.permissions?.map((p: any) => p.id) || [];
        setSelectedPermissions(dbPerms);
      }
    } else {
      setFormData({ name: '', email: '', password: '' });
      setSelectedRole('');
      setSelectedPermissions([]);
    }
  }, [editData]); 

  // --- 2. DROPDOWN CHANGE: Auto-fill from Matrix ---
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    if (!roleId) {
      setSelectedPermissions([]);
      return;
    }

    // Role badalte hi hum "Assume" kar rahe hain ke user ab naye default perms chahta hai
    if (matrix && matrix[roleId]) {
      setSelectedPermissions(matrix[roleId]);
    } else {
      setSelectedPermissions([]);
    }
  };

  // --- 3. MANUAL OVERRIDE ---
  const togglePermission = (id: number) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        role_id: selectedRole,
        permissions: selectedPermissions, // Array exactly waisa jayega jaisa UI par selected hai
      };
      
      if (formData.password) payload.password = formData.password;

      if (editData) {
        await axios.put(`http://localhost:8000/api/users/${editData.id}`, payload);
      } else {
        await axios.post('http://localhost:8000/api/users', payload);
      }
      
      refreshData();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl border-2 border-slate-900 overflow-hidden">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <h2 className="font-black uppercase italic tracking-tighter text-xl">
            {editData ? 'Modify Identity' : 'Forge New Identity'}
          </h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 text-left text-black">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Personnel Name</label>
              <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl focus:border-slate-900 outline-none font-bold text-sm text-black"/>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400">Email Address</label>
              <input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl focus:border-slate-900 outline-none font-bold text-sm text-black"/>
            </div>
          </div>

          <div className="text-left space-y-1">
            <label className="text-[9px] font-black uppercase text-slate-400">
              Security Pin {editData && "(Optional)"}
            </label>
            <input type="password" placeholder="••••••••" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl focus:border-slate-900 outline-none font-bold text-sm text-black"/>
          </div>

          <div className="text-left space-y-1">
            <label className="text-[9px] font-black uppercase text-blue-600">Authority Rank</label>
            <select required value={selectedRole} onChange={(e) => handleRoleChange(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-3 rounded-xl focus:border-slate-900 outline-none font-black uppercase text-xs text-black">
              <option value="">Assign Rank...</option>
              {roles.map(role => <option key={role.id} value={role.id}>{role.role_name}</option>)}
            </select>
          </div>

          <div className="text-left space-y-3">
            <div className="flex justify-between items-center px-1">
               <label className="text-[9px] font-black uppercase text-slate-400">Operational Privileges</label>
               <span className="text-[8px] font-bold text-emerald-500 uppercase">{selectedPermissions.length} Active</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {permissions.map((perm) => {
                const isSelected = selectedPermissions.includes(perm.id);
                return (
                  <div 
                    key={perm.id} 
                    onClick={() => togglePermission(perm.id)} 
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                  >
                    <ShieldCheck size={12} className={isSelected ? 'text-emerald-400' : 'text-slate-200'} />
                    <span className="text-[8px] font-black uppercase truncate">{perm.permission_name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Identity</>}
          </button>
        </form>
      </div>
    </div>
  );
}