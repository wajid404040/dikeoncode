"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth/AuthProvider";
import AvatarScene from "./AvatarScene";
import ChatInterface, { ChatInterfaceHandle } from "./ChatInterface";
import SettingsPanel from "./SettingsPanel";
import EmotionalMonitor from "./EmotionalMonitor";
import EmotionalAlarm from "./EmotionalAlarm";
import { AdminDashboard } from "./AdminDashboard";
import { FriendsPanel } from "./FriendsPanel";
import { ChatWindow } from "./ChatWindow";
import { NotificationBell } from "./NotificationBell";
import FloatingEmotionIndicator from "./FloatingEmotionIndicator";
import TTSService from "./TTSService";
import ConversationService from "./ConversationService";
import EmotionalInterventionService, { EmotionalIntervention } from "./EmotionalInterventionService";

// Icons from Figma design
import {
  Heart,
  BookOpen,
  Users,
  MessageCircle,
  Target,
  Moon,
  Settings,
  LogOut,
  Bell,
  Eye,
  EyeOff,
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  Mic,
  Volume2,
  Send,
  X,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Home,
  BarChart3,
  Activity,
  Zap,
  Brain,
  Monitor,
  AlertCircle,
  CheckCircle,
  User,
  Crown,
  Trophy,
  Award,
  Star,
  Info,
  HelpCircle,
  Play,
  Pause,
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
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpDown,
  ArrowLeftRight,
  MousePointer,
  MousePointer2,
  Minus,
  Equal,
  Divide,
  ChevronUp,
  ChevronDown,
  Download,
  Upload,
  Share2,
  Calendar as CalendarIcon,
  Video,
  FileText,
} from "lucide-react";

// Figma assets
const imgRectangle87 = "http://localhost:3845/assets/d9507786c8d804464ff9ed4185c7c3dde2675563.png";
const imgVector1 = "http://localhost:3845/assets/1ce174283c1345f5e51ce3df53b2d8ebc96a5d52.svg";
const imgGroup = "http://localhost:3845/assets/e972dcc2a67f210ab17f00376ead1d7d683607d6.svg";
const imgFrame = "http://localhost:3845/assets/8c9ca48d5b218ab99d6a27ebac6703c0a1f009e2.svg";
const imgLayer1 = "http://localhost:3845/assets/29f1c762939a53f68638dca3446e38f6428ad0de.svg";
const imgGroup1 = "http://localhost:3845/assets/312abf66dbd1ba7f804e593231bb7ed29824cd08.svg";
const imgGroup2 = "http://localhost:3845/assets/b45ecef508b46ee379c08e539ef184650ffe1902.svg";
const imgGroup3 = "http://localhost:3845/assets/0f99123db869325d3f9ea212f6106460c5912ff2.svg";
const imgGroup4 = "http://localhost:3845/assets/3b2a708dd00031865d62a88876169fbcc5cd74ce.svg";
const imgCheckIn = "http://localhost:3845/assets/e0c7189ad1de7b250655a6f1cd794e8bdeef1b1d.svg";
const imgNotes = "http://localhost:3845/assets/1fab1499ab2cf186583d3bbf0e18e9ff3f1edede.svg";
const imgFriends = "http://localhost:3845/assets/fc1b1531223bc128d78209fae5d53ea70a32b203.svg";
const imgFrame1 = "http://localhost:3845/assets/2c67122716b0272e02f1ff156f3d0d78fe2f1c1d.svg";
const imgFrame2 = "http://localhost:3845/assets/7dd3b67f223a2d9f6fbd3118384792d1ee782c9d.svg";
const imgFrame3 = "http://localhost:3845/assets/8df6b321893e133182530b1c01cfdf5bec0b01bb.svg";
const imgSettings = "http://localhost:3845/assets/01a90ca65d1952442d95d7aa14fc484f1912d20b.svg";
const imgLogout = "http://localhost:3845/assets/606823b76fa0be08f8a1e8861f93eba461c43721.svg";
const imgMonitor = "http://localhost:3845/assets/fc82b06f76671d65a66664fe6d6a3f7746c75075.svg";
const imgBell = "http://localhost:3845/assets/bcfecf8334d4c937c84289b1f849f35109fbade0.svg";

