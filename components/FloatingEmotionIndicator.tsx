"use client";

import { useEffect, useState } from "react";
// Local fallback type for emotion entries used by the indicator
interface Emotion {
  name: string;
  score: number;
}

interface FloatingEmotionIndicatorProps {
  currentEmotions: Emotion[];
  isVisible: boolean;
}

export default function FloatingEmotionIndicator({ currentEmotions, isVisible }: FloatingEmotionIndicatorProps) {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion | null>(null);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    if (currentEmotions.length > 0) {
      // Get the dominant emotion
      const dominant = currentEmotions.reduce((prev, current) => (prev.score > current.score ? prev : current));

      setCurrentEmotion(dominant);

      // Trigger pulse animation when emotion changes
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }
  }, [currentEmotions]);

  if (!isVisible || !currentEmotion) return null;

  const getEmotionData = (emotionName: string) => {
    const negativeEmotions = ["Anger", "Sadness", "Fear", "Disgust", "Confusion", "Horror", "Anxiety", "Stress"];
    const positiveEmotions = ["Joy", "Amusement", "Calmness", "Contentment", "Excitement", "Love", "Pride", "Relief"];

    if (negativeEmotions.includes(emotionName)) {
      return {
        emoji: "😔",
        color: "bg-red-500",
        borderColor: "border-red-400",
        textColor: "text-red-100",
        bgColor: "bg-red-500/20",
        pulseColor: "animate-pulse-red",
        glowClass: "emotion-glow-red",
      };
    } else if (positiveEmotions.includes(emotionName)) {
      return {
        emoji: "😊",
        color: "bg-green-500",
        borderColor: "border-green-400",
        textColor: "text-green-100",
        bgColor: "bg-green-500/20",
        pulseColor: "animate-pulse-green",
        glowClass: "emotion-glow-green",
      };
    } else {
      return {
        emoji: "😐",
        color: "bg-blue-500",
        borderColor: "border-blue-400",
        textColor: "text-blue-100",
        bgColor: "bg-blue-500/20",
        pulseColor: "animate-pulse-blue",
        glowClass: "emotion-glow-blue",
      };
    }
  };

  const emotionData = getEmotionData(currentEmotion.name);
  const confidence = (currentEmotion.score * 100).toFixed(0);

  return (
    <div className="fixed left-4 top-4 z-40">
      {/* Main Emotion Circle */}
      <div
        className={`relative h-20 w-20 rounded-full border-2 ${emotionData.borderColor} ${
          emotionData.bgColor
        } emotion-transition shadow-lg backdrop-blur-md transition-all duration-300 ${
          pulseAnimation ? "scale-110" : "scale-100"
        } ${emotionData.glowClass}`}
      >
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-3xl">{emotionData.emoji}</span>
        </div>

        {/* Confidence Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent">
          <div
            className="h-full w-full rounded-full border-4 border-current"
            style={{
              borderColor: "transparent",
              borderTopColor: emotionData.color.replace("bg-", "text-"),
              transform: `rotate(${(parseInt(confidence) / 100) * 360 - 90}deg)`,
              transition: "transform 0.5s ease-in-out",
            }}
          ></div>
        </div>

        {/* Confidence Text */}
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
          <span className="text-xs font-bold text-gray-800">{confidence}%</span>
        </div>
      </div>

      {/* Emotion Label */}
      <div className="mt-2 text-center">
        <div className={`rounded-lg ${emotionData.bgColor} px-3 py-1 backdrop-blur-md`}>
          <div className={`text-sm font-bold ${emotionData.textColor}`}>{currentEmotion.name}</div>
        </div>
      </div>

      {/* Emotion Intensity Bar */}
      <div className="mt-3 w-full">
        <div className="h-2 w-full rounded-full bg-white/20 backdrop-blur-md">
          <div
            className={`h-full rounded-full ${emotionData.color} transition-all duration-500 ease-out`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <div className="mt-1 text-center text-xs text-white/70">Intensity: {confidence}%</div>
      </div>

      {/* Quick Emotion Status */}
      <div className="mt-3 rounded-lg bg-black/40 p-2 backdrop-blur-md">
        <div className="text-center text-xs text-white/80">
          <div className="font-medium">Current State</div>
          <div className={`text-sm font-bold ${emotionData.textColor}`}>{currentEmotion.name}</div>
        </div>
      </div>
    </div>
  );
}
