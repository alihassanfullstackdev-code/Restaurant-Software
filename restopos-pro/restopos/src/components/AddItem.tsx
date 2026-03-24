import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<any>;
  categories: any[];
  initialData?: any; 
}

export const AddItemModal = ({ isOpen, onClose, onSave, categories, initialData }: AddItemModalProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // EDIT MODE: Auto-fill fields
  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || '');
      setPrice(initialData.price || '');
      setCategoryId(initialData.category_id || '');
      setPreview(initialData.image ? `http://127.0.0.1:8000/storage/${initialData.image}` : null);
      setImage(null); // Purani image ko state mein nahi rakhenge jab tak nayi select na ho
    } else if (isOpen) {
      setName(''); setPrice(''); setCategoryId(''); setImage(null); setPreview(null);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category_id', categoryId);
    if (image) formData.append('image', image);
    
    const validationErrors = await onSave(formData);
    
    if (validationErrors) {
      setErrors(validationErrors);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-black text-slate-800 uppercase tracking-tighter text-xl">
            {initialData ? 'Update Item' : 'New Menu Item'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Image Upload Area */}
          <div>
            <div className={`relative group h-40 w-full border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center overflow-hidden transition-all ${errors.image ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-500'}`}>
              {preview ? (
                <img src={preview} className="h-full w-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center text-slate-400">
                  <Upload className="mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase">Upload Photo</p>
                </div>
              )}
              <input type="file" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
              }} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            {errors.image && (
              <div className="flex items-center gap-1 mt-2 text-red-500">
                <AlertCircle size={14} />
                <p className="text-[10px] font-bold uppercase">{errors.image[0]}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <input required value={name} onChange={(e)=>setName(e.target.value)} className={`w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-bold transition-all ${errors.name ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-emerald-500'}`} placeholder="Item Name" />
            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.name[0]}</p>}

            <input required type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className={`w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-bold transition-all ${errors.price ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-emerald-500'}`} placeholder="Price ($)" />
            {errors.price && <p className="text-red-500 text-[10px] mt-1 ml-2">{errors.price[0]}</p>}

            <select required value={categoryId} onChange={(e)=>setCategoryId(e.target.value)} className={`w-full px-6 py-4 rounded-2xl bg-slate-100 border-none outline-none font-bold transition-all ${errors.category_id ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-emerald-500'}`}>
              <option value="">Select Category</option>
              {categories.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <button disabled={isSubmitting} className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center shadow-xl disabled:opacity-50">
            {isSubmitting ? <Loader2 className="animate-spin" /> : initialData ? 'Update Product' : 'Confirm & Save'}
          </button>
        </form>
      </div>
    </div>
  );
};