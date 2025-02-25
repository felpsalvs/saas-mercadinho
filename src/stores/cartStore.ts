import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartItem = {
  productId: string
  quantity: number
  price: number
  name: string
}

type CartStore = {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  calculateTotal: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.productId === item.productId)
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }
          return { items: [...state.items, item] }
        })
        get().calculateTotal()
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.productId !== productId)
        }))
        get().calculateTotal()
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
        }))
        get().calculateTotal()
      },
      clearCart: () => set({ items: [], total: 0 }),
      calculateTotal: () => {
        set((state) => ({
          total: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }))
      }
    }),
    {
      name: 'cart-store'
    }
  )
) 