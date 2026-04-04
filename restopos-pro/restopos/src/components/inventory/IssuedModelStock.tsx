import React, { useState, useEffect } from 'react';
import { ChefHat, X, Loader2, ArrowRightLeft } from 'lucide-react';

interface Props {
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, notes: string) => Promise<void> | void;
}

export const IssuedModelStock = ({ item, isOpen, onClose, onSubmit }: Props) => {
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNotes('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const available = Number(item.current_balance) || 0;
  const numAmount = Number(amount);
  const isInvalid = !amount || numAmount > available || numAmount <= 0 || isSubmitting;

const handleConfirm = async (e: React.MouseEvent) => {
  e.preventDefault(); e.stopPropagation();
  if (isInvalid) return;

  setIsSubmitting(true);
  try {
    await onSubmit(numAmount, notes);
    onClose();
  } catch (error: any) {
    alert(error.response?.data?.message || "Transfer failed!");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-10 py-10 bg-slate-900 text-white relative">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg">
               <ChefHat size={28} className="text-white" />
             </div>
             <div>
               <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Kitchen <span className="text-indigo-400">Transfer</span></h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Active</p>
             </div>
          </div>
          <button type="button" onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 rounded-2xl hover:bg-rose-500 transition-all">
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="p-10 space-y-8">
          {/* Info Card */}
          <div className="flex items-center justify-between gap-4 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <div className="text-center flex-1">
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Item</p>
              <p className="font-black text-slate-800 uppercase italic truncate">{item.name}</p>
            </div>
            <ArrowRightLeft className="text-indigo-500" size={18} />
            <div className="text-center flex-1">
              <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Available</p>
              <p className="font-black text-indigo-600 text-lg">{available} <span className="text-[10px]">{item.unit}</span></p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block px-2">Amount to Issue</label>
              <input 
                type="number" step="0.01" autoFocus value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
                className={`w-full px-8 py-6 rounded-[2rem] border-2 font-black text-3xl outline-none ${
                  (numAmount > available || (amount !== '' && numAmount <= 0)) ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 focus:border-indigo-500 text-slate-800 bg-slate-50'
                }`}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block px-2">Notes</label>
              <textarea 
                rows={2} value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-8 py-5 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-500 outline-none font-bold bg-slate-50 resize-none"
              />
            </div>
          </div>

          <button 
            type="button"
            onClick={handleConfirm}
            disabled={isInvalid}
            className="w-full py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-30 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Authorize Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};