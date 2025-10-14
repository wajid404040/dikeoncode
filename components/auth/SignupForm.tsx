"use client";

import { useState, useEffect } from "react";

// Figma assets
const imgImage13 = "http://localhost:3845/assets/a1eb02db95b97cb7c35e10dcaa1fff5e846a5cac.png";
const imgImage14 = "http://localhost:3845/assets/ab427fd396d3603f994c97b68a78e59355280a69.png";
const imgChatGptImageJul162025065935Am1 = "http://localhost:3845/assets/4047fb19aefcae7e4f5897acf3548dde3e6292b1.png";
const imgAsset6DknLogo = "http://localhost:3845/assets/b4ea37d37c887c1be8a5b84f561da456f4b202dd.svg";
const imgAsset6DknLogo1 = "http://localhost:3845/assets/000463c4267da174b0a6c9f8fc41d99fb158b2e8.svg";

interface SignupFormProps {
  onSignup: (name: string, surname: string, email: string, password: string, picture?: string) => Promise<void>;
  onSwitchToLogin: () => void;
  error: string;
}

export function SignupForm({ onSignup, onSwitchToLogin, error }: SignupFormProps) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Typing effect state
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const fullText = "We envision a world where feelings are no longer invisible: where therapy is smarter, care is faster, and digital spaces feel truly human again.";
  
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
    if (!name || !surname || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;

    setIsLoading(true);
    try {
      await onSignup(name, surname, email, password, undefined);
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
            Join Dikeon
          </h1>
          <p className="text-xl text-black">
            Join your emotional support journey
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

            {/* Name Fields - Side by Side */}
            <div className="flex gap-4">
              <div className="w-1/2 space-y-3">
                <label className="text-xl text-black block">
                  First Name
                </label>
                <div className="bg-white border border-orange-200 rounded-[30px] h-[50px] flex items-center px-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-black placeholder-gray-400"
                    placeholder="First name"
                    required
                  />
                  <div className="w-[18px] h-[18px] opacity-50">
                    <img alt="" className="w-full h-full" src={imgAsset6DknLogo1} />
                  </div>
                </div>
              </div>

              <div className="w-1/2 space-y-3">
                <label className="text-xl text-black block">
                  Last Name
                </label>
                <div className="bg-white border border-orange-200 rounded-[30px] h-[50px] flex items-center px-4">
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-black placeholder-gray-400"
                    placeholder="Last name"
                    required
                  />
                  <div className="w-[18px] h-[18px] opacity-50">
                    <img alt="" className="w-full h-full" src={imgAsset6DknLogo1} />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field - Full Width */}
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

            {/* Password Fields - Side by Side */}
            <div className="flex gap-4">
              <div className="w-1/2 space-y-3">
                <label className="text-xl text-black block">
                  Password
                </label>
                <div className="bg-white border border-orange-200 rounded-[30px] h-[50px] flex items-center px-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-black placeholder-gray-400"
                    placeholder="Create password"
                    required
                  />
                  <div className="w-[18px] h-[18px] opacity-50">
                    <img alt="" className="w-full h-full" src={imgAsset6DknLogo1} />
                  </div>
                </div>
              </div>

              <div className="w-1/2 space-y-3">
                <label className="text-xl text-black block">
                  Confirm Password
                </label>
                <div className="bg-white border border-orange-200 rounded-[30px] h-[50px] flex items-center px-4">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-black placeholder-gray-400"
                    placeholder="Confirm password"
                    required
                  />
                  <div className="w-[18px] h-[18px] opacity-50">
                    <img alt="" className="w-full h-full" src={imgAsset6DknLogo1} />
                  </div>
                </div>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading || !name || !surname || !email || !password || !confirmPassword || password !== confirmPassword}
              className="bg-[#ff7b00] h-[50px] px-10 py-3 rounded-[30px] text-white text-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-xl text-black">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-orange-400 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - Inspirational Panel (40%) - Different background for signup */}
      <div className="w-[40%] relative flex flex-col justify-end p-8 overflow-hidden">
        {/* Background Images with proper masking - Two layered images for signup */}
        <div className="absolute inset-0">
          {/* First background image */}
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
          {/* Second background image (ChatGPT image) */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${imgChatGptImageJul162025065935Am1}')`,
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

          {/* Inspirational Message Box - Orange tinted background for signup */}
          <div className="bg-orange-400 bg-opacity-15 backdrop-blur-md rounded-[30px] p-6 shadow-xl border border-white border-opacity-30 relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-3 left-6 w-1 h-1 bg-orange-200/70 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-orange-100/50 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-8 left-6 w-1 h-1 bg-orange-300/60 rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-3 right-6 w-1 h-1 bg-orange-200/40 rounded-full animate-pulse delay-800"></div>
            </div>
            
            <p className="text-white text-2xl leading-relaxed font-medium relative z-10 transform group-hover:scale-105 transition-all duration-500 ease-out">
              {displayedText}
              {isTyping && <span className="animate-pulse text-orange-300">|</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
