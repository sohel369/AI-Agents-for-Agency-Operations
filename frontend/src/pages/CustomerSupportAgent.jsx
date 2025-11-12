import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
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
  const [demoMode, setDemoMode] = useState(true) // Always in demo mode - uses local saved answer
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Demo mode is always active - uses local saved answer
    // No notification needed as it's always in demo mode
  }, [])

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

    // Demo mode - use local saved answer (no backend needed)
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
    }, 500) // Simulate slight delay for realism
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-6 md:p-8 lg:p-12 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
                <div className="relative">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 md:mb-4">Customer Support Agent</h1>
                      <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-2xl">
                        AI-powered customer support with intelligent ticket triage and automated responses
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
                        title="Demo Mode - Uses local saved answer"
                      >
                        <span className="hidden sm:inline">Demo Mode Active</span>
                        <span className="sm:hidden">Info</span>
                      </button>
            </div>
          </div>
        </div>
      </div>

      {ticketStatus && (
        <div
          className={`mb-4 flex items-center space-x-2 sm:space-x-3 rounded-lg md:rounded-xl p-3 sm:p-4 ${
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

      <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg">
        {/* Chat Messages */}
        <div className="h-[400px] md:h-[500px] space-y-3 md:space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg md:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                    : message.isError
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm sm:text-base break-words">{message.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {message.demoMode && (
                    <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                      Demo Response
                    </span>
                  )}
                  {message.confidence !== undefined && (
                    <span className="text-[10px] sm:text-xs opacity-75 whitespace-nowrap">
                      Confidence: {(message.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                  <span className="text-[10px] sm:text-xs opacity-75 whitespace-nowrap">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg md:rounded-xl bg-gray-100 dark:bg-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-gray-600 dark:text-gray-300" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Agent is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="group relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 sm:px-6 py-2.5 sm:py-3 text-white font-semibold transition-all duration-200 hover:from-primary-700 hover:to-primary-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-primary-600 disabled:hover:to-primary-500 shadow-lg hover:shadow-xl active:scale-95 flex-shrink-0 min-w-[44px] sm:min-w-[56px] flex items-center justify-center"
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

