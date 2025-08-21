"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, MessageCircle, AlertTriangle, Check, X, Clock, Sparkles } from "lucide-react";

interface Friend {
  id: string;
  name: string;
  surname: string;
  email: string;
  isOnline: boolean;
  lastSeen: string | null;
  selectedAvatar: string;
  fullName: string;
}

interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    selectedAvatar: string;
    fullName: string;
  };
  type: "sent" | "received";
}

interface FriendsPanelProps {
  onClose: () => void;
  onOpenChat: (friendId: string, friendName: string) => void;
}

export function FriendsPanel({ onClose, onOpenChat }: FriendsPanelProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/friends/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends);
        setSentRequests(data.sentRequests);
        setReceivedRequests(data.receivedRequests);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (email: string) => {
    if (!email.trim()) return;

    setSendingRequest(true);
    try {
      // First, find the user by email
      const token = localStorage.getItem("auth-token");
      const findResponse = await fetch(`/api/users/find?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (findResponse.ok) {
        const userData = await findResponse.json();

        // Send friend request
        const requestResponse = await fetch("/api/friends/send-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ toUserId: userData.user.id }),
        });

        if (requestResponse.ok) {
          setSearchEmail("");
          fetchFriends(); // Refresh the list
        } else {
          const errorData = await requestResponse.json();
          alert(errorData.message || "Failed to send friend request");
        }
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    } finally {
      setSendingRequest(false);
    }
  };

  const respondToRequest = async (requestId: string, action: "ACCEPTED" | "REJECTED") => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/friends/respond-request", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        fetchFriends(); // Refresh the list
      }
    } catch (error) {
      console.error("Error responding to request:", error);
    }
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
          <p className="text-white">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Friends</h1>
              <p className="text-slate-400">Manage your connections</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {/* Add Friend Section */}
          <div className="mb-8 rounded-xl border border-white/20 bg-white/10 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Add New Friend</h2>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter friend's email address"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={() => sendFriendRequest(searchEmail)}
                disabled={sendingRequest || !searchEmail.trim()}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-all hover:bg-purple-700 disabled:opacity-50"
              >
                {sendingRequest ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Add Friend
              </button>
            </div>
          </div>

          {/* Received Friend Requests */}
          {receivedRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-white">Friend Requests ({receivedRequests.length})</h2>
              <div className="space-y-3">
                {receivedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                        {request.user.name.charAt(0)}
                        {request.user.surname.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{request.user.fullName}</h3>
                        <p className="text-sm text-slate-400">{request.user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToRequest(request.id, "ACCEPTED")}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-white transition-all hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => respondToRequest(request.id, "REJECTED")}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white transition-all hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sent Friend Requests */}
          {sentRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-white">Sent Requests ({sentRequests.length})</h2>
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                        {request.user.name.charAt(0)}
                        {request.user.surname.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{request.user.fullName}</h3>
                        <p className="text-sm text-slate-400">{request.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">Your Friends ({friends.length})</h2>
            {friends.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/20">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">No friends yet</h3>
                <p className="text-slate-400">Add some friends to start chatting and sharing support!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 transition-all hover:bg-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                          {friend.name.charAt(0)}
                          {friend.surname.charAt(0)}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                            friend.isOnline ? "bg-green-500" : "bg-slate-400"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{friend.fullName}</h3>
                        <p className="text-sm text-slate-400">
                          {friend.isOnline ? "Online" : `Last seen ${formatLastSeen(friend.lastSeen)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onOpenChat(friend.id, friend.fullName)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white transition-all hover:bg-blue-700"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
