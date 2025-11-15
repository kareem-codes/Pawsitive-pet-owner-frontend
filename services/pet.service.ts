import { apiClient } from '@/lib/api-client'
import { ApiResponse, Pet, PaginatedResponse, WeightRecord } from '@/types'

export const petService = {
  async getAll(): Promise<Pet[]> {
    const response = await apiClient.get<ApiResponse<Pet[]>>('/pets')
    return response.data
  },

  async getById(id: number): Promise<Pet> {
    const response = await apiClient.get<ApiResponse<Pet>>(`/pets/${id}`)
    return response
  },

  async create(data: Partial<Pet> | FormData): Promise<Pet> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
    const response = await apiClient.post<ApiResponse<Pet>>('/pets', data, { headers })
    return response.data
  },

  async update(id: number, data: Partial<Pet> | FormData): Promise<Pet> {
    if (data instanceof FormData) {
      // Laravel requires _method field for PUT with FormData
      data.append('_method', 'PUT')
      const response = await apiClient.post<ApiResponse<Pet>>(`/pets/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    }
    const response = await apiClient.put<ApiResponse<Pet>>(`/pets/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/pets/${id}`)
  },

  async uploadPhoto(id: number, file: File): Promise<Pet> {
    const formData = new FormData()
    formData.append('photo', file)
    
    const response = await apiClient.post<ApiResponse<Pet>>(
      `/pets/${id}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  async deletePhoto(id: number): Promise<void> {
    await apiClient.delete(`/pets/${id}/photo`)
  },

  async getWeightRecords(id: number): Promise<WeightRecord[]> {
    const response = await apiClient.get<ApiResponse<WeightRecord[]>>(`/pets/${id}/weight`)
    return response.data
  },

  async addWeightRecord(id: number, data: Partial<WeightRecord>): Promise<WeightRecord> {
    const response = await apiClient.post<ApiResponse<WeightRecord>>(`/pets/${id}/weight`, data)
    return response.data
  },

  async getVaccinationCard(id: number): Promise<Blob> {
    const response = await apiClient.get(`/pets/${id}/vaccination-card`, {
      responseType: 'blob',
    })
    return response as any
  },
}
