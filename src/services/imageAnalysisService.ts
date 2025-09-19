// Enhanced image analysis service with better crop detection
export interface CropDetectionResult {
  cropType: string;
  confidence: number;
  healthStatus: 'healthy' | 'diseased' | 'pest_damage' | 'nutrient_deficiency';
  healthScore: number;
  detectedIssues: string[];
  recommendations: string[];
  language: string;
}

export class ImageAnalysisService {
  private static instance: ImageAnalysisService;

  static getInstance(): ImageAnalysisService {
    if (!ImageAnalysisService.instance) {
      ImageAnalysisService.instance = new ImageAnalysisService();
    }
    return ImageAnalysisService.instance;
  }

  async analyzeCropImage(imageFile: File, language: string = 'en'): Promise<CropDetectionResult> {
    try {
      // In a real implementation, this would send the image to an AI service
      // For demo purposes, we'll simulate advanced crop detection
      
      const imageData = await this.processImageFile(imageFile);
      const cropAnalysis = this.simulateAdvancedCropDetection(imageData, language);
      
      return cropAnalysis;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  private async processImageFile(file: File): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          resolve(imageData);
        } else {
          reject(new Error('Failed to process image'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  private simulateAdvancedCropDetection(imageData: ImageData, language: string): CropDetectionResult {
    // Simulate color analysis for crop detection
    const { data, width, height } = imageData;
    let greenPixels = 0;
    let brownPixels = 0;
    let yellowPixels = 0;
    let totalPixels = width * height;

    // Analyze pixel colors to determine crop type and health
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Classify pixels based on color
      if (g > r && g > b && g > 100) {
        greenPixels++;
      } else if (r > 150 && g > 100 && b < 100) {
        brownPixels++;
      } else if (r > 200 && g > 200 && b < 150) {
        yellowPixels++;
      }
    }

    const greenRatio = greenPixels / totalPixels;
    const brownRatio = brownPixels / totalPixels;
    const yellowRatio = yellowPixels / totalPixels;

    // Determine crop type based on color analysis
    let cropType = 'Unknown Plant';
    let confidence = 0.5;

    if (greenRatio > 0.3) {
      if (greenRatio > 0.5) {
        cropType = this.getCropTypes().rice;
        confidence = 0.85 + Math.random() * 0.1;
      } else if (yellowRatio > 0.1) {
        cropType = this.getCropTypes().wheat;
        confidence = 0.80 + Math.random() * 0.15;
      } else {
        cropType = this.getCropTypes().sugarcane;
        confidence = 0.75 + Math.random() * 0.15;
      }
    } else if (brownRatio > 0.2) {
      cropType = this.getCropTypes().cotton;
      confidence = 0.70 + Math.random() * 0.2;
    }

    // Determine health status
    let healthStatus: CropDetectionResult['healthStatus'] = 'healthy';
    let healthScore = 85;
    let detectedIssues: string[] = [];
    let recommendations: string[] = [];

    if (brownRatio > 0.3) {
      healthStatus = 'diseased';
      healthScore = 45 + Math.random() * 20;
      detectedIssues = this.getDiseaseIssues(language);
      recommendations = this.getDiseaseRecommendations(language);
    } else if (yellowRatio > 0.25) {
      healthStatus = 'nutrient_deficiency';
      healthScore = 60 + Math.random() * 15;
      detectedIssues = this.getNutrientIssues(language);
      recommendations = this.getNutrientRecommendations(language);
    } else if (greenRatio < 0.2) {
      healthStatus = 'pest_damage';
      healthScore = 50 + Math.random() * 20;
      detectedIssues = this.getPestIssues(language);
      recommendations = this.getPestRecommendations(language);
    } else {
      healthScore = 80 + Math.random() * 15;
      detectedIssues = this.getHealthyIssues(language);
      recommendations = this.getHealthyRecommendations(language);
    }

    return {
      cropType: this.translateCropType(cropType, language),
      confidence: Math.round(confidence * 100) / 100,
      healthStatus,
      healthScore: Math.round(healthScore),
      detectedIssues,
      recommendations,
      language,
    };
  }

  private getCropTypes() {
    return {
      rice: 'Rice',
      wheat: 'Wheat',
      sugarcane: 'Sugarcane',
      cotton: 'Cotton',
      maize: 'Maize',
      soybean: 'Soybean',
    };
  }

  private translateCropType(cropType: string, language: string): string {
    const translations: Record<string, Record<string, string>> = {
      en: { Rice: 'Rice', Wheat: 'Wheat', Sugarcane: 'Sugarcane', Cotton: 'Cotton' },
      hi: { Rice: 'धान', Wheat: 'गेहूं', Sugarcane: 'गन्ना', Cotton: 'कपास' },
      te: { Rice: 'వరి', Wheat: 'గోధుమ', Sugarcane: 'చెరకు', Cotton: 'పత్తి' },
      bn: { Rice: 'ধান', Wheat: 'গম', Sugarcane: 'আখ', Cotton: 'তুলা' },
      ta: { Rice: 'அரிசி', Wheat: 'கோதுமை', Sugarcane: 'கரும்பு', Cotton: 'பருத்தி' },
      kn: { Rice: 'ಅಕ್ಕಿ', Wheat: 'ಗೋಧಿ', Sugarcane: 'ಕಬ್ಬು', Cotton: 'ಹತ್ತಿ' },
      ml: { Rice: 'അരി', Wheat: 'ഗോതമ്പ്', Sugarcane: 'കരിമ്പ്', Cotton: 'പരുത്തി' },
      as: { Rice: 'ধান', Wheat: 'ঘেঁহু', Sugarcane: 'আখ', Cotton: 'কপাহ' },
    };

    return translations[language]?.[cropType] || cropType;
  }

  private getDiseaseIssues(language: string): string[] {
    const issues: Record<string, string[]> = {
      en: [
        'Leaf blight detected in multiple areas',
        'Brown spots indicating fungal infection',
        'Stem rot symptoms visible',
      ],
      hi: [
        'कई क्षेत्रों में पत्ती झुलसा रोग का पता चला',
        'भूरे धब्बे फंगल संक्रमण का संकेत',
        'तने की सड़न के लक्षण दिखाई दे रहे हैं',
      ],
      te: [
        'అనేక ప్రాంతాలలో ఆకు కాలిపోవడం గుర్తించబడింది',
        'గోధుమ రంగు మచ్చలు ఫంగల్ ఇన్ఫెక్షన్‌ను సూచిస్తున్నాయి',
        'కాండం కుళ్ళిపోవడం లక్షణాలు కనిపిస్తున్నాయి',
      ],
    };

    return issues[language] || issues.en;
  }

  private getDiseaseRecommendations(language: string): string[] {
    const recommendations: Record<string, string[]> = {
      en: [
        'Apply copper-based fungicide immediately',
        'Remove affected plant parts and burn them',
        'Improve drainage to prevent waterlogging',
        'Spray neem oil solution twice weekly',
      ],
      hi: [
        'तुरंत कॉपर आधारित फंगीसाइड का प्रयोग करें',
        'प्रभावित पौधे के हिस्सों को हटाकर जला दें',
        'जल भराव को रोकने के लिए जल निकासी में सुधार करें',
        'सप्ताह में दो बार नीम तेल का घोल छिड़कें',
      ],
      te: [
        'వెంటనే రాగి ఆధారిత శిలీంద్రనాశకం వేయండి',
        'ప్రభావిత మొక్క భాగాలను తొలగించి కాల్చండి',
        'నీరు నిలిచిపోకుండా డ్రైనేజీని మెరుగుపరచండి',
        'వారానికి రెండుసార్లు వేప నూనె ద్రావణం చల్లండి',
      ],
    };

    return recommendations[language] || recommendations.en;
  }

  private getNutrientIssues(language: string): string[] {
    const issues: Record<string, string[]> = {
      en: [
        'Nitrogen deficiency evident in lower leaves',
        'Yellowing indicates possible iron deficiency',
        'Stunted growth observed',
      ],
      hi: [
        'निचली पत्तियों में नाइट्रोजन की कमी स्पष्ट है',
        'पीलापन संभावित आयरन की कमी का संकेत',
        'बौनी वृद्धि देखी गई',
      ],
      te: [
        'దిగువ ఆకులలో నైట్రోజన్ లోపం స్పష్టంగా కనిపిస్తోంది',
        'పసుపు రంగు మారడం ఐరన్ లోపాన్ని సూచిస్తుంది',
        'పెరుగుదల మందగించడం గమనించబడింది',
      ],
    };

    return issues[language] || issues.en;
  }

  private getNutrientRecommendations(language: string): string[] {
    const recommendations: Record<string, string[]> = {
      en: [
        'Apply nitrogen-rich fertilizer (urea) immediately',
        'Use iron chelate for iron deficiency',
        'Ensure proper soil pH (6.0-7.0)',
        'Apply organic compost to improve soil health',
      ],
      hi: [
        'तुरंत नाइट्रोजन युक्त उर्वरक (यूरिया) का प्रयोग करें',
        'आयरन की कमी के लिए आयरन चेलेट का उपयोग करें',
        'उचित मिट्टी पीएच (6.0-7.0) सुनिश्चित करें',
        'मिट्टी के स्वास्थ्य में सुधार के लिए जैविक खाद डालें',
      ],
      te: [
        'వెంటనే నైట్రోజన్ అధికంగా ఉన్న ఎరువు (యూరియా) వేయండి',
        'ఐరన్ లోపానికి ఐరన్ చెలేట్ ఉపయోగించండి',
        'సరైన మట్టి pH (6.0-7.0) నిర్ధారించండి',
        'మట్టి ఆరోగ్యాన్ని మెరుగుపరచడానికి సేంద్రీయ ఎరువు వేయండి',
      ],
    };

    return recommendations[language] || recommendations.en;
  }

  private getPestIssues(language: string): string[] {
    const issues: Record<string, string[]> = {
      en: [
        'Insect damage visible on leaves',
        'Holes in leaves suggest caterpillar infestation',
        'Reduced leaf area affecting photosynthesis',
      ],
      hi: [
        'पत्तियों पर कीट क्षति दिखाई दे रही है',
        'पत्तियों में छेद इल्ली के संक्रमण का सुझाव देते हैं',
        'पत्ती क्षेत्र में कमी प्रकाश संश्लेषण को प्रभावित कर रही है',
      ],
      te: [
        'ఆకులపై కీటకాల దెబ్బ కనిపిస్తోంది',
        'ఆకులలో రంధ్రాలు గొంగళి పురుగుల దాడిని సూచిస్తున్నాయి',
        'ఆకుల వైశాల్యం తగ్గడం కిరణజన్య సంయోగక్రియను ప్రభావితం చేస్తోంది',
      ],
    };

    return issues[language] || issues.en;
  }

  private getPestRecommendations(language: string): string[] {
    const recommendations: Record<string, string[]> = {
      en: [
        'Apply neem-based insecticide spray',
        'Use pheromone traps for pest monitoring',
        'Encourage beneficial insects like ladybugs',
        'Remove heavily infested plant parts',
      ],
      hi: [
        'नीम आधारित कीटनाशक स्प्रे का प्रयोग करें',
        'कीट निगरानी के लिए फेरोमोन ट्रैप का उपयोग करें',
        'लेडीबग जैसे लाभकारी कीटों को प्रोत्साहित करें',
        'अधिक संक्रमित पौधे के हिस्सों को हटा दें',
      ],
      te: [
        'వేప ఆధారిత కీటకనాశక స్ప్రే వేయండి',
        'కీటకాల పర్యవేక్షణ కోసం ఫెరోమోన్ ట్రాప్‌లను ఉపయోగించండి',
        'లేడీబగ్‌ల వంటి ప్రయోజనకరమైన కీటకాలను ప్రోత్సహించండి',
        'ఎక్కువగా సోకిన మొక్క భాగాలను తొలగించండి',
      ],
    };

    return recommendations[language] || recommendations.en;
  }

  private getHealthyIssues(language: string): string[] {
    const issues: Record<string, string[]> = {
      en: [
        'Overall plant health appears good',
        'Minor nutrient optimization possible',
        'Regular monitoring recommended',
      ],
      hi: [
        'समग्र पौधे का स्वास्थ्य अच्छा दिखाई दे रहा है',
        'मामूली पोषक तत्व अनुकूलन संभव है',
        'नियमित निगरानी की सिफारिश की जाती है',
      ],
      te: [
        'మొత్తం మొక్క ఆరోగ్యం బాగుంది',
        'చిన్న పోషకాల అనుకూలీకరణ సాధ్యం',
        'క్రమం తప్పకుండా పర్యవేక్షణ సిఫార్సు చేయబడింది',
      ],
    };

    return issues[language] || issues.en;
  }

  private getHealthyRecommendations(language: string): string[] {
    const recommendations: Record<string, string[]> = {
      en: [
        'Continue current care routine',
        'Apply balanced NPK fertilizer monthly',
        'Monitor for early signs of pests or diseases',
        'Maintain optimal watering schedule',
      ],
      hi: [
        'वर्तमान देखभाल की दिनचर्या जारी रखें',
        'मासिक संतुलित NPK उर्वरक का प्रयोग करें',
        'कीटों या बीमारियों के शुरुआती संकेतों की निगरानी करें',
        'इष्टतम पानी देने का कार्यक्रम बनाए रखें',
      ],
      te: [
        'ప్రస్తుత సంరక్షణ దినచర్యను కొనసాగించండి',
        'నెలవారీ సమతుల్య NPK ఎరువు వేయండి',
        'కీటకాలు లేదా వ్యాధుల ప్రారంభ సంకేతాలను పర్యవేక్షించండి',
        'సరైన నీటిపారుదల షెడ్యూల్‌ను నిర్వహించండి',
      ],
    };

    return recommendations[language] || recommendations.en;
  }
}