import { create } from 'zustand'

type Modal = {
  id: string
  isOpen: boolean
  data?: any
}

type UIStore = {
  isLoading: boolean
  modals: Modal[]
  notifications: string[]
  setLoading: (loading: boolean) => void
  openModal: (modalId: string, data?: any) => void
  closeModal: (modalId: string) => void
  addNotification: (message: string) => void
  removeNotification: (index: number) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  modals: [],
  notifications: [],
  setLoading: (loading) => set({ isLoading: loading }),
  openModal: (modalId, data) =>
    set((state) => ({
      modals: [
        ...state.modals.filter(m => m.id !== modalId),
        { id: modalId, isOpen: true, data }
      ]
    })),
  closeModal: (modalId) =>
    set((state) => ({
      modals: state.modals.filter(m => m.id !== modalId)
    })),
  addNotification: (message) =>
    set((state) => ({
      notifications: [...state.notifications, message]
    })),
  removeNotification: (index) =>
    set((state) => ({
      notifications: state.notifications.filter((_, i) => i !== index)
    }))
})) 