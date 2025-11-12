import { create } from 'zustand'
import { Product, CartItem, Cart } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTax: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id)
      
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      }
      
      return {
        items: [...state.items, { product, quantity }],
      }
    })
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }))
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ),
    }))
  },

  clearCart: () => {
    set({ items: [] })
  },

  getSubtotal: () => {
    const { items } = get()
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  },

  getTax: () => {
    const { items } = get()
    return items.reduce((sum, item) => {
      const itemTotal = item.product.price * item.quantity
      const taxAmount = item.product.tax_percentage 
        ? (itemTotal * item.product.tax_percentage / 100)
        : (item.product.tax_fixed || 0)
      return sum + taxAmount
    }, 0)
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax()
  },
}))
