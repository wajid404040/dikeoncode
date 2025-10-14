"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MessageCircle, 
  Heart, 
  Clock, 
  Star,
  Filter,
  MoreVertical,
  Send,
  Check,
  X,
  AlertCircle,
  Smile,
  Frown,
  Meh,
  Activity,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Camera,
  Video,
  Mic,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";

interface Friend {
  id: string;
  name: string;
  surname: string;
  email: string;
  selectedAvatar?: string;
  fullName: string;
  isOnline: boolean;
  lastSeen: string | null;
  mood?: string;
  status?: string;
  mutualFriends?: number;
  joinedDate?: string;
  location?: string;
  bio?: string;
}

interface FriendRequest {
  id: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    selectedAvatar?: string;
    fullName: string;
  };
  type: "sent" | "received";
  createdAt: string;
}

interface FriendSuggestion {
  id: string;
  name: string;
  surname: string;
  email: string;
  selectedAvatar?: string;
  fullName: string;
  mutualFriends: number;
  reason: string;
}

export function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "online" | "requests" | "suggestions">("all");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendSuggestions, setFriendSuggestions] = useState<FriendSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [addFriendEmail, setAddFriendEmail] = useState("");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [sendingSupport, setSendingSupport] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, content: string, senderId: string, timestamp: string}>>([]);

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/friends/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
        setFriendRequests([...(data.sentRequests || []), ...(data.receivedRequests || [])]);
      }
    } catch (error) {
      console.error("Error fetching friends data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!addFriendEmail.trim()) return;

    setSendingRequest(true);
    try {
      const token = localStorage.getItem("auth-token");
      
      // Find user by email
      const findResponse = await fetch(`/api/users/find?email=${encodeURIComponent(addFriendEmail)}`, {
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
          setAddFriendEmail("");
          setShowAddFriend(false);
          fetchFriendsData();
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
        fetchFriendsData();
      }
    } catch (error) {
      console.error("Error responding to request:", error);
    }
  };

  const openChat = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowChatWindow(true);
    setChatMessages([]); // Clear previous messages
    fetchChatHistory(friend.id);
  };

  const fetchChatHistory = async (friendId: string) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/chat/get-messages?friendId=${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedFriend || !chatMessage.trim()) return;

    setSendingMessage(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/chat/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: selectedFriend.id,
          content: chatMessage.trim(),
        }),
      });

      if (response.ok) {
        const newMessage = {
          id: Date.now().toString(),
          content: chatMessage.trim(),
          senderId: "current-user", // You might want to get this from auth context
          timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, newMessage]);
        setChatMessage("");
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openSupport = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowSupportModal(true);
  };

  const sendSupportMessage = async () => {
    if (!selectedFriend || !supportMessage.trim()) return;

    setSendingSupport(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/emotions/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: selectedFriend.id,
          emotion: "support_request",
          intensity: 0.8,
          message: supportMessage.trim(),
        }),
      });

      if (response.ok) {
        setSupportMessage("");
        setShowSupportModal(false);
        setSelectedFriend(null);
        alert("Support message sent successfully!");
      } else {
        alert("Failed to send support message");
      }
    } catch (error) {
      console.error("Error sending support message:", error);
      alert("Failed to send support message");
    } finally {
      setSendingSupport(false);
    }
  };

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "happy": return <Smile className="w-4 h-4 text-yellow-500" />;
      case "sad": return <Frown className="w-4 h-4 text-blue-500" />;
      case "anxious": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return "Never";
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const filteredFriends = friends.filter(friend => 
    friend.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = friends.filter(friend => friend.isOnline);
  const receivedRequests = friendRequests.filter(req => req.type === "received");
  const sentRequests = friendRequests.filter(req => req.type === "sent");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f4ed] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f4ed] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">My Friends</h1>
              <p className="text-lg text-gray-600">
                Connect with your emotional support network
              </p>
            </div>
            <button
              onClick={() => setShowAddFriend(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add Friend
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{friends.length}</div>
                <div className="text-sm text-gray-600">Total Friends</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{onlineFriends.length}</div>
                <div className="text-sm text-gray-600">Online Now</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{receivedRequests.length}</div>
                <div className="text-sm text-gray-600">Pending Requests</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{sentRequests.length}</div>
                <div className="text-sm text-gray-600">Sent Requests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
              />
            </div>
            <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: "all", label: "All Friends", count: friends.length },
            { id: "online", label: "Online", count: onlineFriends.length },
            { id: "requests", label: "Requests", count: receivedRequests.length },
            { id: "suggestions", label: "Suggestions", count: friendSuggestions.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "all" && filteredFriends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-semibold">
                      {friend.name[0]}{friend.surname[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.isOnline ? "online" : "offline")}`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{friend.fullName}</h3>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last seen {formatLastSeen(friend.lastSeen)}</span>
                </div>

                {friend.mood && (
                  <div className="flex items-center gap-2 text-sm">
                    {getMoodIcon(friend.mood)}
                    <span className="text-gray-600">Feeling {friend.mood}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => openChat(friend)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button 
                    onClick={() => openSupport(friend)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Support
                  </button>
                </div>
              </div>
            </div>
          ))}

          {activeTab === "online" && onlineFriends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-semibold">
                    {friend.name[0]}{friend.surname[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-black">{friend.fullName}</h3>
                  <p className="text-sm text-green-600">Online now</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => openChat(friend)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </button>
                <button 
                  onClick={() => openSupport(friend)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  Support
                </button>
              </div>
            </div>
          ))}

          {activeTab === "requests" && receivedRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-semibold">
                  {request.user.name[0]}{request.user.surname[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-black">{request.user.fullName}</h3>
                  <p className="text-sm text-gray-500">{request.user.email}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => respondToRequest(request.id, "ACCEPTED")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button
                  onClick={() => respondToRequest(request.id, "REJECTED")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            </div>
          ))}

          {activeTab === "suggestions" && (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No suggestions yet</h3>
              <p className="text-gray-500">We'll suggest friends based on your connections</p>
            </div>
          )}
        </div>

        {/* Add Friend Modal */}
        {showAddFriend && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-black mb-4">Add Friend</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={addFriendEmail}
                    onChange={(e) => setAddFriendEmail(e.target.value)}
                    placeholder="Enter friend's email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddFriend(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendFriendRequest}
                    disabled={sendingRequest || !addFriendEmail.trim()}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingRequest ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Window */}
        {showChatWindow && selectedFriend && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-semibold">
                    {selectedFriend.name[0]}{selectedFriend.surname[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">{selectedFriend.fullName}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedFriend.isOnline ? "Online" : `Last seen ${formatLastSeen(selectedFriend.lastSeen)}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowChatWindow(false);
                    setSelectedFriend(null);
                    setChatMessage("");
                    setChatMessages([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Start a conversation with {selectedFriend.name}</p>
                    <p className="text-sm">Messages will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.senderId === "current-user"
                              ? "bg-orange-500 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === "current-user" ? "text-orange-100" : "text-gray-500"
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                    disabled={sendingMessage}
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={sendingMessage || !chatMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {sendingMessage ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Modal */}
        {showSupportModal && selectedFriend && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-400 rounded-xl flex items-center justify-center text-white font-semibold">
                  {selectedFriend.name[0]}{selectedFriend.surname[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black">Send Support</h3>
                  <p className="text-sm text-gray-500">to {selectedFriend.fullName}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Message
                  </label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Let them know you're here for them..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none resize-none"
                  />
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-700">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm font-medium">Emotional Support Alert</span>
                  </div>
                  <p className="text-sm text-orange-600 mt-1">
                    This will send a notification to {selectedFriend.name} that you're reaching out to offer support.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSupportModal(false);
                      setSelectedFriend(null);
                      setSupportMessage("");
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendSupportMessage}
                    disabled={sendingSupport || !supportMessage.trim()}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingSupport ? "Sending..." : "Send Support"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
