import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pawsitive-backend.kareem-codes.com/api/v1";

class ApiClient {
  private client: AxiosInstance

  constructor() {
    const useCredentials = process.env.NEXT_PUBLIC_USE_CREDENTIALS !== 'false'
    
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: useCredentials,
      timeout: 30000, // 30 seconds timeout
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle CORS and network errors
        if (!error.response) {
          console.error('Network/CORS error:', error.message)
          if (typeof window !== 'undefined') {
            // Check if it's a CORS error
            if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
              console.error('CORS or network connectivity issue detected')
            }
          }
        }
        
        if (error.response?.status === 401) {
          this.removeToken()
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  }

  public setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
