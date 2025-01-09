import { supabase } from "../lib/supabase";
import type { Sale, SaleItem, Payment } from "../types";

export async function createSale(items: SaleItem[], payments: Payment[]) {
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      total: items.reduce((sum, item) => sum + item.total, 0),
    })
    .select()
    .single();

  if (saleError) throw saleError;

  const { error: itemsError } = await supabase.from("sale_items").insert(
    items.map((item) => ({
      sale_id: sale.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    }))
  );

  if (itemsError) throw itemsError;

  const { error: paymentsError } = await supabase.from("payments").insert(
    payments.map((payment) => ({
      sale_id: sale.id,
      method: payment.method,
      amount: payment.amount,
    }))
  );

  if (paymentsError) throw paymentsError;

  // Atualiza o estoque dos produtos
  for (const item of items) {
    await supabase.rpc("update_stock_after_sale", {
      p_product_id: item.productId,
      p_quantity: item.quantity,
    });
  }

  return sale;
}
