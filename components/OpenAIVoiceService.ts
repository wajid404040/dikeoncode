export class OpenAIVoiceService {
  private static instance: OpenAIVoiceService;
  private apiKey: string;
  private isListening: boolean = false;
  private recognition: any = null;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    this.initializeSpeechRecognition();
  }

  public static getInstance(): OpenAIVoiceService {
    if (!OpenAIVoiceService.instance) {
      OpenAIVoiceService.instance = new OpenAIVoiceService();
    }
    return OpenAIVoiceService.instance;
  }

  private initializeSpeechRecognition() {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";
    }
  }

  // Speech Synthesis using OpenAI TTS
  async speakText(
    text: string,
    voice: string = "alloy",
    speed: number = 1.0
  ): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1",
          input: text,
          voice: voice,
          speed: speed,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return { success: true, audioUrl };
    } catch (error) {
      console.error("OpenAI TTS error:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Speech Recognition
  startListening(onResult: (text: string) => void, onError?: (error: string) => void): boolean {
    if (!this.recognition) {
      onError?.("Speech recognition not supported");
      return false;
    }

    if (this.isListening) {
      return false;
    }

    this.isListening = true;

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
    return true;
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Get available voices
  getAvailableVoices() {
    return [
      { id: "alloy", name: "Alloy", description: "A warm, friendly voice" },
      { id: "echo", name: "Echo", description: "A clear, confident voice" },
      { id: "fable", name: "Fable", description: "A gentle, storytelling voice" },
      { id: "onyx", name: "Onyx", description: "A deep, authoritative voice" },
      { id: "nova", name: "Nova", description: "A bright, energetic voice" },
      { id: "shimmer", name: "Shimmer", description: "A soft, soothing voice" },
    ];
  }

  // Update API key
  updateApiKey(newApiKey: string): void {
    this.apiKey = newApiKey;
  }
}

export default OpenAIVoiceService;
