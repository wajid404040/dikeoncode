"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import AvatarScene from "../components/AvatarScene";
import ChatInterface, { ChatInterfaceHandle } from "../components/ChatInterface";
import SettingsPanel from "../components/SettingsPanel";
import EmotionalMonitor from "../components/EmotionalMonitor";
import EmotionalAlarm from "../components/EmotionalAlarm";
import OpenAIVoiceService from "../components/OpenAIVoiceService";
import { AdminDashboard } from "../components/AdminDashboard";
import { FriendsPanel } from "../components/FriendsPanel";
import { ChatWindow } from "../components/ChatWindow";
import { NotificationBell } from "../components/NotificationBell";

import FloatingEmotionIndicator from "../components/FloatingEmotionIndicator";
import {
  Settings,
  Sparkles,
  MessageCircle,
  User,
  Eye,
  Heart,
  Camera,
  Activity,
  Zap,
  Brain,
  Mic,
  Volume2,
  Monitor,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Users,
  Shield,
  Star,
  Award,
  Info,
  HelpCircle,
  BookOpen,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Maximize2,
  Minimize2,
  VolumeX,
  Volume1,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  BatteryCharging,
  Power,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  Crown,
  Trophy,
  Medal,
  Gift,
  Package,
  Box,
  Archive,
  Folder,
  File,
  Image,
  Music,
  Film,
  Headphones,
  Speaker,
  Radio,
  Tv,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Database,
  Cloud,
  Globe,
  Map,
  Navigation,
  Compass,
  Flag,
  Building,
  Store,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingDown,
  Percent,
  Hash,
  AtSign,
  Link,
  ExternalLink,
  Mail,
  Phone,
  Send,
  Paperclip,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Scissors,
  Gamepad2,
  Joystick,
  Puzzle,
  Layers,
  Grid,
  List,
  Columns,
  Rows,
  Sidebar,
  SidebarClose,
  Menu,
  MenuSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  Indent,
  Outdent,
  Move,
  RotateCw,
  Scale,
  Crop,
  Type,
  Text,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
  ListOrdered,
  CheckSquare,
  Square,
  Circle,
  Dot,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpDown,
  ArrowLeftRight,
  MousePointer,
  MousePointer2,
  X,
  Plus,
  Minus,
  Equal,
  Divide,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  Bell,
  Calendar,
  Video,
  FileText,
} from "lucide-react";
import TTSService from "../components/TTSService";
import ConversationService from "../components/ConversationService";
import EmotionalInterventionService, { EmotionalIntervention } from "../components/EmotionalInterventionService";
import { useRef } from "react";

