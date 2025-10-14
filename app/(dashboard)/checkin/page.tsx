"use client";

import { useState, useRef } from "react";
import ChatInterface, { ChatInterfaceHandle } from "@/components/ChatInterface";
import ConversationService from "@/components/ConversationService";
import TTSService from "@/components/TTSService";

export default function CheckinPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const chatRef = useRef<ChatInterfaceHandle>(null);

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
    try {
      setIsSpeaking(true);
      await TTSService.speak(text);
    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleVoiceInput = (transcript: string) => {
    console.log("Voice input received:", transcript);
    if (transcript.trim()) {
      handleSpeak(transcript);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f4ed] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Chat with DIA</h1>
          <p className="text-lg text-gray-600">
            Your emotional support companion is here to listen and help
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200 overflow-hidden">
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
  );
}
