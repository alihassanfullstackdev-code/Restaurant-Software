import React, { useState } from 'react';
import axios from 'axios';
import { X, Save, ShieldCheck, Key, Loader2 } from 'lucide-react';

export default function RoleCreateModel({ permissions, onClose, refreshData }: any) {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const togglePermission = (id: number) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!roleName) return alert("Please enter role name");
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/roles', {
        role_name: roleName,
        permissions: selectedPermissions
      });
      refreshData();
      onClose();
    } catch (err) {
      alert("Error creating role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex justify-center items-center z-[500] p-4">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] border-4 border-slate-900 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b-4 border-slate-900 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <ShieldCheck size={32} /> Define Role
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assign system-wide capabilities</p>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-slate-900 rounded-full hover:bg-red-500 hover:text-white transition-all"><X /></button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto space-y-8 custom-scrollbar">
          {/* Role Name Input */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Role Identity</label>
            <input 
              type="text" 
              placeholder="e.g. KITCHEN_MANAGER"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-6 bg-slate-50 border-2 border-slate-900 rounded-2xl font-black uppercase text-sm focus:ring-4 ring-slate-100 outline-none transition-all"
            />
          </div>

          {/* Permissions Matrix */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Key size={14} /> Capability Matrix
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {permissions.map((p: any) => (
                <div 
                  key={p.id}
                  onClick={() => togglePermission(p.id)}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between group
                    ${selectedPermissions.includes(p.id) 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-900'}`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-tight ${selectedPermissions.includes(p.id) ? 'text-white' : 'text-slate-900'}`}>
                    {p.permission_name}
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 border-current ${selectedPermissions.includes(p.id) ? 'bg-emerald-400 border-emerald-400' : ''}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t-4 border-slate-900 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
            Initialize Role
          </button>
        </div>
      </div>
    </div>
  );
}