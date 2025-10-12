'use client';

import { useAuth } from "../components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard');
    } else {
        // User is not authenticated, redirect to sign in
        router.push('/signin');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div className="text-center">
          <div className="w-16 h-16 bg-[var(--accent-orange)] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-primary text-2xl font-bold">D</span>
                </div>
          <p className="font-secondary text-lg" style={{ color: 'var(--text-muted)' }}>
            Loading Dikeon AI...
          </p>
          </div>
        </div>
    );
  }

  return null;
}
