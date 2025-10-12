'use client';

import React from 'react';

interface HeaderProps {
  currentMood?: string;
  moodDescription?: string;
  monitorStatus?: 'on' | 'off';
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentMood = 'Feeling Calm',
  moodDescription = 'Based on recent check-ins',
  monitorStatus = 'off',
  onNotificationClick,
  onProfileClick
}) => {
  const activityBars = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex items-center justify-between w-full px-8 py-5">
      {/* Left Section - Mood Status and Monitor */}
      <div className="flex items-center gap-6">
        {/* Mood Status Card */}
        <div className="card flex flex-col items-center px-8 py-2 min-w-[202px]">
          <p className="font-primary text-xl" style={{ color: 'var(--accent-orange)' }}>
            {currentMood}
          </p>
          <p className="font-secondary text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {moodDescription}
          </p>
        </div>

        {/* Monitor Status Card */}
        <div className="card flex flex-col items-center px-6 py-1 min-w-[92px]">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 mb-1">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 23L15 19L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="font-secondary text-xs" style={{ color: 'var(--accent-purple)' }}>
              Monitor: {monitorStatus === 'on' ? 'On' : 'Off'}
            </p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="flex items-center gap-1">
          {activityBars.map((_, index) => (
            <div
              key={index}
              className="activity-bar"
              style={{
                height: Math.random() > 0.5 ? '22px' : '16px',
                opacity: Math.random() > 0.3 ? 1 : 0.5
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button
          onClick={onNotificationClick}
          className="card w-20 h-20 flex items-center justify-center p-6 relative"
        >
          <div className="relative">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Notification Dot */}
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--accent-orange)' }}
            />
          </div>
        </button>

        {/* Profile Avatar */}
        <button
          onClick={onProfileClick}
          className="card w-20 h-20 flex items-center justify-center p-1.5"
        >
          <div className="w-17 h-17 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-primary text-lg font-bold">JD</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
