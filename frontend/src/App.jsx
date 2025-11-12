import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Introduction from './pages/Introduction'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CustomerSupportAgent from './pages/CustomerSupportAgent'
import DataAnalyticsAgent from './pages/DataAnalyticsAgent'
import MarketingAutomationAgent from './pages/MarketingAutomationAgent'
import AdminPanel from './pages/AdminPanel'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Smart Root Route - shows Introduction if not authenticated, redirects to dashboard if authenticated
const RootRoute = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Introduction />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="support" element={<CustomerSupportAgent />} />
        <Route path="analytics" element={<DataAnalyticsAgent />} />
        <Route path="marketing" element={<MarketingAutomationAgent />} />
        <Route path="admin" element={<AdminPanel />} />
      </Route>
      {/* Direct routes for support, analytics, and marketing */}
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerSupportAgent />} />
      </Route>
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DataAnalyticsAgent />} />
      </Route>
      <Route
        path="/marketing"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MarketingAutomationAgent />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App

