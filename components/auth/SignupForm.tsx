"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Brain } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const isFormValid = name && surname && email && password && confirmPassword && password === confirmPassword;

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent">
          Join DIA
        </h1>
        <p className="text-slate-300">Create your AI emotional support account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-white/80">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:bg-white/20 focus:outline-none"
                placeholder="First name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="surname" className="text-sm font-medium text-white/80">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:bg-white/20 focus:outline-none"
                placeholder="Last name"
                required
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:bg-white/20 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/80">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:bg-white/20 focus:outline-none"
                placeholder="Create password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-12 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all focus:border-purple-500/50 focus:bg-white/20 focus:outline-none"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center">
          <p className="text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-purple-400 transition-colors hover:text-purple-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
