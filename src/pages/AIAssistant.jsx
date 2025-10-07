import { useState } from 'react'
import HeroSection from '../components/HeroSection'
import geminiService from '../services/geminiService'

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI farming assistant powered by Google Gemini. I can help you with crop diseases, soil management, weather patterns, yield predictions, and any farming-related questions. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTool, setSelectedTool] = useState('chat')
  const [diseaseImage, setDiseaseImage] = useState(null)
  const [yieldForm, setYieldForm] = useState({
    crop: '',
    fieldSize: '',
    plantingDate: '',
    soilType: ''
  })
  const [yieldPrediction, setYieldPrediction] = useState(null)
  
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
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsTyping(true)
    
    try {
      // Get AI response from Gemini
      const aiResponse = await geminiService.getChatResponse(currentMessage)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setDiseaseImage(file)
      
      // Simulate disease analysis
      try {
        const analysis = await geminiService.getDiseaseAnalysis(
          `Analyzing uploaded image: ${file.name}. Please provide disease diagnosis and treatment recommendations.`
        )
        
        // Display results
        alert(`Disease Analysis Result:\n\n${analysis}`)
      } catch (error) {
        alert('Error analyzing image. Please try again.')
      }
    }
  }
  
  const handleYieldPrediction = async (e) => {
    e.preventDefault()
    
    try {
      const prediction = await geminiService.predictYield(yieldForm)
      setYieldPrediction(prediction)
    } catch (error) {
      console.error('Error predicting yield:', error)
      setYieldPrediction('Unable to generate yield prediction. Please try again.')
    }
  }
  
  return (
    <>
      <HeroSection 
        title="AI Farming Assistant"
        subtitle="Get instant expert advice powered by Google Gemini AI"
        backgroundClass="bg-gradient-to-r bg-[#DAFCE7] to-blue-50"
      />
      
      {/* AI Tools Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Tools</h2>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Powered by Google Gemini AI</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map(tool => (
              <div 
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedTool === tool.id 
                    ? 'border-primary-500 bg-primary-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
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
                <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">AI Farming Assistant</h3>
                      <p className="text-primary-100">Powered by Google Gemini</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800 border'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Gemini is thinking</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask your farming question..."
                      className="flex-1 form-input"
                      disabled={isTyping}
                    />
                    <button 
                      type="submit" 
                      disabled={isTyping || !inputMessage.trim()}
                      className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-2 rounded-md transition-all duration-200 disabled:cursor-not-allowed"
                    >
                      {isTyping ? 'Thinking...' : 'Send'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Try: "How do I treat tomato blight?" or "Best fertilizer for corn?"
                  </p>
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
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Plant Disease Diagnosis</h3>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Powered by Google Gemini AI</span>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-primary-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">Upload a photo of your plant</p>
                  <p className="text-sm text-gray-500 mb-4">AI will analyze the image and provide diagnosis</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="disease-image"
                  />
                  <label htmlFor="disease-image" className="btn-primary cursor-pointer inline-block">
                    Choose Image
                  </label>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">How it works:</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Take a clear photo of the affected plant</li>
                    <li>2. Upload the image using the button above</li>
                    <li>3. Gemini AI analyzes the image for disease symptoms</li>
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
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">AI Weather Insights</h3>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Powered by Google Gemini AI</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">7-Day Forecast</h4>
                    <p className="text-blue-700">Partly cloudy with 30% chance of rain. Ideal for field work on Tuesday and Wednesday.</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Planting Recommendations</h4>
                    <p className="text-green-700">Optimal conditions for planting corn in the next 5 days. Soil temperature: 62°F</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
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
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Yield Prediction</h3>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Powered by Google Gemini AI</span>
                  </div>
                </div>
                
                <form onSubmit={handleYieldPrediction} className="space-y-4">
                  <div>
                    <label className="form-label">Crop Type</label>
                    <select 
                      className="form-input"
                      value={yieldForm.crop}
                      onChange={(e) => setYieldForm({...yieldForm, crop: e.target.value})}
                      required
                    >
                      <option value="">Select crop</option>
                      <option value="corn">Corn</option>
                      <option value="wheat">Wheat</option>
                      <option value="soybeans">Soybeans</option>
                      <option value="rice">Rice</option>
                      <option value="tomatoes">Tomatoes</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Field Size (acres)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="Enter field size"
                      value={yieldForm.fieldSize}
                      onChange={(e) => setYieldForm({...yieldForm, fieldSize: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Planting Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={yieldForm.plantingDate}
                      onChange={(e) => setYieldForm({...yieldForm, plantingDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Soil Type</label>
                    <select 
                      className="form-input"
                      value={yieldForm.soilType}
                      onChange={(e) => setYieldForm({...yieldForm, soilType: e.target.value})}
                      required
                    >
                      <option value="">Select soil type</option>
                      <option value="clay">Clay</option>
                      <option value="loam">Loam</option>
                      <option value="sandy">Sandy</option>
                      <option value="silt">Silt</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Predict Yield with AI
                  </button>
                </form>
                
                {yieldPrediction && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">AI Yield Prediction:</h4>
                    <p className="text-green-700">{yieldPrediction}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default AIAssistant