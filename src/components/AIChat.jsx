import { useState, useEffect, useRef } from 'react'
import geminiService from '../services/geminiService'

function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '👋 Hi! I\'m your AI farming assistant powered by AgroTrends. I can help you with crop management, livestock care, disease diagnosis, weather insights, and much more. What would you like to know?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isTyping) return
    
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
      // Get AI response from AgroTrends
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
  
  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      content: '👋 Hi! I\'m your AI farming assistant powered by AgroTrends. How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }])
  }

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

      recognitionRef.current.onerror = () => {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Create image preview URL
      const imagePreviewUrl = URL.createObjectURL(file)

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
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('https://nur2712-agro-trends-ai.hf.space/predict', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw new Error('API request failed')

        const result = await response.json()
        
        const predictionName = result.prediction.replace(/_/g, ' ')
        const confidenceValue = parseFloat(result.confidence)
        
        // Check if confidence is too low (not a valid crop/plant image)
        if (confidenceValue < 30) {
          const errorResponse = `⚠️ **IMAGE NOT RECOGNIZED**\n` +
            `────────────────\n\n` +
            `🚫 **Issue Detected**\nThe uploaded image doesn't appear to be a crop or plant leaf that our system can analyze.\n\n` +
            `📊 **Confidence**: ${result.confidence} ❌\n\n` +
            `💡 **Please Upload:**\n` +
            `   ✓ Clear photos of crop leaves\n` +
            `   ✓ Close-up plant disease images\n` +
            `   ✓ Well-lit agricultural images\n\n` +
            `❌ **Avoid:**\n` +
            `   × Random objects\n` +
            `   × Blurry images\n` +
            `   × Non-agricultural content\n\n` +
            `────────────────\n🌾 Try again with a crop image`
          
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
        
        const aiResponse = `🌿 **ANALYSIS COMPLETE**\n` +
          `────────────────\n\n` +
          `🎯 **Diagnosis**\n${predictionName}\n\n` +
          `📊 **Confidence**\n${result.confidence} ${confidenceValue >= 80 ? '✅' : '⚠️'}\n\n` +
          `📋 **Top Matches**\n` +
          result.top_5.slice(0, 3).map((item, index) => {
            const probability = (parseFloat(item.probability) * 100).toFixed(1)
            return `${index + 1}. ${item.class.replace(/_/g, ' ')}\n   ${probability}%`
          }).join('\n') +
          `\n\n────────────────\n👨‍⚕️ Consult an expert for treatment`

        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString(),
          gradcamUrl: result.gradcam_image_url ? `https://nur2712-agro-trends-ai.hf.space${result.gradcam_image_url}` : null
        }
        
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('Error:', error)
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: '❌ Error analyzing image. Please try again.',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
        e.target.value = ''
      }
    }
  }

  const triggerImageUpload = () => {
    document.getElementById('floatingImageUpload').click()
  }
  
  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 transform hover:scale-110"
        aria-label="Toggle AI Chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-2 left-2 sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 lg:w-[500px] bg-white rounded-2xl shadow-2xl z-50 max-h-[600px] sm:max-h-[650px] flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-white text-gray-800 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                  🌾
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg flex items-center">
                    AgroTrends AI
                    <sup className="text-xs text-blue-600 ml-1">beta</sup>
                  </h4>
                  <p className="text-xs text-gray-500">awaiting prompts</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={clearChat}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  title="Reset chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  title="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 min-h-[300px] sm:min-h-[400px] max-h-[380px] sm:max-h-[450px]">
            <div className="space-y-3 sm:space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs mr-1.5 sm:mr-2">
                      🌾
                    </div>
                  )}
                  <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ml-auto' 
                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                    }`}>
                      {/* Display uploaded image for user messages - BEFORE text */}
                      {message.type === 'user' && message.imageUrl && (
                        <div className="mb-2">
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded crop" 
                            className="rounded-lg w-full h-auto max-h-40 object-cover border-2 border-white/30 shadow-md"
                          />
                        </div>
                      )}
                      
                      {message.content && (
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                      )}
                      
                      {/* Display GradCAM image for AI responses */}
                      {message.type === 'ai' && message.gradcamUrl && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-600 mb-1">🔍 GradCAM:</p>
                          <img 
                            src={message.gradcamUrl} 
                            alt="Detection heatmap" 
                            className="rounded-lg max-w-full h-auto max-h-48 object-contain border border-gray-200"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1 px-2">
                      <p className="text-xs text-gray-500">{message.timestamp}</p>
                      {message.type === 'ai' && (
                        <button
                          onClick={() => speakText(message.content)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
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
              ))}
              
              {isTyping && (
                <div className="flex items-start justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs mr-2">
                    🌾
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage}>
              <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-green-500 transition-colors">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Enter prompt here..."
                  className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-xs sm:text-sm pr-2"
                  disabled={isTyping}
                />
                
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="floatingImageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {/* Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-1.5 rounded-lg transition-all ${
                      isListening 
                        ? 'text-red-400 bg-red-500/20 animate-pulse' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isListening ? "Stop recording" : "Voice input"}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>

                  {/* Camera Icon Button */}
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    className="p-1.5 rounded-lg transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                    className="p-1.5 rounded-lg transition-all text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
                    className="p-1.5 rounded-lg transition-all text-gray-500 hover:text-green-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
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
            <p className="text-xs text-gray-500 mt-2 hidden sm:block">
              Powered by AgroTrends.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChat