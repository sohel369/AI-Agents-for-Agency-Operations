import { useState, useEffect, useRef } from 'react'
import { Calendar, Plus, Loader2, TrendingUp, Eye, Heart, MessageCircle, Share2, Edit2, Save, X, Megaphone, Sparkles, ArrowRight } from 'lucide-react'
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
  const modalRef = useRef(null)
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
    const savedPosts = localStorage.getItem('marketingPosts')
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts))
      } catch (e) {
        console.error('Error loading posts from localStorage:', e)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowScheduleModal(false)
      }
    }

    if (showScheduleModal) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [showScheduleModal])

  const savePostsToStorage = (postsToSave) => {
    localStorage.setItem('marketingPosts', JSON.stringify(postsToSave))
  }

  const generatePostSuggestion = () => {
    setLoading(true)
    
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
      showError('Validation Error', 'Please fill in all fields')
      return
    }

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
    
    showSuccess('Post Scheduled', 'Your post has been scheduled successfully!')
  }

  const updatePost = (postId, updates) => {
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
    setLoading(true)
    
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
    facebook: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
    linkedin: { bg: 'bg-blue-700', text: 'text-blue-700', border: 'border-blue-300' },
    twitter: { bg: 'bg-sky-500', text: 'text-sky-600', border: 'border-sky-200' },
  }

  const stats = [
    { label: 'Total Posts', value: posts.length.toString(), icon: Megaphone, color: 'text-purple-500' },
    { label: 'Scheduled', value: posts.filter(p => p.status === 'scheduled').length.toString(), icon: Calendar, color: 'text-blue-500' },
    { label: 'Total Engagement', value: '2.4K', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Avg Reach', value: '650', icon: Eye, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                Marketing Automation Agent
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
                Schedule posts, generate content, and track engagement metrics across all platforms
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
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={() => setShowScheduleModal(true)}
          className="group relative overflow-hidden flex-1 sm:flex-none rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center space-x-2 sm:space-x-3">
            <Plus className="h-5 w-5" />
            <span>Schedule Post</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
        <button
          onClick={getRecommendations}
          disabled={loading}
          className="flex-1 sm:flex-none flex items-center justify-center space-x-2 sm:space-x-3 rounded-xl md:rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <TrendingUp className="h-5 w-5" />
          )}
          <span>Get Recommendations</span>
        </button>
      </div>

      {/* Recommendations */}
      {recommendations && (
        <div className="rounded-xl md:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-5 md:p-6 shadow-lg animate-fade-in">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">AI Recommendations</h2>
          </div>
          <div className="prose max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 p-4 sm:p-5 md:p-6 text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 leading-relaxed">
              {recommendations}
            </pre>
          </div>
        </div>
      )}

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Engagement Trends</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: '#0ea5e9', r: 4 }} />
              <Line type="monotone" dataKey="reach" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl md:rounded-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Clicks by Day</h3>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="date" stroke="#6b7280" className="dark:stroke-gray-400" />
              <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="clicks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-purple-50/50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 backdrop-blur-lg border border-purple-200/50 dark:border-purple-700/50 p-4 sm:p-5 md:p-6 shadow-lg">
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Scheduled Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No scheduled posts. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-purple-200/50 dark:border-purple-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 hover:bg-white dark:hover:bg-gray-800 transition-all hover:shadow-md"
              >
                {editingPost?.id === post.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
                      <select
                        value={editingPost.platform}
                        onChange={(e) => setEditingPost({ ...editingPost, platform: e.target.value })}
                        className="w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 sm:px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="facebook">Facebook</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">Twitter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                      <textarea
                        value={editingPost.content}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 sm:px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduled Date & Time</label>
                      <input
                        type="datetime-local"
                        value={editingPost.scheduledDate}
                        onChange={(e) => setEditingPost({ ...editingPost, scheduledDate: e.target.value })}
                        className="w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 sm:px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 sm:space-x-3">
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
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 sm:mb-3 flex items-center space-x-2 flex-wrap gap-2">
                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-semibold text-white shadow-sm ${platformColors[post.platform]?.bg || 'bg-gray-500'}`}
                        >
                          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
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
                      <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 leading-relaxed">{post.content}</p>
                      <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1.5">
                          <Eye className="h-4 w-4" />
                          <span>{post.metrics?.views || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <Heart className="h-4 w-4" />
                          <span>{post.metrics?.likes || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.metrics?.comments || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1.5">
                          <Share2 className="h-4 w-4" />
                          <span>{post.metrics?.shares || 0}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditPost(post)}
                      className="flex-shrink-0 rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 p-2 sm:p-2.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                      title="Edit post"
                    >
                      <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div 
            ref={modalRef}
            className="w-full max-w-2xl rounded-xl md:rounded-2xl bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 p-4 sm:p-6 md:p-8 shadow-2xl border border-purple-200/50 dark:border-purple-700/50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Schedule New Post</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                  className="block w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 transition-all flex items-center space-x-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{loading ? 'Generating...' : 'Generate with AI'}</span>
                  </button>
                </div>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="block w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter post content or generate with AI..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={newPost.scheduledDate}
                  onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                  className="block w-full rounded-lg border border-purple-300 dark:border-purple-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-5 sm:px-6 py-2.5 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={schedulePost}
                disabled={loading}
                className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 px-5 sm:px-6 py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
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
