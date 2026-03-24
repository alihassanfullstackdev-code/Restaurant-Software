import { Table as TableIcon, Users, Link as LinkIcon, RefreshCw, GitMerge } from 'lucide-react';

export default function TableGrid({ loading, tables, selectedTable, onSelect }: any) {
  if (loading) return (
    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {Array(10).fill(0).map((_, i) => (
        <div key={i} className="aspect-square rounded-[3rem] bg-slate-200 animate-pulse border-4 border-white shadow-inner" />
      ))}
    </div>
  );

  return (
    <div className="flex-1 bg-slate-200/30 rounded-[4rem] border-[12px] border-white p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 overflow-y-auto shadow-[inset_0_4px_20px_rgba(0,0,0,0.03)]">
      {tables.map((table: any) => (
        <button 
          key={table.id} 
          disabled={table.is_syncing}
          onClick={() => onSelect(table)} 
          className={`relative group aspect-square rounded-[3rem] border-4 transition-all duration-300 flex flex-col items-center justify-center
            ${selectedTable?.id === table.id ? 'scale-105 shadow-2xl ring-[6px] ring-blue-500/10 z-10' : 'hover:scale-[1.03] shadow-sm'}
            ${table.is_syncing ? 'opacity-50 bg-slate-100 border-dashed border-slate-300 cursor-not-allowed' : 
              table.merge_id ? 'bg-purple-600 border-purple-400 text-white shadow-purple-200' : // Purple for Merged
              table.status === 'occupied' ? 'bg-rose-500 border-rose-300 text-white' : 
              'bg-white border-slate-50 text-slate-400 hover:border-blue-300'}`}
        >
          {/* Top Indicator Badge */}
          {!table.is_syncing && (
            <div className="absolute top-4 right-4">
               {table.merge_id ? (
                 <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                    <GitMerge size={14} className="text-white" />
                 </div>
               ) : table.status === 'occupied' ? (
                 <Users size={14} className="text-white/70" />
               ) : null}
            </div>
          )}

          {table.is_syncing ? (
            <RefreshCw size={24} className="animate-spin text-slate-400" />
          ) : (
            <>
              {/* Center Content */}
              <div className="flex flex-col items-center">
                <TableIcon 
                  size={36} 
                  strokeWidth={2.5} 
                  className={`mb-2 ${table.merge_id || table.status === 'occupied' ? 'text-white' : 'text-slate-200 group-hover:text-blue-200'}`} 
                />
                <span className="text-3xl font-black tracking-tighter leading-none">{table.table_number}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">
                   Cap: {table.seating_capacity}
                </span>
              </div>

              {/* Merge Link Visual (Optional Pro-Tip) */}
              {table.merge_id && (
                <div className="absolute -bottom-2 bg-purple-800 text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-lg">
                  Linked Group
                </div>
              )}
            </>
          )}
        </button>
      ))}
    </div>
  );
}