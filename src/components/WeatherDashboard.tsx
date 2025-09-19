import React, { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

interface WeatherData {
  current: {
    temperature: number
    humidity: number
    rainfall: number
    wind_speed: number
    pressure: number
    weather_condition: string
    uv_index: number
    visibility: number
  }
  forecast: Array<{
    date: string
    max_temp: number
    min_temp: number
    humidity: number
    rainfall_probability: number
    wind_speed: number
    condition: string
  }>
  alerts: Array<{
    type: string
    message: string
    severity: string
    valid_until: string
  }>
  agricultural_insights: {
    irrigation_recommendation: string
    planting_advice: string
    harvest_timing: string
    pest_risk: string
    disease_risk: string
  }
}

interface WeatherDashboardProps {
  location: { latitude: number; longitude: number; name?: string }
}

export default function WeatherDashboard({ location }: WeatherDashboardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeatherData()
    const interval = setInterval(fetchWeatherData, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [location])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weather-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          location: location.name
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setWeatherData(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />
      case 'partly_cloudy': return <Cloud className="w-8 h-8 text-gray-400" />
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-600" />
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />
      default: return <Sun className="w-8 h-8 text-yellow-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
          <p>Error loading weather data: {error}</p>
          <button
            onClick={fetchWeatherData}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!weatherData) return null

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Current Weather</h2>
            <p className="text-blue-100">{location.name || 'Your Location'}</p>
          </div>
          {getWeatherIcon(weatherData.current.weather_condition)}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5" />
              <span className="text-sm">Temperature</span>
            </div>
            <p className="text-2xl font-bold">{weatherData.current.temperature}°C</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5" />
              <span className="text-sm">Humidity</span>
            </div>
            <p className="text-2xl font-bold">{weatherData.current.humidity}%</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Wind className="w-5 h-5" />
              <span className="text-sm">Wind Speed</span>
            </div>
            <p className="text-2xl font-bold">{weatherData.current.wind_speed} km/h</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span className="text-sm">Visibility</span>
            </div>
            <p className="text-2xl font-bold">{weatherData.current.visibility} km</p>
          </div>
        </div>
      </motion.div>

      {/* Weather Alerts */}
      {weatherData.alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 text-orange-500 mr-2" />
            Weather Alerts
          </h3>
          <div className="space-y-3">
            {weatherData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold capitalize">{alert.type.replace('_', ' ')}</h4>
                  <span className="text-sm opacity-75">
                    Valid until: {new Date(alert.valid_until).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2">{alert.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 7-Day Forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </p>
              {getWeatherIcon(day.condition)}
              <div className="mt-2">
                <p className="text-lg font-bold text-gray-800">{day.max_temp}°</p>
                <p className="text-sm text-gray-600">{day.min_temp}°</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">{day.rainfall_probability}% rain</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Agricultural Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Agricultural Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Irrigation</h4>
            <p className="text-green-700">{weatherData.agricultural_insights.irrigation_recommendation}</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Planting Advice</h4>
            <p className="text-blue-700">{weatherData.agricultural_insights.planting_advice}</p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Harvest Timing</h4>
            <p className="text-yellow-700">{weatherData.agricultural_insights.harvest_timing}</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Risk Assessment</h4>
            <p className="text-red-700">Pest Risk: {weatherData.agricultural_insights.pest_risk}</p>
            <p className="text-red-700">Disease Risk: {weatherData.agricultural_insights.disease_risk}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}