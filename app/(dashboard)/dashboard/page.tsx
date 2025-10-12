'use client';

import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';

const DashboardPage: React.FC = () => {
  const [hasLoggedData, setHasLoggedData] = useState(false); // This would come from your data

  return (
    <MainLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="font-primary text-4xl" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p className="font-secondary text-xl" style={{ color: 'var(--text-muted)' }}>
            {hasLoggedData ? 'Your emotional journey overview' : 'Start your emotional wellness journey'}
          </p>
        </div>

        {!hasLoggedData ? (
          /* Empty State - No Log */
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="card">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[var(--accent-orange)] rounded-full flex items-center justify-center mx-auto">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35Z" stroke="white" strokeWidth="2"/>
                    <path d="M20 12V20L26.5 26.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="font-primary text-2xl" style={{ color: 'var(--text-primary)' }}>
                  Welcome to Dikeon AI
                </h2>
                <p className="font-secondary text-lg max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                  Your AI companion is ready to help you track and understand your emotions. Start your first check-in to begin your journey.
                </p>
                <button className="btn-primary mt-4">
                  Start Your First Check-in
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--accent-orange)] rounded-full flex items-center justify-center mx-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-primary text-lg" style={{ color: 'var(--text-primary)' }}>
                  Real-time Emotion Detection
                </h3>
                <p className="font-secondary text-sm" style={{ color: 'var(--text-muted)' }}>
                  Advanced AI analyzes your emotions through voice and video
                </p>
              </div>

              <div className="card text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--accent-orange)] rounded-full flex items-center justify-center mx-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-primary text-lg" style={{ color: 'var(--text-primary)' }}>
                  AI-Powered Support
                </h3>
                <p className="font-secondary text-sm" style={{ color: 'var(--text-muted)' }}>
                  Get personalized insights and emotional support from your AI companion
                </p>
              </div>

              <div className="card text-center space-y-3">
                <div className="w-12 h-12 bg-[var(--accent-orange)] rounded-full flex items-center justify-center mx-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-primary text-lg" style={{ color: 'var(--text-primary)' }}>
                  Track Your Journey
                </h3>
                <p className="font-secondary text-sm" style={{ color: 'var(--text-muted)' }}>
                  Monitor your emotional patterns and progress over time
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Populated State - With Data */
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-secondary text-sm" style={{ color: 'var(--text-muted)' }}>
                      Today's Mood
                    </p>
                    <p className="font-primary text-2xl" style={{ color: 'var(--accent-orange)' }}>
                      Calm
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[var(--accent-orange)] rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">😊</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-secondary text-sm" style={{ color: 'var(--text-muted)' }}>
                      Check-ins This Week
                    </p>
                    <p className="font-primary text-2xl" style={{ color: 'var(--text-primary)' }}>
                      12
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[var(--accent-blue)] rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-secondary text-sm" style={{ color: 'var(--text-muted)' }}>
                      AI Responses
                    </p>
                    <p className="font-primary text-2xl" style={{ color: 'var(--text-primary)' }}>
                      8
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[var(--accent-purple)] rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="font-primary text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-orange-bg)' }}>
                  <div className="w-10 h-10 bg-[var(--accent-orange)] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">😊</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-secondary text-sm" style={{ color: 'var(--text-primary)' }}>
                      Check-in completed - Feeling calm and content
                    </p>
                    <p className="font-secondary text-xs" style={{ color: 'var(--text-muted)' }}>
                      2 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-orange-bg)' }}>
                  <div className="w-10 h-10 bg-[var(--accent-orange)] rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 1L12.5 6.5L18.5 7.5L14 11.5L15 17.5L10 14.5L5 17.5L6 11.5L1.5 7.5L7.5 6.5L10 1Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-secondary text-sm" style={{ color: 'var(--text-primary)' }}>
                      AI provided personalized insights
                    </p>
                    <p className="font-secondary text-xs" style={{ color: 'var(--text-muted)' }}>
                      4 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-primary text-xl mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-primary h-12">
                  Start New Check-in
                </button>
                <button className="h-12 border border-[var(--accent-orange)] rounded-[var(--border-radius)] font-primary text-[var(--accent-orange)] hover:bg-[var(--accent-orange-bg)] transition-colors">
                  View Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
