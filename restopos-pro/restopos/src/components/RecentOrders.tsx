import React, { useEffect, useState } from 'react';
import { X, Printer, Eye, ShoppingCart, Trash2, Lock } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const RecentOrders = ({ isOpen, onClose, onLoadOrder, onDirectPrint, onPreview }: any) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/orders');
      setOrders(res.data.data || res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { if (isOpen) fetchOrders(); }, [isOpen]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: "Kya aap is order ko permanently delete karna chahte hain?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/orders/${id}`);
        setOrders(orders.filter(o => o.id !== id));
        Swal.fire('Deleted!', 'Order delete ho gaya.', 'success');
      } catch (err) {
        Swal.fire('Error', 'Delete fail ho gaya', 'error');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-black">Order History</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full shadow-sm"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="text-center py-10 font-bold opacity-30">Loading Orders...</div>
          ) : (
            orders.map((order) => {
              const isPaid = order.status === 'paid';

              return (
                <div key={order.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isPaid ? 'bg-slate-50 border-slate-200' : 'bg-white border-emerald-100 shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl font-black text-xs ${isPaid ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
                      #{order.id}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{order.customer_name || 'Walking Customer'}</h4>
                      <p className="text-slate-900 font-black text-sm">${Number(order.total_amount).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* OPTION 1: Preview (Hamesha kaam karega) */}
                    <button 
                      onClick={() => onPreview(order)} 
                      className="p-3 bg-white text-slate-500 rounded-xl shadow-sm border border-slate-100 hover:text-blue-600"
                      title="Preview Receipt"
                    >
                      <Eye size={18}/>
                    </button>

                    {/* OPTION 2 & 3: Edit & Print (Sirf HELD orders ke liye) */}
                    {!isPaid ? (
                      <>
                        <button 
                          onClick={() => onLoadOrder(order)} 
                          className="p-3 bg-white text-orange-500 rounded-xl shadow-sm border border-slate-100 hover:bg-orange-50"
                          title="Edit / Load to Cart"
                        >
                          <ShoppingCart size={18}/>
                        </button>
                        <button 
                          onClick={() => onDirectPrint(order)} 
                          className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg hover:bg-emerald-700"
                          title="Quick Pay & Print"
                        >
                          <Printer size={18}/>
                        </button>
                      </>
                    ) : (
                      /* Paid orders par Lock icon dikhayenge edit ki jagah */
                      <div className="flex items-center px-3 text-slate-300 italic text-[10px] font-bold">
                        <Lock size={14} className="mr-1" /> Locked
                      </div>
                    )}

                    {/* OPTION 4: Delete (Hamesha kaam karega) */}
                    <button 
                      onClick={() => handleDelete(order.id)} 
                      className="p-3 bg-white text-red-300 hover:text-red-600 rounded-xl shadow-sm border border-slate-100 hover:bg-red-50"
                      title="Delete Permanently"
                    >
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};