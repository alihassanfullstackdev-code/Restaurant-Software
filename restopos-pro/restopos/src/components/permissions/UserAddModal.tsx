import React, { useState } from 'react';
import axios from 'axios';
import { X, Save, UserPlus, Shield, Key,Loader2 } from 'lucide-react';

export default function UserAddModal({ roles, permissions, onClose, refreshData }: any) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role_id: '' });
  const [selectedPerms, setSelectedPerms] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role_id) return alert("Fill required fields!");
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/users', { ...formData, permissions: selectedPerms });
      alert("Staff Member Registered! ✅");
      refreshData();
      onClose();
    } catch (err) { alert("Registration Failed!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex justify-center items-center z-[200] p-4">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] border-4 border-slate-900 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="p-8 border-b-4 border-slate-900 bg-slate-50 flex justify-between items-center">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Authorize Personnel</h2>
            <button onClick={onClose} className="p-2 border-2 border-slate-900 rounded-full hover:bg-red-500 hover:text-white transition-all"><X /></button>
        </div>

        <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="text" placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} className="p-5 rounded-2xl border-2 border-slate-900 font-bold uppercase text-xs outline-none focus:bg-slate-50" />
            <input type="email" placeholder="Email Address" onChange={e => setFormData({...formData, email: e.target.value})} className="p-5 rounded-2xl border-2 border-slate-900 font-bold uppercase text-xs outline-none focus:bg-slate-50" />
            <input type="password" placeholder="Passcode" onChange={e => setFormData({...formData, password: e.target.value})} className="p-5 rounded-2xl border-2 border-slate-900 font-bold uppercase text-xs outline-none focus:bg-slate-50" />
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2"><Shield size={14}/> Define Authority (Role)</h4>
            <select onChange={e => setFormData({...formData, role_id: e.target.value})} className="w-full p-5 rounded-2xl border-2 border-slate-900 font-black uppercase text-sm bg-slate-50 outline-none">
                <option value="">Select Primary Role</option>
                {roles.map((r:any) => <option key={r.id} value={r.id}>{r.role_name}</option>)}
            </select>
          </div>

          <div className="space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2"><Key size={14}/> Access Override (Pivot Table)</h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {permissions.map((p:any) => (
                    <button 
                        key={p.id}
                        onClick={() => setSelectedPerms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                        className={`p-4 rounded-xl border-2 font-black uppercase text-[9px] tracking-tight transition-all
                        ${selectedPerms.includes(p.id) ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                        {p.permission_name}
                    </button>
                ))}
             </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t-4 border-slate-900 flex justify-end">
            <button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-black transition-all">
               {loading ? <Loader2 className="animate-spin" /> : <Save size={20}/>} Commit Identity
            </button>
        </div>
      </div>
    </div>
  );
}