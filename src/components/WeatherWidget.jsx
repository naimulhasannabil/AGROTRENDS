import { useState, useEffect } from 'react'

function WeatherWidget() {
  const [weatherData, setWeatherData] = useState({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    forecast: [
      { day: 'Today', temp: '24°C', condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', temp: '26°C', condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', temp: '22°C', condition: 'Rainy', icon: '🌧️' },
      { day: 'Thu', temp: '25°C', condition: 'Sunny', icon: '☀️' },
      { day: 'Fri', temp: '23°C', condition: 'Cloudy', icon: '☁️' }
    ]
  })
  
  const [farmingAdvice, setFarmingAdvice] = useState('')
  
  useEffect(() => {
    // Simulate AI-generated farming advice based on weather
    const advice = [
      "Perfect conditions for field work today!",
      "Consider irrigation - low humidity detected",
      "Good day for spraying - low wind conditions",
      "Rain expected tomorrow - plan accordingly",
      "Ideal temperature for crop growth"
    ]
    setFarmingAdvice(advice[Math.floor(Math.random() * advice.length)])
  }, [])
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Weather & AI Insights</h3>
        <div className="text-2xl">🌤️</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">{weatherData.temperature}°C</p>
          <p className="text-xs text-gray-600">Temperature</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</p>
          <p className="text-xs text-gray-600">Humidity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{weatherData.windSpeed}</p>
          <p className="text-xs text-gray-600">Wind km/h</p>
        </div>
      </div>
      
      <div className="bg-primary-50 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-primary-800">AI Recommendation:</p>
        <p className="text-sm text-primary-700">{farmingAdvice}</p>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm">5-Day Forecast</h4>
        {weatherData.forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="w-12">{day.day}</span>
            <span className="text-lg">{day.icon}</span>
            <span className="font-medium">{day.temp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherWidget