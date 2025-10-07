import { useState, useEffect } from 'react'
import geminiService from '../services/geminiService'

function AIInsights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    loadInsights()
  }, [])
  
  const loadInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      const aiInsights = await geminiService.getInsights()
      setInsights(aiInsights)
    } catch (err) {
      console.error('Error loading AI insights:', err)
      setError('Unable to load AI insights')
      // Fallback to static insights
      setInsights([
        {
          id: 1,
          type: 'alert',
          title: 'Weather Alert',
          message: 'High humidity levels detected. Monitor crops for fungal diseases.',
          priority: 'high',
          icon: '⚠️'
        },
        {
          id: 2,
          type: 'recommendation',
          title: 'Planting Window',
          message: 'Optimal conditions for spring planting in the next 5 days.',
          priority: 'medium',
          icon: '🌱'
        },
        {
          id: 3,
          type: 'market',
          title: 'Market Trend',
          message: 'Organic produce prices trending upward this quarter.',
          priority: 'low',
          icon: '📈'
        }
      ])
    } finally {
      setLoading(false)
    }
  }
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800'
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'low': return 'border-green-200 bg-green-50 text-green-800'
      default: return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }
  
  const refreshInsights = () => {
    loadInsights()
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Powered by Gemini</span>
          </div>
        </div>
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
        <div className="flex items-center space-x-2">
          <button 
            onClick={refreshInsights}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh insights"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-500">Powered by Gemini</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {insights.map(insight => (
          <div key={insight.id} className={`border rounded-lg p-3 ${getPriorityColor(insight.priority)}`}>
            <div className="flex items-start">
              <span className="text-lg mr-2">{insight.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <p className="text-sm mt-1 opacity-90">{insight.message}</p>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                insight.priority === 'high' ? 'bg-red-400' :
                insight.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={() => window.location.href = '/ai-assistant'}
        className="w-full mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
      >
        View All AI Tools →
      </button>
    </div>
  )
}

export default AIInsights