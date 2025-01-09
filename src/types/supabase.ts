export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          stock: number;
          min_stock: number;
          unit: "kg" | "unit";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          stock?: number;
          min_stock?: number;
          unit: "kg" | "unit";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          stock?: number;
          min_stock?: number;
          unit?: "kg" | "unit";
          created_at?: string;
          updated_at?: string;
        };
      };
      stock_movements: {
        Row: {
          id: string;
          product_id: string;
          type: "in" | "out";
          quantity: number;
          reason: "purchase" | "sale" | "loss" | "adjustment" | "return";
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          type: "in" | "out";
          quantity: number;
          reason: "purchase" | "sale" | "loss" | "adjustment" | "return";
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          type?: "in" | "out";
          quantity?: number;
          reason?: "purchase" | "sale" | "loss" | "adjustment" | "return";
          notes?: string;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          total?: number;
          created_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          price: number;
          total: number;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          price: number;
          total: number;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          total?: number;
        };
      };
      payments: {
        Row: {
          id: string;
          sale_id: string;
          method: "pix" | "cash" | "card";
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          method: "pix" | "cash" | "card";
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          method?: "pix" | "cash" | "card";
          amount?: number;
          created_at?: string;
        };
      };
    };
    Functions: {
      update_stock_after_sale: {
        Args: {
          p_product_id: string;
          p_quantity: number;
        };
        Returns: void;
      };
    };
  };
}
