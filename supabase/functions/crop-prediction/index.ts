import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PredictionRequest {
  predictionType: 'crop_recommendation' | 'yield_prediction' | 'disease_detection' | 'fertilizer_recommendation'
  inputData: any
  userId: string
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

    const { predictionType, inputData, userId }: PredictionRequest = await req.json()

    let prediction
    let confidence = 0.85 + Math.random() * 0.1 // 85-95% confidence

    switch (predictionType) {
      case 'crop_recommendation':
        prediction = await getCropRecommendation(inputData)
        break
      case 'yield_prediction':
        prediction = await getYieldPrediction(inputData)
        break
      case 'disease_detection':
        prediction = await getDiseaseDetection(inputData)
        break
      case 'fertilizer_recommendation':
        prediction = await getFertilizerRecommendation(inputData)
        break
      default:
        throw new Error('Invalid prediction type')
    }

    // Save prediction to database
    await supabase.from('predictions').insert({
      user_id: userId,
      prediction_type: predictionType,
      input_data: inputData,
      prediction_result: prediction,
      confidence_score: confidence
    })

    return new Response(
      JSON.stringify({ prediction, confidence }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function getCropRecommendation(data: any) {
  const { soilType, climate, season, rainfall, temperature } = data
  
  const cropDatabase = {
    'clay': {
      'tropical': ['rice', 'sugarcane', 'cotton'],
      'temperate': ['wheat', 'barley', 'oats'],
      'arid': ['sorghum', 'millet', 'cotton']
    },
    'sandy': {
      'tropical': ['groundnut', 'coconut', 'cashew'],
      'temperate': ['potato', 'carrot', 'radish'],
      'arid': ['pearl_millet', 'sesame', 'castor']
    },
    'loamy': {
      'tropical': ['maize', 'tomato', 'onion'],
      'temperate': ['wheat', 'peas', 'cabbage'],
      'arid': ['jowar', 'bajra', 'gram']
    }
  }

  const recommendedCrops = cropDatabase[soilType]?.[climate] || ['wheat', 'rice', 'maize']
  
  return {
    recommended_crops: recommendedCrops.slice(0, 3),
    reasons: [
      `Soil type ${soilType} is suitable for these crops`,
      `Climate conditions favor these varieties`,
      `Expected good yield based on historical data`
    ],
    planting_tips: [
      'Prepare soil with organic matter',
      'Ensure proper drainage',
      'Monitor for pests regularly'
    ],
    expected_yield: `${Math.round(Math.random() * 20 + 30)} quintals per hectare`
  }
}

async function getYieldPrediction(data: any) {
  const { cropType, area, soilHealth, weatherConditions, farmingPractices } = data
  
  // Simulate ML model prediction
  const baseYield = {
    'rice': 45,
    'wheat': 35,
    'maize': 55,
    'cotton': 25,
    'sugarcane': 800
  }

  const base = baseYield[cropType] || 40
  const variation = (Math.random() - 0.5) * 0.3 // ±15% variation
  const predictedYield = Math.round(base * (1 + variation) * area)

  return {
    predicted_yield: predictedYield,
    unit: cropType === 'sugarcane' ? 'tons' : 'quintals',
    factors_affecting: [
      'Soil nutrient levels',
      'Weather patterns',
      'Irrigation management',
      'Pest and disease control'
    ],
    recommendations: [
      'Apply balanced fertilizers',
      'Maintain optimal moisture levels',
      'Regular crop monitoring',
      'Timely pest management'
    ],
    risk_factors: [
      'Unpredictable weather',
      'Pest outbreaks',
      'Market price fluctuations'
    ]
  }
}

async function getDiseaseDetection(data: any) {
  const { imageData, cropType, symptoms } = data
  
  const diseases = {
    'rice': ['blast', 'brown_spot', 'bacterial_blight'],
    'wheat': ['rust', 'powdery_mildew', 'septoria'],
    'maize': ['corn_borer', 'leaf_blight', 'smut'],
    'tomato': ['early_blight', 'late_blight', 'mosaic_virus']
  }

  const cropDiseases = diseases[cropType] || ['fungal_infection', 'bacterial_spot', 'viral_disease']
  const detectedDisease = cropDiseases[Math.floor(Math.random() * cropDiseases.length)]

  return {
    detected_disease: detectedDisease,
    severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    treatment_recommendations: [
      'Apply appropriate fungicide/pesticide',
      'Improve air circulation',
      'Remove affected plant parts',
      'Adjust irrigation schedule'
    ],
    prevention_measures: [
      'Use disease-resistant varieties',
      'Maintain proper plant spacing',
      'Regular field sanitation',
      'Crop rotation practices'
    ],
    estimated_yield_loss: `${Math.round(Math.random() * 20 + 5)}%`
  }
}

async function getFertilizerRecommendation(data: any) {
  const { soilTest, cropType, growthStage, area } = data
  
  const npkRequirements = {
    'rice': { N: 120, P: 60, K: 40 },
    'wheat': { N: 100, P: 50, K: 30 },
    'maize': { N: 150, P: 75, K: 50 },
    'cotton': { N: 160, P: 80, K: 80 }
  }

  const requirements = npkRequirements[cropType] || { N: 100, P: 50, K: 40 }
  
  return {
    fertilizer_schedule: [
      {
        stage: 'basal',
        fertilizers: [
          { name: 'DAP', quantity: Math.round(requirements.P * area / 18), unit: 'kg' },
          { name: 'MOP', quantity: Math.round(requirements.K * area / 50), unit: 'kg' }
        ]
      },
      {
        stage: 'top_dressing_1',
        fertilizers: [
          { name: 'Urea', quantity: Math.round(requirements.N * area * 0.5 / 46), unit: 'kg' }
        ]
      },
      {
        stage: 'top_dressing_2',
        fertilizers: [
          { name: 'Urea', quantity: Math.round(requirements.N * area * 0.5 / 46), unit: 'kg' }
        ]
      }
    ],
    organic_alternatives: [
      'Compost: 2-3 tons per hectare',
      'Vermicompost: 1-2 tons per hectare',
      'Green manure: Incorporate legume crops'
    ],
    application_tips: [
      'Apply fertilizers during cool hours',
      'Ensure adequate soil moisture',
      'Mix fertilizers with soil properly',
      'Avoid over-application'
    ],
    estimated_cost: `₹${Math.round((requirements.N + requirements.P + requirements.K) * area * 2.5)}`
  }
}