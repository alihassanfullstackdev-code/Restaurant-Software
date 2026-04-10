import React, { useState } from 'react';
import axios from 'axios'; // Axios import karein
import { Settings2, Trash2, ShieldPlus, Loader2 } from 'lucide-react';
import RoleCreateModal from '../../components/permissions/RoleCreateModel'; 
import RoleEditModal from '../../components/permissions/RoleEditModal';

interface RolesTableProps {
  roles: any[];
  permissions: any[];
  fetchData: () => void;
}

export default function RolesTable({ roles, permissions, fetchData }: RolesTableProps) {
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEditClick = (role: any) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  // DELETE FUNCTION
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to terminate the "${name}" authority?`)) {
      setDeletingId(id);
      try {
        const res = await axios.delete(`http://localhost:8000/api/roles/${id}`);
        alert(res.data.message);
        fetchData(); // List refresh karein
      } catch (err: any) {
        // Agar users assigned hain toh controller error bhejega
        alert(err.response?.data?.message || "Termination failed!");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="animate-in fade-in">
      {/* Upper Action Bar */}
      <div className="p-6 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-black uppercase italic text-sm tracking-tighter text-slate-400">Available Security Groups</h3>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
        >
          <ShieldPlus size={16} /> Define New Role
        </button>
      </div>

      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b-2 border-slate-900">
          <tr>
            <th className="p-8 font-black uppercase text-xs tracking-widest text-slate-400">Authority Level</th>
            <th className="p-8 font-black uppercase text-xs tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-slate-50">
          {roles.map(role => (
            <tr key={role.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-8 font-black text-slate-900 uppercase tracking-tight">{role.role_name}</td>
              <td className="p-8 text-right space-x-2">
                <button 
                  onClick={() => handleEditClick(role)}
                  className="bg-slate-100 p-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                >
                  <Settings2 size={18} />
                </button>

                {/* DELETE BUTTON UPDATED */}
                <button 
                  onClick={() => handleDelete(role.id, role.role_name)}
                  disabled={deletingId === role.id}
                  className="p-3 text-red-500 hover:bg-red-50 transition-all rounded-xl disabled:opacity-50"
                >
                  {deletingId === role.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <RoleCreateModal permissions={permissions} onClose={() => setIsCreateModalOpen(false)} refreshData={fetchData} />
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <RoleEditModal 
          role={selectedRole} 
          permissions={permissions} 
          onClose={() => setIsEditModalOpen(false)} 
          refreshData={fetchData} 
        />
      )}
    </div>
  );
}