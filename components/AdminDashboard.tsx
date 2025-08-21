"use client";

import { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Clock, RefreshCw, Eye } from "lucide-react";

interface WaitlistUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  createdAt: string;
  status: string;
}

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAdminAuthorization();
  }, []);

  const checkAdminAuthorization = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      // Verify the user is actually admin@dia.com
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user?.email === "admin@dia.com" && data.user?.status === "APPROVED") {
          setIsAuthorized(true);
          fetchWaitlistUsers();
        } else {
          setIsAuthorized(false);
          console.error("Unauthorized access attempt to admin dashboard");
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error checking admin authorization:", error);
      setIsAuthorized(false);
    }
  };

  const fetchWaitlistUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/waitlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWaitlistUsers(data.users);
      } else {
        console.error("Failed to fetch waitlist users");
      }
    } catch (error) {
      console.error("Error fetching waitlist users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: "APPROVED" | "REJECTED") => {
    setProcessing(userId);

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/approve-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, action }),
      });

      if (response.ok) {
        // Remove user from waitlist
        setWaitlistUsers((prev) => prev.filter((user) => user.id !== userId));
      } else {
        console.error(`Failed to ${action.toLowerCase()} user`);
      }
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing user:`, error);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Loading waitlist...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-md rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-900/95 to-slate-900/95 p-8 text-center backdrop-blur-xl">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-white">Access Denied</h2>
          <p className="mb-6 text-red-300">You are not authorized to access the admin dashboard.</p>
          <button
            onClick={onClose}
            className="rounded-xl bg-red-500/20 px-6 py-2 text-red-300 transition-all hover:bg-red-500/30"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Manage user waitlist</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchWaitlistUsers}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {waitlistUsers.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">No pending approvals</h3>
              <p className="text-slate-400">All users have been processed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Pending Approvals ({waitlistUsers.length})</h2>
              </div>

              {waitlistUsers.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-white/20 bg-white/10 p-4 transition-all hover:bg-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                          {user.name.charAt(0)}
                          {user.surname.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {user.name} {user.surname}
                          </h3>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied {formatDate(user.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Status: Pending
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUserAction(user.id, "APPROVED")}
                        disabled={processing === user.id}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-all hover:bg-green-700 disabled:opacity-50"
                      >
                        {processing === user.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Approve
                      </button>

                      <button
                        onClick={() => handleUserAction(user.id, "REJECTED")}
                        disabled={processing === user.id}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-all hover:bg-red-700 disabled:opacity-50"
                      >
                        {processing === user.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
