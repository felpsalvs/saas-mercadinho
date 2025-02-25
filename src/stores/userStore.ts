import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

type UserStore = {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, error: null })
    }),
    {
      name: 'user-store'
    }
  )
) 