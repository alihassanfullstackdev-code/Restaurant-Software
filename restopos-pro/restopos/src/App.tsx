import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingCart, Table as TableIcon, ChefHat, 
  Menu as MenuIcon, Package, BarChart3, Users, Settings,
  Truck, LogOut, Bell, Search, X, 
  ShieldCheck // 👈 Permission Icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types & Pages imports
import { View } from './types';
import Dashboard from './pages/Dashboard/dashboard';
import Suppliers from './pages/Supplier/Supplier';
import POSTerminal from './pages/POSTerminal/POSTerminal';
import FloorPlan from './pages/FloorPlan/FloorPlan';
import KitchenDisplay from './pages/KitchenDisplay/KitchenDisplay';
import MenuManagement from './pages/MenuManagement/MenuManagement';
import Inventory  from './pages/Inventory/Inventory';
import Reports from './pages/Reports/Reports';
import StaffManagement from './pages/StaffManagement/StaffManagement';
import RolePermissionMatrix from './pages/RolePermissions/RolePermissionMatrix'; // 👈 Matrix Page
import Login from './components/Login';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  // --- Auth Logic Start ---
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Token synchronization with Axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); 
  };

  if (!token) {
    return <Login />;
  }
  // --- Auth Logic End ---

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart },
    { id: 'floor', label: 'Floor Plan', icon: TableIcon },
    { id: 'kds', label: 'Kitchen OS', icon: ChefHat },
    { id: 'menu', label: 'Menu Management', icon: MenuIcon },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
    { id: 'staff', label: 'Staff & Roles', icon: Users },
    { id: 'permissions', label: 'Access Control', icon: ShieldCheck }, // 👈 Added
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'suppliers': return <Suppliers />;
      case 'pos': return <POSTerminal tableId={selectedTableId} />;
      case 'floor': return <FloorPlan onStartOrder={(tableId: number) => {
        setSelectedTableId(tableId);
        setCurrentView('pos');
      }} />;
      case 'kds': return <KitchenDisplay />;
      case 'menu': return <MenuManagement />;
      case 'inventory': return <Inventory />;
      case 'reports': return <Reports />;
      case 'staff': return <StaffManagement />;
      case 'permissions': return <RolePermissionMatrix />; // 👈 Added
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:w-64
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ChefHat size={22} />
            </div>
            <h1 className="font-black text-xl tracking-tight">RestoPOS</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-500">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-slate-900 text-white font-bold shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active User</p>
              <p className="text-sm font-bold text-slate-900 truncate">{user.name || 'Administrator'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden"
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full max-w-md hidden sm:block mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search data..."
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-slate-200 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500 hidden md:block uppercase tracking-widest">Server Live</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}