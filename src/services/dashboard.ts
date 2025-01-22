import { supabase } from "../lib/supabase";

export interface DashboardMetrics {
  totalSalesToday: number;
  totalSalesMonth: number;
  averageTicket: number;
  topProducts: {
    id: string;
    name: string;
    total_quantity: number;
    total_sales: number;
  }[];
  lowStockProducts: {
    id: string;
    name: string;
    quantity: number;
  }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Vendas do dia
  const { data: todaySales, error: todayError } = await supabase
    .from('sales')
    .select('total')
    .gte('sale_date', today.toISOString().split('T')[0]);

  if (todayError) throw todayError;

  // Vendas do mês
  const { data: monthSales, error: monthError } = await supabase
    .from('sales')
    .select('total')
    .gte('sale_date', firstDayOfMonth.toISOString().split('T')[0]);

  if (monthError) throw monthError;

  // Produtos mais vendidos
  const { data: topProducts, error: topError } = await supabase
    .from('sale_items')
    .select(`
      product_id,
      products (name),
      quantity,
      total
    `)
    .order('quantity', { ascending: false })
    .limit(5);

  if (topError) throw topError;

  // Produtos com estoque baixo
  const { data: lowStock, error: lowStockError } = await supabase
    .from('products')
    .select('id, name, quantity')
    .lt('quantity', 10)
    .order('quantity');

  if (lowStockError) throw lowStockError;

  const totalSalesToday = todaySales.reduce((acc, sale) => acc + sale.total, 0);
  const totalSalesMonth = monthSales.reduce((acc, sale) => acc + sale.total, 0);
  const averageTicket = monthSales.length > 0 ? totalSalesMonth / monthSales.length : 0;

  return {
    totalSalesToday,
    totalSalesMonth,
    averageTicket,
    topProducts: topProducts.map(item => ({
      id: item.product_id,
      name: item.products?.name || 'Produto não encontrado',
      total_quantity: item.quantity,
      total_sales: item.total
    })),
    lowStockProducts: lowStock.map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity
    }))
  };
}
