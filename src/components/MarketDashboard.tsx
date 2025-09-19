import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { motion } from 'framer-motion'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface MarketData {
  current_prices: Array<{
    crop: string
    market: string
    price: number
    unit: string
    change: number
    change_percent: number
  }>
  price_trends: Array<{
    date: string
    price: number
    volume: number
  }>
  market_insights: {
    key_insights: string[]
    market_sentiment: string
    supply_demand_balance: string
    seasonal_factors: string
    government_policies: string
  }
  price_forecast: Array<{
    date: string
    predicted_price: number
    confidence: number
    factors: string
  }>
  trading_opportunities: Array<{
    type: string
    crop: string
    reason: string
    confidence: string
    timeframe: string
  }>
}

export default function MarketDashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCrop, setSelectedCrop] = useState<string>('rice')
  const [selectedLocation, setSelectedLocation] = useState<string>('Delhi')

  useEffect(() => {
    fetchMarketData()
  }, [selectedCrop, selectedLocation])

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/market-data?crop=${selectedCrop}&location=${selectedLocation}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        }
      )

      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setMarketData(data)
    } catch (error) {
      console.error('Error fetching market data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-100 text-green-800 border-green-200'
      case 'sell': return 'bg-red-100 text-red-800 border-red-200'
      case 'hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const chartData = marketData ? {
    labels: marketData.price_trends.map(trend => 
      new Date(trend.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Price Trend',
        data: marketData.price_trends.map(trend => trend.price),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  } : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedCrop} Price Trend (₹/quintal)`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!marketData) return null

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
              <option value="onion">Onion</option>
              <option value="potato">Potato</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Market</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Prices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-6 h-6 text-green-500 mr-2" />
          Current Market Prices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData.current_prices.slice(0, 6).map((price, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 capitalize">{price.crop}</h4>
                <span className="text-sm text-gray-600">{price.market}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">₹{price.price}</p>
                  <p className="text-sm text-gray-600">per {price.unit}</p>
                </div>
                <div className={`flex items-center space-x-1 ${getPriceChangeColor(price.change)}`}>
                  {getPriceChangeIcon(price.change)}
                  <span className="text-sm font-medium">
                    {price.change > 0 ? '+' : ''}{price.change_percent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 text-blue-500 mr-2" />
          Price Trends
        </h3>
        
        {chartData && (
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </motion.div>

      {/* Market Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
          Market Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Key Insights</h4>
            <ul className="space-y-2">
              {marketData.market_insights.key_insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700">Market Sentiment</h4>
              <p className={`capitalize font-medium ${
                marketData.market_insights.market_sentiment === 'bullish' ? 'text-green-600' :
                marketData.market_insights.market_sentiment === 'bearish' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {marketData.market_insights.market_sentiment}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700">Supply-Demand Balance</h4>
              <p className="text-gray-600">{marketData.market_insights.supply_demand_balance}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700">Seasonal Factors</h4>
              <p className="text-gray-600">{marketData.market_insights.seasonal_factors}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trading Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Trading Opportunities</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData.trading_opportunities.map((opportunity, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getOpportunityColor(opportunity.type)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold capitalize">{opportunity.type}</span>
                <span className="text-sm font-medium capitalize">{opportunity.crop}</span>
              </div>
              <p className="text-sm mb-2">{opportunity.reason}</p>
              <div className="flex items-center justify-between text-xs">
                <span>Confidence: {opportunity.confidence}</span>
                <span>Timeframe: {opportunity.timeframe}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Price Forecast</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Predicted Price</th>
                <th className="text-left py-2">Confidence</th>
                <th className="text-left py-2">Key Factor</th>
              </tr>
            </thead>
            <tbody>
              {marketData.price_forecast.map((forecast, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">
                    {new Date(forecast.date).toLocaleDateString('en', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="py-2 font-medium">₹{forecast.predicted_price}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      forecast.confidence >= 80 ? 'bg-green-100 text-green-800' :
                      forecast.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {forecast.confidence}%
                    </span>
                  </td>
                  <td className="py-2 capitalize">{forecast.factors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}