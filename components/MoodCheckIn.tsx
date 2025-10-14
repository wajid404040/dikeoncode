"use client";

import { useState, useEffect } from "react";

interface MoodEntry {
  id: string;
  mood: string;
  timestamp: Date;
  notes?: string;
}

interface MoodCheckInProps {
  onMoodSubmit?: (mood: string, notes?: string) => void;
}

const moodOptions = [
  { value: "happy", label: "Happy", emoji: "😊", color: "bg-yellow-400" },
  { value: "excited", label: "Excited", emoji: "🤩", color: "bg-orange-400" },
  { value: "calm", label: "Calm", emoji: "😌", color: "bg-green-400" },
  { value: "confident", label: "Confident", emoji: "💪", color: "bg-blue-400" },
  { value: "grateful", label: "Grateful", emoji: "🙏", color: "bg-purple-400" },
  { value: "neutral", label: "Neutral", emoji: "😐", color: "bg-gray-400" },
  { value: "tired", label: "Tired", emoji: "😴", color: "bg-indigo-400" },
  { value: "anxious", label: "Anxious", emoji: "😰", color: "bg-red-400" },
  { value: "overwhelmed", label: "Overwhelmed", emoji: "😵", color: "bg-pink-400" },
  { value: "sad", label: "Sad", emoji: "😢", color: "bg-blue-600" },
  { value: "angry", label: "Angry", emoji: "😠", color: "bg-red-600" },
  { value: "stressed", label: "Stressed", emoji: "😤", color: "bg-orange-600" },
];

export function MoodCheckIn({ onMoodSubmit }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [todayMood, setTodayMood] = useState<string>("");

  // Check if user has already checked in today
  useEffect(() => {
    checkTodayMood();
  }, []);

  const checkTodayMood = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/mood/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.mood) {
          setHasCheckedInToday(true);
          setTodayMood(data.mood);
        }
      }
    } catch (error) {
      console.error("Error checking today's mood:", error);
    }
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/mood/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood: selectedMood,
          notes: notes.trim() || undefined,
        }),
      });

      if (response.ok) {
        setHasCheckedInToday(true);
        setTodayMood(selectedMood);
        setSelectedMood("");
        setNotes("");
        onMoodSubmit?.(selectedMood, notes);
      } else {
        console.error("Failed to submit mood");
      }
    } catch (error) {
      console.error("Error submitting mood:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasCheckedInToday) {
    const currentMood = moodOptions.find(m => m.value === todayMood);
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
        <h3 className="text-2xl font-semibold text-black mb-4">Today's Mood</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full ${currentMood?.color} flex items-center justify-center text-3xl`}>
            {currentMood?.emoji}
          </div>
          <div>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
              {currentMood?.label}
            </div>
            <p className="text-gray-600 mt-1">You've checked in today!</p>
          </div>
        </div>
        <button
          onClick={() => setHasCheckedInToday(false)}
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          Update mood
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
      <h3 className="text-2xl font-semibold text-black mb-6">How are you feeling today?</h3>
      
      {/* Mood Selection Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {moodOptions.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedMood === mood.value
                ? "border-orange-400 bg-orange-50 scale-105"
                : "border-gray-200 hover:border-orange-200 hover:bg-orange-50"
            }`}
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className="text-sm font-medium text-gray-700">{mood.label}</div>
          </button>
        ))}
      </div>

      {/* Notes Section */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Any thoughts or notes? (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Share what's on your mind..."
          className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:border-orange-400 focus:outline-none"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleMoodSubmit}
        disabled={!selectedMood || isLoading}
        className="w-full bg-[#ff7b00] text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors duration-200"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Saving mood...</span>
          </div>
        ) : (
          "Check In"
        )}
      </button>
    </div>
  );
}
