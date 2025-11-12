import { create } from 'zustand'
import { apiClient } from '@/lib/api-client'

export interface Notification {
  id: string
  type: 'appointment' | 'vaccination' | 'invoice' | 'message' | 'reminder'
  title: string
  message: string
  read: boolean
  timestamp: string
  link?: string
  priority: 'low' | 'medium' | 'high'
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  
  // Actions
  fetchNotifications: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true })
    try {
      // Fetch from actual API
      const response = await apiClient.get<{ data: Notification[] }>('/notifications')
      const notificationsData = response.data || []

      set({
        notifications: notificationsData,
        unreadCount: notificationsData.filter((n: Notification) => !n.read).length,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      // Set empty array on error
      set({ 
        notifications: [], 
        unreadCount: 0,
        loading: false 
      })
    }
  },

  markAsRead: async (id: string) => {
    const { notifications } = get()
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
    
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length,
    })

    try {
      // API call to mark as read
      await apiClient.patch(`/notifications/${id}/read`)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  },

  markAllAsRead: async () => {
    const { notifications } = get()
    const updated = notifications.map(n => ({ ...n, read: true }))
    
    set({
      notifications: updated,
      unreadCount: 0,
    })

    try {
      // API call to mark all as read
      await apiClient.patch('/notifications/read-all')
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  },

  deleteNotification: async (id: string) => {
    const { notifications } = get()
    const updated = notifications.filter(n => n.id !== id)
    
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length,
    })

    try {
      // API call to delete notification
      await apiClient.delete(`/notifications/${id}`)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  },

  addNotification: (notification: Notification) => {
    const { notifications } = get()
    const updated = [notification, ...notifications]
    
    set({
      notifications: updated,
      unreadCount: updated.filter(n => !n.read).length,
    })
  },
}))

// Hook to poll for new notifications
export const useNotificationPolling = (interval: number = 60000) => {
  const fetchNotifications = useNotificationStore(state => state.fetchNotifications)

  if (typeof window !== 'undefined') {
    setInterval(() => {
      fetchNotifications()
    }, interval)
  }
}
