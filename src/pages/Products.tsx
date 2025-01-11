import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";
import { StockMovementModal } from "../components/products/StockMovementModal";
import { NewProductForm } from "../components/products/NewProductForm";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { useProducts } from "../hooks/useProducts";
import { updateStock } from "../services/products";
import type { Product, StockMovement } from "../types";

export default function Products() {
  const { products, loading, error, reload } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const handleStockMovement = async (
    movement: Omit<StockMovement, "id" | "createdAt">
  ) => {
    try {
      await updateStock(
        movement.productId,
        movement.quantity,
        movement.type,
        movement.reason,
        movement.notes
      );
      reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar estoque");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={() => setShowNewProductForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Novo Produto
        </button>
        {showNewProductForm && (
          <NewProductForm onClose={() => setShowNewProductForm(false)} />
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Pesquisar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Produto</th>
              <th className="text-left p-4">Preço</th>
              <th className="text-left p-4">Estoque</th>
              <th className="text-left p-4">Estoque Mínimo</th>
              <th className="text-left p-4">Unidade</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">R$ {product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        product.stock <= product.minStock
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.minStock} {product.unit}
                  </td>
                  <td className="p-4">
                    {product.unit === "kg" ? "Kg" : "Unidade"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowStockModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Gerenciar Estoque"
                      >
                        <Package size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
    </div>
  );
}
