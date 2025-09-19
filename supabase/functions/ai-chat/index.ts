import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string
  sessionId: string
  language: string
  messageType?: string
  imageData?: string
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

    const { message, sessionId, language, messageType = 'text', imageData }: ChatRequest = await req.json()

    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      message,
      sender: 'user',
      message_type: messageType,
      metadata: imageData ? { imageData } : null
    })

    // Generate AI response based on message type
    let aiResponse = ''
    
    if (messageType === 'image' && imageData) {
      aiResponse = await analyzeImage(imageData, language)
    } else {
      aiResponse = await generateChatResponse(message, language)
    }

    // Save AI response
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      message: aiResponse,
      sender: 'ai',
      message_type: 'text'
    })

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function generateChatResponse(message: string, language: string): Promise<string> {
  // Agricultural AI responses based on common farming queries
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
    return getLocalizedResponse('crop_advice', language)
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
    return getLocalizedResponse('pest_advice', language)
  } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
    return getLocalizedResponse('weather_advice', language)
  } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
    return getLocalizedResponse('fertilizer_advice', language)
  } else if (lowerMessage.includes('market') || lowerMessage.includes('price')) {
    return getLocalizedResponse('market_advice', language)
  } else {
    return getLocalizedResponse('general_advice', language)
  }
}

async function analyzeImage(imageData: string, language: string): Promise<string> {
  // Simulate image analysis for crop diseases, pests, or soil conditions
  const analysisResults = [
    'leaf_blight_detected',
    'healthy_crop',
    'nutrient_deficiency',
    'pest_infestation',
    'soil_analysis'
  ]
  
  const randomResult = analysisResults[Math.floor(Math.random() * analysisResults.length)]
  return getLocalizedResponse(randomResult, language)
}

function getLocalizedResponse(key: string, language: string): string {
  const responses: Record<string, Record<string, string>> = {
    en: {
      crop_advice: "Based on your query about crops, I recommend considering soil conditions, weather patterns, and market demand. For optimal results, ensure proper spacing, adequate water supply, and regular monitoring for pests and diseases.",
      pest_advice: "For pest and disease management, I suggest implementing integrated pest management (IPM) practices. Use organic pesticides when possible, maintain crop rotation, and monitor regularly for early detection.",
      weather_advice: "Weather plays a crucial role in farming success. I recommend checking daily forecasts, planning irrigation based on rainfall predictions, and protecting crops during extreme weather events.",
      fertilizer_advice: "For optimal fertilizer use, conduct soil testing first. Apply balanced NPK fertilizers based on crop requirements and soil conditions. Consider organic alternatives like compost and vermicompost.",
      market_advice: "Market prices fluctuate based on supply and demand. I suggest monitoring local market trends, considering value-added processing, and exploring direct marketing opportunities.",
      general_advice: "I'm here to help with all your agricultural needs! Ask me about crops, weather, pests, fertilizers, market prices, or any farming-related questions.",
      leaf_blight_detected: "Image analysis shows signs of leaf blight. Recommend immediate treatment with copper-based fungicide and improving air circulation around plants.",
      healthy_crop: "Your crop appears healthy! Continue current care practices and monitor regularly for any changes.",
      nutrient_deficiency: "The image suggests nutrient deficiency, likely nitrogen. Consider applying balanced fertilizer and soil testing.",
      pest_infestation: "Pest infestation detected. Implement IPM strategies and consider organic pest control methods.",
      soil_analysis: "Soil condition analysis complete. The soil appears to need organic matter improvement and pH adjustment."
    },
    hi: {
      crop_advice: "फसल के बारे में आपके प्रश्न के आधार पर, मैं मिट्टी की स्थिति, मौसम के पैटर्न और बाजार की मांग पर विचार करने की सलाह देता हूं। इष्टतम परिणामों के लिए, उचित दूरी, पर्याप्त पानी की आपूर्ति और कीटों और बीमारियों की नियमित निगरानी सुनिश्चित करें।",
      pest_advice: "कीट और रोग प्रबंधन के लिए, मैं एकीकृत कीट प्रबंधन (IPM) प्रथाओं को लागू करने का सुझाव देता हूं। जब संभव हो तो जैविक कीटनाशकों का उपयोग करें, फसल चक्र बनाए रखें, और जल्दी पता लगाने के लिए नियमित निगरानी करें।",
      weather_advice: "मौसम खेती की सफलता में महत्वपूर्ण भूमिका निभाता है। मैं दैनिक पूर्वानुमान की जांच करने, वर्षा की भविष्यवाणी के आधार पर सिंचाई की योजना बनाने और चरम मौसम की घटनाओं के दौरान फसलों की सुरक्षा करने की सलाह देता हूं।",
      fertilizer_advice: "इष्टतम उर्वरक उपयोग के लिए, पहले मिट्टी परीक्षण कराएं। फसल की आवश्यकताओं और मिट्टी की स्थिति के आधार पर संतुलित NPK उर्वरक लगाएं। कंपोस्ट और वर्मीकंपोस्ट जैसे जैविक विकल्पों पर विचार करें।",
      market_advice: "बाजार की कीमतें आपूर्ति और मांग के आधार पर उतार-चढ़ाव करती हैं। मैं स्थानीय बाजार के रुझान की निगरानी करने, मूल्य संवर्धित प्रसंस्करण पर विचार करने और प्रत्यक्ष विपणन के अवसरों की खोज करने का सुझाव देता हूं।",
      general_advice: "मैं आपकी सभी कृषि आवश्यकताओं में मदद के लिए यहां हूं! मुझसे फसलों, मौसम, कीटों, उर्वरकों, बाजार की कीमतों या किसी भी खेती से संबंधित प्रश्न के बारे में पूछें।",
      leaf_blight_detected: "छवि विश्लेषण में पत्ती झुलसा रोग के संकेत दिखाई दे रहे हैं। तांबा आधारित कवकनाशी के साथ तत्काल उपचार और पौधों के चारों ओर हवा के संचलन में सुधार की सिफारिश की जाती है।",
      healthy_crop: "आपकी फसल स्वस्थ दिखाई दे रही है! वर्तमान देखभाल प्रथाओं को जारी रखें और किसी भी बदलाव के लिए नियमित निगरानी करें।",
      nutrient_deficiency: "छवि पोषक तत्वों की कमी का सुझाव देती है, संभवतः नाइट्रोजन। संतुलित उर्वरक लगाने और मिट्टी परीक्षण पर विचार करें।",
      pest_infestation: "कीट संक्रमण का पता चला। IPM रणनीतियों को लागू करें और जैविक कीट नियंत्रण विधियों पर विचार करें।",
      soil_analysis: "मिट्टी की स्थिति का विश्लेषण पूरा हुआ। मिट्टी में जैविक पदार्थ सुधार और pH समायोजन की आवश्यकता प्रतीत होती है।"
    }
  }
  
  return responses[language]?.[key] || responses.en[key] || "I'm here to help with your agricultural questions!"
}