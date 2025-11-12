import { Link } from 'react-router-dom'
import { MessageSquare, BarChart3, Megaphone, ArrowRight } from 'lucide-react'

const Dashboard = () => {
  const agents = [
    {
      title: 'Customer Support Agent',
      description: 'AI-powered customer support with intelligent ticket triage and automated responses',
      icon: MessageSquare,
      path: '/support',
      color: 'bg-blue-500',
    },
    {
      title: 'Data Analytics Agent',
      description: 'Analyze CRM data and generate actionable insights using AI',
      icon: BarChart3,
      path: '/analytics',
      color: 'bg-green-500',
    },
    {
      title: 'Marketing Automation Agent',
      description: 'Schedule posts, generate content, and track engagement metrics',
      icon: Megaphone,
      path: '/marketing',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your AI automation agents</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {agents.map((agent) => {
          const Icon = agent.icon
          return (
            <Link
              key={agent.path}
              to={agent.path}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <div className={`mb-4 inline-flex rounded-lg ${agent.color} p-3`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {agent.title}
              </h2>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{agent.description}</p>
              <div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                Open Agent
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Quick Stats</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI Resolved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">892</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Human Escalations</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">342</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

