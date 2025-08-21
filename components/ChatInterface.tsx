"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Mic, Send, Volume2, CheckCircle, AlertCircle, MessageSquare, Sparkles, MicOff } from "lucide-react";

export interface ChatInterfaceHandle {
  stopRecognition: () => void;
}

interface ChatInterfaceProps {
  onSpeak: (text: string) => void;
  onVoiceInput?: (transcript: string) => void;
  isSpeaking: boolean;
  isListening?: boolean;
  setIsListening?: (listening: boolean) => void;
  conversationHistory?: Array<{ role: string; content: string }>;
  settings?: any;
}

const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(function ChatInterface(
  { onSpeak, onVoiceInput, isSpeaking, isListening = false, setIsListening, conversationHistory = [], settings },
  ref
) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [voiceStatus, setVoiceStatus] = useState({
    quality: "Loading voices...",
    status: "checking",
    details: "",
  });

  const recognitionRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    stopRecognition: () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      setIsRecording(false);
      setIsListening?.(false);
    },
  }));

  // Auto-start voice input when isListening is set to true
  useEffect(() => {
    if (isListening && !isRecording && !isSpeaking) {
      console.log("Auto-starting voice input");
      setTimeout(() => {
        if (isListening && !isRecording && !isSpeaking) {
          console.log("Starting voice input after delay...");
          handleVoiceInput();
        }
      }, 500);
    }
  }, [isListening, isRecording, isSpeaking]);

  // Check voice quality and settings on component mount and when settings change
  useEffect(() => {
    const checkVoiceQuality = () => {
      import("./TTSService")
        .then(({ default: TTSService }) => {
          const quality = TTSService.getVoiceQuality();
          const currentSettings = TTSService.getCurrentSettings();

          let status = "checking";
          let details = "";

          if (quality.includes("Enhanced")) {
            status = "success";
            details = "Using enhanced browser voice";
          } else if (quality.includes("Standard")) {
            status = "warning";
            details = "Using standard browser voice";
          } else {
            status = "error";
            details = "Basic voice available";
          }

          setVoiceStatus({
            quality,
            status,
            details,
          });
        })
        .catch(() => {
          setVoiceStatus({
            quality: "Enhanced voice system available",
            status: "success",
            details: "Voice system ready",
          });
        });
    };

    checkVoiceQuality();
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ChatInterface handleSubmit called with text:", inputText.trim());
    if (inputText.trim()) {
      console.log("Calling onSpeak with text:", inputText.trim());
      onSpeak(inputText.trim());
      setInputText("");
    }
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsRecording(true);
      setIsListening?.(true);
      setRecognitionError(null);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log("Voice input transcript:", transcript);
        setInputText(transcript);

        // Send directly to AI conversation
        if (onVoiceInput) {
          console.log("Sending to AI conversation:", transcript);
          onVoiceInput(transcript);
        } else {
          console.log("Sending to text mode:", transcript);
          onSpeak(transcript);
        }

        setIsRecording(false);
        setIsListening?.(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);

        if (event.error === "network") {
          setRecognitionError("Network error: Please check your internet connection");
          setIsRecording(false);
          // Retry after network errors
          setTimeout(() => {
            if (!isSpeaking) {
              console.log("Retrying after network error...");
              setIsListening?.(true);
            }
          }, 5000);
          return;
        }

        if (event.error === "no-speech") {
          setRecognitionError("No speech detected. Please try again.");
          // Always retry for no-speech
          setTimeout(() => {
            if (!isSpeaking) {
              console.log("Retrying after no-speech...");
              setIsListening?.(true);
            }
          }, 2000);
        }

        if (event.error === "not-allowed") {
          setRecognitionError("Microphone access denied. Please allow microphone access.");
          setIsRecording(false);
          setIsListening?.(false);
          return;
        }

        if (event.error === "aborted") {
          console.log("Recognition aborted (likely by user or TTS)");
          setIsRecording(false);
          // Restart after TTS finishes
          setTimeout(() => {
            if (!isSpeaking) {
              console.log("Restarting after recognition aborted...");
              setIsListening?.(true);
            }
          }, 1000);
          return;
        }

        // For other errors, retry
        setTimeout(() => {
          if (!isSpeaking) {
            console.log("Retrying after error...");
            setIsListening?.(true);
          }
        }, 3000);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");

        // Always restart unless speaking
        if (!isSpeaking) {
          console.log("Recognition ended, restarting...");
          setTimeout(() => {
            if (!isSpeaking) {
              console.log("Restarting recognition...");
              setIsListening?.(true);
            }
          }, 1000);
        } else {
          setIsRecording(false);
          setIsListening?.(false);
        }
      };

      recognition.start();
    } else {
      setRecognitionError("Speech recognition not supported in this browser. Please use Chrome.");
      alert("Speech recognition not supported in this browser");
    }
  };

  const getStatusIcon = () => {
    switch (voiceStatus.status) {
      case "success":
        return <CheckCircle size={16} className="text-green-400" />;
      case "warning":
        return <AlertCircle size={16} className="text-yellow-400" />;
      case "error":
        return <AlertCircle size={16} className="text-red-400" />;
      default:
        return <Volume2 size={16} className="text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    switch (voiceStatus.status) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md shadow-purple-500/30">
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
          <div>
            <h2 className="mb-0.5 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
              Voice Chat with DIA
            </h2>
            <p className="text-xs font-medium text-slate-300">Talk to DIA naturally with voice or text</p>
          </div>
        </div>

        {/* Enhanced Voice Chat Mode Indicator */}
        <div className="mb-3 rounded-lg border border-green-500/25 bg-gradient-to-r from-green-500/15 to-emerald-500/15 p-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-r from-green-500 to-emerald-500">
              <Sparkles size={10} className="text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold text-green-300">Voice Chat Mode Active</span>
              <p className="mt-0.5 text-xs text-green-400/80">DIA will respond intelligently and speak back to you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Conversation Display */}
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
        {conversationHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700/50">
              <MessageSquare size={16} className="text-slate-500" />
            </div>
            <p className="mb-1 text-sm font-medium text-slate-300">Start a conversation with DIA</p>
            <p className="text-xs text-slate-500">Use voice input or type your message to begin</p>
          </div>
        ) : (
          conversationHistory.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                  message.role === "user"
                    ? "border border-purple-500/30 bg-gradient-to-r from-purple-600/25 to-pink-600/25 text-white"
                    : "border border-blue-500/30 bg-gradient-to-r from-blue-600/25 to-indigo-600/25 text-white"
                }`}
              >
                <div className="mb-1 text-xs font-medium text-slate-300">
                  {message.role === "user" ? "👤 You" : "🤖 DIA"}
                </div>
                <div className="text-sm leading-relaxed">{message.content}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Input Form */}
      <form onSubmit={handleSubmit} className="mt-auto space-y-3">
        {/* Enhanced Text Input */}
        <div className="group relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-md transition-all duration-500 group-hover:blur-lg"></div>
          <div className="relative flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask DIA anything..."
              disabled={isSpeaking || isRecording}
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all duration-300 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSpeaking || isRecording}
              className="group/btn rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2.5 text-white shadow-md shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} className="transition-transform duration-200 group-hover/btn:scale-110" />
            </button>
          </div>
        </div>

        {/* Enhanced Voice Input Button */}
        <button
          onClick={handleVoiceInput}
          disabled={isRecording || isSpeaking}
          className="group flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 font-semibold text-white shadow-md shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRecording ? (
            <>
              <div className="animate-pulse">
                <MicOff size={16} className="text-red-300" />
              </div>
              <span className="text-sm">Listening...</span>
            </>
          ) : (
            <>
              <Mic size={16} className="transition-transform duration-200 group-hover:scale-110" />
              <span className="text-sm">🎤 Talk to DIA</span>
            </>
          )}
        </button>

        {/* Enhanced Error Display */}
        {recognitionError && (
          <div className="mt-2 rounded-lg border border-red-500/40 bg-gradient-to-r from-red-500/20 to-red-600/20 p-2">
            <div className="mb-1.5 flex items-center gap-1.5">
              <AlertCircle size={12} className="text-red-400" />
              <p className="text-xs font-semibold text-red-300">Voice Recognition Error</p>
            </div>
            <p className="mb-1.5 text-xs text-red-400/90">{recognitionError}</p>
            <button
              onClick={() => setRecognitionError(null)}
              className="text-xs font-medium text-red-300 hover:text-red-200"
            >
              Dismiss Error
            </button>
          </div>
        )}
      </form>

      {/* Enhanced Status Indicator */}
      {isSpeaking && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400 shadow-md"></div>
            <span className="text-xs font-semibold text-white">DIA is responding...</span>
          </div>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ChatInterface;
