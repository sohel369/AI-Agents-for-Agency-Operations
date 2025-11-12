import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize dark mode immediately - CRITICAL for preventing flash
const initializeDarkMode = () => {
  if (typeof window === 'undefined') return

  const saved = localStorage.getItem('darkMode')
  let isDark = false

  if (saved !== null) {
    isDark = saved === 'true'
  } else {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
}

// Initialize before rendering to prevent flash
initializeDarkMode()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

