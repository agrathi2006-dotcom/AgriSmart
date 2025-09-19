import { useState, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export const useSpeechRecognition = (language: string = 'en'): SpeechRecognitionResult => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = getLanguageCode(language);

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      setIsListening(false);
    };

    recognitionInstance.onerror = () => {
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, [language, isSupported]);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
};

function getLanguageCode(lang: string): string {
  const languageMap: Record<string, string> = {
    en: 'en-US',
    hi: 'hi-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    as: 'as-IN',
  };
  return languageMap[lang] || 'en-US';
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}