import React from 'react';
import { Banknote, CreditCard, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: string) => void;
  total: number;
}

export const PaymentMethodModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelect, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black uppercase">Select Payment</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>

        <div className="text-center mb-8">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Total Payable</p>
          <h3 className="text-4xl font-black text-slate-900">${total.toFixed(2)}</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => onSelect('cash')}
            className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Banknote size={24} />
              </div>
              <span className="font-bold text-slate-700">Cash Payment</span>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">FAST</span>
          </button>

          <button 
            onClick={() => onSelect('card')}
            className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CreditCard size={24} />
              </div>
              <span className="font-bold text-slate-700">Card / Online</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};