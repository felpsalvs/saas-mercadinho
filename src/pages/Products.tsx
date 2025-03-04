import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { StockMovementModal } from "../components/products/StockMovementModal";
import { NewProductForm } from "../components/products/NewProductForm";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { updateStock } from "../services/products";
import type { StockMovement } from "../types";
import { useProductStore, useUIStore } from '../stores';
import { DataTable } from '../components/ui/DataTable';
import { useAsync } from '../hooks/useAsync';

// Definindo o tipo para ProductData baseado no tipo usado no store
interface ProductData {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  // Campos adicionais para a tabela
  minStock?: number;
  unit?: "kg" | "unit";
  createdAt?: string;
  updatedAt?: string;
}

export default function Products() {
  const { products, setProducts, setLoading, setError } = useProductStore();
  const { setLoading: setUILoading } = useUIStore();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const { execute: fetchProducts, loading, error } = useAsync(async () => {
    try {
      setLoading(true);
      setUILoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
      setUILoading(false);
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockMovement = async (
    movement: Omit<StockMovement, "id" | "createdAt">
  ) => {
    try {
      setUILoading(true);
      await updateStock(
        movement.productId,
        movement.quantity,
        movement.type,
        movement.reason,
        movement.notes
      );
      await fetchProducts(); // Recarrega os produtos após atualizar o estoque
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar estoque');
    } finally {
      setUILoading(false);
    }
  };

  const columns = [
    { 
      header: 'Nome', 
      accessor: (product: ProductData) => product.name,
      sortable: true 
    },
    { 
      header: 'Preço', 
      accessor: (product: ProductData) => `R$ ${product.price.toFixed(2)}`,
      sortable: true 
    },
    { 
      header: 'Estoque', 
      accessor: (product: ProductData) => product.stock,
      sortable: true 
    },
    { 
      header: 'Estoque Mínimo', 
      accessor: (product: ProductData) => product.minStock || 0,
      sortable: true 
    },
    { 
      header: 'Unidade', 
      accessor: (product: ProductData) => product.unit || 'unit',
      sortable: true 
    }
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProducts} />;

  // Usar os produtos diretamente, já que o tipo ProductData é compatível
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={() => setShowNewProductForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <DataTable
          data={filteredProducts}
          columns={columns}
          isLoading={loading}
          onRowClick={(product) => {
            setSelectedProduct(product as ProductData);
            setShowStockModal(true);
          }}
        />
      </div>

      {showStockModal && selectedProduct && (
        <StockMovementModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          currentStock={selectedProduct.stock}
          onClose={() => {
            setShowStockModal(false);
            setSelectedProduct(null);
          }}
          onSave={handleStockMovement}
        />
      )}

      {showNewProductForm && (
        <NewProductForm 
          onClose={() => setShowNewProductForm(false)}
          onSuccess={() => {
            setShowNewProductForm(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
