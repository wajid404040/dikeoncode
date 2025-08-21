export interface Notification {
  id: string;
  type: "message" | "friend_request" | "emotion_alert" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  data?: any; // Additional data like sender ID, message content, etc.
  actionUrl?: string; // URL to navigate to when clicked
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private soundEnabled: boolean = true;
  private desktopNotificationsEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      this.loadNotifications();
      this.requestNotificationPermission();
      this.setupSound();
    }
  }

  // Request permission for desktop notifications
  private async requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      this.desktopNotificationsEnabled = permission === "granted";
    }
  }

  // Setup notification sound
  private setupSound() {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.notificationSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, "id" | "timestamp" | "isRead">) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    // Show desktop notification
    this.showDesktopNotification(newNotification);

    // Play sound
    if (this.soundEnabled) {
      this.notificationSound();
    }

    return newNotification;
  }

  // Show desktop notification
  private showDesktopNotification(notification: Notification) {
    if (!this.desktopNotificationsEnabled || Notification.permission !== "granted") return;

    const desktopNotification = new Notification(notification.title, {
      body: notification.message,
      icon: "/favicon.ico", // You can add a custom icon
      badge: "/favicon.ico",
      tag: notification.id,
      requireInteraction: notification.type === "emotion_alert", // Keep emotion alerts visible
    });

    // Handle click on desktop notification
    desktopNotification.onclick = () => {
      window.focus();
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl;
      }
      this.markAsRead(notification.id);
    };

    // Auto-close after 5 seconds (except for emotion alerts)
    if (notification.type !== "emotion_alert") {
      setTimeout(() => {
        desktopNotification.close();
      }, 5000);
    }
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach((n) => (n.isRead = true));
    this.saveNotifications();
    this.notifyListeners();
  }

  // Remove notification
  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  // Get notifications by type
  getNotificationsByType(type: Notification["type"]): Notification[] {
    return this.notifications.filter((n) => n.type === type);
  }

  // Add listener for notification changes
  addListener(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }

  // Save notifications to localStorage
  private saveNotifications() {
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", JSON.stringify(this.notifications));
    }
  }

  // Load notifications from localStorage
  private loadNotifications() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        try {
          this.notifications = JSON.parse(saved).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
        } catch (error) {
          console.error("Error loading notifications:", error);
        }
      }
    }
  }

  // Toggle sound
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("notificationSound", this.soundEnabled.toString());
    }
  }

  // Toggle desktop notifications
  async toggleDesktopNotifications() {
    if (Notification.permission === "granted") {
      this.desktopNotificationsEnabled = !this.desktopNotificationsEnabled;
    } else {
      const permission = await Notification.requestPermission();
      this.desktopNotificationsEnabled = permission === "granted";
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("desktopNotifications", this.desktopNotificationsEnabled.toString());
    }
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get notification sound function
  private notificationSound: () => void = () => {};
}

// Create singleton instance
const notificationService = new NotificationService();
export default notificationService;
