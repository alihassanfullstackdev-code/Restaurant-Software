import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Shield, Plus, Trash2, Loader2 } from 'lucide-react';

export default function RolesModal({ onClose }: { onClose: () => void }) {
  const [roles, setRoles] = useState<any[]>([]);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Fetch Roles from API
  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/staff-roles');
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 2. Add New Role (Saves to role_name column)
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/staff-roles', {
        role_name: newRole // Laravel validation 'role_name' handle karega
      });
      setNewRole(''); // Input clear karein
      fetchRoles();   // List refresh karein
    } catch (err: any) {
      alert(err.response?.data?.message || "Role already exists or error occurred");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Role
  const handleDeleteRole = async (id: number) => {
    if (!window.confirm("Delete this role? Staff assigned to this role might be affected.")) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/staff-roles/${id}`);
      fetchRoles();
    } catch (err: any) {
      alert(err.response?.data?.message || "Cannot delete role");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={24} />
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight">Manage Staff Roles</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Database: staff_roles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Add Role Form */}
          <form onSubmit={handleAddRole} className="flex gap-2">
            <input 
              type="text" 
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Senior Chef" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-all font-bold" 
            />
            <button 
              disabled={loading}
              className="bg-primary p-3 rounded-xl text-slate-900 font-black shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            </button>
          </form>

          {/* Roles List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {fetching ? (
              <div className="text-center py-10 text-slate-400 animate-pulse font-bold uppercase text-[10px] tracking-widest">Loading Roles...</div>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-700 uppercase text-xs tracking-tight">{role.role_name}</span>
                    <span className="text-[9px] text-slate-400 font-bold tracking-tighter uppercase">ID: {role.id}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-300 text-xs font-bold uppercase tracking-widest">No roles found in database</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}