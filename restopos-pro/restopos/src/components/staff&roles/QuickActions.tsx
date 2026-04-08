import React from 'react';
import { Mail, Shield, CheckCircle2, TrendingUp } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    { label: 'Broadcast Message', icon: Mail, bg: 'bg-blue-50', color: 'text-blue-500' },
    { label: 'Manage Permissions', icon: Shield, bg: 'bg-purple-50', color: 'text-purple-500' },
    { label: 'Approve Time-off', icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-black text-lg mb-6 italic uppercase tracking-tight">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, i) => (
          <button 
            key={i} 
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all group active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${action.bg} ${action.color} rounded-lg transition-colors`}>
                <action.icon size={18} />
              </div>
              <span className="text-sm font-bold text-slate-700">{action.label}</span>
            </div>
            <TrendingUp size={14} className="text-slate-200 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}