"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { PersonalizationFlow } from "../PersonalizationFlow";
import { WaitlistStatus } from "../WaitlistStatus";

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  picture?: string;
  selectedAvatar?: string;
  selectedVoice?: string;
  status: "WAITLIST" | "APPROVED" | "REJECTED";
  approvedAt?: Date;
  voiceSettings?: {
    speed?: number;
    pitch?: number;
    volume?: number;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, surname: string, email: string, password: string, picture?: string) => Promise<void>;
  logout: () => void;
  switchToSignup: () => void;
  switchToLogin: () => void;
  isSignupMode: boolean;
  updateUserPreferences: (selectedAvatar: string, selectedVoice: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPersonalization, setShowPersonalization] = useState(false);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem("auth-token");
    if (token) {
      // Verify token and get user data
      verifyToken(token);
    } else {
      setLoading(false);
    }

    // Check if user has already completed personalization
    const hasCompletedPersonalization = localStorage.getItem("personalization-completed");
    if (hasCompletedPersonalization === "true") {
      setShowPersonalization(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem("auth-token", token);

        // Only show personalization if user is approved AND missing preferences
        if (userData.user.status === "APPROVED" && (!userData.user.selectedAvatar || !userData.user.selectedVoice)) {
          // Check if user has already completed personalization
          const hasCompletedPersonalization = localStorage.getItem("personalization-completed");
          if (hasCompletedPersonalization !== "true") {
            setShowPersonalization(true);
          } else {
            setShowPersonalization(false);
          }
        } else {
          setShowPersonalization(false); // Explicitly hide if preferences are set
        }
      } else {
        localStorage.removeItem("auth-token");
      }
    } catch (error) {
      localStorage.removeItem("auth-token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("auth-token", data.token);
        setIsSignupMode(false);

        // Only show personalization if user is approved AND missing preferences
        if (data.user.status === "APPROVED" && (!data.user.selectedAvatar || !data.user.selectedVoice)) {
          // Check if user has already completed personalization
          const hasCompletedPersonalization = localStorage.getItem("personalization-completed");
          if (hasCompletedPersonalization !== "true") {
            setShowPersonalization(true);
          } else {
            setShowPersonalization(false);
          }
        } else {
          setShowPersonalization(false); // Explicitly hide if preferences are set
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

  const signup = async (name: string, surname: string, email: string, password: string, picture?: string) => {
    setError("");
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, email, password, picture }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("auth-token", data.token);
        setIsSignupMode(false);

        // New users always need personalization
        setShowPersonalization(true);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("An error occurred during signup");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("personalization-completed");
  };

  const switchToSignup = () => setIsSignupMode(true);
  const switchToLogin = () => setIsSignupMode(false);

  const updateUserPreferences = async (selectedAvatar: string, selectedVoice: string) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/auth/update-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ selectedAvatar, selectedVoice }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setShowPersonalization(false); // Hide personalization after completion

        // Mark personalization as completed in localStorage
        localStorage.setItem("personalization-completed", "true");
      }
    } catch (error) {
      console.error("Failed to update user preferences:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        {isSignupMode ? (
          <SignupForm onSignup={signup} onSwitchToLogin={switchToLogin} error={error} />
        ) : (
          <LoginForm onLogin={login} onSwitchToSignup={switchToSignup} error={error} />
        )}
      </div>
    );
  }

  // Show waitlist status if user is not approved
  if (user.status === "WAITLIST") {
    return <WaitlistStatus status="WAITLIST" />;
  }

  if (user.status === "REJECTED") {
    return <WaitlistStatus status="REJECTED" />;
  }

  // Show personalization flow if needed
  if (showPersonalization) {
    return <PersonalizationFlow onComplete={updateUserPreferences} onSkip={() => setShowPersonalization(false)} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        switchToSignup,
        switchToLogin,
        isSignupMode,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
