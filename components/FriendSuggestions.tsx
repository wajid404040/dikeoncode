"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Sparkles, Heart, MessageCircle, Star } from "lucide-react";

interface SuggestedUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  selectedAvatar: string;
  fullName: string;
  commonInterests: string[];
  matchScore: number;
  isOnline: boolean;
  lastSeen: string | null;
}

interface FriendSuggestionsProps {
  onClose: () => void;
  onSendRequest: (userId: string) => void;
}

export function FriendSuggestions({ onClose, onSendRequest }: FriendSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high_match" | "online">("all");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/friends/suggestions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/friends/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toUserId: userId }),
      });

      if (response.ok) {
        // Remove from suggestions after sending request
        setSuggestions((prev) => prev.filter((s) => s.id !== userId));

        // Show success notification
        import("./NotificationService").then(({ default: notificationService }) => {
          notificationService.addNotification({
            type: "friend_request",
            title: "Friend Request Sent",
            message: "Your friend request has been sent successfully!",
          });
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const getFilteredSuggestions = () => {
    switch (filter) {
      case "high_match":
        return suggestions.filter((s) => s.matchScore >= 0.7);
      case "online":
        return suggestions.filter((s) => s.isOnline);
      default:
        return suggestions;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-400";
    if (score >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  const getMatchScoreIcon = (score: number) => {
    if (score >= 0.8) return <Heart className="h-4 w-4 text-green-400" />;
    if (score >= 0.6) return <Star className="h-4 w-4 text-yellow-400" />;
    return <Sparkles className="h-4 w-4 text-orange-400" />;
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return "Never";

    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Finding friends for you...</p>
        </div>
      </div>
    );
  }

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Friend Suggestions</h1>
              <p className="text-slate-400">Discover people you might connect with</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
          >
            Close
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 border-b border-white/10 bg-white/5 p-4">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
              filter === "all"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users size={16} />
            <span className="text-sm font-medium">All ({suggestions.length})</span>
          </button>
          <button
            onClick={() => setFilter("high_match")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
              filter === "high_match"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Heart size={16} />
            <span className="text-sm font-medium">High Match</span>
          </button>
          <button
            onClick={() => setFilter("online")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
              filter === "online"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MessageCircle size={16} />
            <span className="text-sm font-medium">Online Now</span>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
          {filteredSuggestions.length === 0 ? (
            <div className="py-12 text-center">
              <Sparkles size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="mb-2 text-xl font-semibold text-white">No suggestions found</h3>
              <p className="text-slate-400">
                {filter === "high_match"
                  ? "No high-match users found. Try the 'All' filter to see more suggestions."
                  : filter === "online"
                  ? "No users are currently online. Check back later!"
                  : "We're still learning about your preferences. Check back soon for personalized suggestions!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSuggestions.map((user) => (
                <div
                  key={user.id}
                  className="group rounded-xl border border-white/20 bg-white/10 p-4 transition-all hover:bg-white/20"
                >
                  {/* User Info Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                          {user.name.charAt(0)}
                          {user.surname.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                            user.isOnline ? "bg-green-500" : "bg-slate-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.fullName}</h3>
                        <p className="text-sm text-slate-400">
                          {user.isOnline ? "Online" : `Last seen ${formatLastSeen(user.lastSeen)}`}
                        </p>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-2">
                      {getMatchScoreIcon(user.matchScore)}
                      <span className={`text-sm font-semibold ${getMatchScoreColor(user.matchScore)}`}>
                        {Math.round(user.matchScore * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Common Interests */}
                  {user.commonInterests.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium text-slate-300">Common Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.commonInterests.map((interest, index) => (
                          <span key={index} className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendRequest(user.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-pink-700"
                    >
                      <UserPlus size={16} />
                      Add Friend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
