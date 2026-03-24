export type View = 
  | 'dashboard' 
  | 'pos' 
  | 'floor' 
  | 'kds' 
  | 'menu' 
  | 'inventory' 
  | 'reports' 
  | 'staff' 
  | 'settings';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  sku: string;
  status: 'active' | 'archived' | 'draft';
  stock: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  instructions?: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'paid' | 'voided';
  timestamp: string;
  type: 'dine-in' | 'takeaway' | 'delivery';
  guests?: number;
  server?: string;
}

export interface Floor {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResturantTable {
  merge_id?: number | null;
  id: number;
  table_number: string;
  seating_capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  floor_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: string;
  label: string;
  status: 'available' | 'occupied' | 'reserved' | 'selected';
  capacity: number;
  section: string;
  type: 'square' | 'round' | 'booth';
}
