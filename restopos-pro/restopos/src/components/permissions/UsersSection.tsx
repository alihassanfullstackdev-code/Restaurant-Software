import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import UserAddModal from './UserAddModal';

interface UsersSectionProps {
  roles: any[];
  permissions: any[];
  fetchData: () => void;
}

export default function UsersSection({ roles, permissions, fetchData }: UsersSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-20 text-center animate-in fade-in slide-in-from-bottom">
      <div className="p-8 bg-slate-50 rounded-[3rem] inline-block mb-6 border-2 border-dashed border-slate-200">
        <UserPlus size={64} className="text-slate-300" />
      </div>
      <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Personnel Directory</h3>
      <p className="text-slate-400 text-xs mb-8 max-w-sm mx-auto font-bold uppercase tracking-widest">
        Create users and bind them to specific authorities.
      </p>
      
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        Initialize New Staff
      </button>

      {/* Add User Modal - Iske andar hi manage ho raha hai */}
      {isModalOpen && (
        <UserAddModal 
          roles={roles} 
          permissions={permissions} 
          onClose={() => setIsModalOpen(false)} 
          refreshData={fetchData} 
        />
      )}
    </div>
  );
}