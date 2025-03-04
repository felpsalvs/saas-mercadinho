import React, { useRef, useEffect } from 'react';
import { Search, Tag, Package, ShoppingBag } from 'lucide-react';
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
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Função para obter o ícone da categoria
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'alimentos':
        return ShoppingBag;
      case 'bebidas':
        return Package;
      default:
        return Tag;
    }
  };

  // Foca no campo de busca quando Ctrl+F é pressionado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-6 w-6 text-text-light-tertiary dark:text-text-dark-tertiary" />
          <input
            id="product-search"
            ref={searchInputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar produtos... (Ctrl+F)"
            className={cn(
              "w-full pl-12 pr-4 py-4 rounded-lg text-pdv-base",
              "bg-surface-light dark:bg-surface-dark",
              "border-2 border-border-light dark:border-border-dark",
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
              "px-4 py-3 rounded-lg text-pdv-base font-medium transition-all duration-200",
              "flex items-center gap-2",
              selectedCategory === null
                ? "bg-primary-500 text-white shadow-md hover:bg-primary-600"
                : "bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-hover-light dark:hover:bg-hover-dark border border-border-light dark:border-border-dark"
            )}
          >
            <Tag className="h-5 w-5" />
            <span>Todos</span>
            <kbd className="ml-2 px-2 py-1 text-pdv-xs rounded bg-primary-600 text-white border border-primary-700">
              0
            </kbd>
          </button>
          {categories.map((category, index) => {
            const CategoryIcon = getCategoryIcon(category);
            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "px-4 py-3 rounded-lg text-pdv-base font-medium transition-all duration-200",
                  "flex items-center gap-2",
                  selectedCategory === category
                    ? "bg-primary-500 text-white shadow-md hover:bg-primary-600"
                    : "bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-hover-light dark:hover:bg-hover-dark border border-border-light dark:border-border-dark"
                )}
              >
                <CategoryIcon className="h-5 w-5" />
                <span>{category}</span>
                <kbd className="ml-2 px-2 py-1 text-pdv-xs rounded bg-primary-600 text-white border border-primary-700">
                  {index + 1}
                </kbd>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
        {filteredProducts.map((product, index) => (
          <button
            key={product.id}
            onClick={() => onProductSelect(product.id)}
            disabled={product.stock <= 0}
            className={cn(
              "flex flex-col p-4 rounded-lg text-left transition-all duration-200",
              "bg-surface-light dark:bg-surface-dark",
              "border-2 border-border-light dark:border-border-dark",
              "hover:shadow-md-light dark:hover:shadow-md-dark",
              "hover:border-primary-500 dark:hover:border-primary-500",
              "group",
              product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            {/* Product Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-pdv-base text-text-light-primary dark:text-text-dark-primary group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {product.name}
                </h3>
                <kbd className="px-2 py-1 text-pdv-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  {index < 9 ? index + 1 : '*'}
                </kbd>
              </div>
              <p className="text-pdv-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                {formatCurrency(product.price)}
              </p>
              <p className="text-pdv-sm text-text-light-secondary dark:text-text-dark-secondary">
                por {product.unit}
              </p>
              {product.stock && (
                <p className={cn(
                  "text-pdv-sm mt-2",
                  product.stock < 5 
                    ? "text-pdv-error" 
                    : "text-text-light-tertiary dark:text-text-dark-tertiary"
                )}>
                  Estoque: {product.stock} {product.unit}
                </p>
              )}
            </div>
          </button>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center text-pdv-lg text-text-light-tertiary dark:text-text-dark-tertiary py-12">
            Nenhum produto encontrado
          </div>
        )}
      </div>
    </div>
  );
}