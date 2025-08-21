"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check, Trash2, Settings } from "lucide-react";
import notificationService, { Notification as AppNotification } from "./NotificationService";

interface NotificationBellProps {
  onNotificationClick?: (notification: AppNotification) => void;
}

export function NotificationBell({ onNotificationClick }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationService.getNotifications());

    // Subscribe to notification changes
    const unsubscribe = notificationService.addListener((newNotifications) => {
      setNotifications(newNotifications);
    });

    return unsubscribe;
  }, []);

  const unreadCount = notificationService.getUnreadCount();

  const handleNotificationClick = (notification: AppNotification) => {
    notificationService.markAsRead(notification.id);
    setIsOpen(false);

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const removeNotification = (id: string) => {
    notificationService.removeNotification(id);
  };

  const clearAll = () => {
    notificationService.clearAll();
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "message":
        return "💬";
      case "friend_request":
        return "👥";
      case "emotion_alert":
        return "🚨";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 rounded-xl border-2 border-orange-500/40 bg-orange-600/20 px-4 py-2.5 text-orange-300 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-orange-600/30 hover:text-orange-200"
      >
        <Bell size={18} className="transition-transform duration-500 group-hover:scale-110" />
        <span className="text-sm font-semibold">Notifications</span>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-4 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={markAllAsRead}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 rounded-xl border border-white/20 bg-white/10 p-4">
              <h4 className="mb-3 text-sm font-semibold text-white">Notification Settings</h4>
              <div className="space-y-3">
                <button
                  onClick={() => notificationService.toggleSound()}
                  className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                >
                  <span>Sound</span>
                  <div
                    className={`h-3 w-6 rounded-full ${
                      notificationService.getNotifications().length > 0 ? "bg-green-500" : "bg-slate-500"
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full bg-white transition-transform ${
                        notificationService.getNotifications().length > 0 ? "translate-x-3" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </button>
                <button
                  onClick={() => notificationService.toggleDesktopNotifications()}
                  className="flex w-full items-center justify-between rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                >
                  <span>Desktop Notifications</span>
                  <div
                    className={`h-3 w-6 rounded-full ${
                      Notification.permission === "granted" ? "bg-green-500" : "bg-slate-500"
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full bg-white transition-transform ${
                        Notification.permission === "granted" ? "translate-x-3" : "translate-x-0"
                      }`}
                    ></div>
                  </div>
                </button>
                <button
                  onClick={clearAll}
                  className="flex w-full items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell size={32} className="mx-auto mb-2 text-slate-400" />
                <p className="text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group cursor-pointer rounded-xl border p-3 transition-all hover:bg-white/10 ${
                    notification.isRead ? "border-white/10 bg-white/5" : "border-orange-500/30 bg-orange-500/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-sm font-semibold ${notification.isRead ? "text-slate-300" : "text-white"}`}>
                        {notification.title}
                      </h4>
                      <p className="line-clamp-2 text-xs text-slate-400">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatTime(notification.timestamp)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={14} className="text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
