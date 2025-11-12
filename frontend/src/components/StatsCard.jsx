import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatsCard = ({ title, value, change, changeType, icon: Icon, color, gradient }) => {
  const isPositive = changeType === 'up'
  const isNegative = changeType === 'down'
  const isNeutral = changeType === 'neutral'

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              isPositive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              isNegative ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
            }`}>
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {isNeutral && <Minus className="h-3 w-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
            style={{ width: `${Math.min(100, (parseInt(value.replace(/,/g, '')) / 2000) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsCard

