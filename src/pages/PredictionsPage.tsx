import React from 'react'
import { User } from '@supabase/supabase-js'
import CropPrediction from '../components/CropPrediction'
import { Brain, TrendingUp, AlertCircle, Leaf } from 'lucide-react'

interface PredictionsPageProps {
  user: User
}

export default function PredictionsPage({ user }: PredictionsPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Crop Predictions</h1>
        <p className="text-gray-600">
          Get intelligent recommendations and predictions powered by advanced machine learning algorithms
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Leaf className="w-8 h-8" />
            <span className="text-2xl font-bold">95%</span>
          </div>
          <h3 className="font-semibold mb-1">Crop Recommendation</h3>
          <p className="text-green-100 text-sm">Accuracy based on soil & climate</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-2xl font-bold">92%</span>
          </div>
          <h3 className="font-semibold mb-1">Yield Prediction</h3>
          <p className="text-blue-100 text-sm">Forecast accuracy rate</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8" />
            <span className="text-2xl font-bold">88%</span>
          </div>
          <h3 className="font-semibold mb-1">Disease Detection</h3>
          <p className="text-red-100 text-sm">Early detection success</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8" />
            <span className="text-2xl font-bold">90%</span>
          </div>
          <h3 className="font-semibold mb-1">Fertilizer Advice</h3>
          <p className="text-purple-100 text-sm">Optimization accuracy</p>
        </div>
      </div>

      {/* Main Prediction Interface */}
      <CropPrediction userId={user.id} />

      {/* How It Works */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">How Our AI Predictions Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Data Collection</h3>
            <p className="text-gray-600 text-sm">
              We gather soil, weather, crop, and historical data from multiple sources
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced machine learning algorithms process and analyze the data patterns
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Prediction</h3>
            <p className="text-gray-600 text-sm">
              Generate accurate predictions and recommendations in real-time
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Optimization</h3>
            <p className="text-gray-600 text-sm">
              Continuous learning improves accuracy and provides better insights
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Benefits of AI-Powered Predictions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">🎯 Increased Accuracy</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Data-driven decisions reduce guesswork</li>
              <li>• Historical patterns improve predictions</li>
              <li>• Real-time updates ensure relevance</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">💰 Cost Optimization</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Optimize fertilizer and pesticide usage</li>
              <li>• Reduce crop losses through early detection</li>
              <li>• Maximize yield potential</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">⏰ Time Savings</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Instant recommendations</li>
              <li>• Automated analysis of complex data</li>
              <li>• Quick decision-making support</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3">🌱 Sustainable Farming</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Environmentally conscious recommendations</li>
              <li>• Efficient resource utilization</li>
              <li>• Long-term soil health preservation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tips for Better Predictions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📝 Provide Accurate Data</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Enter precise soil test results</li>
              <li>• Specify exact crop varieties</li>
              <li>• Include local climate conditions</li>
              <li>• Update farming practices regularly</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">🔄 Regular Updates</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check predictions weekly</li>
              <li>• Update crop growth stages</li>
              <li>• Monitor weather changes</li>
              <li>• Track actual vs predicted results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}