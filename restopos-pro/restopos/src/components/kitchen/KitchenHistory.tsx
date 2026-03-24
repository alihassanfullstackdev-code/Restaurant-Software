import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Eye, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { OrderPreviewModal } from './OrderPreviewModal'; // Import modal
import Swal from 'sweetalert2';

export const KitchenHistory = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/kitchen-history?page=${page}`);
      setHistory(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("History Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async (orderId: number) => {
  // Confirm with SweetAlert
  const result = await Swal.fire({
    title: 'Move back to Kitchen?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Re-open!',
    background: '#111827',
    color: '#fff'
  });

  if (result.isConfirmed) {
    try {
      // Resource controller ka 'update' route call ho raha hai
      const response = await axios.put(`http://127.0.0.1:8000/api/kitchen-history/${orderId}`, {
        reopen: true // Yeh 'reopen' key backend check karega
      });

      if (response.data.success) {
        setHistory(prev => prev.filter(o => o.id !== orderId));
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Sent to Kitchen!', showConfirmButton: false, timer: 1500 });
      }
    } catch (error) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  }
};

  useEffect(() => { fetchHistory(currentPage); }, [currentPage]);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in">
      
      {/* Render Modal if an order is selected */}
      {selectedOrder && (
        <OrderPreviewModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase tracking-tighter text-white">Order Logs</h2>
        
        {/* Pagination Logic (Same as before) */}
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg bg-white/5 hover:bg-primary hover:text-black disabled:opacity-20 transition-all text-slate-400"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="flex items-center px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Page {currentPage} of {lastPage}
          </span>
          <button 
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg bg-white/5 hover:bg-primary hover:text-black disabled:opacity-20 transition-all text-slate-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="bg-[#111827]/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Order</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Items Summary</th>
                <th className="p-5 text-[10px] font-black uppercase text-slate-500 text-right tracking-widest">Actions</th>
              </tr>
            </thead>
           <tbody className="divide-y divide-white/5">
                {history.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5 font-black text-lg text-white">#{order.id}</td>
                    <td className="p-5 text-sm text-slate-400 italic">
                        {order.items?.map((i: any) => i.product?.name).join(', ')}
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                        {/* Preview Button */}
                        <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-primary hover:text-black transition-all"
                        >
                        <Eye size={18} />
                        </button>

                        {/* Re-open Button - Ab yeh functional hai */}
                        <button 
                        onClick={() => handleReopen(order.id)}
                        className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                        title="Move back to Active Kitchen"
                        >
                        <RotateCcw size={18} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
          </table>
        )}
      </div>
    </div>
  );
};