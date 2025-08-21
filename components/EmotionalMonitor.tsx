"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Heart, Eye, AlertTriangle, Zap } from "lucide-react";
// Local fallback type for emotion entries used by the monitor
interface Emotion {
  name: string;
  score: number;
}

// Copy the exact same canvasToImageBlob function from the working root app
const canvasToImageBlob = (canvas: HTMLCanvasElement, format: string = "image/png"): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const handleBlob = (blob: Blob | null) => {
      if (blob) {
        resolve(blob);
      } else {
        reject("Could not parse blob");
      }
    };
    canvas.toBlob(handleBlob, format, 1);
  });
};

interface EmotionalMonitorProps {
  onEmotionDetected: (emotions: Emotion[], isNegative: boolean) => void;
  onInterventionNeeded: (emotions: Emotion[], severity: "low" | "medium" | "high") => void;
  isMonitoring: boolean;
}

export default function EmotionalMonitor({
  onEmotionDetected,
  onInterventionNeeded,
  isMonitoring,
}: EmotionalMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentEmotions, setCurrentEmotions] = useState<Emotion[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState("Initializing...");
  const [lastIntervention, setLastIntervention] = useState<number>(0);
  const [showCameraFeed, setShowCameraFeed] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [frameCount, setFrameCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  const [captureInterval, setCaptureInterval] = useState<NodeJS.Timeout | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Emotion thresholds for intervention - Only alert for CRITICAL negative emotions
  const CRITICAL_EMOTIONS = ["Sadness", "Crying", "Despair", "Hopelessness", "Horror", "Fear"];

  const MODERATE_EMOTIONS = ["Anger", "Anxiety", "Stress", "Disgust"];

  const POSITIVE_EMOTIONS = ["Joy", "Amusement", "Calmness", "Contentment", "Excitement", "Love", "Pride", "Relief"];

  const SEVERITY_THRESHOLDS = {
    low: 0.6, // 60% confidence - Higher threshold to avoid false positives
    medium: 0.75, // 75% confidence
    high: 0.85, // 85% confidence - Only very confident emotions trigger alerts
  };

  // Retry camera initialization
  const retryCamera = async () => {
    if (retryCount >= maxRetries) {
      setCameraError("Maximum retry attempts reached. Please refresh the page.");
      return;
    }

    setRetryCount((prev) => prev + 1);
    setCameraError(null);
    setMonitoringStatus(`Retrying camera access (${retryCount + 1}/${maxRetries})...`);

    // Wait a bit before retrying
    setTimeout(() => {
      if (isMonitoring) {
        initializeMonitoring();
      }
    }, 1000);
  };

  // Initialize camera and WebSocket connection - using root app approach
  const initializeMonitoring = async () => {
    try {
      setMonitoringStatus("Accessing camera...");
      setCameraError(null);

      // Get camera access with better error handling
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 500, min: 320 },
          height: { ideal: 375, min: 240 },
          facingMode: "user",
          frameRate: { ideal: 30, min: 15 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Wait for video to be ready using the same approach as root app
        videoRef.current.addEventListener(
          "canplay",
          async () => {
            console.log("Video can play - setting up dimensions");

            if (videoRef.current && photoRef.current) {
              // Set video dimensions like root app
              const videoWidth = 500;
              const videoHeight = (videoRef.current.videoHeight * videoWidth) / videoRef.current.videoWidth;

              videoRef.current.setAttribute("width", videoWidth.toString());
              videoRef.current.setAttribute("height", videoHeight.toString());
              photoRef.current.setAttribute("width", videoWidth.toString());
              photoRef.current.setAttribute("height", videoHeight.toString());

              setVideoReady(true);
              setMonitoringStatus("Camera active - connecting to AI...");
              setRetryCount(0); // Reset retry count on success

              // Connect to Hume AI after video is ready
              await connectToHumeAI();

              // Don't auto-start here - let the connection handler do it
              console.log("🎯 Video ready, waiting for AI connection...");
            }
          },
          { once: true }
        );

        // Handle video errors
        videoRef.current.onerror = (error) => {
          console.error("Video error:", error);
          setCameraError("Video playback error occurred");
        };

        // Handle video ending
        videoRef.current.onended = () => {
          console.log("Video stream ended");
          setMonitoringStatus("Video stream ended - reconnecting...");
          // Try to restart the stream
          setTimeout(() => {
            if (isMonitoring) {
              initializeMonitoring();
            }
          }, 2000);
        };
      }
    } catch (error: any) {
      console.error("Failed to initialize monitoring:", error);
      if (error.name === "NotAllowedError") {
        setCameraError("Camera access denied. Please allow camera permissions.");
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera found. Please connect a camera.");
      } else if (error.name === "NotReadableError") {
        setCameraError("Camera is in use by another application. Please close other apps using the camera.");
      } else if (error.name === "OverconstrainedError") {
        setCameraError("Camera doesn't support required settings. Trying with lower resolution...");
        // Try with lower resolution
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: 320,
              height: 240,
              facingMode: "user",
            },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            setMonitoringStatus("Camera active with fallback settings - connecting to AI...");
          }
        } catch (fallbackError: any) {
          setCameraError(`Camera error: ${fallbackError.message}`);
        }
      } else {
        setCameraError(`Camera error: ${error.message}`);
      }
      setMonitoringStatus("Failed to access camera");
    }
  };

  // Connect to Hume AI streaming API
  const connectToHumeAI = async () => {
    try {
      setMonitoringStatus("Connecting to AI service...");

      // Get API key from config
      const response = await fetch("/api/config");
      if (!response.ok) {
        throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const apiKey = data.apiKey;

      if (!apiKey) {
        throw new Error("No API key configured");
      }

      console.log("Got API key, connecting to Hume AI...");
      const socketUrl = `wss://api.hume.ai/v0/stream/models?apikey=${apiKey}`;
      console.log("Connecting to:", socketUrl);

      const socket = new WebSocket(socketUrl);

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (socket.readyState === WebSocket.CONNECTING) {
          console.error("❌ Connection timeout - closing socket");
          socket.close();
          setMonitoringStatus("Connection timeout - retrying...");
          setTimeout(connectToHumeAI, 3000);
        }
      }, 10000); // 10 second timeout

      socket.onopen = () => {
        console.log("✅ Connected to Hume AI for emotion monitoring");
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setMonitoringStatus("AI connected - monitoring emotions...");

        // Don't send test message - Hume AI doesn't expect it
        // Just mark as connected and ready
        console.log("🎯 Connection ready for emotion monitoring");

        // Auto-start emotion monitoring after connection is established
        if (isMonitoring && videoReady) {
          console.log("🚀 Auto-starting emotion monitoring after connection...");
          setTimeout(() => {
            startEmotionMonitoring();
          }, 500); // Small delay to ensure everything is ready
        }
      };

      socket.onmessage = (event) => {
        console.log("📨 Received message from Hume AI:", event.data);
        handleEmotionResponse(event);
      };

      socket.onclose = (event) => {
        console.log("❌ Hume AI connection closed:", event.code, event.reason);
        clearTimeout(connectionTimeout);
        setIsConnected(false);
        setMonitoringStatus(`Connection lost (${event.code}) - reconnecting...`);
        // Auto-reconnect after delay
        setTimeout(connectToHumeAI, 3000);
      };

      socket.onerror = (error) => {
        console.error("💥 WebSocket error:", error);
        clearTimeout(connectionTimeout);
        setMonitoringStatus("Connection error");
      };

      socketRef.current = socket;
    } catch (error: any) {
      console.error("❌ Failed to connect to Hume AI:", error);
      setMonitoringStatus(`AI connection failed: ${error.message}`);
    }
  };

  // Handle emotion analysis responses
  const handleEmotionResponse = (event: MessageEvent) => {
    try {
      console.log("📨 Raw response from Hume AI:", event.data);

      const response = JSON.parse(event.data);
      console.log("🔍 Parsed response:", response);

      // Check for errors first
      if (response.error) {
        console.error("💥 Hume AI error:", response.error);
        setMonitoringStatus(`AI error: ${response.error}`);
        return;
      }

      const predictions = response.face?.predictions || [];
      console.log("👥 Face predictions:", predictions);

      if (predictions.length > 0) {
        const emotions = predictions[0].emotions || [];
        console.log("😊 Detected emotions:", emotions);

        if (emotions.length > 0) {
          console.log("🎯 Setting emotions:", emotions);
          setCurrentEmotions(emotions);
          setLastUpdate(new Date());

          // Analyze emotions for intervention
          const analysis = analyzeEmotions(emotions);
          console.log("🧠 Emotion analysis:", analysis);

          if (analysis.isNegative) {
            console.log("⚠️ Negative emotion detected, calling callback");
            onEmotionDetected(emotions, true);

            // Check if intervention is needed
            if (analysis.severity && shouldIntervene(analysis.severity)) {
              console.log("🚨 Intervention needed:", analysis.severity);
              onInterventionNeeded(emotions, analysis.severity);
            }
          } else {
            console.log("😊 Positive emotion detected, calling callback");
            onEmotionDetected(emotions, false);
          }
        } else {
          console.log("❌ No emotions in prediction");
          setCurrentEmotions([]);
        }
      } else {
        console.log("❌ No face predictions found");
        if (response.face?.warning) {
          console.log("⚠️ Face warning:", response.face.warning);
          setMonitoringStatus(`AI warning: ${response.face.warning}`);
        }
        setCurrentEmotions([]);
      }
    } catch (error) {
      console.error("💥 Error parsing emotion response:", error);
      console.error("Raw data:", event.data);
    }
  };

  // Analyze emotions and determine severity
  const analyzeEmotions = (emotions: Emotion[]) => {
    let maxNegativeScore = 0;
    let dominantNegativeEmotion = "";

    emotions.forEach((emotion) => {
      if (CRITICAL_EMOTIONS.includes(emotion.name) || MODERATE_EMOTIONS.includes(emotion.name)) {
        if (emotion.score > maxNegativeScore) {
          maxNegativeScore = emotion.score;
          dominantNegativeEmotion = emotion.name;
        }
      }
    });

    let severity: "low" | "medium" | "high" | null = null;

    if (maxNegativeScore >= SEVERITY_THRESHOLDS.high) {
      severity = "high";
    } else if (maxNegativeScore >= SEVERITY_THRESHOLDS.medium) {
      severity = "medium";
    } else if (maxNegativeScore >= SEVERITY_THRESHOLDS.low) {
      severity = "low";
    }

    return {
      isNegative: maxNegativeScore > 0,
      severity,
      dominantEmotion: dominantNegativeEmotion,
      maxScore: maxNegativeScore,
    };
  };

  // Determine if intervention is needed
  const shouldIntervene = (severity: "low" | "medium" | "high"): boolean => {
    const now = Date.now();
    const timeSinceLastIntervention = now - lastIntervention;

    // Prevent too frequent interventions - Less frequent alerts
    const minInterval = {
      low: 60000, // 1 minute - Less frequent alerts
      medium: 30000, // 30 seconds
      high: 10000, // 10 seconds
    };

    return timeSinceLastIntervention >= minInterval[severity];
  };

  // Start continuous emotion monitoring - using root app approach
  const startEmotionMonitoring = useCallback(() => {
    console.log("🔍 Checking monitoring prerequisites:", {
      isConnected,
      hasVideo: !!videoRef.current,
      hasPhoto: !!photoRef.current,
      videoReady,
      socketState: socketRef.current?.readyState,
    });

    if (!isConnected || !videoRef.current || !photoRef.current || !videoReady) {
      console.log("❌ Cannot start monitoring:", {
        isConnected,
        hasVideo: !!videoRef.current,
        hasPhoto: !!photoRef.current,
        videoReady,
      });
      return;
    }

    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      console.log("❌ Socket not ready, state:", socketRef.current?.readyState);
      return;
    }

    console.log("🚀 Starting emotion monitoring...");

    const captureAndSend = async () => {
      if (!isMonitoring || !videoRef.current || !photoRef.current || !videoReady) {
        console.log("❌ Skipping capture:", {
          isMonitoring,
          hasVideo: !!videoRef.current,
          hasPhoto: !!photoRef.current,
          videoReady,
        });
        return;
      }

      try {
        setIsProcessing(true);
        console.log("📸 Capturing frame...");

        // Enhanced video readiness check
        if (!videoRef.current || videoRef.current.readyState < 2) {
          console.log("⏳ Video not ready, state:", videoRef.current?.readyState);
          return;
        }

        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
          console.log("⏳ Video dimensions not set yet");
          return;
        }

        // Capture frame from video using canvas - EXACTLY like root app
        const canvas = photoRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
          console.log("❌ No canvas context");
          return;
        }

        // Set canvas size to match video dimensions - EXACTLY like root app
        const videoWidth = 500;
        const videoHeight = (video.videoHeight * videoWidth) / video.videoWidth;

        console.log("📏 Canvas dimensions:", videoWidth, "x", videoHeight);
        console.log("📹 Video dimensions:", video.videoWidth, "x", video.videoHeight);

        // Use exact same approach as root app: setAttribute first, then width/height
        canvas.setAttribute("width", videoWidth.toString());
        canvas.setAttribute("height", videoHeight.toString());

        // Reset canvas transform before drawing
        context.setTransform(1, 0, 0, 1, 0, 0);
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Draw video frame to canvas - using root app's approach
        context.translate(videoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, videoWidth, videoHeight);

        console.log("🎨 Frame drawn to canvas");

        // Use the exact same canvasToImageBlob function as the working root app
        const blob = await canvasToImageBlob(canvas, "image/png");

        console.log("📦 Blob created, size:", blob.size, "type:", blob.type);

        // Convert to base64 - using EXACT format like root app
        // Use the exact same canvasToImageBlob function as the working root app
        const base64 = await blobToBase64(blob);
        console.log("🔤 Base64 length:", base64.length);

        // Send to Hume AI - using root app's exact format
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const requestData = JSON.stringify({
            data: base64,
            models: {
              face: {},
            },
          });

          console.log("📤 Sending to Hume AI, data size:", requestData.length);
          console.log("📤 First 100 chars of base64:", base64.substring(0, 100));
          socketRef.current.send(requestData);
          setFrameCount((prev) => prev + 1);
          console.log("✅ Frame sent successfully");
        } else {
          console.log("❌ Socket not open, state:", socketRef.current?.readyState);
        }
      } catch (error) {
        console.error("💥 Error capturing frame:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    // IMPORTANT: Clear any existing interval first
    if (captureInterval) {
      clearInterval(captureInterval);
      setCaptureInterval(null);
    }

    // Capture every 1000ms for better performance - EXACTLY like root app
    console.log("⏰ Setting up capture interval...");
    const interval = setInterval(captureAndSend, 1000);
    setCaptureInterval(interval);

    // Also capture immediately for faster response
    console.log("🚀 Immediate first capture...");
    captureAndSend();

    console.log("✅ Continuous monitoring started with interval:", interval);

    return () => {
      console.log("🧹 Cleaning up interval:", interval);
      clearInterval(interval);
    };
  }, [isConnected, isMonitoring, videoReady, captureInterval]);

  // Auto-start monitoring when both video and connection are ready
  useEffect(() => {
    if (isConnected && videoReady && isMonitoring && !captureInterval) {
      console.log("🎯 Auto-starting monitoring - both video and connection ready");
      setTimeout(() => {
        startEmotionMonitoring();
      }, 500);
    }
  }, [isConnected, videoReady, isMonitoring, captureInterval, startEmotionMonitoring]);

  // Convert blob to base64 - clean format for Hume AI (EXACTLY like root app)
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const result = reader.result as string;
          // Use exact same logic as working root app: split on "," and take second part
          const cleanBase64 = result.split(",")[1];
          console.log(
            "🔄 Blob converted to base64, original length:",
            result.length,
            "clean length:",
            cleanBase64.length
          );
          resolve(cleanBase64);
        } else {
          reject("No result from FileReader");
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Cleanup resources
  const cleanup = () => {
    console.log("🧹 Starting cleanup...");

    if (captureInterval) {
      console.log("🧹 Clearing capture interval:", captureInterval);
      clearInterval(captureInterval);
      setCaptureInterval(null);
    }

    if (socketRef.current) {
      console.log("🧹 Closing WebSocket connection");
      socketRef.current.close();
      socketRef.current = null;
    }

    if (videoRef.current) {
      // Pause video before stopping tracks to prevent play error
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (error) {
        console.warn("Error during video cleanup:", error);
      }

      // Stop all tracks from the stream
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    }

    setIsConnected(false);
    setVideoReady(false);
    setMonitoringStatus("Monitoring stopped");
    console.log("🧹 Cleanup completed");
  };

  // Get emotion color based on type
  const getEmotionColor = (emotionName: string) => {
    if (CRITICAL_EMOTIONS.includes(emotionName) || MODERATE_EMOTIONS.includes(emotionName)) {
      return "text-red-400";
    } else if (POSITIVE_EMOTIONS.includes(emotionName)) {
      return "text-green-400";
    } else {
      return "text-blue-400";
    }
  };

  // Get dominant emotion
  const getDominantEmotion = () => {
    if (currentEmotions.length === 0) return null;

    let maxScore = 0;
    let dominant = currentEmotions[0];

    currentEmotions.forEach((emotion) => {
      if (emotion.score > maxScore) {
        maxScore = emotion.score;
        dominant = emotion;
      }
    });

    return dominant;
  };

  const dominantEmotion = getDominantEmotion();

  // Initialize camera and WebSocket connection
  useEffect(() => {
    if (!isMonitoring) return;

    initializeMonitoring();

    return () => {
      cleanup();
    };
  }, [isMonitoring]);

  return (
    <div className="fixed right-4 top-4 z-50 w-96 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-6 text-white shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2">
            <Heart className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
              Emotional Monitor
            </h3>
            <p className="text-xs text-white/60">Real-time emotion tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? "animate-pulse bg-green-400" : "bg-red-400"}`}></div>
          <button
            onClick={() => setShowCameraFeed(!showCameraFeed)}
            className="rounded-lg border border-white/20 bg-white/10 p-2 transition-colors hover:bg-white/20"
            title={showCameraFeed ? "Hide Camera" : "Show Camera"}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Status Bar */}

      {/* Live Camera Feed */}
      {showCameraFeed && (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium">Live Camera Feed</span>
          </div>

          {cameraError ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-400" />
                <p className="text-sm text-red-300">{cameraError}</p>
                <button
                  onClick={retryCamera}
                  className="mt-2 rounded-lg bg-red-500/20 px-3 py-1 text-xs transition-colors hover:bg-red-500/30"
                >
                  {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : "Retry"}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="h-48 w-full rounded-xl border-2 border-white/20 object-cover shadow-lg"
                autoPlay
                muted
                playsInline
              />

              {/* Emotion overlay on camera feed */}
              {dominantEmotion && (
                <div className="absolute bottom-3 left-3 rounded-lg border border-white/20 bg-black/80 px-3 py-2 backdrop-blur-sm">
                  <div className={`text-sm font-bold ${getEmotionColor(dominantEmotion.name)}`}>
                    {dominantEmotion.name}
                  </div>
                  <div className="text-xs text-white/80">{(dominantEmotion.score * 100).toFixed(0)}% confidence</div>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="absolute right-3 top-3 rounded-full bg-black/70 p-2 backdrop-blur-sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                </div>
              )}

              {/* Video ready indicator */}
              {!videoReady && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                    <p className="text-sm text-white">Initializing camera...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Current Emotions Display */}
      {currentEmotions.length > 0 ? (
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Detected Emotions</span>
            <span className="text-xs text-white/50">{lastUpdate.toLocaleTimeString()}</span>
            <button
              onClick={() => {
                console.log("🧪 Manual emotion test");
                console.log("Current emotions:", currentEmotions);
                console.log("Socket state:", socketRef.current?.readyState);
                console.log("Video ready:", videoReady);
                console.log("Is connected:", isConnected);
                alert(
                  `Current emotions: ${currentEmotions
                    .map((e) => `${e.name} (${(e.score * 100).toFixed(1)}%)`)
                    .join(", ")}`
                );
              }}
              className="ml-2 rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300 hover:bg-blue-500/30"
            >
              Debug
            </button>
          </div>

          <div className="space-y-3">
            {currentEmotions
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((emotion, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      CRITICAL_EMOTIONS.includes(emotion.name) || MODERATE_EMOTIONS.includes(emotion.name)
                        ? "bg-red-400"
                        : POSITIVE_EMOTIONS.includes(emotion.name)
                        ? "bg-green-400"
                        : "bg-blue-400"
                    }`}
                  ></div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{emotion.name}</span>
                      <span className={`text-sm font-bold ${getEmotionColor(emotion.name)}`}>
                        {(emotion.score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          CRITICAL_EMOTIONS.includes(emotion.name) || MODERATE_EMOTIONS.includes(emotion.name)
                            ? "bg-red-400"
                            : POSITIVE_EMOTIONS.includes(emotion.name)
                            ? "bg-green-400"
                            : "bg-blue-400"
                        }`}
                        style={{ width: `${emotion.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <Eye className="mx-auto mb-2 h-8 w-8 text-white/40" />
          <p className="text-sm text-white/60">{videoReady ? "No emotions detected yet" : "Camera initializing..."}</p>
          <p className="mt-1 text-xs text-white/40">
            {videoReady ? "Make sure your face is visible" : "Please wait for camera to be ready"}
          </p>
        </div>
      )}

      {/* Emotional State Summary */}
      {dominantEmotion && (
        <div className="mb-6 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
          <div className="mb-3 text-center text-sm font-medium">Current Emotional State</div>
          <div className="flex items-center justify-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
                CRITICAL_EMOTIONS.includes(dominantEmotion.name) || MODERATE_EMOTIONS.includes(dominantEmotion.name)
                  ? "border-2 border-red-400/40 bg-red-500/20"
                  : POSITIVE_EMOTIONS.includes(dominantEmotion.name)
                  ? "border-2 border-green-400/40 bg-green-500/20"
                  : "border-2 border-blue-400/40 bg-blue-500/20"
              }`}
            >
              {CRITICAL_EMOTIONS.includes(dominantEmotion.name) || MODERATE_EMOTIONS.includes(dominantEmotion.name)
                ? "😔"
                : POSITIVE_EMOTIONS.includes(dominantEmotion.name)
                ? "😊"
                : "😐"}
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${getEmotionColor(dominantEmotion.name)}`}>{dominantEmotion.name}</div>
              <div className="text-sm text-white/70">{(dominantEmotion.score * 100).toFixed(0)}% confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={photoRef} className="hidden" />
    </div>
  );
}
