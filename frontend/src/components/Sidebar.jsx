import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MessageSquare,
  BarChart3,
  Megaphone,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react'
import { useState } from 'react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/support', icon: MessageSquare, label: 'Support Agent' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics Agent' },
    { path: '/dashboard/marketing', icon: Megaphone, label: 'Marketing Agent' },
    { path: '/dashboard/admin', icon: Settings, label: 'Admin Panel' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-r border-gray-700/50 dark:border-gray-800/50 shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-700/50 dark:border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                    AI Suite
                  </h1>
                  <p className="text-xs text-gray-400">Automation Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/10 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                      : 'hover:bg-gray-800/50 dark:hover:bg-gray-800/30 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? 'text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-700/50 dark:border-gray-800/50">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 dark:bg-gray-800/30 mb-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center border-2 border-primary-500/30">
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email || 'No email'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

