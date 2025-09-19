export class SpeechService {
  private synthesis: SpeechSynthesis
  private recognition: SpeechRecognition | null = null
  private voices: SpeechSynthesisVoice[] = []

  constructor() {
    this.synthesis = window.speechSynthesis
    this.initializeVoices()
    this.initializeSpeechRecognition()
  }

  private initializeVoices() {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices()
    }

    loadVoices()
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices
    }
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
    }
  }

  speak(text: string, language: string = 'en-US'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve()
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Find appropriate voice for the language
      const voice = this.findVoiceForLanguage(language)
      if (voice) {
        utterance.voice = voice
      }

      utterance.lang = language
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis.speak(utterance)
    })
  }

  private findVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    // Language mapping for better voice selection
    const languageMap: Record<string, string[]> = {
      'en': ['en-US', 'en-GB', 'en-AU'],
      'hi': ['hi-IN'],
      'te': ['te-IN'],
      'ta': ['ta-IN'],
      'kn': ['kn-IN'],
      'ml': ['ml-IN'],
      'bn': ['bn-IN'],
      'gu': ['gu-IN'],
      'mr': ['mr-IN'],
      'pa': ['pa-IN'],
      'or': ['or-IN'],
      'as': ['as-IN']
    }

    const targetLanguages = languageMap[language] || [language]
    
    for (const targetLang of targetLanguages) {
      const voice = this.voices.find(v => v.lang.startsWith(targetLang))
      if (voice) return voice
    }

    // Fallback to any voice containing the language code
    return this.voices.find(v => v.lang.includes(language.split('-')[0])) || null
  }

  listen(language: string = 'en-US'): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'))
        return
      }

      this.recognition.lang = language
      
      this.recognition.onresult = (event) => {
        const result = event.results[0][0].transcript
        resolve(result)
      }

      this.recognition.onerror = (error) => {
        reject(error)
      }

      this.recognition.onend = () => {
        // Recognition ended without result
      }

      this.recognition.start()
    })
  }

  stopSpeaking() {
    this.synthesis.cancel()
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window
  }

  isRecognitionSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
  }

  getAvailableLanguages(): string[] {
    const languages = new Set<string>()
    this.voices.forEach(voice => {
      languages.add(voice.lang)
    })
    return Array.from(languages).sort()
  }
}

export const speechService = new SpeechService()