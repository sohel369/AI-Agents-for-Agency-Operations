import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [viewedNotifications, setViewedNotifications] = useState(new Set())

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      duration: notification.duration || 5000,
      read: false,
      ...notification,
    }

    setNotifications((prev) => [...prev, newNotification])
    setUnreadCount((prev) => prev + 1)

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id)
      if (notification && !notification.read) {
        setUnreadCount((count) => Math.max(0, count - 1))
      }
      return prev.filter((n) => n.id !== id)
    })
    setViewedNotifications((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setViewedNotifications((prev) => new Set(prev).add(id))
    setUnreadCount((count) => Math.max(0, count - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    setViewedNotifications(
      new Set(notifications.map((n) => n.id))
    )
  }, [notifications])

  const showSuccess = useCallback((title, message) => {
    return addNotification({ type: 'success', title, message })
  }, [addNotification])

  const showError = useCallback((title, message) => {
    return addNotification({ type: 'error', title, message })
  }, [addNotification])

  const showInfo = useCallback((title, message) => {
    return addNotification({ type: 'info', title, message })
  }, [addNotification])

  const showWarning = useCallback((title, message) => {
    return addNotification({ type: 'warning', title, message })
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification}
        onMarkAsRead={markAsRead}
      />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = ({ notifications, onRemove, onMarkAsRead }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 w-full max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => !notification.read && onMarkAsRead(notification.id)}
          className={`rounded-xl border p-4 shadow-lg backdrop-blur-sm animate-fade-in cursor-pointer transition-all ${
            notification.read ? 'opacity-75' : ''
          } ${getStyles(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold">{notification.title}</p>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-current opacity-75" />
                )}
              </div>
              {notification.message && (
                <p className="mt-1 text-sm opacity-90">{notification.message}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove(notification.id)
              }}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

