// src/constants/index.ts

export const ANALYTICS_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export const TOP_ITEMS = [
  { name: 'Cheese Burger', orders: 120, price: 15 },
  { name: 'Margherita Pizza', orders: 95, price: 22 },
  { name: 'Pasta Carbonara', orders: 80, price: 18 },
  { name: 'Chicken Wings', orders: 75, price: 12 },
];

export const RECENT_ORDERS = [
  { id: '#ORD-001', table: 'T-05', status: 'Paid', amount: 45.00 },
  { id: '#ORD-002', table: 'T-12', status: 'Pending', amount: 32.50 },
  { id: '#ORD-003', table: 'T-08', status: 'Paid', amount: 120.00 },
  { id: '#ORD-004', table: 'T-02', status: 'Paid', amount: 85.00 },
];

export const TABLES = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  label: `T-${i + 1}`,
  status: i % 3 === 0 ? 'occupied' : 'available'
}));