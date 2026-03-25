import React from 'react';

export const TableSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <table className="w-full text-left">
      <thead className="bg-slate-50/50">
        <tr>{[1, 2, 3, 4, 5].map(i => <th key={i} className="px-6 py-5"><div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div></th>)}</tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4].map(r => (
          <tr key={r} className="border-b border-slate-50">
            <td className="px-6 py-4"><div className="flex gap-4 items-center"><div className="h-12 w-12 bg-slate-100 rounded-xl animate-pulse"></div><div className="h-3 w-32 bg-slate-100 animate-pulse"></div></div></td>
            <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-50 animate-pulse"></div></td>
            <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-50 animate-pulse ml-auto"></div></td>
            <td className="px-6 py-4"><div className="h-6 w-10 bg-slate-100 rounded-full animate-pulse mx-auto"></div></td>
            <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-50 animate-pulse ml-auto"></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);