import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle } from 'lucide-react';
import { ImageAnalysisService } from '../services/imageAnalysisService';
import { translations } from '../data/translations';

interface ImageAnalysisProps {
  language: string;
}

export const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ language }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysis(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    try {
      const imageAnalysisService = ImageAnalysisService.getInstance();
      const result = await imageAnalysisService.analyzeCropImage(selectedImage, language);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // Handle error appropriately
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.imageAnalysis}</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Selected crop"
                className="max-w-full h-48 object-contain mx-auto rounded-lg"
              />
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Change Image
                </button>
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? t.processing : t.analyze}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 mb-2">{t.uploadImage}</p>
              <p className="text-sm text-gray-500">Take a photo or upload from gallery</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {analysis && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">{t.healthScore}: {analysis.healthScore}%</span>
              </div>
              <div className="bg-white rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{analysis.cropType}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(analysis.confidence * 100)}% {t.confidence}
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {analysis.recommendations.map((rec: string, recIndex: number) => (
                    <li key={recIndex} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
                  </div>
            </div>

            {analysis.detectedIssues && analysis.detectedIssues.length > 0 && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-medium">{t.detectedIssues}</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {analysis.detectedIssues.map((issue: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};