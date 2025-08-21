"use client";

import { useState, useEffect } from "react";
import { Settings, User, Mic, Volume2, Save, Eye, Palette, X, Sparkles } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import AvatarPreview from "./AvatarPreview";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: any) => void;
  currentSettings: any;
}

interface AvatarOption {
  id: string;
  name: string;
  gender: "male" | "female" | "neutral";
  modelPath: string;
  preview: string;
}

export const availableAvatars: AvatarOption[] = [
  {
    id: "Ala",
    name: "Ala",
    gender: "female",
    modelPath: "/models/Ala.glb",
    preview: "👩",
  },
  {
    id: "Adam",
    name: "Adam",
    gender: "male",
    modelPath: "/models/Adam.glb",
    preview: "👨",
  },
  {
    id: "David",
    name: "David",
    gender: "male",
    modelPath: "/models/David.glb",
    preview: "👨",
  },
  {
    id: "Frank",
    name: "Frank",
    gender: "male",
    modelPath: "/models/Frank.glb",
    preview: "👨",
  },
  {
    id: "brunette",
    name: "Brunette",
    gender: "female",
    modelPath: "/models/brunette.glb",
    preview: "👩",
  },
];

export default function SettingsPanel({ isOpen, onClose, onSettingsChange, currentSettings }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    selectedAvatar: "Ala",
    gender: "female",
    voiceProvider: "browser",
    selectedVoice: "default",
    openaiVoice: "alloy",
    speechRate: 0.9,
    speechPitch: 1.0,
    animationIntensity: 0.8,
    lipSyncSensitivity: 0.7,
    ...currentSettings,
  });

  const [activeTab, setActiveTab] = useState("avatar");
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState("Ala");

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("avatarSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings((prev: any) => ({ ...prev, ...parsed }));
      setPreviewAvatar(parsed.selectedAvatar || "Ala");
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);

    // Update preview when avatar changes
    if (key === "selectedAvatar") {
      setPreviewAvatar(value);
    }

    // Save to localStorage
    localStorage.setItem("avatarSettings", JSON.stringify(newSettings));

    // Update TTSService immediately for voice-related settings
    if (["speechRate", "speechPitch"].includes(key)) {
      import("./TTSService").then(({ default: TTSService }) => {
        TTSService.updateSettings({ [key]: value });
      });
    }
  };

  const testVoice = async () => {
    setIsLoading(true);
    const providerText = settings.voiceProvider === "openai" ? "OpenAI" : "browser";
    setTestResult(`Testing ${providerText} voice...`);

    try {
      if (settings.voiceProvider === "openai") {
        // Test OpenAI voice
        const testText =
          "Hello! This is a test of the OpenAI voice system. It should sound much more natural and human-like than the browser voice.";

        const response = await fetch("/api/tts/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: testText,
            voice: settings.openaiVoice,
          }),
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
          setTestResult("✅ OpenAI voice test successful! Playing audio...");
        } else {
          const errorData = await response.json();
          setTestResult("❌ OpenAI voice test failed: " + (errorData.message || "Unknown error"));
        }
      } else {
        // Test browser voice
        import("./TTSService").then(async ({ default: TTSService }) => {
          TTSService.updateSettings(settings);
          const testText = "Hello! This is a test of the browser voice system with your current settings.";
          const result = await TTSService.speak(testText);

          if (result.success) {
            setTestResult("✅ Browser voice test successful! Playing audio with current settings...");
          } else {
            setTestResult("❌ Browser voice test failed: " + (result.error || "Unknown error"));
          }
        });
      }
    } catch (error) {
      setTestResult("❌ Voice test error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedAvatarObj = availableAvatars.find((a) => a.id.toLowerCase() === (previewAvatar || "").toLowerCase());
  const modelPath = selectedAvatarObj ? selectedAvatarObj.modelPath : "/models/brunette.glb";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl"></div>

        <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-2xl backdrop-blur-xl">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
                  Settings
                </h2>
                <p className="text-sm font-medium text-slate-300">Configure your DIA experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:shadow-lg"
            >
              <X className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 border-b border-white/10 bg-white/5 p-4">
            <button
              onClick={() => setActiveTab("avatar")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
                activeTab === "avatar"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <User size={16} />
              <span className="text-sm font-medium">Avatar</span>
            </button>
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
                activeTab === "voice"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Mic size={16} />
              <span className="text-sm font-medium">Voice</span>
            </button>
            <button
              onClick={() => setActiveTab("animation")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-300 ${
                activeTab === "animation"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Eye size={16} />
              <span className="text-sm font-medium">Animation</span>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[50vh] overflow-y-auto p-6">
            {/* Avatar Settings */}
            {activeTab === "avatar" && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Avatar Selection */}
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                      <User size={20} />
                      Select Character
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {availableAvatars.map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleSettingChange("selectedAvatar", avatar.id)}
                          className={`group rounded-2xl border-2 p-6 transition-all duration-300 ${
                            settings.selectedAvatar === avatar.id
                              ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/25"
                              : "border-white/20 bg-white/5 hover:border-purple-500/50 hover:bg-white/10"
                          }`}
                        >
                          <div className="mb-3 text-4xl transition-transform duration-300 group-hover:scale-110">
                            {avatar.preview}
                          </div>
                          <div className="text-sm font-semibold text-white">{avatar.name}</div>
                          <div className="text-xs capitalize text-slate-400">{avatar.gender}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-semibold text-white">Gender Preference</h3>
                    <div className="flex gap-3">
                      {["male", "female", "neutral"].map((gender) => (
                        <button
                          key={gender}
                          onClick={() => handleSettingChange("gender", gender)}
                          className={`rounded-xl px-6 py-3 transition-all duration-300 ${
                            settings.gender === gender
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                              : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Avatar Preview */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                    <Eye size={20} />
                    Character Preview
                  </h3>
                  <div className="group relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                    <div className="relative h-[400px] overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-slate-800/50 to-slate-900/50 shadow-2xl backdrop-blur-md">
                      <Canvas camera={{ position: [0, 1.6, 2], fov: 50 }}>
                        <Suspense fallback={null}>
                          <Environment preset="studio" />
                          <AvatarPreview avatarId={previewAvatar} modelPath={modelPath} settings={settings} />
                          <OrbitControls
                            enablePan={false}
                            enableZoom={true}
                            minDistance={1.5}
                            maxDistance={4}
                            target={[0, 1.6, 0]}
                          />
                        </Suspense>
                      </Canvas>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-400">Click and drag to rotate • Scroll to zoom</p>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Settings */}
            {activeTab === "voice" && (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                    <Mic size={20} />
                    Voice Settings
                  </h3>

                  <div className="space-y-6">
                    {/* Voice Provider Selection */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <label className="mb-4 block text-sm font-semibold text-white">Voice Provider</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleSettingChange("voiceProvider", "browser")}
                          className={`flex-1 rounded-lg px-4 py-2 transition-all duration-300 ${
                            settings.voiceProvider === "browser"
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                              : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          Browser TTS
                        </button>
                        <button
                          onClick={() => handleSettingChange("voiceProvider", "openai")}
                          className={`flex-1 rounded-lg px-4 py-2 transition-all duration-300 ${
                            settings.voiceProvider === "openai"
                              ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                              : "bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white"
                          }`}
                        >
                          OpenAI (Human-like)
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {settings.voiceProvider === "browser"
                          ? "Uses your browser's built-in text-to-speech"
                          : "Uses OpenAI's advanced AI voices for natural speech"}
                      </p>
                    </div>

                    {/* OpenAI Voice Selection */}
                    {settings.voiceProvider === "openai" && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                        <label className="mb-4 block text-sm font-semibold text-white">OpenAI Voice</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: "alloy", name: "Alloy", description: "Neutral, balanced" },
                            { id: "echo", name: "Echo", description: "Deep, warm" },
                            { id: "fable", name: "Fable", description: "Storytelling, expressive" },
                            { id: "onyx", name: "Onyx", description: "Rich, powerful" },
                            { id: "nova", name: "Nova", description: "Bright, energetic" },
                            { id: "shimmer", name: "Shimmer", description: "Soft, gentle" },
                          ].map((voice) => (
                            <button
                              key={voice.id}
                              onClick={() => handleSettingChange("openaiVoice", voice.id)}
                              className={`rounded-lg border p-3 text-left transition-all duration-300 ${
                                settings.openaiVoice === voice.id
                                  ? "border-green-500 bg-green-500/20 text-green-300"
                                  : "border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:bg-white/10"
                              }`}
                            >
                              <div className="font-semibold">{voice.name}</div>
                              <div className="text-xs text-slate-400">{voice.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <label className="mb-4 block text-sm font-semibold text-white">Speech Rate</label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={settings.speechRate}
                        onChange={(e) => handleSettingChange("speechRate", parseFloat(e.target.value))}
                        className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                      />
                      <div className="mt-2 flex justify-between text-sm text-slate-400">
                        <span>Slow</span>
                        <span className="font-semibold text-purple-400">{settings.speechRate}</span>
                        <span>Fast</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <label className="mb-4 block text-sm font-semibold text-white">Speech Pitch</label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        value={settings.speechPitch}
                        onChange={(e) => handleSettingChange("speechPitch", parseFloat(e.target.value))}
                        className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                      />
                      <div className="mt-2 flex justify-between text-sm text-slate-400">
                        <span>Low</span>
                        <span className="font-semibold text-purple-400">{settings.speechPitch}</span>
                        <span>High</span>
                      </div>
                    </div>

                    <button
                      onClick={testVoice}
                      disabled={isLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40 disabled:opacity-50"
                    >
                      <Volume2 size={20} />
                      {isLoading ? "Testing..." : "Test Voice"}
                    </button>

                    {testResult && (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                        <p className="text-sm text-white">{testResult}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Animation Settings */}
            {activeTab === "animation" && (
              <div className="space-y-8">
                <div>
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                    <Eye size={20} />
                    Animation Settings
                  </h3>

                  <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <label className="mb-4 block text-sm font-semibold text-white">Animation Intensity</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={settings.animationIntensity}
                        onChange={(e) => handleSettingChange("animationIntensity", parseFloat(e.target.value))}
                        className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                      />
                      <div className="mt-2 flex justify-between text-sm text-slate-400">
                        <span>Subtle</span>
                        <span className="font-semibold text-purple-400">{settings.animationIntensity}</span>
                        <span>Exaggerated</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <label className="mb-4 block text-sm font-semibold text-white">Lip Sync Sensitivity</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={settings.lipSyncSensitivity}
                        onChange={(e) => handleSettingChange("lipSyncSensitivity", parseFloat(e.target.value))}
                        className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20"
                      />
                      <div className="mt-2 flex justify-between text-sm text-slate-400">
                        <span>Subtle</span>
                        <span className="font-semibold text-purple-400">{settings.lipSyncSensitivity}</span>
                        <span>Pronounced</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 bg-white/5 p-8">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Sparkles size={16} />
              <span>Settings are automatically saved and applied</span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40"
            >
              <Save size={16} />
              Close Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
