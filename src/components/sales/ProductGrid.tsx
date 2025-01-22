import React from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/format';
import { AlertTriangle } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">Nenhum produto encontrado</p>
          <p className="text-sm">Tente uma busca diferente</p>
        </div>
      ) : (
        products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductSelect(product)}
            className="group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col"
          >
            {/* Indicador de estoque baixo */}
            {product.stock <= product.minStock && (
              <div className="absolute top-2 right-2">
                <AlertTriangle className="text-amber-500" size={16} />
              </div>
            )}

            {/* Sem estoque */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium transform -rotate-12">
                  Sem Estoque
                </span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-2">
                {product.name}
              </h3>
              
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.unit === 'kg' ? 'Por Kg' : 'Unidade'}
                </span>
                {product.stock > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    • {product.stock} {product.unit === 'kg' ? 'kg' : 'un'} disponível
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-lg font-semibold text-orange-600 dark:text-orange-500">
                {formatCurrency(product.price)}
              </p>

              <div className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500 rounded-full">
                {product.unit === 'kg' ? 'KG' : 'UN'}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  );
}