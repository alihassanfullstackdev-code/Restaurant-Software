import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Truck, Search, MapPin, RefreshCw } from 'lucide-react';
import { SupplierTable } from '../../components/supplier/SupplierTable';
import { SupplierModal } from '../../components/supplier/SupplierModel';

// Interface for Type Safety
export interface Supplier {
    id: number;
    name: string;
    contact_person: string;
    phone: string;
    email?: string;
    address?: string;
    status: 'active' | 'inactive';
}

const API_BASE_URL = 'http://localhost:8000/api';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/suppliers`);
            setSuppliers(res.data || []);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Filtered list based on search
    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
    );

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await axios.delete(`${API_BASE_URL}/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                alert("Failed to delete. Supplier might be linked to transactions.");
            }
        }
    };
    const handleToggleStatus = async (supplier: Supplier) => {
        const newStatus = supplier.status === 'active' ? 'inactive' : 'active';

        try {
            // Axios se status update karein
            await axios.put(`http://127.0.0.1:8000/api/suppliers/${supplier.id}`, {
                ...supplier,
                status: newStatus
            });

            // Data refresh karein
            fetchSuppliers();

            // Optional: Success message
            console.log(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    return (
        <div className="space-y-8 pb-20 md:pb-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Truck size={28} />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                            Suppliers Directory
                        </h1>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2 text-sm ml-1">
                        Manage your vendors and procurement contacts
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingSupplier(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-slate-900 text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                    <Plus size={20} /> Register New Vendor
                </button>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by company name or phone..."
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-primary outline-none font-bold transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={fetchSuppliers}
                    className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Main Table Wrapper */}
            <div className="relative">
                {loading ? (
                    <div className="py-20 text-center">
                        <div className="animate-bounce mb-4 text-primary font-black uppercase tracking-widest">Loading Vendors...</div>
                    </div>
                ) : (
                    <SupplierTable
                        suppliers={filteredSuppliers}
                        onEdit={handleEdit}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            {/* Unified Modal for Add & Edit */}
            <SupplierModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingSupplier(null);
                }}
                onRefresh={fetchSuppliers}
                editData={editingSupplier}
            />
        </div>
    );
}