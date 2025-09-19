import React, { useState, useEffect } from 'react';
import { Beaker, DropletIcon, Leaf } from 'lucide-react';
import { SoilData } from '../types';
import { translations } from '../data/translations';

interface SoilHealthProps {
  language: string;
}

export const SoilHealth: React.FC<SoilHealthProps> = ({ language }) => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    // Simulate soil data fetch
    const mockSoilData: SoilData = {
      ph: 6.8,
      nitrogen: 245,
      phosphorus: 32,
      potassium: 198,
      moisture: 24,
    };
    setSoilData(mockSoilData);
  }, []);

  if (!soilData) return <div>Loading soil data...</div>;

  const getHealthStatus = (value: number, min: number, max: number): string => {
    if (value >= min && value <= max) return 'optimal';
    if (value < min * 0.8 || value > max * 1.2) return 'poor';
    return 'fair';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-4">
        <Beaker className="w-6 h-6 text-green-500 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">{t.soilHealth}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <DropletIcon className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">pH Level</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{soilData.ph}</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(getHealthStatus(soilData.ph, 6.0, 7.5))}`}>
                {getHealthStatus(soilData.ph, 6.0, 7.5)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium">Nitrogen (N)</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{soilData.nitrogen} kg/ha</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(getHealthStatus(soilData.nitrogen, 200, 300))}`}>
                {getHealthStatus(soilData.nitrogen, 200, 300)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-orange-500 mr-2" />
              <span className="text-sm font-medium">Phosphorus (P)</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{soilData.phosphorus} kg/ha</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(getHealthStatus(soilData.phosphorus, 25, 50))}`}>
                {getHealthStatus(soilData.phosphorus, 25, 50)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Leaf className="w-5 h-5 text-purple-500 mr-2" />
              <span className="text-sm font-medium">Potassium (K)</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{soilData.potassium} kg/ha</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(getHealthStatus(soilData.potassium, 150, 250))}`}>
                {getHealthStatus(soilData.potassium, 150, 250)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <DropletIcon className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-sm font-medium">Soil Moisture</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{soilData.moisture}%</div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(getHealthStatus(soilData.moisture, 20, 30))}`}>
                {getHealthStatus(soilData.moisture, 20, 30)}
              </span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Recommendations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Add organic compost to improve soil structure</li>
              <li>• Consider lime application if pH drops below 6.0</li>
              <li>• Monitor moisture levels during dry season</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};