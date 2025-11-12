import { Outlet, Link, useLocation } from 'react-router-dom'
import Header from './Header'
import {
  MessageSquare,
  BarChart3,
  Megaphone,
  Settings,
  Home,
} from 'lucide-react'

const Layout = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/support', icon: MessageSquare, label: 'Support Agent' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics Agent' },
    { path: '/marketing', icon: Megaphone, label: 'Marketing Agent' },
    { path: '/admin', icon: Settings, label: 'Admin Panel' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg z-40">
        <div className="flex h-full flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              AI Suite
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Automation Platform</p>
          </div>
          
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content with Header */}
      <div className="ml-64">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

