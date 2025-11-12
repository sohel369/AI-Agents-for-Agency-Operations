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

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random() // Ensure unique IDs
    const newNotification = {
      id,
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      duration: notification.duration !== undefined ? notification.duration : 5000, // Default 5 seconds, 0 = persistent
      read: false,
      timestamp: new Date().toISOString(),
      ...notification,
    }

    setNotifications((prev) => [...prev, newNotification])
    setUnreadCount((prev) => prev + 1)

    // Auto remove after duration (only if duration > 0)
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [removeNotification])

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
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      case 'error':
        return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
      default:
        return <Info className="h-4 w-4 sm:h-5 sm:w-5" />
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
    <div className="fixed top-16 sm:top-20 right-2 sm:right-4 left-2 sm:left-auto z-50 space-y-2 sm:space-y-3 w-auto sm:w-full max-w-[calc(100vw-1rem)] sm:max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => !notification.read && onMarkAsRead(notification.id)}
          className={`rounded-lg md:rounded-xl border p-3 sm:p-4 shadow-lg backdrop-blur-sm animate-fade-in cursor-pointer transition-all hover:shadow-xl active:scale-[0.98] ${
            notification.read ? 'opacity-75' : ''
          } ${getStyles(notification.type)}`}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <p className="text-xs sm:text-sm font-semibold break-words">{notification.title}</p>
                {!notification.read && (
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-current opacity-75 animate-pulse flex-shrink-0" />
                )}
              </div>
              {notification.message && (
                <p className="mt-1 text-xs sm:text-sm opacity-90 break-words leading-relaxed">{notification.message}</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove(notification.id)
              }}
              className="flex-shrink-0 p-1.5 sm:p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:bg-black/20 dark:active:bg-white/20 transition-colors min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              aria-label="Close notification"
            >
              <X className="h-4 w-4 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

