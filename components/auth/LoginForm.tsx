"use client";

import { useState, useEffect } from "react";

// Figma assets
const imgImage13 = "http://localhost:3845/assets/a1eb02db95b97cb7c35e10dcaa1fff5e846a5cac.png";
const imgImage14 = "http://localhost:3845/assets/ab427fd396d3603f994c97b68a78e59355280a69.png";
const imgAsset6DknLogo = "http://localhost:3845/assets/b4ea37d37c887c1be8a5b84f561da456f4b202dd.svg";
const imgAsset6DknLogo1 = "http://localhost:3845/assets/000463c4267da174b0a6c9f8fc41d99fb158b2e8.svg";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  error: string;
}

export function LoginForm({ onLogin, onSwitchToSignup, error }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Typing effect state
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const fullText = "We hope to give every voice the space to be heard, understood, and felt - because no one should carry their emotions alone.";
  
  useEffect(() => {
    if (currentIndex < fullText.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Typing speed: 50ms per character
      
      return () => clearTimeout(timeout);
    } else if (currentIndex >= fullText.length) {
      setIsTyping(false);
    }
  }, [currentIndex, isTyping, fullText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Section - Form (60%) */}
      <div className="w-[60%] bg-[#f9f4ed] flex flex-col items-center justify-center px-16">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <img alt="Logo" className="w-14 h-14" src={imgAsset6DknLogo} />
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-semibold text-black mb-7">
            Welcome Back
          </h1>
          <p className="text-xl text-black">
            Sign in to your emotional support space
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Display */}
            {error && (
              <div className="w-full p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-xl text-black block">
                Email Address
              </label>
              <div className="bg-white border border-orange-200 rounded-[30px] h-[50px] flex items-center px-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-black placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
                <div className="w-[18px] h-[18px] opacity-50">
                  <img alt="" className="w-full h-full" src={imgAsset6DknLogo1} />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-xl text-black block">
                Password
              </label>
              <div className="bg-white border border-orange-200 rounded-[30px] h-[50px] flex items-center px-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-black placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
                <div className="w-[18px] h-[18px] opacity-50">
                  <img alt="" className="w-full h-full" src={imgAsset6DknLogo1} />
                </div>
              </div>
            </div>

            {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="bg-[#ff7b00] h-[50px] px-10 py-3 rounded-[30px] text-white text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-xl text-black">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-orange-400 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Inspirational Panel (40%) */}
      <div className="w-[40%] relative flex flex-col justify-end p-8 overflow-hidden">
        {/* Background Image with proper masking */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${imgImage14}')`,
              maskImage: `url('${imgImage13}')`,
              maskSize: 'cover',
              maskPosition: 'center',
              maskRepeat: 'no-repeat'
            }}
          />
        </div>

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-30" />

        {/* Content Overlay */}
        <div className="relative z-10 space-y-7">
          {/* Interactive Buttons */}
          <div className="flex gap-8">
            <div className="border-2 border-white rounded-[30px] h-[39px] px-5 flex items-center bg-white bg-opacity-10 backdrop-blur-sm">
              <p className="text-white text-base font-medium">
                Feel Seen
              </p>
            </div>
            <div className="border-2 border-white rounded-[30px] h-[39px] px-5 flex items-center bg-white bg-opacity-10 backdrop-blur-sm">
              <p className="text-white text-base font-medium">
                Feel Connected
              </p>
            </div>
          </div>

          {/* Inspirational Message Box */}
          <div className="bg-white bg-opacity-25 backdrop-blur-md rounded-[30px] p-6 shadow-xl border border-white border-opacity-30 relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-6 left-8 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-700"></div>
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
            </div>
            
            <p className="text-white text-2xl leading-relaxed font-medium relative z-10 transform group-hover:scale-105 transition-all duration-500 ease-out">
              {displayedText}
              {isTyping && <span className="animate-pulse text-yellow-300">|</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
