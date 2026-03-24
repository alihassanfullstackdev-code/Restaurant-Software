import { MenuItem, Table, Order } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    price: 12.50,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-BRG-01',
    status: 'active',
    stock: 45
  },
  {
    id: '2',
    name: 'Salmon Sushi Platter',
    price: 18.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-SUS-02',
    status: 'active',
    stock: 20
  },
  {
    id: '3',
    name: 'Pesto Pasta',
    price: 14.25,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-PST-03',
    status: 'active',
    stock: 30
  },
  {
    id: '4',
    name: 'Fresh Orange Juice',
    price: 4.50,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-BEV-04',
    status: 'active',
    stock: 100
  },
  {
    id: '5',
    name: 'Quinoa Salad',
    price: 11.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-SAL-05',
    status: 'active',
    stock: 25
  },
  {
    id: '6',
    name: 'Margherita Pizza',
    price: 16.50,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-PIZ-06',
    status: 'active',
    stock: 15
  },
  {
    id: '7',
    name: 'Choco Glazed Donut',
    price: 3.25,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-DES-07',
    status: 'active',
    stock: 50
  },
  {
    id: '8',
    name: 'BBQ Pork Sliders',
    price: 13.75,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    sku: 'SKU-SLD-08',
    status: 'active',
    stock: 12
  }
];

export const TABLES: Table[] = [
  { id: 't1', label: 'T1', status: 'available', capacity: 4, section: 'Window', type: 'square' },
  { id: 't2', label: 'T2', status: 'occupied', capacity: 2, section: 'Window', type: 'round' },
  { id: 't3', label: 'T3', status: 'available', capacity: 4, section: 'Window', type: 'square' },
  { id: 'b1', label: 'B1 (Booth)', status: 'occupied', capacity: 6, section: 'Window', type: 'square' },
  { id: 't4', label: 'T4', status: 'available', capacity: 4, section: 'Window', type: 'square' },
  { id: 't5', label: 'T5', status: 'reserved', capacity: 4, section: 'Main', type: 'square' },
  { id: 't6', label: 'T6', status: 'available', capacity: 2, section: 'Main', type: 'round' },
  { id: 't7', label: 'T7', status: 'available', capacity: 4, section: 'Main', type: 'square' },
  { id: 't8', label: 'T8', status: 'occupied', capacity: 4, section: 'Main', type: 'square' },
  { id: 't9', label: 'T9', status: 'occupied', capacity: 4, section: 'Main', type: 'square' },
  { id: 't10', label: 'T10', status: 'available', capacity: 2, section: 'Main', type: 'round' },
  { id: 't11', label: 'T11', status: 'reserved', capacity: 4, section: 'Main', type: 'square' },
  { id: 't12', label: 'T12', status: 'selected', capacity: 4, section: 'Main', type: 'square' },
  { id: 't13', label: 'T13', status: 'available', capacity: 4, section: 'Main', type: 'square' },
  { id: 't14', label: 'T14', status: 'available', capacity: 4, section: 'Main', type: 'square' },
  { id: 't15', label: 'T15', status: 'occupied', capacity: 4, section: 'Main', type: 'square' },
  { id: 't16', label: 'T16', status: 'available', capacity: 4, section: 'Main', type: 'square' },
  { id: 't17', label: 'T17', status: 'available', capacity: 2, section: 'Main', type: 'round' },
  { id: 't18', label: 'T18', status: 'available', capacity: 4, section: 'Main', type: 'square' },
];

export const RECENT_ORDERS: Order[] = [
  {
    id: 'ORD-2841',
    tableId: 'T-08',
    status: 'paid',
    timestamp: '14:24 PM',
    type: 'dine-in',
    items: [
      { id: '1', menuItemId: '1', name: 'Classic Cheeseburger', price: 12.50, quantity: 2 },
      { id: '2', menuItemId: '3', name: 'Pesto Pasta', price: 14.25, quantity: 1 },
    ]
  },
  {
    id: 'ORD-2840',
    tableId: 'T-12',
    status: 'pending',
    timestamp: '14:18 PM',
    type: 'dine-in',
    items: [
      { id: '3', menuItemId: '6', name: 'Margherita Pizza', price: 16.50, quantity: 1 },
    ]
  },
  {
    id: 'ORD-2839',
    tableId: 'T-05',
    status: 'paid',
    timestamp: '14:05 PM',
    type: 'dine-in',
    items: [
      { id: '4', menuItemId: '2', name: 'Salmon Sushi Platter', price: 18.00, quantity: 3 },
    ]
  }
];
