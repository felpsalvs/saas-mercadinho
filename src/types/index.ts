export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  unit: "kg" | "unit";
  barcode?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out";
  quantity: number;
  reason: "purchase" | "sale" | "loss" | "adjustment" | "return";
  notes?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  payments: Payment[];
  status: "pending" | "completed" | "cancelled";
  customerName?: string;
  customerDocument?: string;
  notes?: string;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unit: "kg" | "unit";
  total: number;
  discount?: number;
}

export interface Payment {
  method: "pix" | "cash" | "credit" | "debit";
  amount: number;
  installments?: number;
  cardBrand?: string;
  authorizationCode?: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "cashier";
  createdAt: Date;
  updatedAt: Date;
}
