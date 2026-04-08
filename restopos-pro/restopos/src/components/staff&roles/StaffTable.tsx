import React from 'react';
import { UserX, Edit2, Trash2, Phone, CreditCard, MapPin, Banknote } from 'lucide-react';
// import StaffPage from '../../components/staff&roles/StaffPage';

// 1. Interface definition
interface StaffTableProps {
  staff: any[]; // Ya StaffMember[] agar aapne type define ki hai
  onDelete: (id: string | number) => void;
  onEdit: (member: any) => void;
}

// 2. Props destructuring with Type assignment
export default function StaffTable({ staff, onDelete, onEdit }: StaffTableProps) {
  const STORAGE_URL = "http://localhost:8000/storage/";

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <table className="w-full text-left min-w-[1000px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Team Member</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role & Salary</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact & CNIC</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Address</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staff && staff.length > 0 ? (
            staff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {member.profile_image ? (
                      <img 
                        src={`${STORAGE_URL}${member.profile_image}`} 
                        className="size-11 rounded-2xl object-cover border-2 border-white shadow-sm"
                        alt={member.full_name}
                      />
                    ) : (
                      <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary uppercase border-2 border-white shadow-sm">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-slate-900">{member.full_name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase italic">Joined: {new Date(member.joining_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="w-fit px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-black uppercase">
                      {member.role?.role_name || 'Staff'}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-xs">
                      <Banknote size={12} /> 
                      {Number(member.salary).toLocaleString()} <span className="text-[8px] opacity-70">PKR</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-slate-500">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                      <Phone size={12} className="text-primary" /> {member.phone_number}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-70">
                      <CreditCard size={12} /> {member.cnic_number || '---'}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 max-w-[200px]">
                  <div className="flex items-start gap-1.5 text-slate-500">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-slate-300" />
                    <p className="text-[10px] font-medium leading-relaxed italic line-clamp-2">
                      {member.address || 'Address not provided'}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    member.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {member.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onEdit(member)} // 🔥 Ye line zaroori hai edit modal kholne k liye
                        className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-primary transition-all border border-transparent hover:border-slate-100"
                        >
                        <Edit2 size={16} />
                        </button>
                    <button 
                      onClick={() => onDelete(member.id)}
                      className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-24 text-center">
                <UserX className="mx-auto text-slate-100 mb-3" size={60} />
                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">No Staff Records Found</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}