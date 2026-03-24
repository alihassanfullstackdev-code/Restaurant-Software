import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, PlusCircle, Search, History, Share2, ArrowRightLeft, Save, Send } from 'lucide-react';
import { MenuCard } from '../../components/MenuCard'; 
import { CartItem } from '../../components/CartItem';
import { PaymentMethodModal } from '../../components/PaymentMethodModel';
import { AddItemModal } from '../../components/AddItem'; 
import { RecentOrders } from '../../components/RecentOrders'; 
import { PrintModel } from '../../components/PrintModel'; 
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function POSTerminal({ tableId }: { tableId?: number | null }) {
  const [products, setProducts] = useState<any[]>([]); 
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<any>({ id: 'all', name: 'All Items' });
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<any>(null); 
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [servedBy, setServedBy] = useState('');
  const [activeTable, setActiveTable] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (tableId) {
      loadActiveTableOrder(tableId);
    } else {
      resetForm();
      setActiveTable(null);
    }
  }, [tableId]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/categories`)
      ]);
      setProducts(prodRes.data.data || prodRes.data);
      setCategories([{ id: 'all', name: 'All Items' }, ...(catRes.data.data || catRes.data)]);
    } catch (err) { console.error("Fetch Error:", err); }
    setLoading(false);
  };

  const loadActiveTableOrder = async (id: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/orders?table_id=${id}`);
      const order = res.data;

      if (order && order.table) {
        setActiveTable(order.table);
      } else {
        const tableRes = await axios.get(`${API_BASE_URL}/tables/${id}`);
        setActiveTable(tableRes.data);
      }

      if (order && order.id) {
        setEditingOrderId(order.id);
        setCustomerName(order.customer_name || '');
        setServedBy(order.served_by || '');
        
        const itemsFromDB = order.items || order.order_items || [];
        setCart(itemsFromDB.map((it: any) => ({
          id: it.product_id || it.id, 
          name: it.product?.name || it.name || 'Item',
          price: Number(it.price),
          quantity: Number(it.quantity),
          image: it.product?.image || null
        })));
        
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: `Table ${id} order loaded`, showConfirmButton: false, timer: 1500
        });
      } else {
        resetForm();
      }
    } catch (err) {
      console.error("Error loading table order:", err);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCart([]);
    setCustomerName('');
    setServedBy('');
    setEditingOrderId(null);
  };

  const syncWithDatabase = async (status: string, paymentMethod: string = 'cash') => {
    const calculatedTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const finalAmount = parseFloat(calculatedTotal.toFixed(2));

    const payload = {
      // Logic: tableId optional rakha taake takeaway/null handle ho sake
      table_id: tableId || null,
      customer_name: customerName || (status === 'held' || status === 'pending' ? 'Table Order' : 'Walking Customer'),
      served_by: servedBy || 'System',
      total_amount: finalAmount,
      payment_method: paymentMethod,
      status: status, 
      cart: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price)
      }))
    };

    return await axios.post(`${API_BASE_URL}/orders`, payload);
  };

  const handleUpdateOrder = async () => {
    if (cart.length === 0) return;
    try {
      setLoading(true);
      await syncWithDatabase('held'); 
      
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: 'Order Sent to Kitchen', showConfirmButton: false, timer: 2000
      });
      if(tableId) loadActiveTableOrder(tableId);
    } catch (err: any) {
      Swal.fire('Error', 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const processFinalOrder = async (paymentMethod: string) => {
    setShowPaymentModal(false);
    Swal.fire({
      title: 'Finalize & Print?',
      text: "Is order ko mark as PAID karein?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Checkout',
      cancelButtonText: 'Keep Current',
      confirmButtonColor: '#10b981',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await syncWithDatabase('paid', paymentMethod);
          setLastOrder(res.data);
          setShowPrintModal(true);
          resetForm();
          setActiveTable(null); 
        } catch (err: any) { 
          Swal.fire('Error', 'Checkout Failed', 'error'); 
        }
      }
    });
  };

  const displayTotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-100 overflow-hidden font-sans">
      <main className="flex-1 flex flex-col min-w-0 bg-white h-full border-r border-slate-200">
        <header className="p-4 md:p-6 bg-white border-b space-y-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                placeholder="Search dish..." 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-[1.5rem] focus:bg-white outline-none font-bold text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button onClick={() => setShowRecentOrders(true)} className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-blue-50 transition-all">
                <History size={20} />
              </button>
              <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="px-6 py-3.5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 shadow-xl">
                <PlusCircle size={16} className="inline mr-2" /> Add Item
              </button>
            </div>
          </div>
          
          <nav className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat)} 
                className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 whitespace-nowrap transition-all ${activeCategory.id === cat.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/40 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full h-96 flex items-center justify-center opacity-30"><Loader2 className="animate-spin" size={40} /></div>
            ) : products.filter(p => (activeCategory.id === 'all' || p.category_id === activeCategory.id) && p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
              <MenuCard key={product.id} item={product} onAdd={() => {
                const existing = cart.find(i => i.id === product.id);
                if (existing) {
                  setCart(cart.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i));
                } else {
                  setCart([...cart, {...product, quantity: 1}]);
                }
              }} />
            ))}
          </div>
        </section>
      </main>

      <aside className="w-full lg:w-[400px] bg-white flex flex-col h-full shadow-2xl z-20">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1">
                <h2 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                    {tableId ? `Table #${tableId}` : 'Order Terminal'}
                    {activeTable?.merge_id && (
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] border border-blue-100 font-bold">
                            <Share2 size={10} /> MERGED
                        </span>
                    )}
                </h2>
            </div>
            {editingOrderId && <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[9px] font-black rounded-full italic">LIVE ORDER</span>}
          </div>
          
          <div className="space-y-2">
            <input placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none text-sm font-bold outline-none" />
            <input placeholder="Served By" value={servedBy} onChange={(e) => setServedBy(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-none text-sm font-bold outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {cart.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdate={(id, d) => setCart(cart.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} 
              onRemove={(id) => setCart(cart.filter(i => i.id !== id))} 
            />
          ))}
        </div>

        <div className="p-6 bg-white border-t">
          <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase">Total Payable</span>
              <div className="flex items-baseline gap-1"><span className="text-xl font-black text-emerald-600">Rs.</span><span className="text-5xl font-black text-slate-900 tracking-tighter">{displayTotal.toFixed(2)}</span></div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleUpdateOrder} 
                  disabled={cart.length === 0} 
                  className="py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg hover:bg-orange-700 flex items-center justify-center gap-2"
                >
                    <Send size={14} /> KOT / Kitchen
                </button>
                <button 
                  onClick={() => setShowPaymentModal(true)} 
                  disabled={cart.length === 0} 
                  className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-emerald-700"
                >
                    Checkout
                </button>
            </div>
            
            {editingOrderId && (
               <button onClick={resetForm} className="text-[9px] font-bold text-slate-400 uppercase hover:text-red-500 text-center">
                   Cancel Edit / New Order
               </button>
            )}
          </div>
        </div>
      </aside>

      <RecentOrders 
        isOpen={showRecentOrders} 
        onClose={() => setShowRecentOrders(false)} 
        onDirectPrint={(order:any) => { setLastOrder(order); setShowPrintModal(true); }}
        onPreview={(order:any) => { setLastOrder(order); setShowRecentOrders(false); setShowPrintModal(true); }}
        onLoadOrder={(order:any) => {
          setEditingOrderId(order.id);
          const itemsFromDB = order.items || order.order_items || [];
          setCart(itemsFromDB.map((it: any) => ({
            id: it.product_id || it.id, 
            name: it.product?.name || it.name || 'Item',
            price: Number(it.price),
            quantity: Number(it.quantity)
          })));
          setCustomerName(order.customer_name || '');
          setServedBy(order.served_by || '');
          setShowRecentOrders(false);
        }}
      />
      
      <PaymentMethodModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSelect={processFinalOrder} total={displayTotal} />
      {showPrintModal && lastOrder && <PrintModel isOpen={showPrintModal} order={lastOrder} onClose={() => setShowPrintModal(false)} />}
      <AddItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={async () => { fetchInitialData(); setIsModalOpen(false); return null; }} categories={categories} initialData={editingProduct} />
    </div>
  );
}