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
    stock: number;
    min_stock: number;
  }[];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Vendas do dia
    const { data: todaySales, error: todayError } = await supabase
      .from('sales')
      .select('total')
      .gte('created_at', startOfToday.toISOString());

    if (todayError) throw todayError;

    // Vendas do mês
    const { data: monthSales, error: monthError } = await supabase
      .from('sales')
      .select('total')
      .gte('created_at', firstDayOfMonth.toISOString());

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
      .select('id, name, stock, min_stock')
      .lt('stock', 10)
      .order('stock', { ascending: true })
      .limit(5);

    if (lowStockError) throw lowStockError;

    // Calcula métricas
    const totalSalesToday = todaySales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
    const totalSalesMonth = monthSales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
    const averageTicket = monthSales?.length
      ? totalSalesMonth / monthSales.length
      : 0;


    // Formata produtos mais vendidos
    const formattedTopProducts = topProducts?.map(item => ({
      id: item.product_id,
      name: item.products?.name || 'Produto Removido',
      total_quantity: item.quantity,
      total_sales: item.total
    })) || [];

    // Formata produtos com estoque baixo
    const formattedLowStock = lowStock?.map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.stock,
      stock: product.stock,
      min_stock: product.min_stock
    })) || [];

    return {
      totalSalesToday,
      totalSalesMonth,
      averageTicket,
      topProducts: formattedTopProducts,
      lowStockProducts: formattedLowStock
    };

  } catch (error) {
    console.error('Erro ao carregar métricas:', error);
    throw new Error('Erro ao carregar métricas do dashboard');
  }
}
