export interface TTSResponse {
  audioUrl: string;
  duration: number;
  success: boolean;
  error?: string;
}

interface Settings {
  selectedAvatar: string;
  gender: string;
  voiceProvider: string;
  selectedVoice: string;
  openaiVoice?: string;
  speechRate: number;
  speechPitch: number;
  animationIntensity?: number;
  lipSyncSensitivity?: number;
}

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;
  private settings: Settings = {
    selectedAvatar: "ala",
    gender: "female",
    voiceProvider: "browser",
    selectedVoice: "default",
    openaiVoice: "alloy",
    speechRate: 0.9,
    speechPitch: 1.0,
    animationIntensity: 0.8,
    lipSyncSensitivity: 0.7,
  };

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSettings();
      console.log("TTSService initialized with browser TTS");
    }
  }

  // Method to update settings from external source
  updateSettings(newSettings: Partial<Settings>) {
    this.settings = { ...this.settings, ...newSettings };
    console.log("TTSService settings updated:", this.settings);

    // Also save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("avatarSettings", JSON.stringify(this.settings));
    }
  }

  // Method to force reload settings from localStorage
  reloadSettings() {
    this.loadSettings();
    console.log("TTSService settings reloaded:", this.settings);
  }

  private loadSettings() {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("avatarSettings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsed };
        console.log("TTSService loaded settings:", this.settings);
      }
    }
  }

  // OpenAI TTS
  private async openaiTTS(text: string): Promise<TTSResponse> {
    try {
      console.log("Calling OpenAI TTS API...");

      const response = await fetch("/api/tts/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: this.settings.openaiVoice || "alloy",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "OpenAI TTS failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create audio element to get duration
      const audio = new Audio(audioUrl);
      const duration = await new Promise<number>((resolve) => {
        audio.addEventListener("loadedmetadata", () => resolve(audio.duration));
        audio.addEventListener("error", () => resolve(0));
      });

      return {
        audioUrl,
        duration,
        success: true,
      };
    } catch (error) {
      console.error("OpenAI TTS error:", error);
      return {
        audioUrl: "",
        duration: 0,
        success: false,
        error: error instanceof Error ? error.message : "OpenAI TTS failed",
      };
    }
  }

  // Enhanced browser TTS
  private async enhancedBrowserTTS(text: string): Promise<TTSResponse> {
    return new Promise((resolve) => {
      console.log("Starting enhanced browser TTS with text:", text);

      // Only cancel if actually speaking
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Get best available voice
      const voices = speechSynthesis.getVoices();
      console.log(
        "Available voices:",
        voices.map((v) => v.name)
      );

      const preferredVoices = [
        "Google UK English Female",
        "Google US English Female",
        "Samantha",
        "Victoria",
        "Alex",
        "Google UK English Male",
        "Google US English Male",
        "Karen",
        "Daniel",
        "Tessa",
        "Moira",
        "Fiona",
        "Fred",
        "Ralph",
      ];

      // Find the best available voice
      let selectedVoice = null;
      for (const preferredVoice of preferredVoices) {
        selectedVoice = voices.find(
          (voice) =>
            voice.name.includes(preferredVoice) ||
            voice.name.toLowerCase().includes("google") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("microsoft") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("daniel") ||
            voice.name.toLowerCase().includes("tessa") ||
            voice.name.toLowerCase().includes("moira") ||
            voice.name.toLowerCase().includes("fiona") ||
            voice.name.toLowerCase().includes("fred") ||
            voice.name.toLowerCase().includes("ralph")
        );
        if (selectedVoice) break;
      }

      // Use the best available voice or fallback
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("Using enhanced voice:", selectedVoice.name);
      } else if (voices.length > 0) {
        // Find any voice that sounds more natural
        const naturalVoices = voices.filter(
          (voice) =>
            !voice.name.toLowerCase().includes("microsoft") &&
            !voice.name.toLowerCase().includes("system") &&
            voice.lang.startsWith("en")
        );
        if (naturalVoices.length > 0) {
          utterance.voice = naturalVoices[0];
          console.log("Using natural voice:", naturalVoices[0].name);
        } else {
          utterance.voice = voices[0];
          console.log("Using fallback voice:", voices[0].name);
        }
      }

      // Apply settings
      utterance.rate = this.settings.speechRate;
      utterance.pitch = this.settings.speechPitch;
      utterance.volume = 1.0;

      console.log("Browser TTS settings applied:", {
        rate: utterance.rate,
        pitch: utterance.pitch,
        voice: utterance.voice?.name,
        text: text,
      });

      // Set up event handlers
      utterance.onstart = () => {
        console.log("Speech started for text:", text);
      };

      utterance.onend = () => {
        console.log("Speech ended for text:", text);
        this.isSpeaking = false;
        resolve({
          audioUrl: "",
          duration: text.length * 80,
          success: true,
        });
      };

      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        this.isSpeaking = false;
        // Treat 'interrupted' as success since it's often just a timing issue
        if (event.error === "interrupted") {
          console.log("Speech interrupted, treating as success");
          resolve({
            audioUrl: "",
            duration: text.length * 80,
            success: true,
          });
        } else {
          resolve({
            audioUrl: "",
            duration: 0,
            success: false,
            error: "Browser TTS failed: " + event.error,
          });
        }
      };

      // Start speaking
      console.log("Starting speech synthesis for text:", text);
      speechSynthesis.speak(utterance);
    });
  }

  // Main speak function - supports both browser and OpenAI TTS
  async speak(text: string): Promise<TTSResponse> {
    // If already speaking, don't start another
    if (this.isSpeaking) {
      console.log("TTS already in progress, skipping new request");
      return {
        audioUrl: "",
        duration: 0,
        success: false,
        error: "TTS already in progress",
      };
    }

    // Stop any current audio
    this.stop();

    // Choose voice provider based on settings
    if (this.settings.voiceProvider === "openai") {
      console.log("Using OpenAI TTS...");
      this.isSpeaking = true;
      try {
        const result = await this.openaiTTS(text);
        this.isSpeaking = false;
        return result;
      } catch (error) {
        this.isSpeaking = false;
        throw error;
      }
    } else {
      console.log("Using enhanced browser TTS...");
      this.isSpeaking = true;
      try {
        const result = await this.enhancedBrowserTTS(text);
        this.isSpeaking = false;
        return result;
      } catch (error) {
        this.isSpeaking = false;
        throw error;
      }
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    console.log("TTS stopped");
  }

  getVoiceQuality(): string {
    const voices = speechSynthesis.getVoices();
    const preferredVoices = [
      "Google UK English Female",
      "Google US English Female",
      "Samantha",
      "Victoria",
      "Alex",
      "Microsoft Zira",
      "Microsoft David",
      "Karen",
      "Daniel",
      "Tessa",
      "Moira",
      "Fiona",
      "Fred",
      "Ralph",
    ];

    const hasGoodVoice = voices.some((voice) =>
      preferredVoices.some(
        (preferred) =>
          voice.name.includes(preferred) ||
          voice.name.toLowerCase().includes("google") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("victoria") ||
          voice.name.toLowerCase().includes("microsoft") ||
          voice.name.toLowerCase().includes("karen") ||
          voice.name.toLowerCase().includes("daniel") ||
          voice.name.toLowerCase().includes("tessa") ||
          voice.name.toLowerCase().includes("moira") ||
          voice.name.toLowerCase().includes("fiona") ||
          voice.name.toLowerCase().includes("fred") ||
          voice.name.toLowerCase().includes("ralph")
      )
    );

    if (hasGoodVoice) {
      return "Enhanced browser voice available";
    } else if (voices.length > 0) {
      return "Standard browser voice available";
    } else {
      return "Basic browser voice available";
    }
  }

  getCurrentSettings(): Settings {
    return { ...this.settings };
  }

  initializeVoices() {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log(
        "Available voices:",
        voices.map((v) => `${v.name} (${v.lang})`)
      );

      if (voices.length === 0) {
        console.log("No voices available, retrying in 1 second...");
        setTimeout(loadVoices, 1000);
        return;
      }

      const preferredVoices = [
        "Google UK English Female",
        "Google US English Female",
        "Samantha",
        "Victoria",
        "Alex",
        "Microsoft Zira",
        "Microsoft David",
        "Karen",
        "Daniel",
        "Tessa",
        "Moira",
        "Fiona",
        "Fred",
        "Ralph",
      ];

      for (const preferredVoice of preferredVoices) {
        const found = voices.find(
          (voice) =>
            voice.name.includes(preferredVoice) ||
            voice.name.toLowerCase().includes("google") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("microsoft") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("daniel") ||
            voice.name.toLowerCase().includes("tessa") ||
            voice.name.toLowerCase().includes("moira") ||
            voice.name.toLowerCase().includes("fiona") ||
            voice.name.toLowerCase().includes("fred") ||
            voice.name.toLowerCase().includes("ralph")
        );
        if (found) {
          console.log("Found preferred voice:", found.name);
          break;
        }
      }
    };

    // Try to load voices immediately
    loadVoices();

    // Also listen for voiceschanged event
    speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export default new TTSService();
