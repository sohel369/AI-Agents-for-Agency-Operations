import { useState, useEffect } from 'react'
import { Calendar, Plus, Loader2, TrendingUp, Eye, Heart, MessageCircle, Share2 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import axios from 'axios'

const MarketingAutomationAgent = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [newPost, setNewPost] = useState({ platform: 'facebook', content: '', scheduledDate: '' })
  const [recommendations, setRecommendations] = useState(null)
  const [metrics, setMetrics] = useState([
    { date: 'Mon', engagement: 120, reach: 450, clicks: 89 },
    { date: 'Tue', engagement: 190, reach: 520, clicks: 112 },
    { date: 'Wed', engagement: 300, reach: 680, clicks: 145 },
    { date: 'Thu', engagement: 250, reach: 590, clicks: 128 },
    { date: 'Fri', engagement: 400, reach: 750, clicks: 167 },
    { date: 'Sat', engagement: 350, reach: 720, clicks: 152 },
    { date: 'Sun', engagement: 280, reach: 650, clicks: 138 },
  ])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/marketing/posts')
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const generatePostSuggestion = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/marketing/generate', {
        platform: newPost.platform,
      })
      setNewPost((prev) => ({ ...prev, content: response.data.suggestion }))
    } catch (error) {
      console.error('Error generating suggestion:', error)
    } finally {
      setLoading(false)
    }
  }

  const schedulePost = async () => {
    if (!newPost.content || !newPost.scheduledDate) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/marketing/schedule', newPost)
      setShowScheduleModal(false)
      setNewPost({ platform: 'facebook', content: '', scheduledDate: '' })
      fetchPosts()
    } catch (error) {
      console.error('Error scheduling post:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendations = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/marketing/recommendations', {
        posts,
        metrics,
      })
      setRecommendations(response.data.recommendations)
    } catch (error) {
      console.error('Error getting recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const platformColors = {
    facebook: 'bg-blue-500',
    linkedin: 'bg-blue-700',
    twitter: 'bg-sky-500',
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Marketing Automation Agent</h1>
        <p className="mt-2 text-gray-600">
          Schedule posts, generate content, and track engagement metrics
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Post</span>
        </button>
        <button
          onClick={getRecommendations}
          disabled={loading}
          className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          )}
          <span>Recommend Next Steps</span>
        </button>
      </div>

      {/* Recommendations */}
      {recommendations && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">AI Recommendations</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm text-gray-800">
              {recommendations}
            </pre>
          </div>
        </div>
      )}

      {/* Metrics Charts */}
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Engagement Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="reach" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Clicks by Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clicks" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Scheduled Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No scheduled posts. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium text-white ${platformColors[post.platform] || 'bg-gray-500'}`}
                      >
                        {post.platform}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(post.scheduledDate).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-900">{post.content}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.metrics?.views || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.metrics?.likes || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.metrics?.comments || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.metrics?.shares || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Schedule New Post</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Platform</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <button
                    onClick={generatePostSuggestion}
                    disabled={loading}
                    className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter post content or generate with AI..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={schedulePost}
                disabled={loading}
                className="rounded-lg bg-primary-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Scheduling...' : 'Schedule Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketingAutomationAgent

