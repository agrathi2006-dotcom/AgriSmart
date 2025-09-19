// Weather service for real-time weather data
export interface WeatherResponse {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  description: string;
  location: string;
}

export class WeatherService {
  private static instance: WeatherService;
  private apiKey = 'demo_key'; // In production, use environment variable

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherResponse> {
    try {
      // Get user location if not provided
      if (!lat || !lon) {
        const position = await this.getCurrentPosition();
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      }

      // In a real implementation, you would call a weather API like OpenWeatherMap
      // For demo purposes, we'll simulate realistic weather data based on location
      const weatherData = this.generateRealisticWeatherData(lat, lon);
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Return fallback data
      return this.getFallbackWeatherData();
    }
  }

  private getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true,
      });
    });
  }

  private generateRealisticWeatherData(lat: number, lon: number): WeatherResponse {
    // Simulate realistic weather based on Indian geographical regions
    const isNorthIndia = lat > 26;
    const isSouthIndia = lat < 15;
    const isWestIndia = lon < 77;
    const isEastIndia = lon > 85;

    // Current season simulation (simplified)
    const month = new Date().getMonth();
    const isMonsoon = month >= 5 && month <= 9; // June to October
    const isWinter = month >= 11 || month <= 2; // December to March
    const isSummer = month >= 3 && month <= 5; // April to June

    let baseTemp = 25;
    let humidity = 60;
    let rainfall = 0;
    let windSpeed = 8;
    let description = 'Clear sky';

    // Regional adjustments
    if (isNorthIndia) {
      if (isWinter) {
        baseTemp = Math.random() * 10 + 10; // 10-20°C
        humidity = 40 + Math.random() * 20; // 40-60%
        description = 'Cool and dry';
      } else if (isSummer) {
        baseTemp = Math.random() * 15 + 35; // 35-50°C
        humidity = 20 + Math.random() * 30; // 20-50%
        description = 'Hot and dry';
      } else if (isMonsoon) {
        baseTemp = Math.random() * 10 + 25; // 25-35°C
        humidity = 70 + Math.random() * 25; // 70-95%
        rainfall = Math.random() * 50; // 0-50mm
        description = 'Monsoon rains';
      }
    } else if (isSouthIndia) {
      baseTemp = Math.random() * 8 + 24; // 24-32°C (more stable)
      humidity = 65 + Math.random() * 25; // 65-90%
      if (isMonsoon) {
        rainfall = Math.random() * 80; // 0-80mm
        description = 'Heavy monsoon';
      }
    }

    // Coastal adjustments
    if (isWestIndia || isEastIndia) {
      humidity += 10; // Higher humidity near coasts
      windSpeed += Math.random() * 5; // More wind near coasts
    }

    // Add some randomness for realism
    baseTemp += (Math.random() - 0.5) * 4;
    humidity += (Math.random() - 0.5) * 10;
    windSpeed += (Math.random() - 0.5) * 6;

    // Ensure realistic bounds
    baseTemp = Math.max(5, Math.min(50, baseTemp));
    humidity = Math.max(10, Math.min(100, humidity));
    windSpeed = Math.max(0, Math.min(30, windSpeed));

    return {
      temperature: Math.round(baseTemp * 10) / 10,
      humidity: Math.round(humidity),
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: Math.round(windSpeed * 10) / 10,
      description,
      location: this.getLocationName(lat, lon),
    };
  }

  private getLocationName(lat: number, lon: number): string {
    // Simplified location mapping for Indian regions
    if (lat > 28 && lon < 77) return 'Punjab/Haryana';
    if (lat > 26 && lat <= 28 && lon >= 77 && lon <= 82) return 'Uttar Pradesh';
    if (lat >= 20 && lat <= 26 && lon >= 72 && lon <= 78) return 'Maharashtra';
    if (lat >= 15 && lat <= 20 && lon >= 74 && lon <= 80) return 'Karnataka';
    if (lat >= 8 && lat <= 15 && lon >= 76 && lon <= 80) return 'Tamil Nadu';
    if (lat >= 20 && lat <= 27 && lon >= 82 && lon <= 88) return 'West Bengal';
    if (lat >= 24 && lat <= 28 && lon >= 88 && lon <= 96) return 'Assam';
    if (lat >= 15 && lat <= 20 && lon >= 78 && lon <= 84) return 'Telangana/Andhra Pradesh';
    return 'India';
  }

  private getFallbackWeatherData(): WeatherResponse {
    return {
      temperature: 28,
      humidity: 65,
      rainfall: 2.5,
      windSpeed: 12,
      description: 'Partly cloudy',
      location: 'India',
    };
  }
}