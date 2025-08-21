"use client";

import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  fromUser: {
    id: string;
    name: string;
    surname: string;
    selectedAvatar: string;
    fullName: string;
  };
  toUser: {
    id: string;
    name: string;
    surname: string;
    selectedAvatar: string;
    fullName: string;
  };
  isFromMe: boolean;
}

interface ChatWindowProps {
  friendId: string;
  friendName: string;
  onClose: () => void;
}

export function ChatWindow({ friendId, friendName, onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/chat/get-messages?friendId=${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/chat/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toUserId: friendId,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Chat with {friendName}</h1>
              <p className="text-sm text-slate-400">Send messages and provide support</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/10 p-2 text-white transition-all hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" style={{ height: "calc(90vh - 140px)" }}>
          {messages.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/20">
                <MessageCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No messages yet</h3>
              <p className="text-slate-400">Start the conversation with {friendName}!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      message.isFromMe ? "bg-blue-600 text-white" : "bg-white/10 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`mt-1 text-xs ${message.isFromMe ? "text-blue-200" : "text-slate-400"}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-white/20 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-all hover:bg-purple-700 disabled:opacity-50"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
