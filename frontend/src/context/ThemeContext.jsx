import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode')
      if (saved !== null) {
        return saved === 'true'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  // Initialize on mount - CRITICAL for real theme mode
  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = localStorage.getItem('darkMode')
    let isDark = false

    if (saved !== null) {
      isDark = saved === 'true'
    } else {
      // Check system preference
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    // Apply theme immediately
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }

    setDarkMode(isDark)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (localStorage.getItem('darkMode') === null) {
        const shouldBeDark = e.matches
        if (shouldBeDark) {
          root.classList.add('dark')
          root.style.colorScheme = 'dark'
        } else {
          root.classList.remove('dark')
          root.style.colorScheme = 'light'
        }
        setDarkMode(shouldBeDark)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Update theme when darkMode changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    
    // Update localStorage
    localStorage.setItem('darkMode', darkMode.toString())
    
    // Update document class and color scheme globally
    if (darkMode) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }

    // Force reflow to ensure theme applies
    void root.offsetHeight
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

