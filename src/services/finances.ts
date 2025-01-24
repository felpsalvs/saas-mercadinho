import { supabase } from "../lib/supabase";
import type { Bill, Payment } from "../types";

interface GetBillsOptions {
  type?: "payable" | "receivable";
  status?: "pending" | "paid" | "overdue";
  startDate?: Date;
  endDate?: Date;
  customerId?: string;
}

export async function getBills(options: GetBillsOptions = {}) {
  let query = supabase
    .from("bills")
    .select("*, customer:customers(name)", { count: "exact" });

  if (options.type) {
    query = query.eq("type", options.type);
  }

  if (options.status) {
    query = query.eq("status", options.status);
  }

  if (options.startDate) {
    query = query.gte("due_date", options.startDate.toISOString());
  }

  if (options.endDate) {
    query = query.lte("due_date", options.endDate.toISOString());
  }

  if (options.customerId) {
    query = query.eq("customer_id", options.customerId);
  }

  const { data, error, count } = await query.order("due_date");
  if (error) throw error;
  return { data, count };
}

export async function createBill(bill: Omit<Bill, "id" | "createdAt" | "updatedAt">) {
  const { data, error } = await supabase
    .from("bills")
    .insert({
      ...bill,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBill(id: string, bill: Partial<Bill>) {
  const { data, error } = await supabase
    .from("bills")
    .update({
      ...bill,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function recordPayment(billId: string, payment: Omit<Payment, "id">) {
  // Inicia uma transação
  const { data: bill, error: billError } = await supabase
    .from("bills")
    .select("amount_paid, total_amount, status")
    .eq("id", billId)
    .single();

  if (billError) throw billError;

  const newAmountPaid = (bill.amount_paid || 0) + payment.amount;
  const newStatus = newAmountPaid >= bill.total_amount ? "paid" : "pending";

  const { error: paymentError } = await supabase.from("payments").insert({
    ...payment,
    bill_id: billId,
    created_at: new Date(),
  });

  if (paymentError) throw paymentError;

  const { data, error } = await supabase
    .from("bills")
    .update({
      amount_paid: newAmountPaid,
      status: newStatus,
      updated_at: new Date(),
    })
    .eq("id", billId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDashboardData(startDate: Date, endDate: Date) {
  const { data, error } = await supabase.rpc("get_financial_dashboard", {
    p_start_date: startDate.toISOString(),
    p_end_date: endDate.toISOString(),
  });

  if (error) throw error;
  return data;
}
