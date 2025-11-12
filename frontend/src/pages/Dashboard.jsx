import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, BarChart3, Megaphone, ArrowRight, TrendingUp, Users, AlertCircle } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import { useNotifications } from '../context/NotificationContext'

const Dashboard = () => {
  const { showSuccess, showInfo } = useNotifications()

  // Demo notifications on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      showInfo('Welcome!', 'Your AI Automation Suite is ready. All agents are operational.')
    }, 1000)

    return () => clearTimeout(timer)
  }, [showInfo])
  const agents = [
    {
      title: 'Customer Support Agent',
      description: 'AI-powered customer support with intelligent ticket triage and automated responses',
      icon: MessageSquare,
      path: '/support',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Data Analytics Agent',
      description: 'Analyze CRM data and generate actionable insights using AI',
      icon: BarChart3,
      path: '/analytics',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500',
    },
    {
      title: 'Marketing Automation Agent',
      description: 'Schedule posts, generate content, and track engagement metrics',
      icon: Megaphone,
      path: '/marketing',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 p-8 lg:p-12 shadow-2xl">
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Manage your AI Automation Agents
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Streamline your operations with intelligent automation. Monitor, control, and optimize your AI agents from one powerful dashboard.
          </p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <Link
              key={agent.path}
              to={agent.path}
              className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${agent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
              <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-gray-800" />
              
              <div className="relative">
                <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${agent.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {agent.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {agent.description}
                </p>
                
                <div className="flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Open Agent</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Total Tickets"
            value="1,234"
            change="+12.5%"
            changeType="up"
            icon={MessageSquare}
            color="text-blue-500"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="AI Resolved"
            value="892"
            change="+8.2%"
            changeType="up"
            icon={TrendingUp}
            color="text-green-500"
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Human Escalations"
            value="342"
            change="-5.1%"
            changeType="down"
            icon={AlertCircle}
            color="text-orange-500"
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 p-6 border border-primary-200/50 dark:border-primary-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            System Status
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All systems operational. All AI agents are running smoothly.
          </p>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">All Systems Online</span>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 border border-purple-200/50 dark:border-purple-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Recent Activity
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Last 24 hours: 156 tickets processed, 89% AI resolution rate.
          </p>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">High Performance</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
