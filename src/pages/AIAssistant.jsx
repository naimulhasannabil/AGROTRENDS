import { useState, useEffect, useRef } from 'react'
import { useAskAI } from '../services/query/ai' // Import the custom hook

// Reusable Logo component to keep design consistent
const Logo = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-14 h-14 sm:w-20 sm:h-20',
  }
  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl ${sizes[size]}`}>
      <img src="/AgroTrends.svg" alt="AgroTrends logo" className="w-full h-full object-contain block" />
    </div>
  )
}

function AIAssistant() {
  // Load messages from localStorage on init so chat persists across refreshes
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('ai_messages')
      return saved ? JSON.parse(saved) : []
    } catch (err) {
      console.error('Failed to load saved messages', err)
      return []
    }
  })
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [responseLength, setResponseLength] = useState('medium')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ai_messages', JSON.stringify(messages))
    } catch (err) {
      console.error('Failed to save messages', err)
    }
  }, [messages])

  // Initialize the API mutation hook
  const { mutate: askAI, isLoading: isAILoading } = useAskAI()

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
    setIsSidebarOpen(false)
    try {
      localStorage.removeItem('ai_messages') // clear persisted chat
    } catch (err) {
      console.error('Failed to remove saved messages', err)
    }
  }

  // Format the API response text to be more readable
  const formatResponseText = (text) => {
    if (!text) return ''
    
    // Remove excessive newlines (more than 2 consecutive)
    let formatted = text.replace(/\n{3,}/g, '\n\n')
    
    // Add proper spacing after section markers
    formatted = formatted.replace(/\*\*/g, '')
    
    // Clean up bullet points and numbering
    formatted = formatted.replace(/\\n/g, '\n')
    
    return formatted.trim()
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
      // Call the API using the custom hook
      askAI(
        { 
          question: currentMessage, 
          lang: 'en' 
        },
        {
          onSuccess: (response) => {
            // Extract the answer from the response payload
            const aiResponseText = response?.payload?.answer || 'No response received'
            
            // Format the response text
            const formattedText = formatResponseText(aiResponseText)
            
            const aiMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: formattedText,
              timestamp: new Date().toLocaleTimeString()
            }
            
            setMessages(prev => [...prev, aiMessage])
            setIsTyping(false)
          },
          onError: (error) => {
            console.error('Error getting AI response:', error)
            const errorMessage = {
              id: Date.now() + 1,
              type: 'ai',
              content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
              timestamp: new Date().toLocaleTimeString()
            }
            setMessages(prev => [...prev, errorMessage])
            setIsTyping(false)
          }
        }
      )
    } catch (error) {
      console.error('Unexpected error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'An unexpected error occurred. Please try again.',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, errorMessage])
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
        if (confidenceValue < 50) {
          const errorResponse = `INVALID IMAGE DETECTED\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Analysis Failed\n` +
            `The image you uploaded does not appear to be a valid crop or plant image that our disease detection system can analyze.\n\n` +
            `Confidence Level\n` +
            `${result.confidence}\n\n` +
            `What We're Looking For:\n` +
            `- Clear, well-lit photos of crop leaves\n` +
            `- Close-up images showing plant diseases\n` +
            `- Photos of agricultural crops (corn, wheat, tomato, etc.)\n` +
            `- Leaves with visible symptoms or healthy plants\n\n` +
            `Common Issues:\n` +
            `- Random objects, animals, or people\n` +
            `- Blurry or poorly lit images\n` +
            `- Non-plant content\n` +
            `- Screenshots or drawings\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Next Steps\n` +
            `Please upload a clear photo of a crop leaf or plant for accurate disease detection. Make sure the image is focused and well-lit.`

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
        
        const aiResponse = `CROP DISEASE ANALYSIS COMPLETE\n` +
          `───────────────────────\n\n` +
          `Primary Diagnosis\n` +
          `${predictionName}\n\n` +
          `Confidence Level\n` +
          `${result.confidence} ${confidenceValue >= 80 ? 'High Confidence' : confidenceValue >= 60 ? 'Moderate' : 'Low Confidence'}\n\n` +
          `Detailed Analysis (Top 5)\n` +
          result.top_5.map((item, index) => {
            const probability = (parseFloat(item.probability) * 100).toFixed(2)
            const barLength = Math.round(parseFloat(item.probability) * 20)
            const bar = '█'.repeat(barLength)
            return `${index + 1}. ${item.class.replace(/_/g, ' ')}\n   ${bar} ${probability}%`
          }).join('\n\n')

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
          content: 'Sorry, I encountered an error analyzing the image. Please ensure the model is running and try again.',
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Conversations History */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:flex
      `}>
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
        <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <Logo size="md" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-gray-800 flex items-center truncate">
                AgroTrends AI
                <sup className="text-xs text-blue-600 ml-1">beta</sup>
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">awaiting prompts</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Reset chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center px-4 py-8 sm:py-12">
              <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 relative">
                <Logo size="lg" />
                <div className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1.5 sm:p-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-medium text-gray-800 mb-4 sm:mb-8 text-center px-4">Hi! How can I help you today?</h2>
            </div>
          ) : (
            // Messages Display
            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
              <div className="space-y-4 sm:space-y-6">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg font-semibold ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
                          : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                      }`}>
                        {message.type === 'user' ? '👤' : '🌾'}
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                        }`}>
                          {/* Display uploaded image for user messages - BEFORE text */}
                          {message.type === 'user' && message.imageUrl && (
                            <div className="mb-2 sm:mb-3">
                              <img 
                                src={message.imageUrl} 
                                alt="Uploaded crop" 
                                className="rounded-lg w-full h-auto max-h-48 sm:max-h-72 object-contain border-2 border-white/30 shadow-lg"
                              />
                            </div>
                          )}
                          
                          {message.content && (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">{message.content}</p>
                          )}
                          
                          {/* Display GradCAM image for AI responses */}
                          {message.type === 'ai' && message.gradcamUrl && (
                            <div className="mt-2 sm:mt-3">
                              <p className="text-xs font-semibold text-gray-600 mb-2">GradCAM Visualization:</p>
                              <img 
                                src={message.gradcamUrl} 
                                alt="Disease detection heatmap" 
                                className="rounded-lg max-w-full h-auto max-h-48 sm:max-h-64 object-contain border border-gray-200"
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
                    <div className="flex items-start space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%]">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base sm:text-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        🌾
                      </div>
                      <div className="bg-white border border-gray-200 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-sm">
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
        <div className="border-t border-gray-200 bg-white px-3 sm:px-4 py-3 sm:py-6">
          <div className="max-w-4xl mx-auto space-y-2 sm:space-y-3">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3.5 focus-within:border-green-500 transition-colors">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Enter prompt here..."
                  className="flex-1 outline-none text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent pr-2 sm:pr-3"
                  disabled={isTyping}
                />
                
                <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="imageUploadInput"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Camera Icon Button - Hidden on very small screens */}
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-1.5 sm:p-2 rounded-lg transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100 hidden xs:block"
                    title="Upload image for disease detection"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Image Icon Button */}
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-1.5 sm:p-2 rounded-lg transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    title="Upload image for disease detection"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  
                  {/* Send Button */}
                  <button 
                    type="submit" 
                    disabled={isTyping || !inputMessage.trim()}
                    className="p-1.5 sm:p-2 rounded-lg transition-all text-gray-500 hover:text-green-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    {isTyping ? (
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
            
            {/* Response Length Control */}
            <div className="flex items-center space-x-2 flex-wrap">
              <label className="text-xs sm:text-sm text-gray-600">Response Length:</label>
              <select
                value={responseLength}
                onChange={(e) => setResponseLength(e.target.value)}
                className="text-xs sm:text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 focus:outline-none focus:border-green-500"
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