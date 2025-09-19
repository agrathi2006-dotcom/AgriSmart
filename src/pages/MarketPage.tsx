import React from 'react'
import { User } from '@supabase/supabase-js'
import MarketDashboard from '../components/MarketDashboard'
import { TrendingUp, DollarSign, BarChart3, AlertCircle } from 'lucide-react'

interface MarketPageProps {
  user: User
}

export default function MarketPage({ user }: MarketPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Intelligence</h1>
        <p className="text-gray-600">
          Real-time market prices, trends, and trading opportunities for agricultural commodities
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-2xl font-bold">₹2,450</span>
          </div>
          <h3 className="font-semibold mb-1">Rice (Average)</h3>
          <p className="text-green-100 text-sm">+5.2% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <span className="text-2xl font-bold">₹2,180</span>
          </div>
          <h3 className="font-semibold mb-1">Wheat (Average)</h3>
          <p className="text-blue-100 text-sm">-2.1% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <span className="text-2xl font-bold">₹1,850</span>
          </div>
          <h3 className="font-semibold mb-1">Maize (Average)</h3>
          <p className="text-orange-100 text-sm">+8.7% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="w-8 h-8" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <h3 className="font-semibold mb-1">Active Alerts</h3>
          <p className="text-purple-100 text-sm">Price movement alerts</p>
        </div>
      </div>

      {/* Main Market Dashboard */}
      <MarketDashboard />

      {/* Market Analysis Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Analysis Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-3">📈 Price Trends</h3>
            <ul className="text-green-700 text-sm space-y-2">
              <li>• Monitor 30-day moving averages</li>
              <li>• Compare seasonal patterns</li>
              <li>• Track supply-demand indicators</li>
              <li>• Watch for policy announcements</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-3">🎯 Trading Signals</h3>
            <ul className="text-blue-700 text-sm space-y-2">
              <li>• Buy signals: Prices below average</li>
              <li>• Sell signals: Prices above average</li>
              <li>• Hold signals: Stable market conditions</li>
              <li>• Volume analysis for confirmation</li>
            </ul>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-3">⚠️ Risk Factors</h3>
            <ul className="text-orange-700 text-sm space-y-2">
              <li>• Weather-related disruptions</li>
              <li>• Government policy changes</li>
              <li>• International market volatility</li>
              <li>• Transportation and logistics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Market Intelligence Features */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Intelligence Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">📊 Real-time Data</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Live price updates from major mandis</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Historical price trends and patterns</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Volume and trading activity data</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>Cross-market price comparisons</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-4">🔮 Predictive Analytics</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>7-day price forecasts with confidence levels</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Seasonal trend predictions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span>Supply-demand balance analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <span>Market sentiment indicators</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trading Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Smart Trading Tips</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">💡 Best Practices</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Diversify your crop portfolio</li>
              <li>• Time your sales based on market cycles</li>
              <li>• Use forward contracts to lock in prices</li>
              <li>• Monitor competitor pricing strategies</li>
              <li>• Consider value-added processing</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">📱 Stay Connected</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Set up price alerts for your crops</li>
              <li>• Follow market news and updates</li>
              <li>• Join farmer trading communities</li>
              <li>• Use mobile apps for quick price checks</li>
              <li>• Network with local traders and buyers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}