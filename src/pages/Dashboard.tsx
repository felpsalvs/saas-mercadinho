import { useEffect, useState } from "react";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "../services/dashboard";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      const data = await getDashboardMetrics();
      setMetrics(data);
    } catch (err) {
      setError("Erro ao carregar métricas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Vendas Hoje"
          value={formatCurrency(metrics.totalSalesToday)}
          icon="💰"
        />
        <MetricCard
          title="Vendas do Mês"
          value={formatCurrency(metrics.totalSalesMonth)}
          icon="📅"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(metrics.averageTicket)}
          icon="🎫"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos mais vendidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Produto</th>
                  <th className="text-right py-2">Qtd. Vendida</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="text-right">{product.total_quantity}</td>
                    <td className="text-right">
                      {formatCurrency(product.total_sales)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertas de estoque baixo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Alertas de Estoque Baixo
            {metrics.lowStockProducts.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {metrics.lowStockProducts.length}
              </span>
            )}
          </h2>
          {metrics.lowStockProducts.length === 0 ? (
            <p className="text-gray-500">Nenhum produto com estoque baixo</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Produto</th>
                    <th className="text-right py-2">Estoque Atual</th>
                    <th className="text-right py-2">Estoque Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.lowStockProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-2">{product.name}</td>
                      <td className="text-right">
                        <span className="text-red-600 font-medium">
                          {product.stock}
                        </span>
                      </td>
                      <td className="text-right">{product.min_stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
