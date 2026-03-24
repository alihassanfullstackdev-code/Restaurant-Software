import React from 'react';
import { X, Printer, CheckCircle, MapPin, Phone, Globe } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; // POSTerminal me 'lastOrder' pass ho raha hai
}

export const PrintModel = ({ isOpen, onClose, order }: PrintModalProps) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
    onClose();
  };

  // Cart items handle karein (Paid order structure ya direct cart)
  const items = order.cart || order.items || order.order_items || [];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-receipt, #printable-receipt * { visibility: visible; }
          #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-4 border-b bg-emerald-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle size={18} /> Order Processed!
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-100 rounded-full text-slate-500"><X size={20} /></button>
        </div>

        <div className="p-6 bg-white overflow-y-auto max-h-[70vh]">
          <div id="printable-receipt" className="p-2 font-mono text-[12px] text-slate-800 leading-tight">
            <div className="text-center mb-4">
              <h2 className="font-black text-lg uppercase tracking-tighter">RESTOPOS</h2>
              <div className="text-[10px] mt-1 opacity-80">
                <p>Main Gulberg, Sargodha</p>
                <p>+92 300 0000000</p>
              </div>
              <div className="border-b border-dotted border-slate-300 my-3"></div>
            </div>

            <div className="space-y-1 mb-3 text-[11px]">
              <div className="flex justify-between"><span>Receipt:</span> <span className="font-bold">#ORD-{order.id}</span></div>
              <div className="flex justify-between"><span>Date:</span> <span>{new Date().toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Customer:</span> <span className="uppercase">{order.customer_name || 'Walk-in'}</span></div>
            </div>

            <div className="border-b border-dotted border-slate-300 mb-2"></div>

            <div className="space-y-2 mb-4">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start">
                  <span className="w-1/2">{item.name || item.product?.name}</span>
                  <span className="w-1/6 text-center">x{item.quantity}</span>
                  <span className="w-1/3 text-right">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dotted border-slate-300 pt-2 space-y-1">
              <div className="flex justify-between font-black text-sm">
                <span>TOTAL</span>
                <span>${Number(order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center mt-6 italic text-[10px]">
              <p>Thank You for Visiting!</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 grid grid-cols-2 gap-3 no-print">
          <button onClick={onClose} className="py-3 bg-white border rounded-xl font-bold text-xs text-slate-500">Close</button>
          <button onClick={handlePrint} className="py-3 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2">
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};