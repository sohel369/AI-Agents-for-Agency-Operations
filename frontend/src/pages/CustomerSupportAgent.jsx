import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, CheckCircle, MessageSquare, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

// Demo mode - saved answer (no backend needed)
const DEMO_AGENT_RESPONSE = "Hello! 👋 Welcome to our AI Automation Suite support. I'm here to help you with any questions about our services, features, or technical issues. How can I assist you today?"

const CustomerSupportAgent = () => {
  const { showInfo, showSuccess, showError } = useNotifications()
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 Welcome to our AI Automation Suite support. I'm here to help you with any questions about our services, features, or technical issues. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date(),
      demoMode: true,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketStatus, setTicketStatus] = useState(null)
  const [demoMode, setDemoMode] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input
    setInput('')
    setLoading(true)
    setTicketStatus(null)

    // Demo mode - use local saved answer
    setTimeout(() => {
      const agentResponse = {
        id: Date.now() + 1,
        text: DEMO_AGENT_RESPONSE,
        sender: 'agent',
        timestamp: new Date(),
        confidence: 0.95,
        ticketCreated: true,
        escalated: false,
        demoMode: true,
      }

      setMessages((prev) => [...prev, agentResponse])
      setTicketStatus({
        type: 'success',
        message: 'Ticket created successfully in CRM',
      })
      setLoading(false)
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const stats = [
    { label: 'Total Tickets', value: '1,234', icon: MessageSquare, color: 'text-blue-500' },
    { label: 'Resolved Today', value: '89', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Avg Response Time', value: '2.3 min', icon: Clock, color: 'text-purple-500' },
    { label: 'Satisfaction Rate', value: '98%', icon: TrendingUp, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    Customer Support Agent
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                    AI-powered customer support with intelligent ticket triage and automated responses
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <span className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg md:rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-lg text-center whitespace-nowrap ${
                demoMode 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'bg-green-500/20 text-white border border-green-400/30'
              }`}>
                {demoMode ? '🎭 Demo Mode' : '🤖 AI Mode'}
              </span>
              <button
                onClick={() => {
                  showInfo('Demo Mode', 'Support Agent is running in demo mode with local saved answers. No backend connection required.')
                }}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg md:rounded-xl bg-white/20 backdrop-blur-lg text-white border border-white/30 hover:bg-white/30 active:scale-95 transition-all duration-200 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Demo Mode Active</span>
                <span className="sm:hidden">Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label} 
              className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${stat.color}`} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ticket Status */}
      {ticketStatus && (
        <div
          className={`flex items-center space-x-2 sm:space-x-3 rounded-lg md:rounded-xl p-3 sm:p-4 animate-fade-in ${
            ticketStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50'
              : 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50'
          }`}
        >
          {ticketStatus.type === 'success' ? (
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-medium">{ticketStatus.message}</span>
        </div>
      )}

      {/* Chat Container */}
      <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 sm:p-5 md:p-6 border-b border-blue-500/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-md" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">AI Support Agent</h3>
              <p className="text-xs sm:text-sm text-white/80">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[400px] sm:h-[500px] md:h-[600px] space-y-3 sm:space-y-4 overflow-y-auto p-4 sm:p-5 md:p-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-4 sm:px-5 py-3 sm:py-4 shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                    : message.isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm sm:text-base break-words leading-relaxed">{message.text}</p>
                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {message.demoMode && (
                    <span className="px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      Demo Response
                    </span>
                  )}
                  {message.confidence !== undefined && (
                    <span className="opacity-75 whitespace-nowrap">
                      Confidence: {(message.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                  <span className="opacity-75 whitespace-nowrap">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="rounded-2xl bg-white dark:bg-gray-700 px-4 sm:px-5 py-3 sm:py-4 border border-gray-200 dark:border-gray-600 shadow-md">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Agent is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800">
          <div className="flex gap-3 sm:gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-xl md:rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 text-white font-semibold transition-all duration-200 hover:from-primary-700 hover:to-primary-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-95 flex-shrink-0 min-w-[56px] sm:min-w-[64px] flex items-center justify-center"
              aria-label="Send message"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                {loading ? (
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSupportAgent
