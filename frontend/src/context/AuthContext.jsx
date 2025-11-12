import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// User data structure
const defaultUser = {
  id: null,
  email: '',
  name: '',
  avatar: '',
  role: 'user',
  createdAt: null,
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : defaultUser
  })

  // Load user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const signup = (email, password, name) => {
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff&size=128`,
      role: 'user',
      createdAt: new Date().toISOString(),
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    // Check if user already exists
    if (users.find(u => u.email === newUser.email)) {
      return { success: false, error: 'User with this email already exists' }
    }

    // Add password hash (in production, use proper hashing)
    const userWithPassword = {
      ...newUser,
      password: btoa(password), // Simple encoding - use proper hashing in production
    }

    // Save user
    users.push(userWithPassword)
    localStorage.setItem('users', JSON.stringify(users))
    
    // Set current user (without password)
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('user', JSON.stringify(newUser))

    return { success: true, user: newUser }
  }

  const login = (email, password) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(
      u => u.email === email.toLowerCase().trim() && 
      atob(u.password) === password // Decode password
    )

    if (user) {
      // Remove password before setting user
      const { password: _, ...userWithoutPassword } = user
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      return { success: true, user: userWithoutPassword }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(defaultUser)
    // Clear all authentication and user-related data
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    // Note: We keep 'users' array for signup/login functionality
    // Clear any other user-specific preferences if needed
    // localStorage.removeItem('language') // Optional: clear language preference
    // localStorage.removeItem('notifications') // Optional: clear notifications
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // Also update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      const { password } = users[userIndex]
      users[userIndex] = { ...updatedUser, password }
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

