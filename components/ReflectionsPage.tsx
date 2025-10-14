"use client";

import { useState, useEffect } from "react";

interface MoodEntry {
  id: string;
  mood: string;
  notes?: string;
  timestamp: string;
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

export function ReflectionsPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<MoodEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [searchQuery, moodEntries]);

  const fetchMoodEntries = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/mood/entries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMoodEntries(data.entries || []);
      }
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    if (!searchQuery.trim()) {
      setFilteredEntries(moodEntries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = moodEntries.filter(entry => {
      const moodLabel = getMoodLabel(entry.mood);
      const notes = entry.notes || "";
      
      return (
        moodLabel.toLowerCase().includes(query) ||
        notes.toLowerCase().includes(query) ||
        entry.mood.toLowerCase().includes(query)
      );
    });

    setFilteredEntries(filtered);
  };

  const getMoodLabel = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.label || mood;
  };

  const getMoodColor = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.color || "bg-gray-400";
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f4ed] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f4ed] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Reflections</h1>
          <p className="text-lg text-gray-600">
            Review your emotional journey and insights
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your reflections"
              className="w-full px-4 py-3 rounded-xl border border-orange-200 focus:border-orange-400 focus:outline-none text-black placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Mood Entries */}
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchQuery ? "No reflections found" : "No reflections yet"}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Start your emotional journey by checking in with your mood"
                }
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Mood Tag */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getMoodColor(entry.mood)}`}>
                      {getMoodLabel(entry.mood)}
                    </div>
                    
                    {/* Date and Time */}
                    <div className="text-sm text-gray-500">
                      {formatDate(entry.timestamp)} • {formatTime(entry.timestamp)}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {entry.notes && (
                  <div className="text-gray-700 leading-relaxed">
                    {entry.notes}
                  </div>
                )}

                {!entry.notes && (
                  <div className="text-gray-500 italic">
                    No additional notes for this reflection
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {moodEntries.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold text-black mb-4">Your Reflection Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{moodEntries.length}</div>
                <div className="text-sm text-gray-600">Total Reflections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {new Set(moodEntries.map(e => e.mood)).size}
                </div>
                <div className="text-sm text-gray-600">Different Moods</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {moodEntries.filter(e => e.notes && e.notes.trim()).length}
                </div>
                <div className="text-sm text-gray-600">With Notes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
