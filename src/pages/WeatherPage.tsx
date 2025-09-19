import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import WeatherDashboard from '../components/WeatherDashboard'
import { MapPin, RefreshCw } from 'lucide-react'

interface WeatherPageProps {
  user: User
}

export default function WeatherPage({ user }: WeatherPageProps) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; name?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: 'Current Location'
          })
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          // Fallback to a default location (Delhi, India)
          setLocation({
            latitude: 28.6139,
            longitude: 77.2090,
            name: 'Delhi, India'
          })
          setError('Unable to get your location. Showing weather for Delhi.')
          setLoading(false)
        }
      )
    } else {
      // Fallback for browsers that don't support geolocation
      setLocation({
        latitude: 28.6139,
        longitude: 77.2090,
        name: 'Delhi, India'
      })
      setError('Geolocation not supported. Showing weather for Delhi.')
      setLoading(false)
    }
  }

  const handleLocationChange = (newLocation: { latitude: number; longitude: number; name: string }) => {
    setLocation(newLocation)
  }

  const predefinedLocations = [
    { name: 'Delhi, India', latitude: 28.6139, longitude: 77.2090 },
    { name: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Bangalore, India', latitude: 12.9716, longitude: 77.5946 },
    { name: 'Chennai, India', latitude: 13.0827, longitude: 80.2707 },
    { name: 'Kolkata, India', latitude: 22.5726, longitude: 88.3639 },
    { name: 'Hyderabad, India', latitude: 17.3850, longitude: 78.4867 },
    { name: 'Pune, India', latitude: 18.5204, longitude: 73.8567 },
    { name: 'Ahmedabad, India', latitude: 23.0225, longitude: 72.5714 }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Dashboard</h1>
        <p className="text-gray-600">
          Real-time weather data and agricultural insights for your location
        </p>
      </div>

      {/* Location Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">
              {location?.name || 'Unknown Location'}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={getCurrentLocation}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Use Current Location</span>
            </button>
            
            <select
              onChange={(e) => {
                const selectedLocation = predefinedLocations.find(loc => loc.name === e.target.value)
                if (selectedLocation) {
                  handleLocationChange(selectedLocation)
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a city</option>
              {predefinedLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Weather Dashboard */}
      {location && <WeatherDashboard location={location} />}

      {/* Agricultural Tips */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weather-Based Farming Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">☀️ Sunny Weather</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Perfect for harvesting mature crops</li>
              <li>• Ideal for field preparation</li>
              <li>• Good for drying harvested grains</li>
              <li>• Monitor soil moisture levels</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🌧️ Rainy Weather</h3>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Excellent for planting seeds</li>
              <li>• Natural irrigation for crops</li>
              <li>• Check for waterlogging issues</li>
              <li>• Monitor for fungal diseases</li>
            </ul>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">☁️ Cloudy Weather</h3>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Good for transplanting seedlings</li>
              <li>• Reduced water evaporation</li>
              <li>• Suitable for pesticide application</li>
              <li>• Monitor temperature changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Weather Alerts Info */}
      <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Weather Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Alert Types:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="font-medium text-red-600">High Severity:</span> Immediate action required</li>
              <li><span className="font-medium text-orange-600">Medium Severity:</span> Prepare and monitor</li>
              <li><span className="font-medium text-blue-600">Low Severity:</span> Stay informed</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Common Alerts:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Heat Wave: Protect crops and increase irrigation</li>
              <li>• Heavy Rain: Prepare drainage systems</li>
              <li>• Frost: Cover sensitive plants</li>
              <li>• Drought: Conserve water resources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}