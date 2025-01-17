import { supabase } from "../lib/supabase";

export interface DashboardMetrics {
  totalSalesToday: number;
  totalSalesMonth: number;
  averageTicket: number;
  topProducts: Array<{
    id: string;
    name: string;
    total_quantity: number;
    total_sales: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    min_stock: number;
  }>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Vendas do dia
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: todaySales, error: todayError } = await supabase
    .from("sales")
    .select("total")
    .gte("created_at", today.toISOString());

  if (todayError) throw todayError;

  // Vendas do mês
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const { data: monthSales, error: monthError } = await supabase
    .from("sales")
    .select("total")
    .gte("created_at", firstDayOfMonth.toISOString());

  if (monthError) throw monthError;

  // Produtos mais vendidos
  const { data: topProducts, error: topError } = await supabase
    .from("sale_items")
    .select(`
      product_id,
      products (
        name
      ),
      quantity,
      total
    `)
    .gte("created_at", firstDayOfMonth.toISOString())
    .order("quantity", { ascending: false })
    .limit(5);

  if (topError) throw topError;

  // Produtos com estoque baixo
  const { data: lowStock, error: lowStockError } = await supabase
    .from("products")
    .select("id, name, stock, min_stock")
    .lt("stock", supabase.raw("min_stock"))
    .order("stock", { ascending: true });

  if (lowStockError) throw lowStockError;

  // Calcular métricas
  const totalSalesToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSalesMonth = monthSales.reduce((sum, sale) => sum + sale.total, 0);
  const averageTicket = monthSales.length > 0 
    ? totalSalesMonth / monthSales.length 
    : 0;

  // Agregar produtos mais vendidos
  const aggregatedTopProducts = topProducts.reduce((acc, item) => {
    const existingProduct = acc.find(p => p.id === item.product_id);
    if (existingProduct) {
      existingProduct.total_quantity += item.quantity;
      existingProduct.total_sales += item.total;
    } else {
      acc.push({
        id: item.product_id,
        name: item.products.name,
        total_quantity: item.quantity,
        total_sales: item.total,
      });
    }
    return acc;
  }, [] as DashboardMetrics["topProducts"]);

  return {
    totalSalesToday,
    totalSalesMonth,
    averageTicket,
    topProducts: aggregatedTopProducts,
    lowStockProducts: lowStock,
  };
}
