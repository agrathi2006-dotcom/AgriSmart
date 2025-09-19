import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { WeatherService } from '../services/weatherService';
import { translations } from '../data/translations';

interface WeatherWidgetProps {
  language: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ language }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const weatherService = WeatherService.getInstance();
        const weatherData = await weatherService.getCurrentWeather();
        setWeather(weatherData);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.currentWeather}</h3>
      <div className="animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!weather) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{t.currentWeather}</h3>
        <span className="text-sm text-gray-500">{weather.location}</span>
      </div>
      
      {weather.description && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-center font-medium">{weather.description}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Thermometer className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">{t.temperature}</p>
            <p className="text-xl font-semibold">{weather.temperature}°C</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Droplets className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">{t.humidity}</p>
            <p className="text-xl font-semibold">{weather.humidity}%</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Cloud className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">{t.rainfall}</p>
            <p className="text-xl font-semibold">{weather.rainfall}mm</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Wind className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">{t.windSpeed}</p>
            <p className="text-xl font-semibold">{weather.windSpeed}km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};