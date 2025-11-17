import { useState, useEffect, useRef } from 'react'
import geminiService from '../services/geminiService'

function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '👋 Hi! I\'m your AI farming assistant powered by Google Gemini. I can help you with crop management, livestock care, disease diagnosis, weather insights, and much more. What would you like to know?',
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
  
  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      content: '👋 Hi! I\'m your AI farming assistant powered by Google Gemini. How can I help you today?',
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
        <div className="fixed bottom-20 right-2 left-2 sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 lg:w-[500px] bg-white rounded-2xl shadow-2xl z-50 max-h-[600px] sm:max-h-[650px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                  🤖
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg">AI Assistant</h4>
                  <p className="text-xs text-white/90">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={clearChat}
                  className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  title="Clear chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-xs mr-1.5 sm:mr-2">
                      AI
                    </div>
                  )}
                  <div className="flex-1 max-w-[85%] sm:max-w-[80%]">
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-gray-200 text-gray-900 ml-auto' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                    }`}>
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 px-2">
                      <p className="text-xs text-gray-400">{message.timestamp}</p>
                      {message.type === 'ai' && (
                        <button
                          onClick={() => speakText(message.content)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-xs mr-2">
                    AI
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 bg-white border-t">
            <form onSubmit={handleSendMessage}>
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-gray-100 rounded-full px-3 sm:px-4 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about farming, crops..."
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-xs sm:text-sm"
                  disabled={isTyping}
                />
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-1.5 sm:p-2 rounded-full transition-all flex-shrink-0 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-500 hover:text-green-600 hover:bg-white'
                  }`}
                  title={isListening ? 'Stop recording' : 'Voice input'}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                
                {/* Send Button */}
                <button 
                  type="submit" 
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white p-1.5 sm:p-2 rounded-full transition-all disabled:cursor-not-allowed flex-shrink-0"
                  title="Send message"
                >
                  {isTyping ? (
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500 text-center mt-2 hidden sm:block">
              💡 Try asking: "How do I treat tomato blight?" or "Best time to plant corn?"
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChat