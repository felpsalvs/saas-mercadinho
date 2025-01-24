import { supabase } from "../lib/supabase";
import type { Product } from "../types";

interface GetProductsOptions {
  category?: string;
  barcode?: string;
  minStock?: boolean;
  search?: string;
  orderBy?: {
    column: keyof Product;
    ascending?: boolean;
  };
  limit?: number;
  offset?: number;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  try {
    let query = supabase.from("products").select("*");

    // Filtros
    if (options.category) {
      query = query.eq("category", options.category);
    }

    if (options.barcode) {
      query = query.eq("barcode", options.barcode);
    }

    if (options.minStock) {
      query = query.lte("stock", supabase.raw("min_stock"));
    }

    if (options.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    // Ordenação
    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
      });
    } else {
      query = query.order("name");
    }

    // Paginação
    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  // Validações
  if (!product.name?.trim()) {
    throw new Error("Nome do produto é obrigatório");
  }

  if (product.price <= 0) {
    throw new Error("Preço deve ser maior que zero");
  }

  if (product.stock < 0) {
    throw new Error("Estoque não pode ser negativo");
  }

  if (product.minStock < 0) {
    throw new Error("Estoque mínimo não pode ser negativo");
  }

  // Verifica se já existe um produto com o mesmo código de barras
  if (product.barcode) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("barcode", product.barcode)
      .single();

    if (existing) {
      throw new Error("Já existe um produto com este código de barras");
    }
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  // Validações
  if (product.name !== undefined && !product.name.trim()) {
    throw new Error("Nome do produto é obrigatório");
  }

  if (product.price !== undefined && product.price <= 0) {
    throw new Error("Preço deve ser maior que zero");
  }

  if (product.stock !== undefined && product.stock < 0) {
    throw new Error("Estoque não pode ser negativo");
  }

  if (product.minStock !== undefined && product.minStock < 0) {
    throw new Error("Estoque mínimo não pode ser negativo");
  }

  // Verifica se já existe um produto com o mesmo código de barras
  if (product.barcode) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("barcode", product.barcode)
      .neq("id", id)
      .single();

    if (existing) {
      throw new Error("Já existe um produto com este código de barras");
    }
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      ...product,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStock(
  id: string,
  quantity: number,
  type: "in" | "out",
  reason: string,
  notes?: string
) {
  // Validações
  if (quantity <= 0) {
    throw new Error("Quantidade deve ser maior que zero");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", id)
    .single();

  if (productError) throw productError;

  const newStock =
    type === "in" ? product.stock + quantity : product.stock - quantity;

  if (newStock < 0) {
    throw new Error("Estoque insuficiente");
  }

  // Inicia uma transação
  const { error: transactionError } = await supabase.rpc("update_stock", {
    p_product_id: id,
    p_quantity: quantity,
    p_type: type,
    p_reason: reason,
    p_notes: notes,
    p_new_stock: newStock
  });

  if (transactionError) throw transactionError;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  // Verifica se o produto tem movimentações
  const { count: movementsCount, error: countError } = await supabase
    .from("stock_movements")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  if (countError) throw countError;

  if (movementsCount && movementsCount > 0) {
    throw new Error("Não é possível excluir um produto com movimentações");
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
