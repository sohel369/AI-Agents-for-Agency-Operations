import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import {
  LogOut,
  User,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  Settings,
  Menu,
  Bell
} from 'lucide-react'

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const { showInfo, showSuccess, unreadCount, markAllAsRead, notifications } = useNotifications()
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const profileMenuRef = useRef(null)
  const languageMenuRef = useRef(null)
  const notificationPanelRef = useRef(null)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowProfileMenu(false)
  }

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode)
    setShowLanguageMenu(false)
    localStorage.setItem('language', langCode)
    showSuccess('Language Changed', `Switched to ${languages.find(l => l.code === langCode)?.name || langCode}`)
  }

  const handleThemeToggle = () => {
    toggleDarkMode()
    showInfo(
      'Theme Changed',
      `Switched to ${darkMode ? 'Light' : 'Dark'} mode`
    )
  }

  const handleNotificationClick = (e) => {
    e.stopPropagation()
    const newState = !showNotificationPanel
    setShowNotificationPanel(newState)
    if (newState && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const addDemoNotification = () => {
    // Demo notifications
    const demos = [
      { type: 'success', title: 'New Ticket Resolved', message: 'Ticket #1234 has been resolved by AI agent' },
      { type: 'info', title: 'System Update', message: 'All systems are running smoothly' },
      { type: 'warning', title: 'High Traffic', message: 'Support requests are above average today' },
    ]
    const random = demos[Math.floor(Math.random() * demos.length)]
    if (random.type === 'success') {
      showSuccess(random.title, random.message)
    } else if (random.type === 'info') {
      showInfo(random.title, random.message)
    } else {
      showInfo(random.title, random.message)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        setShowNotificationPanel(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0]

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-gray-900/5">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            AI Automation Suite
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationPanelRef}>
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold ring-2 ring-white dark:ring-gray-900 animate-pulse">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Panel */}
            {showNotificationPanel && (
              <div 
                className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-50 max-h-96 overflow-hidden flex flex-col backdrop-blur-xl"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addDemoNotification()
                    }}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    Add Demo
                  </button>
                </div>
                <div className="overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No notifications
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.slice().reverse().map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border ${
                            notification.read
                              ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                              : 'bg-white dark:bg-gray-800 border-primary-200 dark:border-primary-800'
                          }`}
                        >
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative hidden md:block" ref={languageMenuRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden lg:inline">{currentLanguage.flag}</span>
              <span className="hidden xl:inline">{currentLanguage.name}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl py-2 z-50 backdrop-blur-xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-500/30"
                />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white border-2 border-primary-500/30">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="hidden md:inline font-medium">{user.name || 'User'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl py-2 z-50 backdrop-blur-xl">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email || 'No email'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate('/admin')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

