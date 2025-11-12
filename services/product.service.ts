import { apiClient } from '@/lib/api-client'
import { ApiResponse, Product, PaginatedResponse } from '@/types'

export const productService = {
  async getAll(params?: { category?: string; search?: string; page?: number }): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product>>(
      '/products',
      { params }
    )
    return response
  },

  async getById(id: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data
  },

  async getCategories(): Promise<string[]> {
    try {
      // Derive categories from products
      const response = await this.getAll()
      if (!response || !response.data) {
        return []
      }
      const categories = Array.from(new Set(response.data.map(p => p.category)))
      return categories.filter(Boolean) // Remove any null/undefined values
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },
}
