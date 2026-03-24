import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  Clock, 
  Shield, 
  Mail, 
  Phone,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
  UserX
} from 'lucide-react';

export default function StaffManagement() {
  // --- Empty State Logic ---
  const [staff, setStaff] = useState([]); // Array empty rakha hai 'Empty State' dikhane ke liye

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Staff & Performance</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Manage your team and track performance.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Calendar size={18} />
            <span className="hidden sm:inline">Duty Roster</span>
            <span className="sm:hidden">Roster</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-slate-900 hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            <UserPlus size={18} />
            Add Member
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Staff', value: '0', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Active Now', value: '0', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Avg Rating', value: '0.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Openings', value: '0', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <TrendingUp size={14} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-tight">{stat.label}</p>
            <h3 className="text-xl md:text-2xl font-black mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Staff List Table Area */}
        <div className="flex-1 space-y-6 overflow-hidden">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Search & Filters */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search staff..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all">
                  <Filter size={14} /> Filter
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all">
                  <Shield size={14} /> Roles
                </button>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Team Member</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Performance</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {staff.length > 0 ? (
                    staff.map((member, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Member Row Content */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                            <UserX size={32} className="text-slate-300" />
                          </div>
                          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.1em]">No Staff Members Found</h4>
                          <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest">Add your first team member to start tracking</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-black text-lg mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Broadcast Message', icon: Mail, bg: 'bg-blue-50', color: 'text-blue-500' },
                { label: 'Manage Permissions', icon: Shield, bg: 'bg-purple-50', color: 'text-purple-500' },
                { label: 'Approve Time-off', icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' }
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all group active:scale-95">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 ${action.bg} ${action.color} rounded-lg transition-colors`}>
                      <action.icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{action.label}</span>
                  </div>
                  <TrendingUp size={14} className="text-slate-200" />
                </button>
              ))}
            </div>
          </div>

          {/* Featured Card (Empty Version) */}
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Staff of the Month</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="size-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/20">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-white/30 tracking-tight">Pending Audit...</p>
                  <p className="text-slate-600 text-[9px] font-black uppercase tracking-widest">Performance Data Required</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Orders</p>
                  <p className="text-lg font-black text-white/10">---</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Rating</p>
                  <p className="text-lg font-black text-white/10">---</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 size-48 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}