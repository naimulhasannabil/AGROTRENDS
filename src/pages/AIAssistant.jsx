import { useState, useEffect, useRef } from 'react'
import geminiService from '../services/geminiService'

function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      content: 'What are the best practices for organic tomato farming?',
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString()
    },
    {
      id: 2,
      type: 'ai',
      content: `Great question! Here are the key best practices for organic tomato farming:

🌱 **Soil Preparation**
- Use compost and organic matter to enrich soil
- Maintain pH between 6.0-6.8
- Ensure good drainage

🌿 **Plant Care**
- Space plants 24-36 inches apart
- Use organic mulch to retain moisture
- Stake or cage plants for support

💧 **Watering**
- Water deeply 1-2 inches per week
- Water at base to prevent leaf diseases
- Use drip irrigation when possible

🐛 **Pest Management**
- Companion planting (basil, marigolds)
- Neem oil for organic pest control
- Regular inspection for early detection

Would you like more specific guidance on any of these areas?`,
      timestamp: new Date(Date.now() - 580000).toLocaleTimeString()
    },
    {
      id: 3,
      type: 'user',
      content: 'How do I identify and treat tomato blight?',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString()
    },
    {
      id: 4,
      type: 'ai',
      content: `Tomato blight is a serious disease. Here's how to identify and manage it:

🔍 **Identification**
Early Blight:
- Dark brown spots with concentric rings on lower leaves
- Yellowing around spots
- Affects older leaves first

Late Blight:
- Gray-green water-soaked spots on leaves
- White fuzzy growth on undersides
- Can spread rapidly in cool, wet weather

🛡️ **Treatment & Prevention**
1. Remove affected leaves immediately
2. Apply copper-based fungicides (organic option)
3. Improve air circulation
4. Water at soil level only
5. Rotate crops yearly
6. Use disease-resistant varieties

⚠️ **Important**: Act quickly as blight spreads fast in humid conditions!`,
      timestamp: new Date(Date.now() - 280000).toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [responseLength, setResponseLength] = useState('medium')
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)

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

  const _toggleVoiceInput = () => {
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

  const _speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      window.speechSynthesis.speak(utterance)
    }
  }


  const clearChat = () => {
    setMessages([])
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
      // Get AI response from Gemini with response length context
      const lengthPrompt = responseLength === 'short' ? ' (Please provide a brief, concise answer)' : 
                          responseLength === 'long' ? ' (Please provide a detailed, comprehensive answer)' : 
                          ' (Please provide a balanced answer)'
      const aiResponse = await geminiService.getChatResponse(currentMessage + lengthPrompt)
      
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
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Create image preview URL
      const imagePreviewUrl = URL.createObjectURL(file)

      // Add user message showing image upload
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: '', // Empty content, only show image
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: imagePreviewUrl
      }
      setMessages(prev => [...prev, userMessage])
      setIsTyping(true)

      try {
        // Create FormData and send to disease detection API
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('https://nur2712-agro-trends-ai.hf.space/predict', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('API request failed')
        }

        const result = await response.json()
        
        // Format the AI response with disease detection results
        const predictionName = result.prediction.replace(/_/g, ' ')
        const confidenceValue = parseFloat(result.confidence)
        
        // Check if confidence is too low (not a valid crop/plant image)
        if (confidenceValue < 30) {
          const errorResponse = `⚠️ **INVALID IMAGE DETECTED**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `🚫 **Analysis Failed**\n` +
            `   The image you uploaded does not appear to be a valid crop or plant image that our disease detection system can analyze.\n\n` +
            `📊 **Confidence Level**\n` +
            `   ➤ ${result.confidence} ❌\n\n` +
            `🌾 **What We're Looking For:**\n` +
            `   ✓ Clear, well-lit photos of crop leaves\n` +
            `   ✓ Close-up images showing plant diseases\n` +
            `   ✓ Photos of agricultural crops (corn, wheat, tomato, etc.)\n` +
            `   ✓ Leaves with visible symptoms or healthy plants\n\n` +
            `❌ **Common Issues:**\n` +
            `   × Random objects, animals, or people\n` +
            `   × Blurry or poorly lit images\n` +
            `   × Non-plant content\n` +
            `   × Screenshots or drawings\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💡 **Next Steps**\n` +
            `Please upload a clear photo of a crop leaf or plant for accurate disease detection. Make sure the image is focused and well-lit.\n\n` +
            `📸 Need help? Take a photo directly showing the affected plant leaves or crop area.`

          const aiMessage = {
            id: Date.now() + 1,
            type: 'ai',
            content: errorResponse,
            timestamp: new Date().toLocaleTimeString()
          }
          
          setMessages(prev => [...prev, aiMessage])
          setIsTyping(false)
          e.target.value = ''
          return
        }
        
        const aiResponse = `🌿 **CROP DISEASE ANALYSIS COMPLETE**\n` +
          `───────────────────────\n\n` +
          `🎯 **Primary Diagnosis**\n` +
          `   ➤ ${predictionName}\n\n` +
          `📊 **Confidence Level**\n` +
          `   ➤ ${result.confidence} ${confidenceValue >= 80 ? '✅ High Confidence' : confidenceValue >= 60 ? '⚠️ Moderate' : '⚠️ Low Confidence'}\n\n` +
          `📋 **Detailed Analysis (Top 5)**\n` +
          result.top_5.map((item, index) => {
            const probability = (parseFloat(item.probability) * 100).toFixed(2)
            const bar = '█'.repeat(Math.round(parseFloat(item.probability) * 20))
            return `   ${index + 1}. ${item.class.replace(/_/g, ' ')}\n      ${bar} ${probability}%`
          }).join('\n\n') +
          `\n\n───────────────────────\n` +
          `👨‍⚕️ **Expert Recommendation**\n` +
          `For accurate treatment and management of this condition, we recommend consulting with a certified agricultural specialist or plant pathologist. They can provide tailored solutions based on your specific growing conditions.\n\n` +
          `📞 Need help finding an expert? Contact your local agricultural extension office.`

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
          gradcamUrl: result.gradcam_image_url ? `https://nur2712-agro-trends-ai.hf.space${result.gradcam_image_url}` : null
        }
        
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('Error analyzing image:', error)
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: '❌ Sorry, I encountered an error analyzing the image. Please ensure the model is running and try again.',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
        // Reset file input
        e.target.value = ''
      }
    }
  }
  
  const _handleYieldPrediction = async (e) => {
    e.preventDefault()
    alert('Yield prediction feature will be integrated with the chat interface.')
  }

  const triggerImageUpload = () => {
    document.getElementById('imageUploadInput').click()
  }
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Conversations History */}
      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-4">
          <button 
            onClick={clearChat}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">New chat</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Today</div>
            
            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate group-hover:text-green-600">Tomato Farming Tips</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Best practices for organic...</p>
                </div>
              </div>
            </button>

            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-3">Yesterday</div>
            
            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate group-hover:text-green-600">Crop Disease Detection</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Identifying wheat rust...</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate group-hover:text-green-600">Soil Testing Guide</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">How to test pH levels...</p>
                </div>
              </div>
            </button>

            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-3">Last 7 Days</div>
            
            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate group-hover:text-green-600">Irrigation Systems</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Drip vs sprinkler comparison...</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate group-hover:text-green-600">Livestock Management</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Cattle vaccination schedule...</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate group-hover:text-green-600">Weather Predictions</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">Seasonal rainfall forecast...</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Powered by AgroTrends
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with title and reset button */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 flex items-center">
                AgroTrends AI
                <sup className="text-xs text-blue-600 ml-1">beta</sup>
              </h1>
              <p className="text-xs text-gray-500">awaiting prompts</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Reset chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm hidden sm:inline">Reset chat</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            // Empty State - PlantVillage Style
            <div className="h-full flex flex-col items-center justify-center px-4 py-12">
              <div className="w-32 h-32 mb-6 relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-6xl">🌾</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-2">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-medium text-gray-800 mb-8">Hi! How can I help you today?</h2>
            </div>
          ) : (
            // Messages Display
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="space-y-6">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      }`}>
                        {message.type === 'user' ? '👤' : '🌾'}
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`px-5 py-3 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                        }`}>
                          {/* Display uploaded image for user messages - BEFORE text */}
                          {message.type === 'user' && message.imageUrl && (
                            <div className="mb-3">
                              <img 
                                src={message.imageUrl} 
                                alt="Uploaded crop" 
                                className="rounded-lg w-full h-auto max-h-72 object-cover border-2 border-white/30 shadow-lg"
                                onLoad={() => console.log('Image loaded:', message.imageUrl)}
                                onError={(e) => console.error('Failed to load image:', message.imageUrl)}
                              />
                            </div>
                          )}
                          
                          {message.content && (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.content}</p>
                          )}
                          
                          {/* Display GradCAM image for AI responses */}
                          {message.type === 'ai' && message.gradcamUrl && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-600 mb-2">🔍 GradCAM Visualization:</p>
                              <img 
                                src={message.gradcamUrl} 
                                alt="Disease detection heatmap" 
                                className="rounded-lg max-w-full h-auto max-h-64 object-contain border border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  console.error('Failed to load GradCAM image')
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1 px-2">
                          <p className="text-xs text-gray-500">{message.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-[85%]">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        🌾
                      </div>
                      <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-3">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-2xl px-4 py-3.5 focus-within:border-green-500 transition-colors">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Enter prompt here..."
                  className="flex-1 outline-none text-base text-gray-800 placeholder-gray-400 bg-transparent pr-3"
                  disabled={isTyping}
                />
                
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="imageUploadInput"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Camera Icon Button */}
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-2 rounded-lg transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    title="Upload image for disease detection"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Image Icon Button */}
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-2 rounded-lg transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    title="Upload image for disease detection"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  
                  {/* Send Button */}
                  <button 
                    type="submit" 
                    disabled={isTyping || !inputMessage.trim()}
                    className="p-2 rounded-lg transition-all text-gray-500 hover:text-green-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    {isTyping ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Response Length Control */}
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Response Length:</label>
              <select
                value={responseLength}
                onChange={(e) => setResponseLength(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-green-500"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Detailed</option>
              </select>
            </div>

            <p className="text-xs text-gray-500">
              Powered by AgroTrends.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant