import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Edit, Trash2, Mail, Loader2 } from 'lucide-react';
import UserAddModal from './UserAddModal';
import axios from 'axios';

export default function UsersSection() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [matrix, setMatrix] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, configRes] = await Promise.all([
        axios.get('http://localhost:8000/api/users'),
        axios.get('http://localhost:8000/api/role-permissions')
      ]);

      setUsers(usersRes.data);
      setRoles(configRes.data.roles || []);
      setPermissions(configRes.data.permissions || []);
      setMatrix(configRes.data.matrix || {}); 
      
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const deleteUser = async (id: number) => {
    if (window.confirm("Are you sure? This identity will be purged.")) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${id}`);
        fetchData();
      } catch (err) {
        alert("Deletion failed.");
      }
    }
  };

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center border-b-2 pb-8 border-slate-100">
        <div>
          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Personnel Directory</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active System Identities</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-600 transition-all shadow-lg"
        >
          Initialize New Staff
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-slate-300" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div key={`${user.id}-${user.permissions?.length}`} className="bg-white border-2 border-slate-100 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-slate-900 transition-all group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center font-black group-hover:bg-slate-900 group-hover:text-white transition-all">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm text-slate-900">{user.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase italic">
                    <Mail size={10} /> {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="bg-slate-50 text-slate-900 px-4 py-2 rounded-lg text-[9px] font-black uppercase border border-slate-100 flex items-center gap-2">
                  <Shield size={12} className="text-blue-500" />
                  {user.role?.role_name || 'Restricted'}
                </span>

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(user)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <UserAddModal 
          roles={roles} 
          permissions={permissions} 
          matrix={matrix}
          onClose={() => { setIsModalOpen(false); setEditingUser(null); }} 
          refreshData={fetchData} 
          editData={editingUser} 
        />
      )}
    </div>
  );
}