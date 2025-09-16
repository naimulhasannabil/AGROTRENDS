import { useState } from 'react'
import HeroSection from '../components/HeroSection'

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI farming assistant. How can I help you today? You can ask me about crop diseases, soil management, weather patterns, or any farming-related questions.',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTool, setSelectedTool] = useState('chat')
  
  // AI Tools
  const aiTools = [
    {
      id: 'chat',
      name: 'AI Chat Assistant',
      description: 'Get instant answers to your farming questions',
      icon: '💬'
    },
    {
      id: 'disease',
      name: 'Disease Diagnosis',
      description: 'Upload plant images for disease identification',
      icon: '🔬'
    },
    {
      id: 'weather',
      name: 'Weather Insights',
      description: 'AI-powered weather predictions for farming',
      icon: '🌤️'
    },
    {
      id: 'yield',
      name: 'Yield Predictor',
      description: 'Predict crop yields based on current conditions',
      icon: '📊'
    }
  ]
  
  // Sample AI responses
  const aiResponses = [
    "Based on your description, it sounds like your tomatoes might have early blight. I recommend removing affected leaves and applying a copper-based fungicide.",
    "For optimal corn growth, ensure soil temperature is above 60°F and provide adequate nitrogen fertilization during the V6 growth stage.",
    "Your soil pH of 6.2 is ideal for most vegetables. Consider adding organic matter to improve soil structure and water retention.",
    "The weather forecast shows rain in the next 3 days. I recommend delaying your pesticide application until after the rain passes.",
    "Based on current growing conditions, your wheat yield is projected to be 15% above average this season."
  ]
  
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }
  
  return (
    <>
      <HeroSection 
        title="AI Farming Assistant"
        subtitle="Get instant expert advice powered by artificial intelligence"
        backgroundClass="bg-gradient-to-r from-primary-50 to-blue-50"
      />
      
      {/* AI Tools Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map(tool => (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedTool === tool.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="text-4xl mb-4 text-center">{tool.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-center">{tool.name}</h3>
                <p className="text-gray-600 text-center text-sm">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Chat Interface */}
      {selectedTool === 'chat' && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-primary-600 text-white p-4">
                  <h3 className="text-xl font-semibold">AI Farming Assistant</h3>
                  <p className="text-primary-100">Ask me anything about farming!</p>
                </div>
                
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask your farming question..."
                      className="flex-1 form-input"
                    />
                    <button type="submit" className="btn-primary">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Disease Diagnosis Tool */}
      {selectedTool === 'disease' && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-center">Plant Disease Diagnosis</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Upload a photo of your plant</p>
                  <p className="text-sm text-gray-500">AI will analyze the image and provide diagnosis</p>
                  <button className="btn-primary mt-4">
                    Choose Image
                  </button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Take a clear photo of the affected plant</li>
                    <li>2. Upload the image using the button above</li>
                    <li>3. AI analyzes the image for disease symptoms</li>
                    <li>4. Get instant diagnosis and treatment recommendations</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Weather Insights Tool */}
      {selectedTool === 'weather' && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-center">AI Weather Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">7-Day Forecast</h4>
                    <p className="text-blue-700">Partly cloudy with 30% chance of rain. Ideal for field work on Tuesday and Wednesday.</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Planting Recommendations</h4>
                    <p className="text-green-700">Optimal conditions for planting corn in the next 5 days. Soil temperature: 62°F</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Disease Risk</h4>
                    <p className="text-yellow-700">Moderate risk for fungal diseases due to humidity. Consider preventive treatments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Yield Predictor Tool */}
      {selectedTool === 'yield' && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-semibold mb-6 text-center">Yield Prediction</h3>
                <form className="space-y-4">
                  <div>
                    <label className="form-label">Crop Type</label>
                    <select className="form-input">
                      <option>Select crop</option>
                      <option>Corn</option>
                      <option>Wheat</option>
                      <option>Soybeans</option>
                      <option>Rice</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Field Size (acres)</label>
                    <input type="number" className="form-input" placeholder="Enter field size" />
                  </div>
                  <div>
                    <label className="form-label">Planting Date</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Soil Type</label>
                    <select className="form-input">
                      <option>Select soil type</option>
                      <option>Clay</option>
                      <option>Loam</option>
                      <option>Sandy</option>
                      <option>Silt</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Predict Yield
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default AIAssistant