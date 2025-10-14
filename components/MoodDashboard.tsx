"use client";

import { useState } from "react";
import { MoodCheckIn } from "./MoodCheckIn";
import { MoodHistory } from "./MoodHistory";

export function MoodDashboard() {
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleMoodSubmit = () => {
    // Trigger a refresh of the mood history
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f9f4ed] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Mood Tracker</h1>
          <p className="text-xl text-gray-600">
            Track your daily emotions and see your mood journey over time
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Mood Check-in */}
          <div className="space-y-6">
            <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
            
            {/* Additional Mood Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <h3 className="text-xl font-semibold text-black mb-4">Mood Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">📊</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Track Progress</div>
                    <div className="text-sm text-gray-600">See how your mood changes over time</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-lg">💭</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Add Notes</div>
                    <div className="text-sm text-gray-600">Record thoughts and feelings</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg">🎯</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Set Goals</div>
                    <div className="text-sm text-gray-600">Work towards better emotional wellbeing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Mood History */}
          <div>
            <MoodHistory key={refreshHistory} />
          </div>
        </div>

        {/* Bottom Section - Tips and Resources */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
          <h3 className="text-xl font-semibold text-black mb-4">Wellness Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 text-2xl">🧘</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Mindfulness</h4>
              <p className="text-sm text-gray-600">
                Practice daily meditation or breathing exercises to improve your mood
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-2xl">🏃</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Physical Activity</h4>
              <p className="text-sm text-gray-600">
                Regular exercise can significantly boost your mood and energy levels
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-2xl">😴</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Quality Sleep</h4>
              <p className="text-sm text-gray-600">
                Aim for 7-9 hours of sleep to maintain emotional balance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
