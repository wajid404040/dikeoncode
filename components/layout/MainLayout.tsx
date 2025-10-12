'use client';

import React, { useState } from 'react';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  currentPage = 'dashboard',
  onNavigate 
}) => {
  const [notifications, setNotifications] = useState(1); // Mock notification count

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
    // Handle notification logic
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Handle profile logic
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-collapsed)' }}>
        {/* Header */}
        <Header 
          onNotificationClick={handleNotificationClick}
          onProfileClick={handleProfileClick}
        />
        
        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
