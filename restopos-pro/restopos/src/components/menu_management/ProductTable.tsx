import React from 'react';
import { Edit2, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
// AUTH IMPORT
import { can } from '../../utils/auth';

const baseUrl = "http://127.0.0.1:8000/storage/";

export const ProductTable = ({ 
  products, 
  onToggle, 
  onDelete, 
  onEdit, 
  currentPage, 
  lastPage, 
  onPageChange 
}: any) => (
  <div className="space-y-4">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Details</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Price</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.length > 0 ? (
              products.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        {item.image ? (
                          <img src={`${baseUrl}${item.image}`} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase">No Img</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">Ref: #PROD-{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {item.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">Rs. {parseFloat(item.price).toLocaleString()}</td>
                  
                  {/* STATUS TOGGLE: Only if user can edit-menu */}
                  <td className="px-6 py-4 text-center">
                    <label className={`relative inline-flex items-center ${can('edit-menu') ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={item.is_available === 1} 
                        disabled={!can('edit-menu')}
                        onChange={() => onToggle && onToggle(item.id, item.is_available)} 
                      />
                      <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-green-500 peer-checked:after:translate-x-full shadow-inner"></div>
                    </label>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* EDIT BUTTON: Only if user can edit-menu */}
                      {can('edit-menu') && (
                        <button 
                          onClick={() => onEdit && onEdit(item)} 
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}

                      {/* DELETE BUTTON: Only if user can delete-menu */}
                      {can('delete-menu') && (
                        <button 
                          onClick={() => onDelete && onDelete(item.id)} 
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                      {/* LOCK ICON: Agar dono permissions nahi hain to lock dikha dein (Optional) */}
                      {!can('edit-menu') && !can('delete-menu') && (
                         <span className="p-2 text-slate-200"><Filter size={16} /></span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center opacity-20">
                  <Filter size={40} className="mx-auto mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">No items found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Pagination UI */}
    <div className="flex items-center justify-between px-2">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Page {currentPage} of {lastPage}
      </p>
      <div className="flex gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          disabled={currentPage === lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  </div>
);