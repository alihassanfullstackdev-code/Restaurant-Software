import React from 'react';
import { Edit2, Trash2, Truck, Phone, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Supplier } from '../../pages/Supplier/Supplier';

interface Props {
    suppliers: Supplier[];
    onEdit: (supplier: Supplier) => void;
    onToggleStatus: (supplier: Supplier) => void;
    onDelete: (id: number) => void;
}

export const SupplierTable = ({ suppliers, onEdit, onDelete }: Props) => {
    function onToggleStatus(s: Supplier): void {
        s.status = s.status === 'active' ? 'inactive' : 'active';
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mt-8">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                <h3 className="font-black text-lg">Registered Suppliers</h3>
                <span className="text-xs font-bold bg-slate-200 px-3 py-1 rounded-full text-slate-600">
                    Total: {suppliers.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400">
                            <th className="px-6 py-4">Vendor & Contact</th>
                            <th className="px-6 py-4">Email & Address</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {suppliers.length > 0 ? (
                            suppliers.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                                    {/* Name & Phone */}
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{s.name}</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                            <User size={12} className="text-slate-400" /> {s.contact_person || 'No Contact'}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                            <Phone size={12} /> {s.phone}
                                        </div>
                                    </td>

                                    {/* Email & Address */}
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 flex items-center gap-2">
                                            <Mail size={14} className="text-slate-300" /> {s.email || 'N/A'}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-300" />
                                            <span className="truncate max-w-[200px]">{s.address || 'No Address'}</span>
                                        </div>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => onToggleStatus(s)}
                                            className="hover:scale-105 transition-transform active:scale-95"
                                            title="Click to toggle status"
                                        >
                                            {s.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                                    <CheckCircle2 size={10} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider border border-rose-100">
                                                    <AlertCircle size={10} /> Inactive
                                                </span>
                                            )}
                                        </button>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(s)}
                                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                title="Edit Supplier"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this vendor?')) {
                                                        onDelete(s.id);
                                                    }
                                                }}
                                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                title="Delete Supplier"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="size-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                            <Truck size={24} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">No suppliers found in database</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Helper Icon for Contact Person
const User = ({ size, className }: { size: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);