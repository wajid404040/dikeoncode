'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      await signup(firstName, lastName, formData.email, formData.password);
      // Redirect will be handled by useEffect when user state updates
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error('Sign up error:', error);
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
      {/* Signup Section - centered on white background */}
      <div className="bg-[#f9f4ed] rounded-[30px] overflow-hidden flex max-w-6xl w-full shadow-lg relative">
        {/* Left Side - Form */}
        <div className="flex-1 p-12 flex flex-col justify-center relative">
          {/* Logo */}
          <div className="absolute left-8 top-8 w-[58px] h-[58px] overflow-hidden">
            <img alt="" className="block max-w-none w-full h-full" src="http://localhost:3845/assets/b4ea37d37c887c1be8a5b84f561da456f4b202dd.svg" />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-primary text-[40px] font-medium text-black mb-4">
              Join Dikeon
            </h1>
            <p className="font-secondary text-[20px] text-black">
              Join your emotional support journey
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
              
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-secondary text-[20px] text-black mb-3">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.name.split(' ')[0] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: `${e.target.value} ${prev.name.split(' ')[1] || ''}`.trim() }))}
                    className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block font-secondary text-[20px] text-black mb-3">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.name.split(' ')[1] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: `${prev.name.split(' ')[0] || ''} ${e.target.value}`.trim() }))}
                    className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-secondary text-[20px] text-black mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-secondary text-[20px] text-black mb-3">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    name="password"
                    className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                    placeholder="Create password"
                    required
                  />
                </div>
                <div>
                  <label className="block font-secondary text-[20px] text-black mb-3">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    name="confirmPassword"
                    className="w-full h-[50px] bg-white border border-[rgba(255,123,0,0.2)] rounded-[30px] px-4 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF7B00] text-white rounded-[30px] h-[50px] font-primary text-[20px] font-medium hover:bg-[#e66a00] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-8">
              <p className="font-primary text-[20px] text-black">
                <span>Already have an account? </span>
                <Link
                  href="/signin"
                  className="text-[rgba(255,123,0,0.4)]"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Exact Figma Structure */}
        <div className="flex-1 relative flex flex-col justify-end px-[11px] py-5 h-[962px] w-[678px]">
          {/* Background Images - With rotation */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Main background image - the hands image with rotation */}
            <div className="absolute left-[-500px] top-[50px] w-[1500px] h-[1200px]">
              <div className="rotate-[-45deg] w-full h-full">
                <img 
                  alt="Background hands" 
                  className="w-full h-full object-cover object-center opacity-50" 
                  src="http://localhost:3845/assets/4047fb19aefcae7e4f5897acf3548dde3e6292b1.png"
                  onError={(e) => {
                    console.log('Background image failed to load');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
            
            {/* Secondary background image with different rotation */}
            <div className="absolute left-[-400px] bottom-[-100px] w-[1200px] h-[1100px]">
              <div className="rotate-[30deg] w-full h-full">
                <img 
                  alt="Secondary background" 
                  className="w-full h-full object-cover object-center opacity-40" 
                  src="http://localhost:3845/assets/ab427fd396d3603f994c97b68a78e59355280a69.png"
                  onError={(e) => {
                    console.log('Secondary background image failed to load');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Container - Exact Figma structure */}
          <div className="flex flex-col gap-7 w-[647px] relative">
            {/* Tags */}
            <div className="flex gap-8">
              <div className="border border-white h-[39px] rounded-[30px] w-[114px] relative">
                <div className="absolute bg-[rgba(255,255,255,0)] h-[62px] left-0 rounded-[30px] top-0 w-[227px]" />
                <p className="absolute font-secondary font-normal left-[21px] text-[16px] text-white top-[9px] whitespace-pre">
                  Feel Seen
                </p>
              </div>
              <div className="border border-white h-[39px] rounded-[30px] w-[160px] relative">
                <div className="absolute bg-[rgba(255,255,255,0)] h-[62px] left-0 rounded-[30px] top-0 w-[227px]" />
                <p className="absolute font-secondary font-normal left-[21px] text-[16px] text-white top-[9px] whitespace-pre">
                  Feel Connected
                </p>
              </div>
            </div>

            {/* Quote Card */}
            <div className="flex gap-[10px] h-[206px] items-center px-6 py-14 relative w-full">
              <div className="absolute bg-[rgba(0,0,0,0)] h-[206px] left-0 rounded-[30px] top-0 w-[647px]">
                <div className="absolute bg-[rgba(255,123,0,0.15)] h-[206px] left-0 rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] top-0 w-[647px]" />
              </div>
              <p className="font-secondary font-normal text-[24px] text-white w-[598px] relative">
                We envision a world where feelings are no longer invisible: where therapy is smarter, care is faster, and digital spaces feel truly human again.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
