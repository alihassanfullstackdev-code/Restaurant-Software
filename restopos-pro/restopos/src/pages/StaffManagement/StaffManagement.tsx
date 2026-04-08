import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Shield, Calendar, Loader2 } from 'lucide-react';

// Components
import QuickActions from '../../components/staff&roles/QuickActions';
import FeaturedStaff from '../../components/staff&roles/FeaturedStaff';
import StaffTable from '../../components/staff&roles/StaffTable';

// Modals
import AddMemberModal from '../../components/staff&roles/AddMemberModal';
import RolesModal from '../../components/staff&roles/RolesModal';

const API_URL = "http://localhost:8000/api";

export default function StaffManagement() {
  // States
  const [staffData, setStaffData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null); // 🔥 For Edit logic

  // 1. Fetch Data Function
  const fetchStaff = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/staff?page=${pageNumber}`);
      setStaffData(res.data);
      setPage(pageNumber);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Initial Load
  useEffect(() => {
    fetchStaff();
  }, []);

  // 3. Delete Handler
  const handleDelete = async (id: string | number) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await axios.delete(`${API_URL}/staff/${id}`);
        fetchStaff(page);
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  // 4. Edit Handler
  const handleEdit = (member: any) => {
    setEditingMember(member); // Data pakra
    setIsMemberModalOpen(true); // Modal khola
  };

  // 5. Add New Handler
  const handleAddNew = () => {
    setEditingMember(null); // Data khali kiya (taake "Add" mode on ho)
    setIsMemberModalOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10 px-4 md:px-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight italic uppercase">
            Staff & Performance
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
            Manage your team, roles, and track real-time performance.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold shadow-sm active:scale-95 hover:bg-slate-50 transition-all">
            <Calendar size={18} />
            <span className="hidden sm:inline">Duty Roster</span>
          </button>
          <button
            onClick={handleAddNew}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-slate-900 shadow-lg shadow-primary/20 active:scale-95 hover:opacity-90 transition-all"
          >
            <UserPlus size={18} /> Add Member
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="w-full lg:flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
              </div>
            )}

            {/* Table Search & Actions */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button onClick={() => setIsRolesModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white shadow-sm hover:bg-slate-50 transition-all">
                  <Shield size={14} /> Roles Management
                </button>
              </div>
            </div>

            {/* 🔥 Staff Table with both Handlers */}
            <StaffTable 
              staff={staffData?.data || []} 
              onDelete={handleDelete} 
              onEdit={handleEdit} 
            />

            {/* Pagination Controls */}
            {staffData && staffData.last_page > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => fetchStaff(page - 1)}
                  className="px-4 py-1.5 rounded-lg border text-xs font-black uppercase disabled:opacity-30 hover:bg-slate-50"
                >
                  Prev
                </button>
                <div className="px-4 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase">
                  Page {page} of {staffData.last_page}
                </div>
                <button 
                  disabled={page === staffData.last_page}
                  onClick={() => fetchStaff(page + 1)}
                  className="px-4 py-1.5 rounded-lg border text-xs font-black uppercase disabled:opacity-30 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <QuickActions />
          <FeaturedStaff />
        </div>
      </div>

      {/* Modals Section */}
      {isMemberModalOpen && (
        <AddMemberModal 
          key={editingMember?.id || 'new'} // 🔥 Prefill fix ke liye key lazmi hei
          initialData={editingMember}
          onClose={() => setIsMemberModalOpen(false)} 
          onRefresh={() => fetchStaff(page)} 
        />
      )}

      {isRolesModalOpen && (
        <RolesModal onClose={() => setIsRolesModalOpen(false)} />
      )}
    </div>
  );
}