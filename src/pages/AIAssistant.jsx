import { useState, useEffect, useRef } from 'react'
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
  const [, setDiseaseImage] = useState(null)
  const [yieldForm, setYieldForm] = useState({
    crop: '',
    fieldSize: '',
    plantingDate: '',
    soilType: ''
  })
  const [yieldPrediction, setYieldPrediction] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Open sidebar by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI farming assistant powered by Google Gemini. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }])
  }
  
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
      } catch {
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:sticky lg:top-0 lg:translate-x-0 inset-y-0 left-0 z-50 lg:z-10 w-64 bg-gray-900 text-white transition-transform duration-300 flex flex-col lg:h-screen lg:self-start`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">AgroTrends AI</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <button 
            onClick={clearChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">AI Tools</h3>
          <div className="space-y-2">
            {aiTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  setSelectedTool(tool.id)
                  // Close sidebar on mobile after selecting a tool
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false)
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedTool === tool.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tool.name}</p>
                    <p className="text-xs text-gray-400 truncate">{tool.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Powered by Google Gemini</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
                {aiTools.find(t => t.id === selectedTool)?.name || 'AI Assistant'}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 truncate hidden sm:block">
                {aiTools.find(t => t.id === selectedTool)?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center space-x-2 px-2 lg:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs lg:text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Online</span>
            </div>
          </div>
        </div>

        {/* AI Chat Interface */}
        {selectedTool === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 lg:px-4 py-4 lg:py-6">
              <div className="max-w-3xl mx-auto space-y-4 lg:space-y-6">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 lg:space-x-3 max-w-[85%] lg:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {message.type === 'user' ? 'Y' : 'AI'}
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`px-3 lg:px-4 py-2 lg:py-3 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}>
                          <p className="whitespace-pre-wrap text-xs lg:text-sm leading-relaxed break-words">{message.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 px-2">
                          <p className="text-xs text-gray-400">{message.timestamp}</p>
                          {message.type === 'ai' && (
                            <button
                              onClick={() => speakText(message.content)}
                              className="text-gray-400 hover:text-primary-600 transition-colors hidden sm:block"
                              title="Read aloud"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-7.07a5 5 0 00-1.414 1.414M12 12h.01" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 lg:space-x-3 max-w-[85%] lg:max-w-[80%]">
                      <div className="flex-shrink-0 w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold bg-green-600 text-white">
                        AI
                      </div>
                      <div className="bg-white border border-gray-200 px-3 lg:px-4 py-2 lg:py-3 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input Area */}
            <div className="border-t bg-white px-3 lg:px-4 py-3 lg:py-4 flex-shrink-0">
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSendMessage} className="relative">
                  <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full lg:rounded-3xl px-3 lg:px-4 py-2 lg:py-3 shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Message AgroTrends AI..."
                      className="flex-1 outline-none text-sm lg:text-base text-gray-900 placeholder-gray-400"
                      disabled={isTyping}
                    />
                    
                    {/* Voice Input Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-1.5 lg:p-2 rounded-full transition-all flex-shrink-0 ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
                      }`}
                      title={isListening ? 'Stop recording' : 'Voice input'}
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    
                    {/* Send Button */}
                    <button 
                      type="submit" 
                      disabled={isTyping || !inputMessage.trim()}
                      className="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-1.5 lg:p-2 rounded-full transition-all disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {isTyping ? (
                        <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 text-center mt-2 lg:mt-3 hidden sm:block">
                  AgroTrends AI can make mistakes. Consider checking important information.
                </p>
              </div>
            </div>
          </div>
        )}

          {/* Disease Diagnosis Tool */}
        {selectedTool === 'disease' && (
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4 lg:p-8">
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
        )}

        {/* Weather Insights Tool */}
        {selectedTool === 'weather' && (
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4 lg:p-8">
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
        )}

        {/* Yield Predictor Tool */}
        {selectedTool === 'yield' && (
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-4 lg:p-8">
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
        )}
      </div>
    </div>
  )
}

export default AIAssistant