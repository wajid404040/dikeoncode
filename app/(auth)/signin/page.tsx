'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Redirect will be handled by useEffect when user state updates
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF7B00] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-primary text-2xl font-bold">D</span>
          </div>
          <p className="font-secondary text-lg text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      {/* Login Section - centered on white background */}
      <div className="bg-[#f9f4ed] rounded-[30px] overflow-hidden flex max-w-6xl w-full shadow-lg relative">
        {/* Left Side - Form */}
        <div className="flex-1 p-12 flex flex-col justify-center relative">
          {/* Logo */}
          <div className="absolute top-8 left-8 w-14 h-14">
            <div className="w-full h-full bg-[#FF7B00] rounded-full flex items-center justify-center">
              <span className="text-white font-primary text-xl font-bold">D</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-primary text-[40px] font-medium text-black mb-4">
              Welcome Back
            </h1>
            <p className="font-secondary text-[20px] text-black">
              Sign in to your emotional support space
            </p>
          </div>

          {/* Form */}
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {/* Email Field */}
              <div>
                <label className="block font-secondary text-[20px] text-black mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-secondary text-[20px] text-black mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF7B00] text-white rounded-[30px] h-[50px] font-primary text-[20px] font-medium hover:bg-[#e66a00] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="font-primary text-[20px] text-black">
                <span>Don't have an account? </span>
                <Link 
                  href="/signup" 
                  className="text-[rgba(255,123,0,0.4)]"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Orange to Blue Gradient */}
        <div className="flex-1 relative bg-gradient-to-br from-orange-500 via-orange-400 to-blue-500 flex flex-col justify-end p-5">
          {/* Content Container */}
          <div className="flex flex-col gap-7 w-[647px]">
            {/* Tags */}
            <div className="flex gap-8">
              <div className="border border-white h-[39px] rounded-[30px] w-[114px] flex items-center justify-center">
                <span className="font-secondary text-[16px] text-white">Feel Seen</span>
              </div>
              <div className="border border-white h-[39px] rounded-[30px] w-[160px] flex items-center justify-center">
                <span className="font-secondary text-[16px] text-white">Feel Connected</span>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-white/20 backdrop-blur-sm rounded-[30px] h-[206px] flex items-center px-6 py-14 shadow-lg">
              <p className="font-secondary text-[24px] text-white leading-normal w-[598px]">
                We hope to give every voice the space to be heard, understood, and felt - because no one should carry their emotions alone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
