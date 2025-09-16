import { useState, useEffect } from 'react'

function AIInsights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulate AI-generated insights
    setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: 'alert',
          title: 'Disease Risk Alert',
          message: 'High humidity levels detected. Monitor crops for fungal diseases.',
          priority: 'high',
          icon: '⚠️'
        },
        {
          id: 2,
          type: 'recommendation',
          title: 'Optimal Planting Window',
          message: 'Soil temperature ideal for corn planting in the next 3 days.',
          priority: 'medium',
          icon: '🌱'
        },
        {
          id: 3,
          type: 'market',
          title: 'Market Opportunity',
          message: 'Wheat prices trending upward. Consider increasing acreage.',
          priority: 'low',
          icon: '📈'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Insights</h3>
        <div className="text-xl">🤖</div>
      </div>
      
      <div className="space-y-3">
        {insights.map(insight => (
          <div key={insight.id} className={`border rounded-lg p-3 ${getPriorityColor(insight.priority)}`}>
            <div className="flex items-start">
              <span className="text-lg mr-2">{insight.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium">
        View All Insights →
      </button>
    </div>
  )
}

export default AIInsights