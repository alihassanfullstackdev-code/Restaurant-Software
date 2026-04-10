import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Loader2, Users, Key, PlusCircle } from 'lucide-react';

// Divided Components
import RolesTable from '../../components/permissions/RolesTable';
import UsersSection from '../../components/permissions/UsersSection';
import PermissionsGrid from '../../components/permissions/PermissionsGrid';

const API_URL = "http://localhost:8000/api";
type TabType = 'users' | 'roles' | 'permissions';

export default function RolePermissionMatrix() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/role-permissions`);
      setRoles(res.data.roles || []);
      setPermissions(res.data.permissions || []);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="p-8 space-y-8 bg-[#fdfdfd] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-slate-100 pb-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Control Room</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">IAM & Matrix Control</p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-2 rounded-3xl border-2 border-slate-900 flex gap-2">
          {(['users', 'roles', 'permissions'] as TabType[]).map((tab) => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-2xl font-black uppercase text-[10px] flex items-center gap-2
                ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab === 'users' && <Users size={14} />}
              {tab === 'roles' && <ShieldCheck size={14} />}
              {tab === 'permissions' && <Key size={14} />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        {activeTab === 'users' && (
          <UsersSection roles={roles} permissions={permissions} fetchData={fetchData} />
        )}

        {activeTab === 'roles' && (
          <RolesTable roles={roles}  permissions={permissions}  fetchData={fetchData} />
        )}

        {activeTab === 'permissions' && (
          <PermissionsGrid permissions={permissions} />
        )}
      </div>
    </div>
  );
}