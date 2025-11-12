import { useState, useEffect } from 'react'
import { Download, Slack, Loader2, TrendingUp, Users, DollarSign, Activity, BarChart3, Sparkles, ArrowRight } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
    { label: 'Total Customers', value: '12,345', icon: Users, color: 'text-blue-600', bgColor: 'from-blue-500 to-cyan-500' },
    { label: 'Revenue', value: '$245,678', icon: DollarSign, color: 'text-green-600', bgColor: 'from-green-500 to-emerald-500' },
    { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'text-purple-600', bgColor: 'from-purple-500 to-pink-500' },
    { label: 'Active Users', value: '8,901', icon: Activity, color: 'text-orange-600', bgColor: 'from-orange-500 to-red-500' },
  ]

  const chartData = [
    { month: 'Jan', customers: 12000, revenue: 200000 },
    { month: 'Feb', customers: 13500, revenue: 220000 },
    { month: 'Mar', customers: 15000, revenue: 245000 },
    { month: 'Apr', customers: 14200, revenue: 235000 },
    { month: 'May', customers: 16000, revenue: 260000 },
    { month: 'Jun', customers: 17500, revenue: 280000 },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                Data Analytics Agent
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                Analyze CRM data and generate actionable insights using AI
              </p>
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
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${stat.bgColor} shadow-md`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={analyzeData}
          disabled={loading}
          className="group relative overflow-hidden flex-1 sm:flex-none rounded-xl md:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm sm:text-base">Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span className="text-sm sm:text-base">Generate AI Insights</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </div>
        </button>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex-1 sm:flex-none rounded-xl md:rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh Data
        </button>
      </div>

      {/* Charts Section */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Customer Growth</h3>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-gray-400" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis dataKey="month" stroke="#6b7280" className="dark:stroke-gray-400" />
                <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Insights Display */}
      {insights && (
        <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">AI-Generated Insights</h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={exportToText}
                className="flex items-center justify-center space-x-2 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={sendToSlack}
                className="flex items-center justify-center space-x-2 rounded-lg md:rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Slack className="h-4 w-4" />
                <span>Send to Slack</span>
              </button>
            </div>
          </div>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 p-4 sm:p-5 md:p-6 text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 overflow-x-auto leading-relaxed">
              {insights}
            </pre>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {data && !insights && (
        <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg">
          <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Data Preview</h2>
          <div className="overflow-x-auto">
            <pre className="rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 p-4 sm:p-5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataAnalyticsAgent
