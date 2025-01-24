import { supabase } from "../lib/supabase";
import type { Customer } from "../types";

interface GetCustomersOptions {
  search?: string;
  orderBy?: keyof Customer;
  limit?: number;
  offset?: number;
}

export async function getCustomers(options: GetCustomersOptions = {}) {
  let query = supabase.from("customers").select("*", { count: "exact" });

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%, document.ilike.%${options.search}%`);
  }

  if (options.orderBy) {
    query = query.order(options.orderBy);
  } else {
    query = query.order("name");
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function createCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">) {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      ...customer,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  const { data, error } = await supabase
    .from("customers")
    .update({
      ...customer,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCustomerPurchaseHistory(customerId: string) {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      items:sale_items(
        product:products(name)
      )
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
