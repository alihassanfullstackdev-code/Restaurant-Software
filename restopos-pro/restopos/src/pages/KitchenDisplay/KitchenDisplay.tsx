import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Loader2, Package } from 'lucide-react';
import { OrderCard } from '../../components/OrderCard';
import { KitchenHeader } from '../../components/kitchen/KitchenHeader';
import { KitchenFooter } from '../../components/kitchen/KitchenFooter';
import { KitchenHistory } from '../../components/kitchen/KitchenHistory';
import { KitchenInventory } from '../../components/kitchen/KitchenInventory'; // Imported
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface KitchenDisplayProps {
  userPermissions?: any;
}

export default function KitchenDisplay({ userPermissions }: KitchenDisplayProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Updated State to include 'inventory'
  const [currentView, setCurrentView] = useState<'active' | 'history' | 'inventory'>('active');

  const fetchOrders = async (showLoading = false) => {
    // Inventory view par orders fetch nahi karne
    if (currentView !== 'active') return;

    if (showLoading) setLoading(true);
    
    try {
      const filterParam = activeFilter === 'All' ? 'all' : activeFilter.toLowerCase();
      const response = await axios.get(`${API_BASE_URL}/kitchen-orders`, {
        params: { type: filterParam }
      });

      const rawData = response.data.data || response.data;
      
      const formattedOrders = rawData.map((order: any) => ({
        id: order.id,
        typeLabel: order.order_type,
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: order.kitchen_status,
        is_critical: (new Date().getTime() - new Date(order.created_at).getTime()) / 60000 > 15,
        items: order.items.map((item: any) => ({
          qty: item.quantity,
          name: item.product?.name || 'Unknown Item',
          notes: item.notes || '',
          isMain: true
        })),
        specialInstructions: order.notes || ''
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Fetch Error:", error);
      if (showLoading) setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);

    const interval = setInterval(() => {
      fetchOrders(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [activeFilter, currentView]);

  const handleComplete = async (orderId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/kitchen-orders/${orderId}`, { status: 'ready' });
      if (response.status === 200) {
        setOrders(prev => prev.filter(o => o.id.toString() !== orderId.toString()));
        
        Swal.fire({ 
          toast: true, 
          position: 'top-end', 
          icon: 'success', 
          title: 'Order Ready!', 
          showConfirmButton: false, 
          timer: 1000,
          background: '#111827',
          color: '#fff'
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const getCounts = (allOrders: any[]) => {
    return {
      dineIn: allOrders.filter(o => o.typeLabel === 'dine-in').length,
      delivery: allOrders.filter(o => o.typeLabel === 'delivery').length,
      takeaway: allOrders.filter(o => o.typeLabel === 'takeaway').length,
      total: allOrders.length
    };
  };

  return (
    <div className="flex flex-col h-screen lg:h-[calc(100dvh-64px)] bg-[#0a0f18] text-slate-100 overflow-hidden">
      
      <KitchenHeader 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter} 
        setLoading={setLoading}
        currentView={currentView}
        setView={setCurrentView} 
      />

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {currentView === 'active' ? (
          loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : orders.length > 0 ? (
            <div className="flex flex-col lg:flex-row h-full p-4 lg:p-8 gap-6 min-w-0 lg:min-w-max">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onComplete={() => handleComplete(order.id)} />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
              <Filter size={40} className="mb-2" />
              <p className="font-bold tracking-widest uppercase text-xs">No Active {activeFilter !== 'All' ? activeFilter : ''} Orders</p>
            </div>
          )
        ) : currentView === 'history' ? (
          <KitchenHistory /> 
        ) : (
          <KitchenInventory /> /* Render Kitchen Inventory View */
        )}
      </main>

      <KitchenFooter 
        orderCount={orders.length} 
        criticalCount={orders.filter(o => o.is_critical).length} 
        counts={getCounts(orders)}
      />
    </div>
  );
}