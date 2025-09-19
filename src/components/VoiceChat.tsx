import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { ChatMessage } from '../types';
import { translations } from '../data/translations';

interface VoiceChatProps {
  language: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { transcript, isListening, isSupported, startListening, stopListening } = 
    useSpeechRecognition(language);

  const t = translations[language as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language,
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, language);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        language,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputMessage('');
  };

  const generateAIResponse = (question: string, lang: string): string => {
    // Mock AI responses based on language and context
    const responses = {
      en: [
        "Based on current weather conditions and soil analysis, I recommend adjusting your irrigation schedule. The humidity levels suggest reduced watering frequency.",
        "For optimal crop growth, apply nitrogen-rich fertilizer during the vegetative stage. Monitor for pest activity during warm weather periods.",
        "Your soil analysis shows good pH levels. Consider adding organic matter to improve water retention and nutrient availability.",
        "Weather forecast indicates rainfall in the next 3 days. Delay fertilizer application until after the rain to prevent nutrient loss.",
        "Based on your crop type and growth stage, increase potassium application to improve disease resistance and fruit quality.",
      ],
      hi: [
        "वर्तमान मौसम की स्थिति और मिट्टी के विश्लेषण के आधार पर, मैं आपके सिंचाई कार्यक्रम को समायोजित करने की सलाह देता हूं।",
        "इष्टतम फसल वृद्धि के लिए, वानस्पतिक अवस्था के दौरान नाइट्रोजन युक्त उर्वरक का प्रयोग करें।",
        "आपके मिट्टी विश्लेषण से अच्छे पीएच स्तर दिखते हैं। जल धारण और पोषक तत्वों की उपलब्धता में सुधार के लिए जैविक पदार्थ जोड़ने पर विचार करें।",
        "मौसम पूर्वानुमान अगले 3 दिनों में बारिश का संकेत देता है। पोषक तत्वों के नुकसान को रोकने के लिए बारिश के बाद तक उर्वरक का प्रयोग स्थगित करें।",
        "आपकी फसल के प्रकार और वृद्धि अवस्था के आधार पर, रोग प्रतिरोधक क्षमता और फल की गुणवत्ता में सुधार के लिए पोटेशियम का प्रयोग बढ़ाएं।",
      ],
      te: [
        "ప్రస్తుత వాతావరణ పరిస్థితులు మరియు మట్టి విశ్లేషణ ఆధారంగా, మీ నీటిపారుదల షెడ్యూల్‌ను సర్దుబాటు చేయాలని సిఫార్సు చేస్తున్నాను.",
        "సరైన పంట పెరుగుదల కోసం, వృక్షసంపద దశలో నైట్రోజన్ అధికంగా ఉన్న ఎరువు వేయండి।",
        "మీ మట్టి విశ్లేషణ మంచి pH స్థాయిలను చూపిస్తుంది. నీటి నిలుపుదల మరియు పోషకాల లభ్యతను మెరుగుపరచడానికి సేంద్రీయ పదార్థాలను జోడించడాన్ని పరిగణించండి.",
        "వాతావరణ సూచన రాబోయే 3 రోజుల్లో వర్షాలను సూచిస్తుంది. పోషకాల నష్టాన్ని నివారించడానికి వర్షం తర్వాత వరకు ఎరువు వేయడాన్ని వాయిదా వేయండి.",
        "మీ పంట రకం మరియు పెరుగుదల దశ ఆధారంగా, వ్యాధి నిరోధక శక్తి మరియు పండ్ల నాణ్యతను మెరుగుపరచడానికి పొటాషియం వేయడాన్ని పెంచండి.",
      ],
      bn: [
        "বর্তমান আবহাওয়া পরিস্থিতি এবং মাটি বিশ্লেষণের ভিত্তিতে, আমি আপনার সেচের সময়সূচী সমন্বয় করার পরামর্শ দিচ্ছি।",
        "সর্বোত্তম ফসল বৃদ্ধির জন্য, উদ্ভিজ্জ পর্যায়ে নাইট্রোজেন সমৃদ্ধ সার প্রয়োগ করুন।",
        "আপনার মাটি বিশ্লেষণ ভাল pH মাত্রা দেখায়। জল ধরে রাখা এবং পুষ্টির প্রাপ্যতা উন্নত করতে জৈব পদার্থ যোগ করার কথা বিবেচনা করুন।",
        "আবহাওয়ার পূর্বাভাস আগামী ৩ দিনে বৃষ্টির ইঙ্গিত দেয়। পুষ্টি ক্ষতি রোধ করতে বৃষ্টির পর পর্যন্ত সার প্রয়োগ বিলম্বিত করুন।",
        "আপনার ফসলের ধরন এবং বৃদ্ধির পর্যায়ের ভিত্তিতে, রোগ প্রতিরোধ ক্ষমতা এবং ফলের গুণমান উন্নত করতে পটাসিয়াম প্রয়োগ বৃদ্ধি করুন।",
      ],
      ta: [
        "தற்போதைய வானிலை நிலைமைகள் மற்றும் மண் பகுப்பாய்வின் அடிப்படையில், உங்கள் நீர்ப்பாசன அட்டவணையை சரிசெய்ய பரிந்துரைக்கிறேன்.",
        "சரியான பயிர் வளர்ச்சிக்கு, தாவர நிலையில் நைட்ரஜன் நிறைந்த உரத்தைப் பயன்படுத்துங்கள்.",
        "உங்கள் மண் பகுப்பாய்வு நல்ல pH அளவுகளைக் காட்டுகிறது. நீர் தக்கவைப்பு மற்றும் ஊட்டச்சத்து கிடைக்கும் தன்மையை மேம்படுத்த கரிமப் பொருட்களைச் சேர்ப்பதைக் கருத்தில் கொள்ளுங்கள்.",
        "வானிலை முன்னறிவிப்பு அடுத்த 3 நாட்களில் மழையைக் குறிக்கிறது. ஊட்டச்சத்து இழப்பைத் தடுக்க மழைக்குப் பிறகு வரை உர பயன்பாட்டை தாமதப்படுத்துங்கள்.",
        "உங்கள் பயிர் வகை மற்றும் வளர்ச்சி நிலையின் அடிப்படையில், நோய் எதிர்ப்பு சக்தி மற்றும் பழ தரத்தை மேம்படுத்த பொட்டாசியம் பயன்பாட்டை அதிகரிக்கவும்.",
      ],
      kn: [
        "ಪ್ರಸ್ತುತ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು ಮತ್ತು ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ, ನಿಮ್ಮ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಸರಿಹೊಂದಿಸಲು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.",
        "ಸೂಕ್ತ ಬೆಳೆ ಬೆಳವಣಿಗೆಗಾಗಿ, ಸಸ್ಯಕ ಹಂತದಲ್ಲಿ ಸಾರಜನಕ ಭರಿತ ಗೊಬ್ಬರವನ್ನು ಬಳಸಿ.",
        "ನಿಮ್ಮ ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ಉತ್ತಮ pH ಮಟ್ಟಗಳನ್ನು ತೋರಿಸುತ್ತದೆ. ನೀರಿನ ಧಾರಣ ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಲಭ್ಯತೆಯನ್ನು ಸುಧಾರಿಸಲು ಸಾವಯವ ಪದಾರ್ಥಗಳನ್ನು ಸೇರಿಸುವುದನ್ನು ಪರಿಗಣಿಸಿ.",
        "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮುಂದಿನ 3 ದಿನಗಳಲ್ಲಿ ಮಳೆಯನ್ನು ಸೂಚಿಸುತ್ತದೆ. ಪೋಷಕಾಂಶಗಳ ನಷ್ಟವನ್ನು ತಡೆಯಲು ಮಳೆಯ ನಂತರದವರೆಗೆ ಗೊಬ್ಬರ ಬಳಕೆಯನ್ನು ವಿಳಂಬಗೊಳಿಸಿ.",
        "ನಿಮ್ಮ ಬೆಳೆಯ ಪ್ರಕಾರ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಹಂತದ ಆಧಾರದ ಮೇಲೆ, ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಮತ್ತು ಹಣ್ಣಿನ ಗುಣಮಟ್ಟವನ್ನು ಸುಧಾರಿಸಲು ಪೊಟ್ಯಾಸಿಯಮ್ ಬಳಕೆಯನ್ನು ಹೆಚ್ಚಿಸಿ.",
      ],
      ml: [
        "നിലവിലെ കാലാവസ്ഥാ സാഹചര്യങ്ങളും മണ്ണ് വിശകലനവും അടിസ്ഥാനമാക്കി, നിങ്ങളുടെ ജലസേചന ഷെഡ്യൂൾ ക്രമീകരിക്കാൻ ശുപാർശ ചെയ്യുന്നു.",
        "ഒപ്റ്റിമൽ വിള വളർച്ചയ്ക്കായി, സസ്യ ഘട്ടത്തിൽ നൈട്രജൻ സമ്പുഷ്ടമായ വളം പ്രയോഗിക്കുക.",
        "നിങ്ങളുടെ മണ്ണ് വിശകലനം നല്ല pH നിലകൾ കാണിക്കുന്നു. ജല നിലനിർത്തലും പോഷക ലഭ്യതയും മെച്ചപ്പെടുത്താൻ ജൈവ പദാർത്ഥങ്ങൾ ചേർക്കുന്നത് പരിഗണിക്കുക.",
        "കാലാവസ്ഥാ പ്രവചനം അടുത്ത 3 ദിവസത്തിൽ മഴയെ സൂചിപ്പിക്കുന്നു. പോഷക നഷ്ടം തടയാൻ മഴയ്ക്ക് ശേഷം വരെ വള പ്രയോഗം വൈകിപ്പിക്കുക.",
        "നിങ്ങളുടെ വിള തരവും വളർച്ചാ ഘട്ടവും അടിസ്ഥാനമാക്കി, രോഗ പ്രതിരോധവും ഫല ഗുണനിലവാരവും മെച്ചപ്പെടുത്താൻ പൊട്ടാസ്യം പ്രയോഗം വർദ്ധിപ്പിക്കുക.",
      ],
      as: [
        "বৰ্তমানৰ বতৰৰ পৰিস্থিতি আৰু মাটিৰ বিশ্লেষণৰ ভিত্তিত, আপোনাৰ জলসিঞ্চনৰ সময়সূচী সমন্বয় কৰিবলৈ পৰামৰ্শ দিছো।",
        "সৰ্বোত্তম শস্যৰ বৃদ্ধিৰ বাবে, উদ্ভিদ অৱস্থাত নাইট্ৰজেন সমৃদ্ধ সাৰ প্ৰয়োগ কৰক।",
        "আপোনাৰ মাটিৰ বিশ্লেষণে ভাল pH স্তৰ দেখুৱায়। পানী ধৰি ৰখা আৰু পুষ্টিৰ উপলব্ধতা উন্নত কৰিবলৈ জৈৱিক পদাৰ্থ যোগ কৰাৰ কথা বিবেচনা কৰক।",
        "বতৰৰ পূৰ্বাভাসে আগন্তুক ৩ দিনত বৰষুণৰ ইংগিত দিয়ে। পুষ্টিৰ ক্ষতি ৰোধ কৰিবলৈ বৰষুণৰ পিছলৈকে সাৰ প্ৰয়োগ বিলম্বিত কৰক।",
        "আপোনাৰ শস্যৰ প্ৰকাৰ আৰু বৃদ্ধিৰ পৰ্যায়ৰ ভিত্তিত, ৰোগ প্ৰতিৰোধ ক্ষমতা আৰু ফলৰ গুণগত মান উন্নত কৰিবলৈ পটেছিয়াম প্ৰয়োগ বৃদ্ধি কৰক।",
      ],
    };

    const langResponses = responses[lang as keyof typeof responses] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.voiceChat}</h3>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Volume2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{t.askQuestion}</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex space-x-2">
        <div className="flex-1 flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.typeMessage}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          {isSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      {isListening && (
        <div className="text-center text-green-600 mt-2 animate-pulse">
          {t.listening}
        </div>
      )}
    </div>
  );
};