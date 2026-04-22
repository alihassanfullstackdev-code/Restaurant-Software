import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingCart, Table as TableIcon, ChefHat, 
  Menu as MenuIcon, Package, BarChart3, Users, ShieldCheck, LogOut, Bell, Menu as MenuIconLucide 
} from 'lucide-react';

// Pages imports
import Dashboard from './pages/Dashboard/dashboard';
import POSTerminal from './pages/POSTerminal/POSTerminal';
import FloorPlan from './pages/FloorPlan/FloorPlan';
import MenuManagement from './pages/MenuManagement/MenuManagement';
import Inventory from './pages/Inventory/Inventory';
import Reports from './pages/Reports/Reports';
import StaffManagement from './pages/StaffManagement/StaffManagement';
import RolePermissionMatrix from './pages/RolePermissions/RolePermissionMatrix';
import KitchenDisplay from './pages/KitchenDisplay/KitchenDisplay'; // <--- Kitchen Import
import Login from './components/Login';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsInitialized(true);
  }, []);

  // --- PERMISSION HELPER ---
  const can = (permissionSlug: string) => {
    if (!user || !user.permissions) return false;
    return user.permissions.some((p: any) => p.slug === permissionSlug);
  };

  // --- UPDATED NAVIGATION ITEMS ---
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, slug: 'view-dashboard' },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, slug: 'access-pos' },
    { id: 'floor', label: 'Floor Plan', icon: TableIcon, slug: 'view-floor-plan' }, 
    // Kitchen Item Added
    { id: 'kitchen', label: 'Kitchen OS', icon: ChefHat, slug: 'view-kitchen' }, 
    { id: 'menu', label: 'Menu Management', icon: MenuIcon, slug: 'view-menu' },
    { id: 'inventory', label: 'Inventory', icon: Package, slug: 'view-inventory' },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3, slug: 'view-reports' },
    { id: 'staff', label: 'Staff & Roles', icon: Users, slug: 'view-staff' },
    { id: 'permissions', label: 'Access Control', icon: ShieldCheck, slug: 'manage-permissions' },
  ];

  const filteredNavItems = navItems.filter(item => can(item.slug));

  if (!isInitialized) return null; 
  if (!token || !user) return <Login />;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/'; 
  };

  // --- VIEW RENDERING ---
  const renderView = () => {
    const activeItem = navItems.find(item => item.id === currentView);
    if (activeItem && !can(activeItem.slug)) {
      return <Dashboard />;
    }

    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'pos': return <POSTerminal tableId={selectedTableId} />;
      case 'floor': 
        return (
          <FloorPlan 
            canManageLayout={can('manage-tables')} 
            canCreateOrder={can('create-order')}
            onStartOrder={(id) => { 
              if (can('create-order')) {
                setSelectedTableId(id); 
                setCurrentView('pos'); 
              } else {
                alert("Access Denied: You do not have permission to create orders.");
              }
            }} 
          />
        );

      // --- Kitchen Case Added ---
      case 'kitchen': 
        return <KitchenDisplay userPermissions={user.permissions} />;

      case 'menu': return <MenuManagement />;
      case 'inventory': return <Inventory />;
      case 'reports': return <Reports />;
      case 'staff': return <StaffManagement />;
      case 'permissions': return <RolePermissionMatrix />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Section */}
      <aside className={`fixed lg:relative z-50 w-64 h-full bg-white border-r transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 font-black text-xl italic tracking-tight flex items-center gap-2 border-b">
            <div className="p-2 bg-slate-900 text-white rounded-lg"><ChefHat size={20}/></div>
            RestoPOS
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <item.icon size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t bg-white">
            <div className="p-4 bg-slate-50 rounded-2xl mb-2">
                <p className="text-[8px] font-black uppercase text-slate-400">Personalized Access</p>
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-medium capitalize">{user.role?.role_name || 'Staff'}</p>
            </div>
            <button onClick={handleLogout} className="w-full py-3 text-red-500 font-black text-[10px] uppercase hover:bg-red-50 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                <LogOut size={14}/> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
           <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600"><MenuIconLucide/></button>
           <div className="flex items-center gap-4 ml-auto">
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"/>
                <span className="text-[9px] font-black uppercase tracking-tighter">Verified: {user.name}</span>
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
            {renderView()}
        </div>
      </main>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}