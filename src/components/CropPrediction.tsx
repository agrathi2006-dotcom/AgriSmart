import React, { useState } from 'react'
import { Brain, Leaf, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface PredictionResult {
  prediction: any
  confidence: number
}

interface CropPredictionProps {
  userId: string
}

export default function CropPrediction({ userId }: CropPredictionProps) {
  const [activeTab, setActiveTab] = useState<'crop' | 'yield' | 'disease' | 'fertilizer'>('crop')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [formData, setFormData] = useState<any>({})

  const handlePrediction = async (predictionType: string, inputData: any) => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crop-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          predictionType,
          inputData,
          userId
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setResult(data)
      toast.success('Prediction generated successfully!')
    } catch (error) {
      console.error('Prediction error:', error)
      toast.error('Failed to generate prediction')
    } finally {
      setLoading(false)
    }
  }

  const CropRecommendationForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
          <select
            value={formData.soilType || ''}
            onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select soil type</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="silt">Silt</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Climate</label>
          <select
            value={formData.climate || ''}
            onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select climate</option>
            <option value="tropical">Tropical</option>
            <option value="temperate">Temperate</option>
            <option value="arid">Arid</option>
            <option value="mediterranean">Mediterranean</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
          <select
            value={formData.season || ''}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select season</option>
            <option value="kharif">Kharif (Monsoon)</option>
            <option value="rabi">Rabi (Winter)</option>
            <option value="zaid">Zaid (Summer)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Average Rainfall (mm)</label>
          <input
            type="number"
            value={formData.rainfall || ''}
            onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter rainfall amount"
          />
        </div>
      </div>
      
      <button
        onClick={() => handlePrediction('crop_recommendation', formData)}
        disabled={loading || !formData.soilType || !formData.climate}
        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating Recommendation...' : 'Get Crop Recommendation'}
      </button>
    </div>
  )

  const YieldPredictionForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
          <select
            value={formData.cropType || ''}
            onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select crop</option>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="maize">Maize</option>
            <option value="cotton">Cotton</option>
            <option value="sugarcane">Sugarcane</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares)</label>
          <input
            type="number"
            value={formData.area || ''}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter area in hectares"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soil Health Score (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.soilHealth || ''}
            onChange={(e) => setFormData({ ...formData, soilHealth: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Rate soil health"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farming Practice</label>
          <select
            value={formData.farmingPractices || ''}
            onChange={(e) => setFormData({ ...formData, farmingPractices: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select practice</option>
            <option value="organic">Organic</option>
            <option value="conventional">Conventional</option>
            <option value="precision">Precision Agriculture</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={() => handlePrediction('yield_prediction', formData)}
        disabled={loading || !formData.cropType || !formData.area}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Predicting Yield...' : 'Predict Yield'}
      </button>
    </div>
  )

  const DiseaseDetectionForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
          <select
            value={formData.cropType || ''}
            onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select crop</option>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="maize">Maize</option>
            <option value="tomato">Tomato</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observed Symptoms</label>
          <textarea
            value={formData.symptoms || ''}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Describe symptoms (yellowing, spots, wilting, etc.)"
            rows={3}
          />
        </div>
      </div>
      
      <button
        onClick={() => handlePrediction('disease_detection', formData)}
        disabled={loading || !formData.cropType}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Analyzing Disease...' : 'Detect Disease'}
      </button>
    </div>
  )

  const FertilizerRecommendationForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
          <select
            value={formData.cropType || ''}
            onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select crop</option>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="maize">Maize</option>
            <option value="cotton">Cotton</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Area (hectares)</label>
          <input
            type="number"
            value={formData.area || ''}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter area"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Growth Stage</label>
          <select
            value={formData.growthStage || ''}
            onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select stage</option>
            <option value="seedling">Seedling</option>
            <option value="vegetative">Vegetative</option>
            <option value="flowering">Flowering</option>
            <option value="fruiting">Fruiting</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soil Test Available?</label>
          <select
            value={formData.soilTest || ''}
            onChange={(e) => setFormData({ ...formData, soilTest: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      
      <button
        onClick={() => handlePrediction('fertilizer_recommendation', formData)}
        disabled={loading || !formData.cropType || !formData.area}
        className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generating Recommendation...' : 'Get Fertilizer Recommendation'}
      </button>
    </div>
  )

  const renderResult = () => {
    if (!result) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Prediction Results</h3>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">
              Confidence: {Math.round(result.confidence * 100)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {activeTab === 'crop' && result.prediction.recommended_crops && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recommended Crops:</h4>
              <div className="flex flex-wrap gap-2">
                {result.prediction.recommended_crops.map((crop: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {crop}
                  </span>
                ))}
              </div>
              {result.prediction.reasons && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Reasons:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.prediction.reasons.map((reason: string, index: number) => (
                      <li key={index} className="text-gray-600">{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'yield' && result.prediction.predicted_yield && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Predicted Yield:</h4>
              <p className="text-2xl font-bold text-blue-600">
                {result.prediction.predicted_yield} {result.prediction.unit}
              </p>
              {result.prediction.recommendations && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.prediction.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-600">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'disease' && result.prediction.detected_disease && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Detected Disease:</h4>
              <p className="text-lg font-semibold text-red-600 capitalize">
                {result.prediction.detected_disease.replace('_', ' ')}
              </p>
              <p className="text-sm text-gray-600">
                Severity: <span className="font-medium">{result.prediction.severity}</span>
              </p>
              {result.prediction.treatment_recommendations && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Treatment:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.prediction.treatment_recommendations.map((treatment: string, index: number) => (
                      <li key={index} className="text-gray-600">{treatment}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'fertilizer' && result.prediction.fertilizer_schedule && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Fertilizer Schedule:</h4>
              <div className="space-y-3">
                {result.prediction.fertilizer_schedule.map((stage: any, index: number) => (
                  <div key={index} className="p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-800 capitalize mb-2">
                      {stage.stage.replace('_', ' ')}
                    </h5>
                    <div className="space-y-1">
                      {stage.fertilizers.map((fert: any, fertIndex: number) => (
                        <p key={fertIndex} className="text-sm text-gray-600">
                          {fert.name}: {fert.quantity} {fert.unit}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {result.prediction.estimated_cost && (
                <p className="mt-4 text-lg font-semibold text-green-600">
                  Estimated Cost: {result.prediction.estimated_cost}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-8 h-8 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800">AI Crop Predictions</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'crop', label: 'Crop Recommendation', icon: Leaf },
          { id: 'yield', label: 'Yield Prediction', icon: TrendingUp },
          { id: 'disease', label: 'Disease Detection', icon: AlertCircle },
          { id: 'fertilizer', label: 'Fertilizer Advice', icon: Brain }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any)
              setResult(null)
              setFormData({})
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Forms */}
      <div className="space-y-6">
        {activeTab === 'crop' && <CropRecommendationForm />}
        {activeTab === 'yield' && <YieldPredictionForm />}
        {activeTab === 'disease' && <DiseaseDetectionForm />}
        {activeTab === 'fertilizer' && <FertilizerRecommendationForm />}
        
        {renderResult()}
      </div>
    </div>
  )
}