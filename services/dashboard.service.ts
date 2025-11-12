import { apiClient } from '@/lib/api-client'
import { ApiResponse, DashboardStats } from '@/types'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard')
    return response.data
  },
}
