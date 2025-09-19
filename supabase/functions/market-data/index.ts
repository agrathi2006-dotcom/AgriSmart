import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const url = new URL(req.url)
    const crop = url.searchParams.get('crop')
    const location = url.searchParams.get('location')

    // Generate realistic market data
    const marketData = await generateMarketData(crop, location)

    // Store market data
    for (const price of marketData.current_prices) {
      await supabase.from('market_prices').insert({
        crop_name: price.crop,
        market_location: price.market,
        price_per_unit: price.price,
        unit: price.unit,
        price_date: new Date().toISOString().split('T')[0],
        source: 'api_simulation'
      })
    }

    return new Response(
      JSON.stringify(marketData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function generateMarketData(crop?: string, location?: string) {
  const crops = ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'onion', 'potato', 'tomato']
  const markets = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad']
  
  const currentPrices = []
  const targetCrops = crop ? [crop] : crops.slice(0, 5)
  const targetMarkets = location ? [location] : markets.slice(0, 3)

  for (const cropName of targetCrops) {
    for (const market of targetMarkets) {
      const basePrice = getCropBasePrice(cropName)
      const variation = (Math.random() - 0.5) * 0.2 // ±10% variation
      const price = Math.round(basePrice * (1 + variation))
      
      currentPrices.push({
        crop: cropName,
        market,
        price,
        unit: 'quintal',
        change: Math.round((Math.random() - 0.5) * 200), // ±100 change
        change_percent: Math.round((Math.random() - 0.5) * 20 * 100) / 100 // ±10%
      })
    }
  }

  return {
    current_prices: currentPrices,
    price_trends: generatePriceTrends(targetCrops[0] || 'rice'),
    market_insights: generateMarketInsights(),
    price_forecast: generatePriceForecast(targetCrops[0] || 'rice'),
    trading_opportunities: generateTradingOpportunities()
  }
}

function getCropBasePrice(crop: string): number {
  const basePrices = {
    'rice': 2500,
    'wheat': 2200,
    'maize': 1800,
    'cotton': 5500,
    'sugarcane': 350,
    'onion': 1200,
    'potato': 800,
    'tomato': 1500
  }
  return basePrices[crop] || 2000
}

function generatePriceTrends(crop: string) {
  const trends = []
  const basePrice = getCropBasePrice(crop)
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    const variation = Math.sin(i * 0.2) * 0.1 + (Math.random() - 0.5) * 0.05
    const price = Math.round(basePrice * (1 + variation))
    
    trends.push({
      date: date.toISOString().split('T')[0],
      price,
      volume: Math.round(Math.random() * 1000 + 500)
    })
  }
  
  return trends
}

function generateMarketInsights() {
  const insights = [
    'Onion prices expected to rise due to reduced supply from major producing states',
    'Wheat prices stable with good harvest expectations',
    'Cotton prices showing upward trend due to export demand',
    'Rice prices may fluctuate based on monsoon patterns',
    'Vegetable prices volatile due to weather conditions'
  ]
  
  return {
    key_insights: insights.slice(0, 3),
    market_sentiment: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
    supply_demand_balance: 'Balanced supply with moderate demand',
    seasonal_factors: 'Post-harvest season affecting prices',
    government_policies: 'MSP announcements may impact grain prices'
  }
}

function generatePriceForecast(crop: string) {
  const forecast = []
  const basePrice = getCropBasePrice(crop)
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    const trend = Math.sin(i * 0.3) * 0.05 + (Math.random() - 0.5) * 0.03
    const price = Math.round(basePrice * (1 + trend))
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      predicted_price: price,
      confidence: Math.round((0.8 + Math.random() * 0.15) * 100),
      factors: ['weather', 'demand', 'supply', 'policy'][Math.floor(Math.random() * 4)]
    })
  }
  
  return forecast
}

function generateTradingOpportunities() {
  return [
    {
      type: 'buy',
      crop: 'onion',
      reason: 'Prices expected to rise by 15% in next month',
      confidence: 'high',
      timeframe: '1 month'
    },
    {
      type: 'sell',
      crop: 'potato',
      reason: 'Current prices above seasonal average',
      confidence: 'medium',
      timeframe: '2 weeks'
    },
    {
      type: 'hold',
      crop: 'wheat',
      reason: 'Stable prices with no major changes expected',
      confidence: 'high',
      timeframe: '3 months'
    }
  ]
}