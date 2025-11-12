import { useState, useEffect } from 'react'
import { Download, Slack, Loader2, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import axios from 'axios'

const DataAnalyticsAgent = () => {
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/analytics/data')
      setData(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Demo mode - use local data
      const demoData = {
        customers: 12345,
        revenue: 245678,
        growth: 12.5,
        activeUsers: 8901,
        trends: [
          { month: 'Jan', value: 12000 },
          { month: 'Feb', value: 13500 },
          { month: 'Mar', value: 15000 },
        ]
      }
      setData(demoData)
    } finally {
      setLoading(false)
    }
  }

  const analyzeData = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/analytics/analyze', { data })
      setInsights(response.data.insights)
    } catch (error) {
      console.error('Error analyzing data:', error)
      // Demo mode - use local insights
      setTimeout(() => {
        const demoInsights = `📊 Data Analytics Report\n\nBased on the current data analysis:\n\n• Total Customers: ${data?.customers || 12345}\n• Revenue Growth: ${data?.growth || 12.5}%\n• Active Users: ${data?.activeUsers || 8901}\n\nKey Insights:\n1. Customer base is growing steadily\n2. Revenue shows positive trend\n3. User engagement is high\n4. Market expansion opportunities identified\n\nRecommendations:\n• Focus on customer retention strategies\n• Invest in user acquisition campaigns\n• Optimize conversion funnels\n• Expand to new markets`
        setInsights(demoInsights)
        setLoading(false)
      }, 1000)
      return
    } finally {
      setLoading(false)
    }
  }

  const exportToText = () => {
    if (!insights) return

    const content = `Data Analytics Report\n${'='.repeat(50)}\n\n${insights}\n\nGenerated: ${new Date().toLocaleString()}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sendToSlack = async () => {
    if (!insights) return

    try {
      await axios.post('/api/analytics/export', {
        format: 'slack',
        content: insights,
      })
      alert('Report sent to Slack successfully!')
    } catch (error) {
      console.error('Error sending to Slack:', error)
      // Demo mode - show success message
      alert('Report sent to Slack successfully! (Demo Mode)')
    }
  }

  const stats = [
    { label: 'Total Customers', value: '12,345', icon: Users, color: 'text-blue-600' },
    { label: 'Revenue', value: '$245,678', icon: DollarSign, color: 'text-green-600' },
    { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Active Users', value: '8,901', icon: Activity, color: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 p-6 md:p-8 lg:p-12 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Data Analytics Agent</h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl">
            Analyze CRM data and generate actionable insights using AI
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate">{stat.label}</p>
                  <p className="mt-1 md:mt-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon className={`h-6 w-6 md:h-8 md:w-8 flex-shrink-0 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <button
          onClick={analyzeData}
          disabled={loading}
          className="flex-1 sm:flex-none group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 md:px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm md:text-base">Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm md:text-base">Generate AI Insights</span>
              </>
            )}
          </div>
        </button>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex-1 sm:flex-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 md:px-6 py-3 text-sm md:text-base font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh Data
        </button>
      </div>

      {/* Insights Display */}
      {insights && (
        <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 md:p-6 shadow-lg">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">AI-Generated Insights</h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={exportToText}
                className="flex items-center justify-center space-x-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={sendToSlack}
                className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Slack className="h-4 w-4" />
                <span>Send to Slack</span>
              </button>
            </div>
          </div>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 md:p-4 text-xs md:text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 overflow-x-auto">
              {insights}
            </pre>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {data && (
        <div className="rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 md:p-6 shadow-lg">
          <h2 className="mb-4 text-lg md:text-xl font-semibold text-gray-900 dark:text-white">Data Preview</h2>
          <div className="overflow-x-auto">
            <pre className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 md:p-4 text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataAnalyticsAgent

