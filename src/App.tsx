import React, { useState } from 'react';
import { Leaf, MessageCircle, Camera, BarChart3, Cloud, Beaker } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { VoiceChat } from './components/VoiceChat';
import { ImageAnalysis } from './components/ImageAnalysis';
import { WeatherWidget } from './components/WeatherWidget';
import { CropPrediction } from './components/CropPrediction';
import { SoilHealth } from './components/SoilHealth';
import { translations } from './data/translations';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('chat');

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const tabs = [
    { id: 'chat', name: t.voiceChat, icon: MessageCircle },
    { id: 'image', name: t.imageAnalysis, icon: Camera },
    { id: 'prediction', name: t.cropPrediction, icon: BarChart3 },
    { id: 'weather', name: t.weather, icon: Cloud },
    { id: 'soil', name: t.soilHealth, icon: Beaker },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriSmart</h1>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t.welcome}</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {t.welcomeMessage}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-2 mb-8">
          <nav className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="pb-12">
          {activeTab === 'chat' && <VoiceChat language={selectedLanguage} />}
          {activeTab === 'image' && <ImageAnalysis language={selectedLanguage} />}
          {activeTab === 'prediction' && <CropPrediction language={selectedLanguage} />}
          {activeTab === 'weather' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherWidget language={selectedLanguage} />
              <SoilHealth language={selectedLanguage} />
            </div>
          )}
          {activeTab === 'soil' && <SoilHealth language={selectedLanguage} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-green-500 mr-3" />
            <span className="text-xl font-semibold">AgriSmart</span>
          </div>
          <p className="text-gray-400">
            {t.empoweringFarmers}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t.languageSupport}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;