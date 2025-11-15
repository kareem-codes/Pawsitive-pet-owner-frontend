import { apiClient } from '@/lib/api-client'
import { ApiResponse, PaginatedResponse } from '@/types'

export interface ShopOrderItem {
  product_id: number
  quantity: number
}

export interface ShopOrderRequest {
  items: ShopOrderItem[]
  shipping_address: string
  shipping_city?: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_phone: string
  notes?: string
}

export interface ShopOrder {
  id: number
  invoice_number: string
  user_id: number
  invoice_date: string
  due_date: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  paid_amount: number
  status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled'
  notes: string
  created_at: string
  updated_at: string
  items: Array<{
    id: number
    item_name: string
    description: string
    quantity: number
    unit_price: number
    tax_amount: number
    total: number
    product?: {
      id: number
      name: string
      image_url?: string
    }
  }>
}

export const orderService = {
  async placeOrder(orderData: ShopOrderRequest): Promise<ApiResponse<{ order: ShopOrder }>> {
    const response = await apiClient.post<ApiResponse<{ order: ShopOrder }>>(
      '/shop/orders',
      orderData
    )
    return response
  },

  async getOrders(params?: { page?: number; per_page?: number }): Promise<PaginatedResponse<ShopOrder>> {
    const response = await apiClient.get<PaginatedResponse<ShopOrder>>(
      '/shop/orders',
      { params }
    )
    return response
  },

  async getOrderById(id: number): Promise<ShopOrder> {
    const response = await apiClient.get<ShopOrder>(`/shop/orders/${id}`)
    return response
  },
}
