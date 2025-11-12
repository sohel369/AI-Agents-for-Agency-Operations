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
      alert('Failed to send to Slack. Please try again.')
    }
  }

  const stats = [
    { label: 'Total Customers', value: '12,345', icon: Users, color: 'text-blue-600' },
    { label: 'Revenue', value: '$245,678', icon: DollarSign, color: 'text-green-600' },
    { label: 'Growth Rate', value: '+12.5%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Active Users', value: '8,901', icon: Activity, color: 'text-orange-600' },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Data Analytics Agent</h1>
        <p className="mt-2 text-gray-600">
          Analyze CRM data and generate actionable insights using AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={analyzeData}
          disabled={loading || !data}
          className="rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </span>
          ) : (
            'Generate AI Insights'
          )}
        </button>
        <button
          onClick={fetchData}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh Data
        </button>
      </div>

      {/* Insights Display */}
      {insights && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">AI-Generated Insights</h2>
            <div className="flex space-x-2">
              <button
                onClick={exportToText}
                className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={sendToSlack}
                className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Slack className="h-4 w-4" />
                <span>Send to Slack</span>
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-800">
              {insights}
            </pre>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {data && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Data Preview</h2>
          <div className="overflow-x-auto">
            <pre className="rounded-lg bg-gray-50 p-4 text-xs text-gray-800">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataAnalyticsAgent

