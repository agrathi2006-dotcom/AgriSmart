import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Camera, Volume2, VolumeX, Bot, User, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { speechService } from '../lib/speechService'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Message {
  id: string
  message: string
  sender: 'user' | 'ai'
  message_type: string
  metadata?: any
  created_at: string
}

interface AIChatProps {
  language: string
  userId: string
}

export default function AIChat({ language, userId }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initializeChat()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = async () => {
    try {
      // Create new chat session
      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          session_name: `Chat ${new Date().toLocaleString()}`,
          language
        })
        .select()
        .single()

      if (error) throw error
      setSessionId(session.id)

      // Load existing messages
      loadMessages(session.id)
    } catch (error) {
      console.error('Error initializing chat:', error)
      toast.error('Failed to initialize chat')
    }
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(messages || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async (message: string, messageType: string = 'text', imageData?: string) => {
    if (!message.trim() && !imageData) return

    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          message,
          sessionId,
          language,
          messageType,
          imageData
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Reload messages to get the latest
      await loadMessages(sessionId)
      
      // Speak the AI response
      if (data.response) {
        speakText(data.response)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsLoading(false)
      setInputMessage('')
      setSelectedImage(null)
    }
  }

  const handleSendMessage = () => {
    if (selectedImage) {
      sendMessage(inputMessage || 'Analyze this image', 'image', selectedImage)
    } else {
      sendMessage(inputMessage)
    }
  }

  const startListening = async () => {
    try {
      setIsListening(true)
      const result = await speechService.listen(getLanguageCode(language))
      setInputMessage(result)
      toast.success('Voice input captured!')
    } catch (error) {
      console.error('Error with speech recognition:', error)
      toast.error('Speech recognition failed')
    } finally {
      setIsListening(false)
    }
  }

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true)
      await speechService.speak(text, getLanguageCode(language))
    } catch (error) {
      console.error('Error with text-to-speech:', error)
    } finally {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    speechService.stopSpeaking()
    setIsSpeaking(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getLanguageCode = (lang: string): string => {
    const languageCodes: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN'
    }
    return languageCodes[lang] || 'en-US'
  }

  const getWelcomeMessage = () => {
    const welcomeMessages: Record<string, string> = {
      'en': 'Hello! I\'m your AI agricultural assistant. Ask me anything about farming, crops, weather, pests, or market prices!',
      'hi': 'नमस्ते! मैं आपका AI कृषि सहायक हूं। खेती, फसलों, मौसम, कीटों या बाजार की कीमतों के बारे में कुछ भी पूछें!',
      'te': 'హలో! నేను మీ AI వ్యవసాయ సహాయకుడిని. వ్యవసాయం, పంటలు, వాతావరణం, కీటకాలు లేదా మార్కెట్ ధరల గురించి ఏదైనా అడగండి!',
      'ta': 'வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். விவசாயம், பயிர்கள், வானிலை, பூச்சிகள் அல்லது சந்தை விலைகள் பற்றி எதையும் கேளுங்கள்!',
      'kn': 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಹಾಯಕ. ಕೃಷಿ, ಬೆಳೆಗಳು, ಹವಾಮಾನ, ಕೀಟಗಳು ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ!'
    }
    return welcomeMessages[language] || welcomeMessages['en']
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AgriSmart AI Assistant</h3>
            <p className="text-sm text-gray-600">Your farming companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <VolumeX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{getWelcomeMessage()}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Crop recommendation', 'Weather forecast', 'Pest control', 'Market prices'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'}`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm">{message.message}</p>
                  {message.message_type === 'image' && message.metadata?.imageData && (
                    <img
                      src={message.metadata.imageData}
                      alt="Uploaded"
                      className="mt-2 max-w-full h-32 object-cover rounded"
                    />
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                    {message.sender === 'ai' && (
                      <button
                        onClick={() => speakText(message.message)}
                        className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={isSpeaking}
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <img src={selectedImage} alt="Selected" className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Image selected for analysis</p>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={startListening}
            disabled={isListening}
            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about farming..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}