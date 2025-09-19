import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Wheat } from 'lucide-react';
import { CropPrediction as CropPredictionType } from '../types';
import { translations } from '../data/translations';

interface CropPredictionProps {
  language: string;
}

export const CropPrediction: React.FC<CropPredictionProps> = ({ language }) => {
  const [predictions, setPredictions] = useState<CropPredictionType[]>([]);

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    // Simulate crop prediction data
    const mockPredictions: CropPredictionType[] = [
      {
        crop: 'Rice',
        predictedYield: 4.2,
        confidence: 0.89,
        recommendations: [
          'Maintain water level at 5-10cm during tillering',
          'Apply urea fertilizer in split doses',
          'Monitor for brown plant hopper'
        ]
      },
      {
        crop: 'Wheat',
        predictedYield: 3.8,
        confidence: 0.92,
        recommendations: [
          'Irrigate at crown root initiation stage',
          'Apply potassium chloride before sowing',
          'Watch for yellow rust symptoms'
        ]
      },
      {
        crop: 'Sugarcane',
        predictedYield: 65.5,
        confidence: 0.85,
        recommendations: [
          'Ensure proper earthing up',
          'Apply filter cake as organic matter',
          'Control red rot disease'
        ]
      }
    ];
    setPredictions(mockPredictions);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-6 h-6 text-green-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">{t.cropPrediction}</h3>
      </div>
      
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Wheat className="w-6 h-6 text-green-500 mr-2" />
                <span className="text-lg font-medium">{prediction.crop}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {prediction.predictedYield} {prediction.crop === 'Sugarcane' ? 't/ha' : 'Q/ha'}
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round(prediction.confidence * 100)}% {t.confidence}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-800 mb-2">{t.recommendations}:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {prediction.recommendations.map((rec, recIndex) => (
                  <li key={recIndex} className="flex items-start">
                    <TrendingUp className="w-3 h-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};