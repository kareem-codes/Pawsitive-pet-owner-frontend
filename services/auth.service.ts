import { apiClient } from '@/lib/api-client'
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/login',
      credentials
    )
    
    if (response.data.token) {
      apiClient.setToken(response.data.token)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    }
    
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/register',
      data
    )
    
    if (response.data.token) {
      apiClient.setToken(response.data.token)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
    }
    
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout')
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        window.location.href = '/auth/login'
      }
    }
  },

  async getUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/user')
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    
    return response.data
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token')
    }
    return false
  },
}
