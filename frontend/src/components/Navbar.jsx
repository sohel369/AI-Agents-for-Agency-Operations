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
  Bell,
  Sparkles
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
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-gray-900/5 dark:shadow-gray-950/20">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-cyan-50 dark:hover:from-primary-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="flex items-center space-x-2 min-w-0">
            <div className="hidden sm:block p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-md">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 bg-clip-text text-transparent truncate">
              <span className="hidden sm:inline">AI Automation Suite</span>
              <span className="sm:hidden">AI Suite</span>
            </h2>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
          {/* Notifications */}
          <div className="relative" ref={notificationPanelRef}>
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 sm:p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-cyan-50 dark:hover:from-primary-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 active:scale-95 group"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-[18px] sm:h-5 px-1 sm:px-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold ring-2 ring-white dark:ring-gray-900 animate-pulse shadow-lg">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notification Panel */}
            {showNotificationPanel && (
              <div 
                className="absolute right-0 mt-2 w-[calc(100vw-3rem)] sm:w-80 max-w-sm rounded-2xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl z-50 max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between bg-gradient-to-r from-primary-50/80 to-cyan-50/80 dark:from-primary-900/30 dark:to-cyan-900/30 backdrop-blur-sm">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      addDemoNotification()
                    }}
                    className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold px-2 py-1 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
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
          <div className="relative hidden sm:block" ref={languageMenuRef}>
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-cyan-50 dark:hover:from-primary-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 active:scale-95 group"
              aria-label="Language selector"
            >
              <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden md:inline">{currentLanguage.flag}</span>
              <span className="hidden lg:inline ml-1">{currentLanguage.name}</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 sm:w-52 rounded-2xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
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
            className="p-2 sm:p-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-cyan-50 dark:hover:from-primary-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 active:scale-95 group"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-cyan-50 dark:hover:from-primary-900/20 dark:hover:to-cyan-900/20 transition-all duration-200 active:scale-95 group"
              aria-label="User menu"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-primary-500/30 group-hover:border-primary-500/60 transition-colors shadow-md"
                />
              ) : (
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white border-2 border-primary-500/30 group-hover:border-primary-500/60 group-hover:shadow-lg transition-all shadow-md">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              )}
              <span className="hidden lg:inline font-semibold truncate max-w-[100px]">{user.name || 'User'}</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-2xl bg-white/95 dark:bg-gray-800/95 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-primary-50/50 to-cyan-50/50 dark:from-primary-900/20 dark:to-cyan-900/20">
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {user.email || 'No email'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate('/admin')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-cyan-50 dark:hover:from-primary-900/30 dark:hover:to-cyan-900/30 transition-all duration-200 group"
                >
                  <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-200 group"
                >
                  <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

