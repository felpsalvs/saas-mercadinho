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
  cost?: number;
  supplier?: string;
  location?: string;
  description?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out";
  quantity: number;
  reason: "purchase" | "sale" | "loss" | "adjustment" | "return";
  notes?: string;
  createdAt: Date;
  cost?: number;
  document?: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  payments: Payment[];
  status: "pending" | "completed" | "cancelled";
  customerName?: string;
  customerDocument?: string;
  customerId?: string;
  notes?: string;
  saleDate: Date;
  createdAt: Date;
  updatedAt: Date;
  seller?: string;
  discount?: number;
  deliveryAddress?: string;
  deliveryStatus?: "pending" | "delivered" | "cancelled";
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  unit: "kg" | "unit";
  total: number;
  discount?: number;
  cost?: number;
}

export interface Payment {
  method: "pix" | "cash" | "credit" | "debit" | "check" | "transfer" | "other";
  amount: number;
  installments?: number;
  cardBrand?: string;
  authorizationCode?: string;
  timestamp: Date;
  status: "pending" | "approved" | "rejected" | "cancelled";
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "cashier" | "manager";
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  lastLogin?: Date;
  permissions?: string[];
}

export interface Customer {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  type: "individual" | "company";
  creditLimit?: number;
  createdAt: Date;
  updatedAt: Date;
  birthDate?: Date;
  loyalty?: {
    points: number;
    level: "bronze" | "silver" | "gold";
  };
}

export interface Bill {
  id: string;
  type: "payable" | "receivable";
  description: string;
  totalAmount: number;
  amountPaid: number;
  dueDate: Date;
  status: "pending" | "paid" | "overdue" | "cancelled";
  category: string;
  customerId?: string;
  installments?: number;
  recurrent?: boolean;
  frequency?: "monthly" | "weekly" | "yearly";
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  category?: string;
  paymentTerms?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    type: string;
  };
}

export interface CashRegister {
  id: string;
  openingDate: Date;
  closingDate?: Date;
  initialAmount: number;
  currentAmount: number;
  status: "open" | "closed";
  userId: string;
  transactions: CashTransaction[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CashTransaction {
  id: string;
  type: "in" | "out";
  amount: number;
  category: string;
  description: string;
  paymentMethod: string;
  timestamp: Date;
  userId: string;
  relatedId?: string;
  notes?: string;
}
