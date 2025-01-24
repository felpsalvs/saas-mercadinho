import { supabase } from "../lib/supabase";
import { Sale, SaleItem, Payment } from "../types";

interface PaymentFees {
  pix: number;
  credit: number;
  debit: number;
  cash: number;
  check: number;
  transfer: number;
  other: number;
}

const PAYMENT_FEES: PaymentFees = {
  pix: 0.01, // 1%
  credit: 0.03, // 3%
  debit: 0.02, // 2%
  cash: 0, // Sem taxa
  check: 0,
  transfer: 0.01,
  other: 0
};

export async function createSale(
  items: Omit<SaleItem, "total">[],
  payments: Omit<Payment, "timestamp" | "status">[],
  notes?: string
) {
  // Calcula totais e lucros
  const saleItems = await Promise.all(
    items.map(async (item) => {
      const { data: product } = await supabase
        .from("products")
        .select("cost, price, stock")
        .eq("id", item.productId)
        .single();

      if (!product) throw new Error("Produto não encontrado");
      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para ${item.productName}`);
      }

      const total = item.price * item.quantity;
      const cost = (product.cost || 0) * item.quantity;
      const profit = total - cost;

      return {
        ...item,
        total,
        cost,
        profit,
      };
    })
  );

  // Calcula total e taxas dos pagamentos
  const processedPayments = payments.map((payment) => {
    const fee = PAYMENT_FEES[payment.method as keyof PaymentFees] || 0;
    const feeAmount = payment.amount * fee;
    
    return {
      ...payment,
      timestamp: new Date(),
      status: "approved" as const,
      fee,
      feeAmount,
    };
  });

  const saleTotal = saleItems.reduce((sum, item) => sum + item.total, 0);
  const paymentsTotal = processedPayments.reduce((sum, p) => sum + p.amount, 0);

  if (paymentsTotal !== saleTotal) {
    throw new Error("Total dos pagamentos não corresponde ao total da venda");
  }

  // Calcula lucro
  let totalCost = 0;
  for (const item of saleItems) {
    totalCost += item.cost;
  }

  const grossProfit = saleTotal - totalCost;
  const netProfit = grossProfit - processedPayments.reduce((sum, p) => sum + p.feeAmount, 0);

  // Inicia transação
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      items: saleItems,
      payments: processedPayments,
      total: saleTotal,
      totalCost,
      totalProfit: grossProfit,
      totalFees: processedPayments.reduce((sum, p) => sum + p.feeAmount, 0),
      netProfit,
      status: "completed",
      notes,
      saleDate: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
    .single();

  if (saleError) throw saleError;

  // Atualiza estoque
  for (const item of saleItems) {
    const { error: stockError } = await supabase
      .from("products")
      .update({
        stock: supabase.raw(`stock - ${item.quantity}`),
        updated_at: new Date(),
      })
      .eq("id", item.productId);

    if (stockError) throw stockError;

    // Registra movimento de estoque
    const { error: movementError } = await supabase
      .from("stock_movements")
      .insert({
        product_id: item.productId,
        type: "out",
        quantity: item.quantity,
        reason: "sale",
        notes: `Venda #${sale.id}`,
        created_at: new Date(),
      });

    if (movementError) throw movementError;
  }

  return sale;
}

export async function getSaleDetails(saleId: string) {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      items:sale_items(
        *,
        product:products(name, cost)
      )
    `)
    .eq("id", saleId)
    .single();

  if (error) throw error;
  return data;
}

export async function getSales(startDate?: Date, endDate?: Date) {
  let query = supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false });

  if (startDate) {
    query = query.gte("created_at", startDate.toISOString());
  }

  if (endDate) {
    query = query.lte("created_at", endDate.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getDailySummary() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .gte("created_at", today.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;

  const summary = {
    totalSales: data.length,
    totalAmount: data.reduce((sum, sale) => sum + sale.total, 0),
    totalProfit: data.reduce((sum, sale) => sum + sale.totalProfit, 0),
    totalFees: data.reduce((sum, sale) => sum + sale.totalFees, 0),
    netProfit: data.reduce((sum, sale) => sum + sale.netProfit, 0),
    byPaymentMethod: data.reduce((acc, sale) => {
      sale.payments.forEach((payment) => {
        if (!acc[payment.method]) {
          acc[payment.method] = {
            amount: 0,
            fees: 0,
            count: 0,
          };
        }
        acc[payment.method].amount += payment.amount;
        acc[payment.method].fees += payment.feeAmount;
        acc[payment.method].count += 1;
      });
      return acc;
    }, {} as Record<string, { amount: number; fees: number; count: number }>),
  };

  return summary;
}