export default function Dashboard() {
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
  const [lastAlertSent, setLastAlertSent] = useState<number>(0);

  // Dashboard states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentMood, setCurrentMood] = useState("Calm");
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [recentReflections, setRecentReflections] = useState<any[]>([]);
  const [todayMoodEntry, setTodayMoodEntry] = useState<any>(null);
  const [isLoadingMood, setIsLoadingMood] = useState(true);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [moodNotes, setMoodNotes] = useState("");
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

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

  // Load settings and initialize
  useEffect(() => {
    console.log("🚀 DIA Dashboard starting up...");
    
    const savedSettings = localStorage.getItem("avatarSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings((prev) => ({ ...prev, ...parsed }));
      TTSService.updateSettings(parsed);
    } else {
      TTSService.updateSettings(settings);
    }

    TTSService.initializeVoices();
    loadDashboardData();
  }, []);

  // Refresh data when page becomes visible (user returns from mood entry)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Submit mood entry
  const submitMoodEntry = async () => {
    if (!selectedMood) return;

    setIsSubmittingMood(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/mood/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mood: selectedMood,
          notes: moodNotes.trim() || null,
        }),
      });

      if (response.ok) {
        // Close modal and refresh data
        setShowMoodModal(false);
        setSelectedMood("");
        setMoodNotes("");
        loadDashboardData();
      } else {
        alert("Failed to save mood entry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting mood:", error);
      alert("Failed to save mood entry. Please try again.");
    } finally {
      setIsSubmittingMood(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || isSendingMessage) return;

    const userMessage = chatMessage.trim();
    setChatMessage("");
    setIsSendingMessage(true);

    // Add user message to conversation
    const newUserMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setConversationHistory(prev => [...prev, newUserMessage]);

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        };
        setConversationHistory(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          role: "assistant",
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setConversationHistory(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setConversationHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoadingMood(true);
      const token = localStorage.getItem("auth-token");
      if (token) {
        // Load today's mood entry
        const todayResponse = await fetch("/api/mood/today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        let todayEntry = null;
        if (todayResponse.ok) {
          const todayData = await todayResponse.json();
          todayEntry = todayData.entry;
          setTodayMoodEntry(todayEntry);
          
          // Set current mood based on today's entry
          if (todayEntry) {
            setCurrentMood(todayEntry.mood || "Calm");
          }
        }

        // Load mood history for 7-day chart
        const moodResponse = await fetch("/api/mood/history?days=7", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (moodResponse.ok) {
          const moodData = await moodResponse.json();
          setMoodHistory(moodData.entries || []);
          
          // If no today's entry, use latest entry for current mood
          if (!todayEntry && moodData.entries && moodData.entries.length > 0) {
            setCurrentMood(moodData.entries[0].mood || "Calm");
          }
        }

        // Load recent reflections
        const reflectionsResponse = await fetch("/api/mood/entries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (reflectionsResponse.ok) {
          const reflectionsData = await reflectionsResponse.json();
          const allEntries = reflectionsData.entries || [];
          setRecentReflections(allEntries.slice(0, 3));
          
          // If no today's entry but we have recent entries, use the most recent one
          if (!todayEntry && allEntries.length > 0) {
            const mostRecent = allEntries[0]; // entries are ordered by most recent
            setCurrentMood(mostRecent.mood || "Calm");
            setTodayMoodEntry(mostRecent); // Set it as the "current" entry to show data
          }
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoadingMood(false);
    }
  };

  // Handle emotional monitoring callbacks
  const handleEmotionDetected = (emotions: any[], isNegative: boolean) => {
    setCurrentEmotions(emotions);

    if (isNegative) {
      setEmotionalStatus(`⚠️ Negative emotion detected: ${emotions[0]?.name || "Unknown"}`);
      
      const criticalEmotions = ["Sadness", "Crying", "Despair", "Hopelessness", "Horror", "Fear"];
      const isCriticalEmotion = criticalEmotions.includes(emotions[0]?.name);
      const hasHighIntensity = emotions[0]?.score > 0.7;

      if (isCriticalEmotion && hasHighIntensity) {
        const now = Date.now();
        if (now - lastAlertSent > 300000) {
          sendEmotionAlertToFriends(emotions[0]?.name || "distress", emotions[0]?.score || 0.8);
          setLastAlertSent(now);
        }
      }
    } else {
      setEmotionalStatus("😊 Positive emotions detected");
    }
  };

  const sendEmotionAlertToFriends = async (emotion: string, intensity: number) => {
    try {
      const token = localStorage.getItem("auth-token");
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
      }
    } catch (error) {
      console.error("Failed to send emotion alert:", error);
    }
  };

  const handleInterventionNeeded = (emotions: any[], severity: "low" | "medium" | "high") => {
    const intervention = interventionService.getIntervention(emotions, severity);
    interventionService.recordIntervention(intervention);
    setActiveIntervention(intervention);
    setIsInterventionActive(true);
    handleEmotionalIntervention(intervention);
  };

  const handleEmotionalIntervention = async (intervention: EmotionalIntervention) => {
    TTSService.stop();
    const newHistory = [
      ...conversationHistory,
      { role: "system", content: `Emotional intervention triggered: ${intervention.dominantEmotion} (${intervention.severity} severity)` },
      { role: "assistant", content: intervention.response },
    ];
    setConversationHistory(newHistory);
    await speakText(intervention.response);
  };

  const handleSpeak = async (text: string) => {
    if (!text.trim()) return;

    const newHistory = [...conversationHistory, { role: "user", content: text }];
    setConversationHistory(newHistory);

    const aiResponse = await ConversationService.sendMessage(text);
    if (aiResponse.success && aiResponse.response) {
      const aiText = aiResponse.response;
      setConversationHistory([...newHistory, { role: "assistant", content: aiText }]);
      await speakText(aiText);
    } else {
      const errorText = "I'm sorry, I couldn't process that request right now.";
      setConversationHistory([...newHistory, { role: "assistant", content: errorText }]);
      await speakText(errorText);
    }
  };

  const speakText = async (text: string) => {
    chatRef.current?.stopRecognition?.();
    setCurrentText(text);
    setIsSpeaking(true);

    try {
      const result = await TTSService.speak(text);
      if (result.success) {
        const duration = result.duration;
        setTimeout(() => {
          setIsSpeaking(false);
          setCurrentText("");
          setTimeout(() => {
            setIsListening(true);
          }, 1000);
        }, duration);
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (transcript.trim()) {
      await handleSpeak(transcript);
    } else {
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
  };

  const handleIntervene = () => {
    if (activeIntervention) {
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

  const getDominantEmotion = () => {
    if (currentEmotions.length === 0) return null;
    return currentEmotions.reduce((prev, current) => (prev.score > current.score ? prev : current));
  };

  const dominantEmotion = getDominantEmotion();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-[#f9f4ed] min-h-screen flex">
      {/* Left Sidebar */}
      <div className={`${isNavbarExpanded ? 'w-[280px]' : 'w-[90px]'} bg-white flex flex-col items-center py-8 gap-6 transition-all duration-300 relative shadow-lg border-r border-gray-100`}>
        {/* Toggle Button */}
        <div className="absolute top-4 -right-4 z-10">
          <button
            onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
            className="w-8 h-8 bg-[#ff7b00] rounded-full flex items-center justify-center text-white hover:bg-[#e66a00] transition-colors shadow-lg"
          >
            {isNavbarExpanded ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Logo */}
        <div className="w-[58px] h-[58px] overflow-hidden mb-4">
          <img alt="DIA Logo" className="w-full h-full object-contain drop-shadow-sm" src={imgLayer1} />
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-[18px] w-full">
          {/* Dashboard */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => {
              setActiveTab("dashboard");
              setShowChatInterface(false);
            }}
          >
            <div className={`w-[58px] h-[58px] rounded-[41px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 ${
              !showChatInterface ? 'bg-[#ff7b00]' : 'bg-white border-2 border-black hover:bg-gray-50'
            }`}>
              <div className="w-[24px] h-[24px]">
                <svg viewBox="0 0 24 24" fill="black" className="w-full h-full">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium whitespace-nowrap text-black">Dashboard</span>
            )}
          </div>

          {/* Check-in */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => {
              setShowChatInterface(!showChatInterface);
              setActiveTab("checkin");
            }}
          >
            <div className={`w-[58px] h-[58px] rounded-[41px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 ${
              showChatInterface ? 'bg-[#ff7b00]' : 'bg-white border border-gray-200 hover:bg-gray-50'
            }`}>
              <div className="w-[30px] h-[30px]">
                <img alt="Check-in" className="w-full h-full object-contain" src={imgCheckIn} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium whitespace-nowrap text-black">Check-in</span>
            )}
          </div>

          {/* Notes/Reflections */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => window.location.href = '/reflections'}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[41px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[30px] h-[30px]">
                <img alt="Notes" className="w-full h-full object-contain" src={imgNotes} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Notes</span>
            )}
          </div>

          {/* Friends */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => window.location.href = '/friends'}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[41px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[30px] h-[30px]">
                <img alt="Friends" className="w-full h-full object-contain" src={imgFriends} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Friends</span>
            )}
          </div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col gap-[18px] w-full">
          {/* Feedback */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => window.location.href = '/feedback'}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[45px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[28px] h-[28px]">
                <img alt="Feedback" className="w-full h-full object-contain" src={imgFrame1} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Feedback</span>
            )}
          </div>

          {/* Urgent Help */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => window.location.href = '/help'}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[45px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[30px] h-[30px]">
                <img alt="Urgent Help" className="w-full h-full object-contain" src={imgFrame2} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Urgent Help</span>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-[18px] w-full mt-auto">
          {/* Dark Mode */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => {/* TODO: Implement dark mode toggle */}}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[45px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[30px] h-[30px]">
                <img alt="Dark Mode" className="w-full h-full object-contain" src={imgFrame3} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Dark Mode</span>
            )}
          </div>

          {/* Settings */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={() => setIsSettingsOpen(true)}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[45px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[30px] h-[30px]">
                <img alt="Settings" className="w-full h-full object-contain" src={imgSettings} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Settings</span>
            )}
          </div>

          {/* Logout */}
          <div 
            className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 rounded-lg ${
              isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
            }`}
            onClick={logout}
          >
            <div className="w-[58px] h-[58px] bg-white border border-gray-200 rounded-[45px] flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
              <div className="w-[30px] h-[30px]">
                <img alt="Logout" className="w-full h-full object-contain" src={imgLogout} />
              </div>
            </div>
            {isNavbarExpanded && (
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Logout</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Status indicators */}
            <div className="flex items-center gap-6">
              {/* Feeling Status */}
              <div className="bg-white border border-white rounded-[52px] px-8 py-3">
                <div className="flex items-center gap-16">
                  <div className="bg-white rounded-[42px] px-8 py-2">
                    <div className="text-center">
                      <p className="text-[#ff7b00] text-xl font-medium">
                        Feeling {recentReflections.length > 0 ? recentReflections[0].mood : currentMood}
                      </p>
                      <p className="text-[7px] text-gray-500">
                        {todayMoodEntry ? "Based on today's check-in" : "Based on recent check-ins"}
                      </p>
                    </div>
                  </div>

                  {/* Monitor Toggle */}
                  <div 
                    className="bg-white rounded-[34px] px-6 py-1 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={toggleEmotionalMonitoring}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-[30px] h-[30px] mb-1">
                        <img alt="Monitor" className="w-full h-full object-contain" src={imgMonitor} />
                      </div>
                      <p className={`text-[7px] ${isEmotionalMonitoring ? "text-[#261af6]" : "text-gray-500"}`}>
                        Monitor: {isEmotionalMonitoring ? "On" : "Off"}
                      </p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="flex gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[5px] h-[22px] bg-[rgba(109,125,205,0.3)] border border-[#6d7dcd] rounded-[8px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - User profile and notifications */}
            <div className="flex items-center gap-6">
              {/* Notifications */}
              <div className="relative">
                <NotificationBell
                  onNotificationClick={(notification) => {
                    if (notification.type === "friend_request") {
                      window.location.href = '/friends';
                    } else if (notification.type === "message") {
                      window.location.href = '/friends';
                    }
                  }}
                />
              </div>

              {/* User Profile */}
              <div className="w-[80px] h-[80px] bg-white rounded-[45px] p-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-full h-full rounded-[45px] overflow-hidden">
                  <img alt="User Profile" className="w-full h-full object-cover" src={imgRectangle87} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-[64px] font-medium text-[#090300] mb-2">
              {getGreeting()}
            </h1>
            <p className="text-[20px] text-[rgba(9,3,0,0.6)]">
              Welcome back, {user?.name} {user?.surname}
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Today's Mood */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[30px] p-6 h-[460px]">
                <h2 className="text-[32px] font-medium text-black mb-8">Today's Mood</h2>
                
                {isLoadingMood ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff7b00]"></div>
                  </div>
                ) : (todayMoodEntry || recentReflections.length > 0) ? (
                  /* Show mood data when entry exists */
                  <div className="flex gap-8 h-full">
                    {/* Mood Chart */}
                    <div className="flex-1">
                      <div className="bg-[#f9f4ed] rounded-[26px] p-4 h-[294px]">
                        <div className="bg-[rgba(75,59,255,0.3)] border border-[rgba(38,26,246,0.6)] rounded-[11px] px-2 py-1 w-fit mb-2">
                          <p className="text-[#261af6] text-[8px]">{recentReflections.length > 0 ? recentReflections[0].mood : currentMood}</p>
                        </div>
                        
                        {/* Chart placeholder */}
                        <div className="h-[200px] bg-gradient-to-b from-[rgba(255,123,0,0.21)] to-[rgba(38,26,246,0.21)] rounded-lg flex items-end justify-between px-4 pb-4">
                          {["6 am", "12 pm", "6 pm", "12 am"].map((time, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div className="w-[2px] h-[200px] bg-gradient-to-b from-[rgba(255,123,0,0.21)] to-[rgba(38,26,246,0.21)]"></div>
                              <p className="text-[12px] text-black">{time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-black mt-2">
                        {todayMoodEntry && new Date(todayMoodEntry.timestamp).toDateString() === new Date().toDateString() 
                          ? "You've checked in once today" 
                          : "Latest mood entry"}
                      </p>
                    </div>

                    {/* Mood Details */}
                    <div className="w-[302px]">
                      <div className="mb-8">
                        <p className="text-[10px] text-[rgba(0,0,0,0.4)] mb-1">You were feeling</p>
                        <p className="text-[16px] font-normal text-black">{recentReflections.length > 0 ? recentReflections[0].mood : currentMood}</p>
                      </div>

                      <div className="mb-8">
                        <p className="text-[10px] text-[rgba(0,0,0,0.4)] mb-3">
                          {todayMoodEntry 
                            ? new Date(todayMoodEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : recentReflections.length > 0 
                              ? new Date(recentReflections[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : "Recently"
                          }
                        </p>
                        <p className="text-[12px] text-[rgba(0,0,0,0.7)]">
                          {(todayMoodEntry || recentReflections[0])?.notes || "It's okay to feel this way. Be kind to yourself and take moments of rest when you can."}
                        </p>
                      </div>

                      {/* Chat with DIA Button */}
                      <div className="border-b border-[#090300] pb-1">
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={() => window.location.href = '/checkin'}
                        >
                          <div className="w-4 h-4">
                            <img alt="Chat" className="w-full h-full object-contain" src={imgGroup} />
                          </div>
                          <p className="text-[12px] text-black">Chat with DIA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Show big plus button when no entry exists */
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div
                          className="w-24 h-24 bg-[#ff7b00] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#e66a00] transition-colors mb-4 mx-auto"
                          onClick={() => setShowMoodModal(true)}
                        >
                        <Plus className="w-12 h-12 text-white" />
                      </div>
                      <p className="text-[18px] font-medium text-black mb-2">Start today's entry</p>
                      <p className="text-[14px] text-[rgba(0,0,0,0.6)]">Click the plus button to check in your mood</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Mood Journey */}
              <div className="bg-white rounded-[30px] p-8 h-[460px]">
                <h2 className="text-[32px] font-medium text-black mb-8">Mood Journey</h2>
                
                <div className="flex gap-1">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between h-[275px] text-[6px] text-[rgba(9,3,0,0.25)]">
                    <p>Confident</p>
                    <p>Calm</p>
                    <p>Stressed</p>
                  </div>

                  {/* Chart area */}
                  <div className="flex-1 h-[275px] relative">
                    {/* Chart bars */}
                    <div className="absolute inset-0 flex items-end justify-between px-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-4">
                          <div className="w-[5px] h-[230px] bg-gradient-to-b from-[rgba(255,123,0,0.1)] to-[rgba(38,26,246,0.1)] rounded-[21px]"></div>
                          <p className="text-[20px] text-[rgba(0,0,0,0.5)]">{19 + i}</p>
                        </div>
                      ))}
                    </div>

                    {/* Line chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[210px] h-[161px]">
                        <img alt="Chart" className="w-full h-full object-contain" src={imgVector1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reflections */}
          <div className="mt-8">
            <div className="bg-white rounded-[30px] p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[32px] font-medium text-black">Recent Reflections</h2>
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => window.location.href = '/reflections'}
                >
                  <p className="text-[10px] text-black">View All</p>
                  <div className="w-4 h-4">
                    <img alt="Arrow" className="w-full h-full object-contain" src={imgFrame} />
                  </div>
                </div>
              </div>

              {/* Reflection Cards */}
              {recentReflections.length > 0 ? (
                recentReflections.map((reflection, index) => (
                  <div key={index} className="bg-white border border-[#f9f4ed] rounded-[30px] p-5 mb-4">
                    <div className="flex items-center gap-8 mb-3">
                      <div className="bg-[rgba(75,59,255,0.3)] border border-[rgba(38,26,246,0.6)] rounded-[26px] px-3 py-1">
                        <p className="text-[#261af6] text-[14px]">{reflection.mood}</p>
                      </div>
                      <div className="flex gap-4 text-[14px] text-[rgba(0,0,0,0.5)]">
                        <p>{new Date(reflection.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p>{new Date(reflection.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <p className="text-[16px] text-[rgba(9,3,0,0.35)]">
                      {reflection.notes || "No additional notes provided."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#f9f4ed] rounded-[30px] p-8 text-center">
                  <p className="text-[16px] text-[rgba(9,3,0,0.35)] mb-4">No reflections yet</p>
                      <div
                        className="inline-flex items-center gap-2 text-[#ff7b00] cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setShowMoodModal(true)}
                      >
                    <Plus className="w-4 h-4" />
                    <p className="text-[14px]">Start your first mood entry</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Chat Interface for voice functionality */}
      <div className="hidden">
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

          {/* Chat Interface */}
          {showChatInterface && (
            <div className="fixed inset-0 bg-[#f9f4ed] z-40 flex">
              {/* Left Sidebar - Same as dashboard */}
              <div className={`${isNavbarExpanded ? 'w-[280px]' : 'w-[90px]'} bg-white flex flex-col items-center py-8 gap-6 transition-all duration-300 relative`}>
                {/* Toggle Button */}
                <div className="absolute top-4 -right-4 z-10">
                  <button
                    onClick={() => setIsNavbarExpanded(!isNavbarExpanded)}
                    className="w-8 h-8 bg-[#ff7b00] rounded-full flex items-center justify-center text-white hover:bg-[#e66a00] transition-colors shadow-lg"
                  >
                    {isNavbarExpanded ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Logo */}
                <div className="w-[58px] h-[58px] overflow-hidden">
                  <img alt="DIA Logo" className="w-full h-full object-contain" src={imgLayer1} />
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col gap-[18px] w-full">
                  {/* Dashboard */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 ${
                      isNavbarExpanded ? 'px-4' : 'justify-center'
                    }`}
                    onClick={() => setShowChatInterface(false)}
                  >
                    <div className="w-[58px] h-[58px] bg-white border-2 border-black rounded-[41px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[24px] h-[24px]">
                        <svg viewBox="0 0 24 24" fill="black" className="w-full h-full">
                          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-black whitespace-nowrap">Dashboard</span>
                    )}
                  </div>

                  {/* Check-in (Active) */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    } bg-[#ff7b00] text-white`}
                    onClick={() => setShowChatInterface(true)}
                  >
                    <div className="w-[58px] h-[58px] bg-[#ff7b00] rounded-[41px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Check-in" className="w-full h-full object-contain" src={imgCheckIn} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-white whitespace-nowrap">Check-in</span>
                    )}
                  </div>

                  {/* Notes/Reflections */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={() => window.location.href = '/reflections'}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[41px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Notes" className="w-full h-full object-contain" src={imgNotes} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-black whitespace-nowrap">Notes</span>
                    )}
                  </div>

                  {/* Friends */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={() => window.location.href = '/friends'}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[41px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Friends" className="w-full h-full object-contain" src={imgFriends} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-black whitespace-nowrap">Friends</span>
                    )}
                  </div>
                </div>

                {/* Middle Section */}
                <div className="flex flex-col gap-[18px] w-full">
                  {/* Feedback */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={() => window.location.href = '/feedback'}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[45px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[28px] h-[28px]">
                        <img alt="Feedback" className="w-full h-full object-contain" src={imgFrame1} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-[#090300] whitespace-nowrap">Feedback</span>
                    )}
                  </div>

                  {/* Urgent Help */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={() => window.location.href = '/help'}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[45px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Urgent Help" className="w-full h-full object-contain" src={imgFrame2} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-[#090300] whitespace-nowrap">Urgent Help</span>
                    )}
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col gap-[18px] w-full mt-auto">
                  {/* Dark Mode */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={() => {/* TODO: Implement dark mode toggle */}}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[45px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Dark Mode" className="w-full h-full object-contain" src={imgFrame3} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-black whitespace-nowrap">Dark Mode</span>
                    )}
                  </div>

                  {/* Settings */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[45px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Settings" className="w-full h-full object-contain" src={imgSettings} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-black whitespace-nowrap">Settings</span>
                    )}
                  </div>

                  {/* Logout */}
                  <div 
                    className={`flex items-center gap-[13px] cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg ${
                      isNavbarExpanded ? 'px-4 py-2' : 'justify-center'
                    }`}
                    onClick={logout}
                  >
                    <div className="w-[58px] h-[58px] bg-white rounded-[45px] flex items-center justify-center flex-shrink-0">
                      <div className="w-[30px] h-[30px]">
                        <img alt="Logout" className="w-full h-full object-contain" src={imgLogout} />
                      </div>
                    </div>
                    {isNavbarExpanded && (
                      <span className="text-[14px] font-medium text-black whitespace-nowrap">Logout</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Chat Content */}
              <div className="flex-1 flex flex-col">
                {/* Top Header - Clean version without greeting text */}
                <div className="flex items-center justify-end p-8 bg-white border-b border-gray-200">
                  {/* Right side - Status indicators */}
                  <div className="flex items-center gap-6">
                    {/* Feeling Status */}
                    <div className="bg-white border border-white rounded-[52px] px-8 py-3">
                      <div className="flex items-center gap-16">
                        <div className="bg-white rounded-[42px] px-8 py-2">
                          <div className="text-center">
                            <p className="text-[#ff7b00] text-xl font-medium">
                              Feeling {recentReflections.length > 0 ? recentReflections[0].mood : currentMood}
                            </p>
                            <p className="text-[7px] text-gray-500">
                              {todayMoodEntry ? "Based on today's check-in" : "Based on recent check-ins"}
                            </p>
                          </div>
                        </div>

                        {/* Monitor Toggle */}
                        <div
                          className="bg-white rounded-[34px] px-6 py-1 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={toggleEmotionalMonitoring}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-[30px] h-[30px] mb-1">
                              <img alt="Monitor" className="w-full h-full object-contain" src={imgMonitor} />
                            </div>
                            <p className={`text-[7px] ${isEmotionalMonitoring ? "text-[#261af6]" : "text-gray-500"}`}>
                              Monitor: {isEmotionalMonitoring ? "On" : "Off"}
                            </p>
                          </div>
                        </div>

                        {/* Progress bars */}
                        <div className="flex gap-1">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className="bg-[rgba(109,125,205,0.3)] border border-[#6d7dcd] h-[22px] w-[5px] rounded-[8px]"></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side - User profile and notifications */}
                    <div className="flex items-center gap-6">
                      {/* Notifications */}
                      <div className="relative">
                        <NotificationBell
                          onNotificationClick={(notification) => {
                            if (notification.type === "friend_request") {
                              window.location.href = '/friends';
                            } else if (notification.type === "message") {
                              window.location.href = '/friends';
                            }
                          }}
                        />
                      </div>

                      {/* User Profile */}
                      <div className="w-[80px] h-[80px] bg-white rounded-[45px] p-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="w-full h-full rounded-[45px] overflow-hidden">
                          <img alt="User Profile" className="w-full h-full object-cover" src={imgRectangle87} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Beautiful Chat Interface */}
                <div className="flex-1 bg-gradient-to-br from-[#f9f4ed] via-[#fef7f0] to-[#f9f4ed] flex flex-col">
                  {/* Elegant Header */}
                  <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
                    <div className="flex items-center justify-between p-6">
                      {/* Left - Welcome Message */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#ff7b00] to-[#ff9500] rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">Chat with DIA</h1>
                          <p className="text-sm text-gray-600">Your AI emotional support companion</p>
                        </div>
                      </div>

                      {/* Right - Status & Controls */}
                      <div className="flex items-center gap-4">
                        {/* Mood Status */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-white/50">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">
                              Feeling {recentReflections.length > 0 ? recentReflections[0].mood : currentMood}
                            </span>
                          </div>
                        </div>

                        {/* Monitor Toggle */}
                        <button
                          onClick={toggleEmotionalMonitoring}
                          className={`p-3 rounded-2xl transition-all duration-300 ${
                            isEmotionalMonitoring 
                              ? 'bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-white shadow-lg' 
                              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                        </button>

                        {/* User Avatar */}
                        <div className="w-10 h-10 bg-gradient-to-br from-[#ff7b00] to-[#ff9500] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.name?.[0]}{user?.surname?.[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Container */}
                  <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                      {conversationHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <div className="w-24 h-24 bg-gradient-to-br from-[#ff7b00] to-[#ff9500] rounded-full flex items-center justify-center mb-6 shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to DIA Chat</h2>
                          <p className="text-gray-600 mb-6 max-w-md">
                            I'm here to listen, support, and help you through whatever you're feeling. 
                            Start a conversation by typing a message below.
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {[
                              "How are you feeling today?",
                              "I need someone to talk to",
                              "Help me understand my emotions",
                              "I'm feeling overwhelmed"
                            ].map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setChatMessage(suggestion)}
                                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 border border-white/50"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {conversationHistory.map((message, index) => (
                            <div
                              key={index}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                  message.role === 'user'
                                    ? 'bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-white shadow-lg'
                                    : 'bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm border border-white/50'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                  message.role === 'user' ? 'text-orange-100' : 'text-gray-500'
                                }`}>
                                  {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Just now'}
                                </p>
                              </div>
                            </div>
                          ))}
                          {isSendingMessage && (
                            <div className="flex justify-start">
                              <div className="bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm border border-white/50 px-4 py-3 rounded-2xl">
                                <div className="flex items-center gap-2">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                  <span className="text-sm text-gray-600">DIA is typing...</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/50">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <textarea
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Share what's on your mind..."
                            className="w-full resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-500 text-sm leading-relaxed"
                            rows={1}
                            style={{minHeight: '24px', maxHeight: '120px'}}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendChatMessage();
                              }
                            }}
                            disabled={isSendingMessage}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Voice Input */}
                          <button
                            onClick={() => handleVoiceInput()}
                            className="p-2 text-gray-600 hover:text-[#ff7b00] hover:bg-orange-50 rounded-xl transition-all duration-200"
                            disabled={isSendingMessage}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                            </svg>
                          </button>
                          
                          {/* Send Button */}
                          <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage.trim() || isSendingMessage}
                            className="p-2 bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-white rounded-xl hover:from-[#e66a00] hover:to-[#ff7b00] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            {isSendingMessage ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mood Check-in Modal */}
          {showMoodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#f9f4ed] rounded-[30px] w-full max-w-4xl mx-auto max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="relative p-8 bg-gradient-to-r from-[#ff7b00] to-[#ff9500] rounded-t-[30px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[32px] font-medium text-white">How are you feeling today?</h2>
                  <p className="text-[16px] text-white/90 mt-2">Take a moment to check in with yourself</p>
                </div>
                <button
                  onClick={() => {
                    setShowMoodModal(false);
                    setSelectedMood("");
                    setMoodNotes("");
                  }}
                  className="p-3 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
            </div>

            {/* Modal Content */}
            <div className="p-8 bg-[#f9f4ed]">
              {/* Mood Selection */}
              <div className="mb-8">
                <h3 className="text-[24px] font-medium text-black mb-6">Select your mood</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400" },
                    { id: "excited", emoji: "🤩", label: "Excited", color: "from-pink-400 to-purple-400" },
                    { id: "confident", emoji: "😎", label: "Confident", color: "from-blue-400 to-indigo-400" },
                    { id: "calm", emoji: "😌", label: "Calm", color: "from-green-400 to-teal-400" },
                    { id: "content", emoji: "😊", label: "Content", color: "from-emerald-400 to-green-400" },
                    { id: "tired", emoji: "😴", label: "Tired", color: "from-gray-400 to-slate-400" },
                    { id: "stressed", emoji: "😰", label: "Stressed", color: "from-red-400 to-orange-400" },
                    { id: "anxious", emoji: "😟", label: "Anxious", color: "from-amber-400 to-yellow-400" },
                    { id: "sad", emoji: "😢", label: "Sad", color: "from-blue-500 to-indigo-500" },
                    { id: "angry", emoji: "😠", label: "Angry", color: "from-red-500 to-pink-500" },
                    { id: "overwhelmed", emoji: "😵", label: "Overwhelmed", color: "from-purple-500 to-pink-500" },
                    { id: "frustrated", emoji: "😤", label: "Frustrated", color: "from-orange-500 to-red-500" },
                  ].map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`group relative p-6 rounded-[24px] border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedMood === mood.id
                          ? "border-[#ff7b00] bg-white shadow-lg scale-105"
                          : "border-white/30 bg-white/50 hover:border-[#ff7b00]/50 hover:bg-white/80"
                      }`}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${mood.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{mood.emoji}</div>
                        <div className="text-[14px] font-medium text-black">{mood.label}</div>
                      </div>
                      
                      {/* Selection indicator */}
                      {selectedMood === mood.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff7b00] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div className="mb-8">
                <h3 className="text-[24px] font-medium text-black mb-4">Add a note (optional)</h3>
                <div className="relative">
                  <textarea
                    value={moodNotes}
                    onChange={(e) => setMoodNotes(e.target.value)}
                    placeholder="How are you feeling? What's on your mind? Share your thoughts..."
                    className="w-full p-6 border-2 border-white/50 rounded-[24px] focus:border-[#ff7b00] focus:outline-none resize-none bg-white/90 backdrop-blur-sm text-[16px] text-black placeholder-gray-500"
                    rows={4}
                  />
                  <div className="absolute top-4 right-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-6">
                <button
                  onClick={() => {
                    setShowMoodModal(false);
                    setSelectedMood("");
                    setMoodNotes("");
                  }}
                  className="flex-1 px-8 py-4 border-2 border-white/50 rounded-[24px] text-[16px] font-medium text-gray-600 hover:bg-white/50 transition-all duration-200 backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={submitMoodEntry}
                  disabled={!selectedMood || isSubmittingMood}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-[#ff7b00] to-[#ff9500] text-white rounded-[24px] text-[16px] font-medium hover:from-[#e66a00] hover:to-[#ff7b00] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  {isSubmittingMood ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving your mood...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Entry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
