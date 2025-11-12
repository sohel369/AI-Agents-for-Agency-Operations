import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'

const CustomerSupportAgent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your AI Customer Support Agent in DEMO MODE. I can help you with questions about our services, features, pricing, technical issues, and more. How can I assist you today?",
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

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setTicketStatus(null)

    try {
      const response = await axios.post('/api/support/chat', {
        message: input,
        conversationHistory: messages,
        demoMode: demoMode, // Send demo mode flag
      })

      const agentResponse = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'agent',
        timestamp: new Date(),
        confidence: response.data.confidence,
        ticketCreated: response.data.ticketCreated,
        escalated: response.data.escalated,
        demoMode: response.data.demoMode || false,
      }

      setMessages((prev) => [...prev, agentResponse])

      if (response.data.ticketCreated) {
        setTicketStatus({
          type: 'success',
          message: 'Ticket created successfully in CRM',
        })
      }

      if (response.data.escalated) {
        setTicketStatus({
          type: 'warning',
          message: 'Low confidence detected. Ticket escalated to human agent.',
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'agent',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Support Agent</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              AI-powered customer support with intelligent ticket triage
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              demoMode 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            }`}>
              {demoMode ? '🎭 Demo Mode' : '🤖 AI Mode'}
            </span>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {demoMode ? 'Switch to AI Mode' : 'Switch to Demo Mode'}
            </button>
          </div>
        </div>
      </div>

      {ticketStatus && (
        <div
          className={`mb-4 flex items-center space-x-2 rounded-lg p-4 ${
            ticketStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
          }`}
        >
          {ticketStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{ticketStatus.message}</span>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {/* Chat Messages */}
        <div className="h-[500px] space-y-4 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>
                <div className="mt-2 flex items-center space-x-2">
                  {message.demoMode && (
                    <span className="px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      Demo Response
                    </span>
                  )}
                  {message.confidence !== undefined && (
                    <span className="text-xs opacity-75">
                      Confidence: {(message.confidence * 100).toFixed(1)}%
                    </span>
                  )}
                  <span className="text-xs opacity-75">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-400 dark:placeholder-gray-500"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="rounded-lg bg-primary-600 px-6 py-2 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSupportAgent

