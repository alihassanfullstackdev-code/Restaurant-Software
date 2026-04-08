import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffTable from '../../components/staff&roles/StaffTable';
import AddMemberModal from '../../components/staff&roles/AddMemberModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export default function StaffPage() {
  const [staffData, setStaffData] = useState<any>(null); // Meta data k liye object use krein
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setShowModal(true);
  };


  const fetchStaff = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/staff?page=${pageNumber}`);
      setStaffData(res.data); // Laravel pagination object
      setPage(pageNumber);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(page); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Staff Directory</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-primary/20 hover:scale-95 transition-all">
          + Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Table - Data Laravel k 'data' array se pass hoga */}
        <StaffTable 
          staff={staffData?.data || []} 
          onDelete={() => fetchStaff(page)} 
          onEdit={handleEdit}
        />

        {/* --- PAGINATION CONTROLS --- */}
        {staffData && staffData.last_page > 1 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-[10px] font-black uppercase text-slate-400">
              Showing {staffData.from} to {staffData.to} of {staffData.total} Members
            </p>
            
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => fetchStaff(page - 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-100 transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {[...Array(staffData.last_page)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchStaff(i + 1)}
                    className={`size-8 rounded-xl text-[10px] font-black transition-all ${
                      page === i + 1 ? 'bg-primary text-slate-900 shadow-md shadow-primary/20' : 'bg-white text-slate-400 border border-slate-100 hover:border-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={page === staffData.last_page}
                onClick={() => fetchStaff(page + 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-100 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && <AddMemberModal onClose={() => setShowModal(false)} onRefresh={() => fetchStaff(1)} />}
    </div>
  );
}