import React from 'react';
import { Key, Trash2 } from 'lucide-react';

interface Permission {
  id: number;
  permission_name: string;
  slug: string;
  module: string;
}

interface PermissionsGridProps {
  permissions: Permission[];
}

export default function PermissionsGrid({ permissions }: PermissionsGridProps) {
  // Logic to group permissions by their module name
  const grouped = permissions.reduce((acc: any, p: Permission) => {
    const moduleName = p.module || 'General';
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(p);
    return acc;
  }, {});

  return (
    <div className="p-10 space-y-12 animate-in zoom-in duration-300">
      {Object.keys(grouped).map((moduleName) => (
        <div key={moduleName} className="space-y-6">
          {/* Module Heading with Line */}
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-8 bg-slate-900"></div>
            <h4 className="font-black uppercase italic text-sm tracking-tighter text-slate-900">
              {moduleName} Module
            </h4>
          </div>

          {/* Permissions Grid for this Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped[moduleName].map((p: Permission) => (
              <div 
                key={p.id} 
                className="p-6 border-2 border-slate-100 rounded-3xl flex justify-between items-center group hover:border-slate-900 transition-all bg-white shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <Key size={18} />
                  </div>
                  
                  {/* Name & Slug */}
                  <div>
                    <span className="font-black text-[10px] uppercase tracking-widest text-slate-900 block">
                      {p.permission_name}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter italic">
                      {p.slug}
                    </span>
                  </div>
                </div>

                {/* Delete Action (Optional) */}
                <button 
                  title="Delete Permission"
                  className="p-2 text-slate-200 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State if no permissions found */}
      {permissions.length === 0 && (
        <div className="text-center py-20 text-slate-300 font-bold uppercase tracking-widest text-xs">
          No permissions found in database
        </div>
      )}
    </div>
  );
}