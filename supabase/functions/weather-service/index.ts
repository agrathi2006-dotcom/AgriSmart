import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherRequest {
  latitude: number
  longitude: number
  location?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { latitude, longitude, location }: WeatherRequest = await req.json()

    // Simulate real-time weather data (in production, integrate with OpenWeatherMap or similar)
    const weatherData = {
      current: {
        temperature: Math.round(Math.random() * 20 + 15), // 15-35°C
        humidity: Math.round(Math.random() * 40 + 40), // 40-80%
        rainfall: Math.round(Math.random() * 10), // 0-10mm
        wind_speed: Math.round(Math.random() * 15 + 5), // 5-20 km/h
        pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
        weather_condition: getRandomWeatherCondition(),
        uv_index: Math.round(Math.random() * 10),
        visibility: Math.round(Math.random() * 10 + 5) // 5-15 km
      },
      forecast: generateWeatherForecast(),
      alerts: generateWeatherAlerts(),
      agricultural_insights: generateAgriculturalInsights()
    }

    // Store weather data in database
    await supabase.from('weather_data').insert({
      location: { latitude, longitude, name: location },
      temperature: weatherData.current.temperature,
      humidity: weatherData.current.humidity,
      rainfall: weatherData.current.rainfall,
      wind_speed: weatherData.current.wind_speed,
      pressure: weatherData.current.pressure,
      weather_condition: weatherData.current.weather_condition,
      forecast_date: new Date().toISOString().split('T')[0]
    })

    return new Response(
      JSON.stringify(weatherData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function getRandomWeatherCondition(): string {
  const conditions = ['sunny', 'partly_cloudy', 'cloudy', 'rainy', 'stormy', 'foggy']
  return conditions[Math.floor(Math.random() * conditions.length)]
}

function generateWeatherForecast() {
  const forecast = []
  for (let i = 1; i <= 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      max_temp: Math.round(Math.random() * 15 + 20),
      min_temp: Math.round(Math.random() * 10 + 10),
      humidity: Math.round(Math.random() * 40 + 40),
      rainfall_probability: Math.round(Math.random() * 100),
      wind_speed: Math.round(Math.random() * 15 + 5),
      condition: getRandomWeatherCondition()
    })
  }
  return forecast
}

function generateWeatherAlerts() {
  const alerts = []
  const alertTypes = [
    { type: 'heat_wave', message: 'Heat wave warning: Temperatures may exceed 40°C. Ensure adequate irrigation.' },
    { type: 'heavy_rain', message: 'Heavy rainfall expected: Risk of waterlogging. Prepare drainage systems.' },
    { type: 'frost', message: 'Frost warning: Protect sensitive crops from low temperatures.' },
    { type: 'drought', message: 'Drought conditions: Conserve water and consider drought-resistant crops.' }
  ]
  
  // Randomly generate 0-2 alerts
  const numAlerts = Math.floor(Math.random() * 3)
  for (let i = 0; i < numAlerts; i++) {
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    alerts.push({
      ...alert,
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return alerts
}

function generateAgriculturalInsights() {
  return {
    irrigation_recommendation: 'Based on current weather conditions, moderate irrigation is recommended.',
    planting_advice: 'Good conditions for planting heat-tolerant crops.',
    harvest_timing: 'Consider harvesting mature crops before expected rainfall.',
    pest_risk: 'Medium risk of pest activity due to current humidity levels.',
    disease_risk: 'Low risk of fungal diseases with current weather patterns.'
  }
}