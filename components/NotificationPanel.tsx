'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Calendar,
  Syringe,
  FileText,
  Mail,
  AlertCircle,
  X,
  Check,
  CheckCheck,
} from 'lucide-react'
import { useNotificationStore, type Notification } from '@/stores/notificationStore'
import { formatDistance } from 'date-fns'

const iconMap = {
  appointment: Calendar,
  vaccination: Syringe,
  invoice: FileText,
  message: Mail,
  reminder: AlertCircle,
}

const colorMap = {
  low: 'text-gray-600 dark:text-gray-400',
  medium: 'text-blue-600 dark:text-blue-400',
  high: 'text-red-600 dark:text-red-400',
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = 
    useNotificationStore()

  useEffect(() => {
    // fetchNotifications()
    
    // Poll for new notifications every minute
    const interval = setInterval(() => {
      // fetchNotifications()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.link) {
      setIsOpen(false)
    }
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    deleteNotification(id)
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */} 
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
 
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-96 max-h-[32rem] z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Notifications
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No new notifications
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      You're all caught up! We'll notify you when something new happens.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.map((notification) => {
                      const Icon = iconMap[notification.type]
                      const timeAgo = formatDistance(new Date(notification.timestamp), new Date(), {
                        addSuffix: true,
                      })

                      const content = (
                        <div
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${colorMap[notification.priority]}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="ms-2 h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                    {timeAgo}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => handleDelete(e, notification.id)}
                                  className="ms-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )

                      return notification.link ? (
                        <Link key={notification.id} href={notification.link}>
                          {content}
                        </Link>
                      ) : (
                        <div key={notification.id}>{content}</div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/dashboard/notifications"
                    className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
