import { useState, useEffect, useCallback, useMemo } from "react";
import { getProducts } from "../services/products";
import type { Product } from "../types";

interface UseProductsOptions {
  pageSize?: number;
  initialPage?: number;
  searchTerm?: string;
  category?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  searchByBarcode: (barcode: string) => Promise<Product | null>;
  filteredProducts: Product[];
  totalProducts: number;
}

// Cache de produtos
const productsCache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function useProducts({
  pageSize = 20,
  initialPage = 1,
  searchTerm = "",
  category,
}: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  // Função para carregar produtos com cache
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = `products-${category || "all"}`;
      const cached = productsCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setProducts(cached.data);
        return;
      }

      const data = await getProducts({ category });
      
      if (Array.isArray(data)) {
        setProducts(data);
        
        // Atualiza o cache
        productsCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      } else {
        setError("Formato de dados inválido");
      }

    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Carrega produtos iniciais
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Filtra produtos baseado na busca e categoria
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    return products.filter((product) => {
      if (!product) return false;

      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode?.includes(searchTerm)
        : true;

      const matchesCategory = category
        ? product.category === category
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, category]);

  // Produtos paginados
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, pageSize]);

  // Função para carregar mais produtos
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const offset = (nextPage - 1) * pageSize;

      const moreProducts = await getProducts({
        category,
        limit: pageSize,
        offset,
      });

      if (Array.isArray(moreProducts) && moreProducts.length > 0) {
        setProducts((prev) => [...prev, ...moreProducts]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar mais produtos");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize, category]);

  // Função para buscar produto por código de barras
  const searchByBarcode = useCallback(async (barcode: string): Promise<Product | null> => {
    try {
      const results = await getProducts({ barcode });
      return Array.isArray(results) && results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  return {
    products: paginatedProducts,
    loading,
    error,
    reload: loadProducts,
    page,
    setPage,
    hasMore,
    loadMore,
    searchByBarcode,
    filteredProducts,
    totalProducts: filteredProducts.length,
  };
}
