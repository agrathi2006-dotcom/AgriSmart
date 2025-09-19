import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  location?: any
  farm_size?: number
  farming_experience?: number
  preferred_language: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface Farm {
  id: string
  user_id: string
  name: string
  location: any
  area: number
  soil_type?: string
  irrigation_type?: string
  coordinates?: any
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  session_name?: string
  language: string
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  message: string
  sender: 'user' | 'ai'
  message_type: string
  metadata?: any
  created_at: string
}

export interface WeatherData {
  id: string
  location: any
  temperature: number
  humidity: number
  rainfall: number
  wind_speed: number
  pressure: number
  weather_condition: string
  forecast_date: string
  recorded_at: string
}

export interface MarketPrice {
  id: string
  crop_name: string
  market_location: string
  price_per_unit: number
  unit: string
  price_date: string
  source?: string
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  prediction_type: string
  input_data: any
  prediction_result: any
  confidence_score: number
  created_at: string
}