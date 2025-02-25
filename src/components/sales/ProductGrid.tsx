import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (productId: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function ProductGrid({
  products = [],
  onProductSelect,
  searchTerm = '',
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ProductGridProps) {
  // Extrair categorias únicas dos produtos
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p?.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [products]);

  // Filtra produtos
  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    
    const productName = product.name || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = productName.toLowerCase().includes(searchTermLower);
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light-tertiary dark:text-text-dark-tertiary" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar produtos..."
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-lg",
              "bg-surface-light dark:bg-surface-dark",
              "border border-border-light dark:border-border-dark",
              "text-text-light-primary dark:text-text-dark-primary",
              "placeholder:text-text-light-tertiary dark:placeholder:text-text-dark-tertiary",
              "focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
              "transition duration-200"
            )}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              selectedCategory === null
                ? "bg-primary-500 text-white shadow-md hover:bg-primary-600"
                : "bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-hover-light dark:hover:bg-hover-dark"
            )}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-md hover:bg-primary-600"
                  : "bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-hover-light dark:hover:bg-hover-dark"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductSelect(product.id)}
            disabled={product.stock <= 0}
            className={cn(
              "flex flex-col p-4 rounded-lg text-left transition-all duration-200",
              "bg-surface-light dark:bg-surface-dark",
              "border border-border-light dark:border-border-dark",
              "hover:shadow-md-light dark:hover:shadow-md-dark",
              "hover:border-primary-500/50 dark:hover:border-primary-500/50",
              "group",
              product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-medium text-text-light-primary dark:text-text-dark-primary group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {product.name}
              </h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                {formatCurrency(product.price)} / {product.unit}
              </p>
              {product.stock && (
                <p className="text-sm text-text-light-tertiary dark:text-text-dark-tertiary mt-1">
                  Estoque: {product.stock} {product.unit}
                </p>
              )}
            </div>
          </button>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </div>
  );
}