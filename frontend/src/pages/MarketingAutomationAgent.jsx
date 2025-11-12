import { useState, useEffect } from 'react'
import { Calendar, Plus, Loader2, TrendingUp, Eye, Heart, MessageCircle, Share2, Edit2, Save, X } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useNotifications } from '../context/NotificationContext'

const MarketingAutomationAgent = () => {
  const { showSuccess, showError } = useNotifications()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [newPost, setNewPost] = useState({ platform: 'facebook', content: '', scheduledDate: '' })
  const [editingPost, setEditingPost] = useState(null)
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
    // Load posts from localStorage (demo mode)
    const savedPosts = localStorage.getItem('marketingPosts')
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts))
      } catch (e) {
        console.error('Error loading posts from localStorage:', e)
      }
    }
  }, [])

  const savePostsToStorage = (postsToSave) => {
    localStorage.setItem('marketingPosts', JSON.stringify(postsToSave))
  }

  const generatePostSuggestion = () => {
    // Demo mode - generate simple suggestion
    setLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      const suggestions = {
        facebook: "🎉 Exciting news! We're thrilled to share our latest updates with you. Stay tuned for more amazing content coming your way!",
        linkedin: "We're excited to announce our latest developments. Our team has been working hard to bring you innovative solutions that drive success.",
        twitter: "🚀 Big news! We're launching something amazing. Stay tuned for updates! #Innovation #Tech",
      }
      
      setNewPost((prev) => ({ 
        ...prev, 
        content: suggestions[prev.platform] || suggestions.facebook 
      }))
      setLoading(false)
    }, 500)
  }

  const schedulePost = () => {
    if (!newPost.content || !newPost.scheduledDate) {
      // Add notification to counter only (no popup)
      showError('Validation Error', 'Please fill in all fields')
      return
    }

    // Demo mode - store locally
    const post = {
      id: `POST-${Date.now()}`,
      platform: newPost.platform,
      content: newPost.content,
      scheduledDate: newPost.scheduledDate,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      },
    }

    const updatedPosts = [...posts, post]
    setPosts(updatedPosts)
    savePostsToStorage(updatedPosts)
    
    setShowScheduleModal(false)
    setNewPost({ platform: 'facebook', content: '', scheduledDate: '' })
    
    // Add notification to counter only (no popup)
    showSuccess('Post Scheduled', 'Your post has been scheduled successfully!')
  }

  const updatePost = (postId, updates) => {
    // Demo mode - update locally
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      }
      return post
    })
    
    setPosts(updatedPosts)
    savePostsToStorage(updatedPosts)
    setEditingPost(null)
    
    // Add notification to counter only (no popup)
    showSuccess('Post Updated', 'Your post has been updated successfully!')
  }

  const handleEditPost = (post) => {
    setEditingPost({
      id: post.id,
      platform: post.platform,
      content: post.content,
      scheduledDate: post.scheduledDate ? new Date(post.scheduledDate).toISOString().slice(0, 16) : '',
      status: post.status,
    })
  }

  const getRecommendations = () => {
    // Demo mode - generate simple recommendations
    setLoading(true)
    
    // Simulate API delay
    setTimeout(() => {
      const demoRecommendations = `Based on your current engagement metrics, here are our recommendations:

1. **Optimal Posting Schedule**: Your best performing day is Friday with 400 engagements. Consider scheduling more posts on Fridays.

2. **Content Themes**: Focus on engaging visual content and interactive posts to boost engagement.

3. **Platform Strategy**: 
   - Facebook: Post during peak hours (2-4 PM)
   - LinkedIn: Share professional insights on weekdays
   - Twitter: Use trending hashtags for better reach

4. **Engagement Tips**: 
   - Ask questions to encourage comments
   - Use call-to-action buttons
   - Post consistently at the same times

Keep up the great work! 🚀`
      
      setRecommendations(demoRecommendations)
      setLoading(false)
    }, 800)
  }

  const platformColors = {
    facebook: 'bg-blue-500',
    linkedin: 'bg-blue-700',
    twitter: 'bg-sky-500',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-8 lg:p-12 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Marketing Automation Agent</h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Schedule posts, generate content, and track engagement metrics across all platforms
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setShowScheduleModal(true)}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Schedule Post</span>
          </div>
        </button>
        <button
          onClick={getRecommendations}
          disabled={loading}
          className="flex items-center space-x-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">AI Recommendations</h2>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 text-sm text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
              {recommendations}
            </pre>
          </div>
        </div>
      )}

      {/* Metrics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Engagement Trends</h2>
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

        <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Clicks by Day</h2>
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
      <div className="rounded-2xl bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-purple-50/50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 backdrop-blur-lg border border-purple-200/50 dark:border-purple-700/50 p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Scheduled Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No scheduled posts. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-purple-200/50 dark:border-purple-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-md"
              >
                {editingPost?.id === post.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                      <select
                        value={editingPost.platform}
                        onChange={(e) => setEditingPost({ ...editingPost, platform: e.target.value })}
                        className="w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                      <textarea
                        value={editingPost.content}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date & Time</label>
                      <input
                        type="datetime-local"
                        value={editingPost.scheduledDate}
                        onChange={(e) => setEditingPost({ ...editingPost, scheduledDate: e.target.value })}
                        className="w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingPost(null)}
                        className="flex items-center space-x-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        onClick={() => updatePost(post.id, editingPost)}
                        disabled={loading}
                        className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-2 flex-wrap">
                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-semibold text-white shadow-sm ${platformColors[post.platform] || 'bg-gray-500'}`}
                        >
                          {post.platform}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {new Date(post.scheduledDate).toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === 'scheduled' 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : post.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-100 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
                    <button
                      onClick={() => handleEditPost(post)}
                      className="ml-4 rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      title="Edit post"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 p-6 shadow-2xl border border-purple-200/50 dark:border-purple-700/50">
            <h2 className="mb-4 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Schedule New Post</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                  className="block w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                  <button
                    onClick={generatePostSuggestion}
                    disabled={loading}
                    className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="block w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter post content or generate with AI..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                  className="block w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-2 font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={schedulePost}
                disabled={loading}
                className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-2 font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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

