export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
}

export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
}

export interface CropPrediction {
  crop: string;
  predictedYield: number;
  confidence: number;
  recommendations: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language?: string;
}

export interface ImageAnalysis {
  predictions: Array<{
    label: string;
    confidence: number;
    recommendations: string[];
  }>;
  healthScore: number;
  detectedIssues: string[];
}