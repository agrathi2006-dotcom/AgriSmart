import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import AIChat from '../components/AIChat'
import { Globe, Volume2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ChatPageProps {
  user: User
}

export default function ChatPage({ user }: ChatPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      
      if (data) {
        setUserProfile(data)
        setSelectedLanguage(data.preferred_language || 'en')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const updateLanguagePreference = async (language: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ preferred_language: language })
        .eq('id', user.id)

      if (error) throw error
      setSelectedLanguage(language)
    } catch (error) {
      console.error('Error updating language preference:', error)
    }
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agricultural Assistant</h1>
            <p className="text-gray-600">
              Get instant answers to your farming questions with voice support in multiple languages
            </p>
          </div>
          
          {/* Language Selector */}
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => updateLanguagePreference(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">AI Assistant Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700">Voice Input & Output</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-700">Multi-language Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              📷
            </div>
            <span className="text-sm text-gray-700">Image Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              🧠
            </div>
            <span className="text-sm text-gray-700">Smart Recommendations</span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="h-[600px]">
        <AIChat language={selectedLanguage} userId={user.id} />
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">What you can ask:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "What crop should I plant this season?"</li>
              <li>• "How to control pests in my tomato crop?"</li>
              <li>• "What's the weather forecast for farming?"</li>
              <li>• "Current market prices for wheat"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Voice Commands:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click the microphone to speak</li>
              <li>• Speak clearly in your preferred language</li>
              <li>• AI will respond with voice in same language</li>
              <li>• Upload images for crop disease analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}