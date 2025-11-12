import { apiClient } from '@/lib/api-client'
import { ApiResponse, Invoice, PaginatedResponse } from '@/types'

export const invoiceService = {
  async getAll(params?: { status?: string; page?: number }): Promise<PaginatedResponse<Invoice>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Invoice>>>(
      '/invoices',
      { params }
    )
    return response.data
  },

  async getById(id: number): Promise<Invoice> {
    const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`)
    return response.data
  },

  async downloadPdf(id: number): Promise<Blob> {
    const response = await apiClient.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    })
    return response as any
  },
}
