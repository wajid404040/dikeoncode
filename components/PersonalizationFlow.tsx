"use client";

import { useState } from "react";
import { Volume2, User, Sparkles, ArrowRight, Check } from "lucide-react";

interface PersonalizationFlowProps {
  onComplete: (selectedAvatar: string, selectedVoice: string) => Promise<void>;
  onSkip: () => void;
}

// Available avatars
const AVAILABLE_AVATARS = [
  { id: "avatar1", name: "Emma", description: "Warm and caring companion", image: "👩‍🦰" },
  { id: "avatar2", name: "Alex", description: "Professional and supportive", image: "👨‍💼" },
  { id: "avatar3", name: "Luna", description: "Gentle and understanding", image: "👩‍🦱" },
  { id: "avatar4", name: "Sam", description: "Friendly and approachable", image: "👨‍🦲" },
];

// Available OpenAI voices
const AVAILABLE_VOICES = [
  { id: "alloy", name: "Alloy", description: "A warm, friendly voice" },
  { id: "echo", name: "Echo", description: "A clear, confident voice" },
  { id: "fable", name: "Fable", description: "A gentle, storytelling voice" },
  { id: "onyx", name: "Onyx", description: "A deep, authoritative voice" },
  { id: "nova", name: "Nova", description: "A bright, energetic voice" },
  { id: "shimmer", name: "Shimmer", description: "A soft, soothing voice" },
];

export function PersonalizationFlow({ onComplete, onSkip }: PersonalizationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedAvatar) {
      setCurrentStep(2);
    }
  };

  const handleComplete = async () => {
    if (!selectedAvatar || !selectedVoice) return;

    setIsLoading(true);
    try {
      await onComplete(selectedAvatar, selectedVoice);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = currentStep === 1 ? selectedAvatar : selectedVoice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-purple-900/95 p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
            Personalize Your Experience
          </h1>
          <p className="text-slate-300">Let's make DIA truly yours</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              currentStep >= 1 ? "border-purple-500 bg-purple-500 text-white" : "border-white/20 text-white/40"
            }`}
          >
            {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
          </div>
          <div className={`h-1 w-16 rounded-full ${currentStep >= 2 ? "bg-purple-500" : "bg-white/20"}`}></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              currentStep >= 2 ? "border-purple-500 bg-purple-500 text-white" : "border-white/20 text-white/40"
            }`}
          >
            {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
          </div>
        </div>

        {/* Step 1: Avatar Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-semibold text-white">Choose Your AI Companion</h2>
              <p className="text-slate-400">Select the avatar that resonates with you</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.id)}
                  className={`group relative rounded-2xl border-2 p-6 text-center transition-all ${
                    selectedAvatar === avatar.id
                      ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25"
                      : "border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20"
                  }`}
                >
                  <div className="mb-3 text-4xl">{avatar.image}</div>
                  <div className="font-semibold text-white">{avatar.name}</div>
                  <div className="text-sm text-slate-300">{avatar.description}</div>

                  {selectedAvatar === avatar.id && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={onSkip}
                className="rounded-xl border border-white/20 bg-transparent px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Skip for now
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedAvatar}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Voice Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-semibold text-white">Choose Your AI Voice</h2>
              <p className="text-slate-400">Select the voice that feels most comforting</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {AVAILABLE_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceSelect(voice.id)}
                  className={`group relative rounded-2xl border-2 p-6 text-left transition-all ${
                    selectedVoice === voice.id
                      ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25"
                      : "border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-purple-400" />
                    <span className="font-semibold text-white">{voice.name}</span>
                  </div>
                  <div className="text-sm text-slate-300">{voice.description}</div>

                  {selectedVoice === voice.id && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="rounded-xl border border-white/20 bg-transparent px-6 py-3 text-white transition-all hover:bg-white/10"
              >
                Back
              </button>

              <button
                onClick={handleComplete}
                disabled={!selectedVoice || isLoading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
