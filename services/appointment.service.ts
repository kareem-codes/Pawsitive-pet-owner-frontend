import { apiClient } from '@/lib/api-client'
import { ApiResponse, Appointment, PaginatedResponse, AppointmentSlot } from '@/types'

export const appointmentService = {
  async getAll(params?: { status?: string; page?: number }): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
      '/appointments',
      { params }
    )
    return response.data
  },

  async getById(id: number): Promise<Appointment> {
    const response = await apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`)
    return response.data
  },

  async create(data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.post<ApiResponse<Appointment>>('/appointments', data)
    return response.data
  },

  async update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/appointments/${id}`, data)
    return response.data
  },

  async cancel(id: number): Promise<Appointment> {
    const response = await apiClient.post<ApiResponse<Appointment>>(`/appointments/${id}/cancel`)
    return response.data
  },

  async getAvailableSlots(params: { date: string; type?: string }): Promise<AppointmentSlot[]> {
    const response = await apiClient.get<ApiResponse<AppointmentSlot[]>>(
      '/appointments/slots/available',
      { params }
    )
    return response.data
  },

  async checkSlotAvailability(data: { date: string; time: string; veterinarian_id?: number }): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<{ available: boolean }>>(
      '/appointments/slots/check',
      data
    )
    return response.data.available
  },
}
