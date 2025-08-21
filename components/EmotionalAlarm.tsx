"use client";

import { useEffect, useState, useRef } from "react";
import { AlertTriangle, X, Heart, Shield, MessageCircle } from "lucide-react";
import { EmotionalIntervention } from "./EmotionalInterventionService";

interface EmotionalAlarmProps {
  intervention: EmotionalIntervention | null;
  isActive: boolean;
  onDismiss: () => void;
  onIntervene: () => void;
}

export default function EmotionalAlarm({ intervention, isActive, onDismiss, onIntervene }: EmotionalAlarmProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [alarmSound, setAlarmSound] = useState<HTMLAudioElement | null>(null);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize alarm sound
  useEffect(() => {
    // Create a simple alarm sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    setAlarmSound(oscillator as any);
  }, []);

  // Handle alarm activation
  useEffect(() => {
    if (isActive && intervention) {
      setIsVisible(true);
      setPulseAnimation(true);

      // Play alarm sound
      if (alarmSound) {
        try {
          // For Web Audio API, we need to create a new oscillator each time
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // Different alarm patterns based on severity
          switch (intervention.severity) {
            case "high":
              // High urgency: rapid beeping
              oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
              oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.3);
              break;
            case "medium":
              // Medium urgency: moderate beeping
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
              oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
              oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
              break;
            case "low":
              // Low urgency: gentle beeping
              oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
              oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.3);
              break;
          }

          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
          console.log("Audio playback failed:", error);
        }
      }

      // Auto-dismiss after 10 seconds for low severity
      if (intervention.severity === "low") {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          setPulseAnimation(false);
        }, 10000);
      }
    } else {
      setIsVisible(false);
      setPulseAnimation(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isActive, intervention, alarmSound]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isVisible || !intervention) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-600 border-red-500";
      case "medium":
        return "bg-orange-600 border-orange-500";
      case "low":
        return "bg-yellow-600 border-yellow-500";
      default:
        return "bg-blue-600 border-blue-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-6 w-6 text-white" />;
      case "medium":
        return <Shield className="h-6 w-6 text-white" />;
      case "low":
        return <Heart className="h-6 w-6 text-white" />;
      default:
        return <MessageCircle className="h-6 w-6 text-white" />;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return "IMMEDIATE ATTENTION REQUIRED";
      case "moderate":
        return "ATTENTION NEEDED";
      case "gentle":
        return "GENTLE SUPPORT OFFERED";
      default:
        return "SUPPORT AVAILABLE";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Alarm Modal */}
      <div
        className={`relative mx-4 w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${
          pulseAnimation ? "scale-105" : "scale-100"
        }`}
      >
        {/* Header with severity indicator */}
        <div className={`${getSeverityColor(intervention.severity)} relative p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getSeverityIcon(intervention.severity)}
              <div>
                <h2 className="text-xl font-bold">Emotional Alert</h2>
                <p className="text-sm opacity-90">{getUrgencyText(intervention.urgency)}</p>
              </div>
            </div>
            <button onClick={onDismiss} className="rounded-full p-2 transition-colors hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Detected Emotion: {intervention.dominantEmotion}
            </h3>
            <p className="leading-relaxed text-gray-600">{intervention.response}</p>
          </div>

          {/* Follow-up Actions */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-gray-700">Suggested Actions:</h4>
            <div className="space-y-2">
              {intervention.followUpActions.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onIntervene}
              className={`flex-1 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
                intervention.severity === "high"
                  ? "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl"
                  : intervention.severity === "medium"
                  ? "bg-orange-600 text-white shadow-lg hover:bg-orange-700 hover:shadow-xl"
                  : "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
              }`}
            >
              {intervention.severity === "high"
                ? "🚨 IMMEDIATE HELP"
                : intervention.severity === "medium"
                ? "🛡️ SUPPORT NOW"
                : "💙 TALK TO ME"}
            </button>

            {intervention.severity !== "high" && (
              <button
                onClick={onDismiss}
                className="rounded-lg border border-gray-300 px-4 py-3 text-gray-600 transition-colors hover:bg-gray-50"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {/* Pulse animation indicator */}
        {pulseAnimation && (
          <div className="pointer-events-none absolute inset-0 animate-ping rounded-2xl border-4 border-red-400 opacity-20"></div>
        )}
      </div>
    </div>
  );
}
