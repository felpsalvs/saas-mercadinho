export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  unit: 'kg' | 'unit';
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: 'purchase' | 'sale' | 'loss' | 'adjustment' | 'return';
  notes?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  payments: Payment[];
  createdAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unit: 'kg' | 'unit';
  total: number;
}

export interface Payment {
  method: 'pix' | 'cash' | 'card';
  amount: number;
  timestamp: Date;
}