"use client";

import { useState, useEffect } from "react";

interface MoodEntry {
  id: string;
  mood: string;
  timestamp: string;
  notes?: string;
}

interface MoodHistoryProps {
  className?: string;
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

const moodValues = {
  happy: 10,
  excited: 9,
  confident: 8,
  grateful: 7,
  calm: 6,
  neutral: 5,
  tired: 4,
  anxious: 3,
  overwhelmed: 2,
  sad: 1,
  angry: 0,
  stressed: 1,
};

export function MoodHistory({ className = "" }: MoodHistoryProps) {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");

  useEffect(() => {
    fetchMoodHistory();
  }, [timeRange]);

  const fetchMoodHistory = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/mood/history?range=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMoodHistory(data.moods || []);
      }
    } catch (error) {
      console.error("Error fetching mood history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.emoji || "😐";
  };

  const getMoodColor = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.color || "bg-gray-400";
  };

  const getMoodValue = (mood: string) => {
    return moodValues[mood as keyof typeof moodValues] || 5;
  };

  const getMoodLabel = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.label || mood;
  };

  // Generate chart data
  const generateChartData = () => {
    const days = timeRange === "7d" ? 7 : 30;
    const chartData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayMoods = moodHistory.filter(entry => 
        entry.timestamp.startsWith(dateStr)
      );
      
      const avgMood = dayMoods.length > 0 
        ? dayMoods.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / dayMoods.length
        : null;
      
      chartData.push({
        date: dateStr,
        mood: avgMood,
        count: dayMoods.length,
        latestMood: dayMoods[dayMoods.length - 1]?.mood
      });
    }
    
    return chartData;
  };

  const chartData = generateChartData();
  const maxMood = 10;
  const minMood = 0;

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-orange-100 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-orange-100 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-black">Mood Journey</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === "7d" 
                ? "bg-orange-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === "30d" 
                ? "bg-orange-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Mood Trend Chart */}
      <div className="mb-6">
        <div className="h-48 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>Confident</span>
            <span>Calm</span>
            <span>Stressed</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2].map(i => (
                <div key={i} className="border-t border-gray-100"></div>
              ))}
            </div>
            
            {/* Mood line */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                fill="none"
                stroke="#ff7b00"
                strokeWidth="3"
                points={chartData.map((point, index) => {
                  if (point.mood === null) return "";
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - ((point.mood - minMood) / (maxMood - minMood)) * 100;
                  return `${x},${y}`;
                }).filter(Boolean).join(" ")}
              />
              
              {/* Data points */}
              {chartData.map((point, index) => {
                if (point.mood === null) return null;
                const x = (index / (chartData.length - 1)) * 100;
                const y = 100 - ((point.mood - minMood) / (maxMood - minMood)) * 100;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#ff7b00"
                    className="hover:r-6 transition-all"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {chartData.map((point, index) => {
              if (index % Math.ceil(chartData.length / 5) === 0) {
                const date = new Date(point.date);
                return (
                  <span key={index}>
                    {date.getDate()}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>

      {/* Mood Score */}
      <div className="bg-orange-500 text-white rounded-xl p-4 text-center">
        <div className="text-3xl font-bold">
          {moodHistory.length}
        </div>
        <div className="text-orange-100">
          {timeRange === "7d" ? "Check-ins this week" : "Check-ins this month"}
        </div>
      </div>

      {/* Recent Moods */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-black mb-3">Recent Check-ins</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {moodHistory.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <div className={`w-8 h-8 rounded-full ${getMoodColor(entry.mood)} flex items-center justify-center text-sm`}>
                {getMoodEmoji(entry.mood)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">{getMoodLabel(entry.mood)}</div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
