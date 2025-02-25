import { create } from 'zustand'

type Product = {
  id: string
  name: string
  price: number
  description: string
  stock: number
  category: string
}

type ProductStore = {
  products: Product[]
  isLoading: boolean
  error: string | null
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  setProducts: (products) => set({ products }),
  addProduct: (product) => 
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
})) 