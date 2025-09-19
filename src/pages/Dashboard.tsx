import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  MessageCircle, 
  Brain,
  Users,
  Leaf,
  DollarSign,
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

interface DashboardProps {
  user: User
}

interface DashboardStats {
  totalFarms: number
  activeCrops: number
  chatSessions: number
  predictions: number
  weatherAlerts: number
  marketUpdates: number
}

export default function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalFarms: 0,
    activeCrops: 0,
    chatSessions: 0,
    predictions: 0,
    weatherAlerts: 0,
    marketUpdates: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const [farmsResult, cropsResult, chatResult, predictionsResult] = await Promise.all([
        supabase.from('farms').select('id').eq('user_id', user.id),
        supabase.from('crops').select('id').eq('status', 'active'),
        supabase.from('chat_sessions').select('id').eq('user_id', user.id),
        supabase.from('predictions').select('id').eq('user_id', user.id)
      ])

      setStats({
        totalFarms: farmsResult.data?.length || 0,
        activeCrops: cropsResult.data?.length || 0,
        chatSessions: chatResult.data?.length || 0,
        predictions: predictionsResult.data?.length || 0,
        weatherAlerts: Math.floor(Math.random() * 5) + 1,
        marketUpdates: Math.floor(Math.random() * 10) + 5
      })

      // Simulate recent activity
      setRecentActivity([
        {
          type: 'prediction',
          title: 'Crop recommendation generated',
          description: 'Rice recommended for your farm based on soil conditions',
          time: '2 hours ago',
          icon: Brain,
          color: 'text-purple-600'
        },
        {
          type: 'weather',
          title: 'Weather alert',
          description: 'Heavy rainfall expected in next 24 hours',
          time: '4 hours ago',
          icon: AlertTriangle,
          color: 'text-orange-600'
        },
        {
          type: 'market',
          title: 'Price update',
          description: 'Wheat prices increased by 5% in local market',
          time: '6 hours ago',
          icon: TrendingUp,
          color: 'text-green-600'
        },
        {
          type: 'chat',
          title: 'AI consultation',
          description: 'Discussed pest management strategies',
          time: '1 day ago',
          icon: MessageCircle,
          color: 'text-blue-600'
        }
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Farms',
      value: stats.totalFarms,
      icon: Leaf,
      color: 'bg-green-500',
      change: '+2 this month'
    },
    {
      title: 'Active Crops',
      value: stats.activeCrops,
      icon: Leaf,
      color: 'bg-blue-500',
      change: '+5 this season'
    },
    {
      title: 'AI Predictions',
      value: stats.predictions,
      icon: Brain,
      color: 'bg-purple-500',
      change: '+12 this week'
    },
    {
      title: 'Chat Sessions',
      value: stats.chatSessions,
      icon: MessageCircle,
      color: 'bg-indigo-500',
      change: '+8 this week'
    },
    {
      title: 'Weather Alerts',
      value: stats.weatherAlerts,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: 'Active now'
    },
    {
      title: 'Market Updates',
      value: stats.marketUpdates,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: 'Updated today'
    }
  ]

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.user_metadata?.full_name || user.email}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your agricultural operations today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Ask AI', href: '/chat', icon: MessageCircle, color: 'bg-blue-500' },
            { name: 'Check Weather', href: '/weather', icon: Thermometer, color: 'bg-orange-500' },
            { name: 'Get Predictions', href: '/predictions', icon: Brain, color: 'bg-purple-500' },
            { name: 'Market Prices', href: '/market', icon: TrendingUp, color: 'bg-green-500' }
          ].map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.name}</span>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color} bg-opacity-10`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weather Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Today's Weather</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5" />
                <span>{Math.round(Math.random() * 15 + 20)}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5" />
                <span>{Math.round(Math.random() * 40 + 40)}%</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Perfect for</p>
            <p className="font-semibold">Field inspection</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}