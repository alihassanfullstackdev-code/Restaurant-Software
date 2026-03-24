import React from 'react';
import { X, Clock, Hash, Utensils } from 'lucide-react';

interface ModalProps {
  order: any;
  onClose: () => void;
}

export const OrderPreviewModal: React.FC<ModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Hash size={16} className="font-bold" />
              <span className="text-xl font-black uppercase tracking-tighter">Order {order.id}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Completed at {new Date(order.kitchen_ready_at || order.updated_at).toLocaleTimeString()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Items Summary</h3>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex gap-4">
                  <span className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-black text-sm">
                    {item.quantity || item.qty}x
                  </span>
                  <div>
                    <p className="font-bold text-slate-200">{item.product?.name || item.name}</p>
                    {item.notes && (
                      <p className="text-xs text-orange-400 mt-1 italic">Note: {item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {order.notes && (
            <div className="mt-6 p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Special Instructions</p>
              <p className="text-sm text-slate-300 italic">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs transition-all"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};