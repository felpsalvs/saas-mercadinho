import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...product, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateStock(id: string, quantity: number, type: 'in' | 'out', reason: string, notes?: string) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', id)
    .single();

  if (productError) throw productError;

  const newStock = type === 'in' 
    ? product.stock + quantity
    : product.stock - quantity;

  if (newStock < 0) throw new Error('Estoque insuficiente');

  const { error: movementError } = await supabase
    .from('stock_movements')
    .insert({
      product_id: id,
      type,
      quantity,
      reason,
      notes
    });

  if (movementError) throw movementError;

  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock, updated_at: new Date() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}