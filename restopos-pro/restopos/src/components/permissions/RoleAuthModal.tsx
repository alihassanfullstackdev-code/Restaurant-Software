import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Shield, Save, Loader2, Lock, Unlock, User, Mail, Key, ChevronDown } from 'lucide-react';

const API_URL = "http://localhost:8000/api";

export default function RoleAuthModal({ role, onClose, refreshData }: any) {
  // --- States for User Credentials ---
  const [userName, setUserName] = useState(role?.user?.name || '');
  const [email, setEmail] = useState(role?.user?.email || '');
  const [password, setPassword] = useState(''); // Password hamesha empty rakhein edit par
  const [selectedRole, setSelectedRole] = useState(role?.role_id || ''); // Dropdown value
  
  // --- States for Permissions ---
  const [rolesList, setRolesList] = useState<any[]>([]); // Dropdown roles ke liye
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Aik hi call se Roles aur Permissions mangwa rahe hain
      const res = await axios.get(`${API_URL}/role-permissions`);
      
      setRolesList(res.data.roles || []);
      setPermissions(res.data.permissions || []);
      
      const entireMatrix = res.data.matrix || {};

      // Agar edit mode hai toh permissions load karo
      if (role && role.id) {
        setSelectedPerms(entireMatrix[role.id] || []);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (id: number) => {
    setSelectedPerms(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!userName || !email || (!role && !password)) {
      alert("Please fill all required fields!");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        user_info: {
          name: userName,
          email: email,
          password: password,
          role_id: selectedRole
        },
        permissions: selectedPerms,
        role_id: role?.id || null
      };

      await axios.post(`${API_URL}/role-permissions/sync`, payload);
      alert("User & Permissions Updated! ✅");
      refreshData();
      onClose();
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving data.");
    } finally {
      setSaving(false);
    }
  };

  // Grouping logic for permissions
  const grouped = permissions.reduce((acc: any, curr: any) => {
    const mod = curr.module || 'General';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(curr);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[2.5rem] border-2 border-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-150">
        
        {/* Header */}
        <div className="p-6 border-b-2 border-slate-900 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-slate-900" size={32} />
            <h2 className="text-xl font-black uppercase tracking-tighter">
              {role ? 'Edit System Access' : 'Create New Authority'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* Section 1: User Credentials */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
              <User size={14} /> Identity Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text" value={userName} onChange={e => setUserName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 rounded-2xl outline-none font-bold text-sm transition-all"
                    placeholder="Ali Hassan"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 rounded-2xl outline-none font-bold text-sm transition-all"
                    placeholder="ali@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase ml-1">Security Key {role && "(Leave blank to keep same)"}</label>
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 rounded-2xl outline-none font-bold text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase ml-1">Assign Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <select 
                    value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-slate-50 border-2 border-slate-100 focus:border-slate-900 rounded-2xl outline-none font-bold text-sm appearance-none transition-all"
                  >
                    <option value="">Select Role</option>
                    {rolesList.map((r: any) => (
                      <option key={r.id} value={r.id}>{r.role_name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2: Permissions Matrix */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <Lock size={14} /> Capability Matrix
              </h3>
              <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-black">
                {selectedPerms.length} ACTIVE RULES
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(grouped).map(module => (
                  <div key={module} className="p-5 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-slate-200 transition-all">
                    <h4 className="text-[11px] font-black uppercase mb-4 text-slate-900 border-l-4 border-slate-900 pl-2">{module}</h4>
                    <div className="space-y-2">
                      {grouped[module].map((p: any) => {
                        const active = selectedPerms.includes(p.id);
                        return (
                          <div 
                            key={p.id} onClick={() => togglePermission(p.id)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center
                              ${active ? 'bg-white border-slate-900 shadow-sm' : 'bg-white/50 border-slate-100 text-slate-400 hover:border-slate-200'}`}
                          >
                            <span className="text-[10px] font-bold uppercase">{p.permission_name}</span>
                            {active ? <Unlock size={14} className="text-emerald-500" /> : <Lock size={14} className="text-slate-300" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t-2 border-slate-50 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
          <button 
            onClick={handleSave} disabled={saving}
            className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  );
}