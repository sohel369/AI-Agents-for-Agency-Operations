import { useState, useRef, useEffect } from 'react'
import { Send, MessageSquare, Bot } from 'lucide-react'

const SupportAgentDemo = ({ demoMode = true }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Thank you for contacting support. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Pre-saved demo response
  const DEMO_RESPONSE = "Hello! Thank you for contacting support. How can I assist you today?"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading || !demoMode) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate agent response delay
    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        text: DEMO_RESPONSE,
        sender: 'agent',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
      setLoading(false)
    }, 500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!demoMode) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Demo mode is disabled. Please enable DEMO_MODE to use this component.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-cyan-500 rounded-t-xl">
        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Support Agent</h3>
          <p className="text-xs text-white/80">Demo Mode Active</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg md:rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {message.sender === 'agent' && (
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-primary-500" />
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                    Support Agent
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm sm:text-base break-words">{message.text}</p>
              <p className="mt-1.5 text-[10px] sm:text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Agent is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
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
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <Send className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
          </button>
        </div>
        <p className="mt-2 text-[10px] sm:text-xs text-center text-gray-500 dark:text-gray-400 px-2">
          💡 Demo Mode: All messages receive the same pre-configured response
        </p>
      </div>
    </div>
  )
}

export default SupportAgentDemo