export default function Home() {
  const { user, logout } = useAuth();
  const [currentText, setCurrentText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatFriend, setCurrentChatFriend] = useState<{ id: string; name: string } | null>(null);

  // Emotional monitoring states
  const [isEmotionalMonitoring, setIsEmotionalMonitoring] = useState(true);
  const [currentEmotions, setCurrentEmotions] = useState<any[]>([]);
  const [activeIntervention, setActiveIntervention] = useState<EmotionalIntervention | null>(null);
  const [isInterventionActive, setIsInterventionActive] = useState(false);
  const [emotionalStatus, setEmotionalStatus] = useState("Monitoring emotions...");
  const [showCameraFeed, setShowCameraFeed] = useState(true);
  const [showEmotionStats, setShowEmotionStats] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showRecentActivity, setShowRecentActivity] = useState(true);
  const [lastAlertSent, setLastAlertSent] = useState<number>(0);

  const [settings, setSettings] = useState({
    selectedAvatar: "Ala",
    gender: "female",
    voiceProvider: "browser",
    selectedVoice: "default",
    speechRate: 0.9,
    speechPitch: 1.0,
    animationIntensity: 0.8,
    lipSyncSensitivity: 0.7,
  });

  const chatRef = useRef<ChatInterfaceHandle>(null);
  const interventionService = EmotionalInterventionService.getInstance();

  // Load settings from localStorage on mount
  useEffect(() => {
    console.log("🚀 DIA App starting up...");
    console.log("🔍 Checking for emotional monitoring...");
    console.log("📱 Current monitoring state:", isEmotionalMonitoring);

    const savedSettings = localStorage.getItem("avatarSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings((prev) => ({ ...prev, ...parsed }));
      TTSService.updateSettings(parsed);
    } else {
      TTSService.updateSettings(settings);
    }

    TTSService.initializeVoices();
    console.log("✅ TTSService initialized on app mount");

    // Test API connection on startup
    fetch("/api/config")
      .then((response) => response.json())
      .then((data) => {
        if (data.apiKey) {
          console.log("✅ Hume AI API key found, length:", data.apiKey.length);
        } else {
          console.error("❌ Hume AI API key missing:", data.message);
          console.log("💡 Create a .env.local file with HUME_API_KEY to enable emotion detection");
        }
      })
      .catch((error) => {
        console.error("❌ Failed to check API config:", error);
      });
  }, []);

  // Handle emotional monitoring callbacks
  const handleEmotionDetected = (emotions: any[], isNegative: boolean) => {
    setCurrentEmotions(emotions);

    if (isNegative) {
      setEmotionalStatus(`⚠️ Negative emotion detected: ${emotions[0]?.name || "Unknown"}`);

      // Only send emotion alert to friends for CRITICAL emotions that need immediate support
      const criticalEmotions = ["Sadness", "Crying", "Despair", "Hopelessness", "Horror", "Fear"];
      const isCriticalEmotion = criticalEmotions.includes(emotions[0]?.name);
      const hasHighIntensity = emotions[0]?.score > 0.7; // Only if emotion is very strong

      if (isCriticalEmotion && hasHighIntensity) {
        const now = Date.now();
        if (now - lastAlertSent > 300000) {
          // 5 minute cooldown for critical emotions
          sendEmotionAlertToFriends(emotions[0]?.name || "distress", emotions[0]?.score || 0.8);
          setLastAlertSent(now);
        }
      }
    } else {
      setEmotionalStatus("😊 Positive emotions detected");
    }
  };

  // Send emotion alert to friends
  const sendEmotionAlertToFriends = async (emotion: string, intensity: number) => {
    try {
      const token = localStorage.getItem("auth-token");

      // Only send alerts for truly critical situations
      if (!token) return;

      const response = await fetch("/api/emotions/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emotion,
          intensity,
          message: `I'm experiencing intense ${emotion} and could really use some support right now.`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`🚨 CRITICAL emotion alert sent to ${data.alertsSent} friends for ${emotion}`);

        // Show notification to user
        import("../components/NotificationService").then(({ default: notificationService }) => {
          notificationService.addNotification({
            type: "emotion_alert",
            title: "Support Alert Sent",
            message: `Your friends have been notified about your ${emotion} state. They'll reach out to support you!`,
          });
        });
      }
    } catch (error) {
      console.error("Failed to send emotion alert:", error);
    }
  };

  const handleInterventionNeeded = (emotions: any[], severity: "low" | "medium" | "high") => {
    console.log(`Intervention needed: ${severity} severity for ${emotions[0]?.name}`);

    // Get appropriate intervention response
    const intervention = interventionService.getIntervention(emotions, severity);

    // Record the intervention
    interventionService.recordIntervention(intervention);

    // Set active intervention
    setActiveIntervention(intervention);
    setIsInterventionActive(true);

    // Automatically trigger avatar response
    handleEmotionalIntervention(intervention);
  };

  // Handle emotional intervention automatically
  const handleEmotionalIntervention = async (intervention: EmotionalIntervention) => {
    console.log("Starting emotional intervention:", intervention);

    // Stop any current speech
    TTSService.stop();

    // Add intervention to conversation history
    const newHistory = [
      ...conversationHistory,
      {
        role: "system",
        content: `Emotional intervention triggered: ${intervention.dominantEmotion} (${intervention.severity} severity)`,
      },
      { role: "assistant", content: intervention.response },
    ];
    setConversationHistory(newHistory);

    // Speak the intervention response
    await speakText(intervention.response);

    // Add follow-up questions
    const followUpQuestions = interventionService.getFollowUpQuestions(intervention);
    if (followUpQuestions.length > 0) {
      const followUpText = `Here are some questions to help you: ${followUpQuestions[0]}`;
      setConversationHistory([...newHistory, { role: "assistant", content: followUpText }]);
      await speakText(followUpText);
    }
  };

  const handleSpeak = async (text: string) => {
    console.log("handleSpeak called with text:", text);

    if (!text.trim()) {
      console.log("Empty text, skipping...");
      return;
    }

    // Add user message to conversation history
    const newHistory = [...conversationHistory, { role: "user", content: text }];
    setConversationHistory(newHistory);

    // Get AI response first
    console.log("Getting AI response for:", text);
    const aiResponse = await ConversationService.sendMessage(text);
    console.log("AI Response received:", aiResponse);

    if (aiResponse.success && aiResponse.response) {
      const aiText = aiResponse.response;
      console.log("AI Response text:", aiText);

      // Add AI response to conversation history
      setConversationHistory([...newHistory, { role: "assistant", content: aiText }]);

      // Now speak the AI response
      console.log("About to speak AI response:", aiText);
      await speakText(aiText);
    } else {
      console.error("AI conversation failed:", aiResponse.error);
      const errorText = "I'm sorry, I couldn't process that request right now.";
      setConversationHistory([...newHistory, { role: "assistant", content: errorText }]);
      await speakText(errorText);
    }
  };

  const speakText = async (text: string) => {
    // Stop recognition before TTS
    chatRef.current?.stopRecognition?.();
    setCurrentText(text);
    setIsSpeaking(true);

    try {
      console.log("Calling TTSService.speak with:", text);
      const result = await TTSService.speak(text);
      console.log("TTSService result:", result);

      if (result.success) {
        const duration = result.duration;
        console.log("Speech duration:", duration);

        setTimeout(() => {
          console.log("Speech timeout completed");
          setIsSpeaking(false);
          setCurrentText("");

          // Restart listening after DIA finishes speaking
          console.log("Restarting listening...");
          setTimeout(() => {
            setIsListening(true);
          }, 1000); // Wait 1 second before restarting
        }, duration);
      } else {
        console.error("TTS failed:", result.error);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    console.log("Voice input received:", transcript);

    if (transcript.trim()) {
      console.log("Processing voice input:", transcript);
      await handleSpeak(transcript);
    } else {
      // Start listening again
      console.log("Starting listening mode");
      setIsListening(true);
    }
  };

  const handleSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
    TTSService.updateSettings(newSettings);
  };

  const clearConversation = () => {
    setConversationHistory([]);
    ConversationService.clearConversation();
    console.log("Conversation cleared");
  };

  // Handle intervention actions
  const handleIntervene = () => {
    if (activeIntervention) {
      // The intervention is already happening automatically
      console.log("Intervention in progress");
    }
  };

  const handleDismissAlarm = () => {
    setIsInterventionActive(false);
    setActiveIntervention(null);
    setEmotionalStatus("Monitoring emotions...");
  };

  const toggleEmotionalMonitoring = () => {
    setIsEmotionalMonitoring(!isEmotionalMonitoring);
    if (!isEmotionalMonitoring) {
      setEmotionalStatus("Monitoring emotions...");
    } else {
      setEmotionalStatus("Emotional monitoring disabled");
    }
  };

  // Get dominant emotion for floating button
  const getDominantEmotion = () => {
    if (currentEmotions.length === 0) return null;
    return currentEmotions.reduce((prev, current) => (prev.score > current.score ? prev : current));
  };

  const dominantEmotion = getDominantEmotion();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full bg-pink-500/5 blur-3xl delay-500"></div>
        <div className="delay-1500 absolute right-1/4 top-3/4 h-80 w-80 animate-pulse rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-6">
        {/* Enhanced Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="group relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 transition-all duration-500 group-hover:shadow-blue-500/40">
                <Brain className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400 shadow-md"></div>
            </div>
            <div>
              <h1 className="mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-bold text-transparent">
                DIA
              </h1>
              <p className="text-sm font-medium text-slate-300">Your AI Emotional Support Assistant</p>
              {user && (
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>
                    Welcome, {user.name} {user.surname}
                  </span>
                  <span>•</span>
                  <span>Avatar: {user.selectedAvatar || "Not set"}</span>
                  <span>•</span>
                  <span>Voice: {user.selectedVoice || "Not set"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Emotional Monitoring Toggle */}
            <button
              onClick={toggleEmotionalMonitoring}
              className={`group flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                isEmotionalMonitoring
                  ? "border-green-500/40 bg-green-600/20 text-green-300 hover:bg-green-600/30 hover:text-green-200"
                  : "border-red-500/40 bg-red-600/20 text-red-300 hover:bg-red-600/30 hover:text-red-200"
              }`}
            >
              <Eye size={18} className="transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-semibold">
                {isEmotionalMonitoring ? "Monitoring ON" : "Monitoring OFF"}
              </span>
            </button>

            <button
              onClick={clearConversation}
              className="group flex items-center gap-3 rounded-xl border-2 border-red-500/40 bg-red-600/20 px-4 py-2.5 text-red-300 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-red-600/30 hover:text-red-200"
            >
              <Sparkles size={18} className="transition-transform duration-500 group-hover:rotate-180" />
              <span className="text-sm font-semibold">Clear Chat</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="group flex items-center gap-3 rounded-xl border-2 border-white/20 bg-white/10 px-4 py-2.5 text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <Settings size={18} className="transition-transform duration-500 group-hover:rotate-90" />
              <span className="text-sm font-semibold">Settings</span>
            </button>

            {/* Only show Admin button to the specific admin user */}
            {user?.email === "admin@dia.com" && user?.status === "APPROVED" && (
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="group flex items-center gap-3 rounded-xl border-2 border-blue-500/40 bg-blue-600/20 px-4 py-2.5 text-blue-300 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-blue-600/30 hover:text-blue-200"
              >
                <Users size={18} className="transition-transform duration-500 group-hover:scale-110" />
                <span className="text-sm font-semibold">Admin</span>
              </button>
            )}

            <button
              onClick={() => setIsFriendsPanelOpen(true)}
              className="group flex items-center gap-3 rounded-xl border-2 border-green-500/40 bg-green-600/20 px-4 py-2.5 text-green-300 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-green-600/30 hover:text-green-200"
            >
              <Users size={18} className="transition-transform duration-500 group-hover:scale-110" />
              <span className="text-sm font-semibold">Friends</span>
            </button>

            <NotificationBell
              onNotificationClick={(notification) => {
                // Handle notification clicks
                if (notification.type === "friend_request") {
                  setIsFriendsPanelOpen(true);
                } else if (notification.type === "message") {
                  // Open chat with the sender
                  if (notification.data?.senderId) {
                    // You can implement logic to find the friend and open chat
                  }
                }
              }}
            />

            <button
              onClick={logout}
              className="group flex items-center gap-3 rounded-xl border-2 border-red-500/40 bg-red-600/20 px-4 py-2.5 text-red-300 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-red-600/30 hover:text-red-200"
            >
              <User size={18} className="transition-transform duration-500 group-hover:scale-110" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </div>

        {/* Enhanced Emotional Status Bar */}
        {isEmotionalMonitoring && (
          <div className="mb-6 rounded-2xl border-2 border-white/20 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-xl border border-pink-500/30 bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-3">
                  <Heart size={20} className="animate-pulse text-pink-400" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-white/90">{emotionalStatus}</span>
                  {currentEmotions.length > 0 && (
                    <div className="mt-1 text-sm text-white/70">
                      Dominant: {currentEmotions[0]?.name} ({(currentEmotions[0]?.score * 100).toFixed(0)}%)
                    </div>
                  )}
                </div>
              </div>

              {currentEmotions.length > 0 && (
                <div className="flex gap-3">
                  {/* Only show top emotion */}
                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        ["Anger", "Sadness", "Fear", "Disgust", "Confusion", "Horror", "Anxiety", "Stress"].includes(
                          currentEmotions[0]?.name
                        )
                          ? "bg-red-400"
                          : [
                              "Joy",
                              "Amusement",
                              "Calmness",
                              "Contentment",
                              "Excitement",
                              "Love",
                              "Pride",
                              "Relief",
                            ].includes(currentEmotions[0]?.name)
                          ? "bg-green-400"
                          : "bg-blue-400"
                      }`}
                    ></div>
                    <span className="font-medium">{currentEmotions[0]?.name}</span>
                    <span className="text-white/60">{((currentEmotions[0]?.score || 0) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Simplified Emotion Display - Only show top emotion */}
            {currentEmotions.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm text-white/70">Top Emotion</div>
                  <div className="h-3 flex-1 overflow-hidden rounded-full border border-white/20 bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ["Anger", "Sadness", "Fear", "Disgust", "Confusion", "Horror", "Anxiety", "Stress"].includes(
                          currentEmotions[0]?.name
                        )
                          ? "bg-red-400"
                          : [
                              "Joy",
                              "Amusement",
                              "Calmness",
                              "Contentment",
                              "Excitement",
                              "Love",
                              "Pride",
                              "Relief",
                            ].includes(currentEmotions[0]?.name)
                          ? "bg-green-400"
                          : "bg-blue-400"
                      }`}
                      style={{ width: `${(currentEmotions[0]?.score || 0) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-sm font-medium text-white/90">
                    {((currentEmotions[0]?.score || 0) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Main Content Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Left Panel - Avatar Scene */}
          <div className="xl:col-span-2">
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>
              <div className="group-hover:shadow-3xl relative h-[600px] overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-800/60 to-slate-900/60 shadow-2xl backdrop-blur-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                <AvatarScene currentText={currentText} isSpeaking={isSpeaking} settings={settings} />

                {/* Enhanced Status Indicators */}
                <div className="absolute left-4 top-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-3 py-2 backdrop-blur-md">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isSpeaking ? "animate-pulse bg-green-400 shadow-md" : "bg-slate-400"
                      }`}
                    ></div>
                    <span className="text-sm font-semibold text-white/90">
                      {isSpeaking ? "DIA is speaking..." : "Ready to chat"}
                    </span>
                  </div>
                </div>

                <div className="absolute right-4 top-4">
                  <div className="rounded-xl border-2 border-green-500/40 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 text-sm font-semibold text-green-300 backdrop-blur-md">
                    🎤 Voice Chat Active
                  </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between rounded-xl border border-white/20 bg-black/40 p-3 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Mic size={16} className="text-blue-400" />
                        <span className="text-sm text-white/80">Voice Input</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 size={16} className="text-green-400" />
                        <span className="text-sm text-white/80">AI Response</span>
                      </div>
                    </div>
                    <div className="text-xs text-white/60">Emotional Support Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="xl:col-span-1">
            <div className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-xl transition-all duration-700 group-hover:blur-2xl"></div>
              <div className="group-hover:shadow-3xl relative h-[600px] rounded-2xl border-2 border-white/20 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5"></div>
                <div className="relative z-10 h-full">
                  <ChatInterface
                    ref={chatRef}
                    onSpeak={handleSpeak}
                    onVoiceInput={handleVoiceInput}
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                    setIsListening={setIsListening}
                    conversationHistory={conversationHistory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-purple-400"></div>
              <MessageCircle size={16} />
              <span className="font-medium">Voice Chat</span>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400 delay-300"></div>
              <User size={16} />
              <span className="font-medium">3D Assistant</span>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-pink-400 delay-700"></div>
              <Heart size={16} />
              <span className="font-medium">Emotional Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Emotion Button - Shows Current Emotion */}
      {isEmotionalMonitoring && dominantEmotion && (
        <div className="fixed left-8 top-1/2 z-40 -translate-y-1/2">
          <div className="group relative">
            {/* Main Emotion Button */}
            <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:shadow-purple-500/25">
              <div className="text-center">
                <div className="mb-1 text-4xl">
                  {["Anger", "Sadness", "Fear", "Disgust", "Confusion", "Horror", "Anxiety", "Stress"].includes(
                    dominantEmotion.name
                  )
                    ? "😔"
                    : ["Joy", "Amusement", "Calmness", "Contentment", "Excitement", "Love", "Pride", "Relief"].includes(
                        dominantEmotion.name
                      )
                    ? "😊"
                    : "😐"}
                </div>
                <div className="text-xs font-bold text-white">{dominantEmotion.name}</div>
                <div className="text-xs text-white/70">{(dominantEmotion.score * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Emotion Details Tooltip */}
            <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="rounded-xl border border-white/20 bg-black/80 p-4 shadow-xl backdrop-blur-xl">
                <div className="mb-2 text-sm font-bold text-white">Current Emotional State</div>
                <div className="space-y-2">
                  {currentEmotions.slice(0, 3).map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{emotion.name}</span>
                      <span className="font-medium text-white">{(emotion.score * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emotional Monitor */}
      {isEmotionalMonitoring && (
        <EmotionalMonitor
          onEmotionDetected={handleEmotionDetected}
          onInterventionNeeded={handleInterventionNeeded}
          isMonitoring={isEmotionalMonitoring}
        />
      )}

      {/* Floating Emotion Indicator */}
      <FloatingEmotionIndicator
        currentEmotions={currentEmotions}
        isVisible={isEmotionalMonitoring && currentEmotions.length > 0}
      />

      {/* Emotional Alarm */}
      <EmotionalAlarm
        intervention={activeIntervention}
        isActive={isInterventionActive}
        onDismiss={handleDismissAlarm}
        onIntervene={handleIntervene}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSettingsChange={handleSettingsChange}
        currentSettings={settings}
      />

      {/* Admin Dashboard */}
      {isAdminDashboardOpen && <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />}

      {/* Friends Panel */}
      {isFriendsPanelOpen && (
        <FriendsPanel
          onClose={() => setIsFriendsPanelOpen(false)}
          onOpenChat={(friendId, friendName) => {
            setCurrentChatFriend({ id: friendId, name: friendName });
            setIsChatOpen(true);
            setIsFriendsPanelOpen(false);
          }}
        />
      )}

      {/* Chat Window */}
      {isChatOpen && currentChatFriend && (
        <ChatWindow
          friendId={currentChatFriend.id}
          friendName={currentChatFriend.name}
          onClose={() => {
            setIsChatOpen(false);
            setCurrentChatFriend(null);
          }}
        />
      )}
    </main>
  );
}
