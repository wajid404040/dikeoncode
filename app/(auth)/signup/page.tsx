'use client';

import React, { useState } from 'react';
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
  const { signup } = useAuth();
  const router = useRouter();

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
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const [firstName, ...lastNameParts] = formData.name.split(' ');
      const lastName = lastNameParts.join(' ');
      await signup(firstName, lastName, formData.email, formData.password);
      // AuthProvider will handle the redirect
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F9F4ED' }}>
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FF7B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-primary text-2xl font-bold">D</span>
            </div>
            <h1 className="font-primary text-4xl mb-2 text-black">
              Join Dikeon AI
            </h1>
            <p className="font-secondary text-xl text-black/50">
              Start your emotional wellness journey
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-secondary text-sm mb-2 text-black">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.name.split(' ')[0] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: `${e.target.value} ${prev.name.split(' ')[1] || ''}`.trim() }))}
                  className="w-full h-12 bg-white border border-[rgba(255,123,0,0.2)] rounded-[31px] px-5 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-secondary text-sm mb-2 text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.name.split(' ')[1] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: `${prev.name.split(' ')[0] || ''} ${e.target.value}`.trim() }))}
                  className="w-full h-12 bg-white border border-[rgba(255,123,0,0.2)] rounded-[31px] px-5 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block font-secondary text-sm mb-2 text-black">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-12 bg-white border border-[rgba(255,123,0,0.2)] rounded-[31px] px-5 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block font-secondary text-sm mb-2 text-black">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full h-12 bg-white border border-[rgba(255,123,0,0.2)] rounded-[31px] px-5 pr-12 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                    placeholder="Create password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/50"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M17.5 10C15.5 13.5 12.5 15.5 10 15.5C7.5 15.5 4.5 13.5 2.5 10C4.5 6.5 7.5 4.5 10 4.5C12.5 4.5 15.5 6.5 17.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-secondary text-sm mb-2 text-black">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full h-12 bg-white border border-[rgba(255,123,0,0.2)] rounded-[31px] px-5 pr-12 text-black placeholder-black/50 focus:outline-none focus:border-[#FF7B00]"
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/50"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M17.5 10C15.5 13.5 12.5 15.5 10 15.5C7.5 15.5 4.5 13.5 2.5 10C4.5 6.5 7.5 4.5 10 4.5C12.5 4.5 15.5 6.5 17.5 10Z" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 mt-1"
                style={{ accentColor: '#FF7B00' }}
                required
              />
              <label htmlFor="agreeToTerms" className="ml-2 font-secondary text-sm text-black/50">
                I agree to the{' '}
                <Link href="/terms" className="underline text-[rgba(255,123,0,0.4)]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline text-[rgba(255,123,0,0.4)]">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FF7B00] text-white rounded-[30px] font-primary text-lg font-medium hover:bg-[#e66a00] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="font-secondary text-sm text-black/50">
              Already have an account?{' '}
              <Link 
                href="/signin" 
                className="font-medium text-[rgba(255,123,0,0.4)]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Quote */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="text-center max-w-md">
          <div 
            className="p-8 rounded-3xl mb-6"
            style={{ backgroundColor: 'rgba(255,123,0,0.15)' }}
          >
            <blockquote className="font-secondary text-xl italic mb-4 text-black">
              "Every step forward in understanding your emotions is a step toward a healthier, happier you."
            </blockquote>
            <cite className="font-secondary text-sm text-black/50">
              - Dikeon AI Team
            </cite>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-[#FF7B00] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-secondary text-lg text-black">
                Track your emotional journey
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-[#FF7B00] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <span className="font-secondary text-lg text-black">
                Connect with supportive community
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-[#FF7B00] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-secondary text-lg text-black">
                Get personalized insights
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
