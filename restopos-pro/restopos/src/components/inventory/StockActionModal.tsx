import React, { useState, useEffect } from 'react';
import { X, ArrowUpCircle, ArrowDownCircle, Trash2, Loader2,ChefHat, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  item: any; // Jo item select hua hai
  mode: 'in' | 'out' | 'waste' | 'issue';
  onClose: () => void;
  onSuccess: (id: number, type: string, qty: number, reason: string) => void;
}

export const StockActionModal = ({ isOpen, item, mode, onClose, onSuccess }: Props) => {
  const [quantity, setQuantity] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jab modal band ho toh fields clear kar dein
  useEffect(() => {
    if (!isOpen) {
      setQuantity('');
      setReason('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) return alert("Please enter a valid quantity");

    setIsSubmitting(true);
    await onSuccess(item.id, mode, parseFloat(quantity), reason);
    setIsSubmitting(false);
  };

  // UI Helpers based on Mode
  const modeConfig = {
    in: {
      title: 'Stock In (Add)',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      btnColor: 'bg-emerald-600',
      icon: <ArrowUpCircle size={24} />,
      label: 'How much are you adding?'
    },
    out: {
      title: 'Stock Out (Use)',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      btnColor: 'bg-amber-600',
      icon: <ArrowDownCircle size={24} />,
      label: 'How much is being used?'
    },
    waste: {
      title: 'Waste Log',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      btnColor: 'bg-rose-600',
      icon: <Trash2 size={24} />,
      label: 'How much was wasted?'
    },
    issue: {
      title: 'Issue to Kitchen',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      btnColor: 'bg-indigo-600',
      icon: <ChefHat size={24} />,
      label: 'Transfer Quantity'
    }
  };

  const config = modeConfig[mode];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className={`p-6 ${config.bgColor} flex justify-between items-center border-b border-slate-100`}>
          <div className="flex items-center gap-3">
            <div className={config.color}>{config.icon}</div>
            <div>
              <h3 className={`font-black uppercase tracking-tight ${config.color}`}>{config.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Current Stock Info */}
          <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400">Current Balance</span>
            <span className="font-black text-slate-900">{item.quantity} {item.unit}</span>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">{config.label}</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                autoFocus
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-slate-900 outline-none font-black text-xl transition-all"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300 uppercase italic">{item.unit}</span>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Reason / Note (Optional)</label>
            <textarea
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-3 focus:border-slate-900 outline-none font-bold text-sm resize-none"
              placeholder={mode === 'waste' ? 'Why was it wasted?' : 'Reference/Notes...'}
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Error Message if Out > Stock */}
          {mode !== 'in' && parseFloat(quantity) > item.quantity && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
              <AlertCircle size={16} />
              <span className="text-[10px] font-black uppercase">Insufficient stock available!</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={isSubmitting || (mode !== 'in' && parseFloat(quantity) > item.quantity)}
            className={`w-full py-4 ${config.btnColor} text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : `Confirm ${mode}`}
          </button>
        </form>
      </div>
    </div>
  );
};