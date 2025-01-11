import React from 'react';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onProductSelect(product)}
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <p className="font-medium text-gray-900 truncate">{product.name}</p>
          <p className="text-sm text-gray-500">{product.unit === 'kg' ? 'Por Kg' : 'Unidade'}</p>
          <p className="mt-2 text-lg font-semibold text-orange-600">
            R$ {product.price.toFixed(2)}
          </p>
        </button>
      ))}
    </div>
  );
}