import { apiClient } from '@/lib/api-client'
import { ApiResponse, MedicalRecord, PaginatedResponse } from '@/types'

export const medicalRecordService = {
  async getAll(params?: any): Promise<PaginatedResponse<MedicalRecord>> {
    const response = await apiClient.get<PaginatedResponse<MedicalRecord>>('/medical-records', { params })
    return response
  },

  async getById(id: number): Promise<MedicalRecord> {
    const response = await apiClient.get<ApiResponse<MedicalRecord>>(`/medical-records/${id}`)
    return response.data
  },

  async getByPet(petId: number): Promise<MedicalRecord[]> {
    const response = await apiClient.get<ApiResponse<MedicalRecord[]>>(`/pets/${petId}/medical-records`)
    return response.data
  },

  async create(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const response = await apiClient.post<ApiResponse<MedicalRecord>>('/medical-records', data)
    return response.data
  },

  async update(id: number, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const response = await apiClient.put<ApiResponse<MedicalRecord>>(`/medical-records/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/medical-records/${id}`)
  },
}
