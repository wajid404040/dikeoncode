"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown,
  Bug,
  Lightbulb,
  Heart,
  Settings,
  User,
  Mail,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  Award,
  Zap,
  Shield,
  Bell,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface Feedback {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved" | "closed";
  rating?: number;
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  adminResponseDate?: string;
}

interface FeedbackStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  averageRating: number;
}

export function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    averageRating: 0,
  });

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium" as "low" | "medium" | "high",
    rating: 5,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const categories = [
    { id: "general", label: "General Feedback", icon: MessageSquare, color: "blue" },
    { id: "bug", label: "Bug Report", icon: Bug, color: "red" },
    { id: "feature", label: "Feature Request", icon: Lightbulb, color: "green" },
    { id: "ui", label: "UI/UX", icon: Settings, color: "purple" },
    { id: "performance", label: "Performance", icon: Zap, color: "orange" },
    { id: "support", label: "Support", icon: Heart, color: "pink" },
  ];

  const priorities = [
    { id: "low", label: "Low", color: "green", icon: CheckCircle },
    { id: "medium", label: "Medium", color: "yellow", icon: AlertCircle },
    { id: "high", label: "High", color: "red", icon: AlertCircle },
  ];

  const statuses = [
    { id: "pending", label: "Pending", color: "yellow", icon: Clock },
    { id: "in_progress", label: "In Progress", color: "blue", icon: Activity },
    { id: "resolved", label: "Resolved", color: "green", icon: CheckCircle },
    { id: "closed", label: "Closed", color: "gray", icon: EyeOff },
  ];

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/feedback/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: "",
          description: "",
          category: "general",
          priority: "medium",
          rating: 5,
        });
        fetchFeedbackData();
        alert("Feedback submitted successfully! Thank you for your input.");
      } else {
        alert("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : MessageSquare;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : "blue";
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.id === status);
    return statusObj ? statusObj.color : "gray";
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.id === priority);
    return priorityObj ? priorityObj.color : "yellow";
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

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f4ed] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f4ed] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Feedback Center</h1>
              <p className="text-lg text-gray-600">
                Share your thoughts and help us improve DIA
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("submit")}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === "submit"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                My Feedback ({feedback.length})
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Feedback</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">{stats.resolved}</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "submit" ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Share Your Feedback</h2>
                <p className="text-gray-600">
                  Help us improve DIA by sharing your thoughts, reporting bugs, or suggesting new features
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of your feedback"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: category.id })}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            formData.category === category.id
                              ? `border-${category.color}-400 bg-${category.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                            formData.category === category.id
                              ? `text-${category.color}-600`
                              : "text-gray-400"
                          }`} />
                          <div className={`text-sm font-medium ${
                            formData.category === category.id
                              ? `text-${category.color}-700`
                              : "text-gray-600"
                          }`}>
                            {category.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <div className="flex gap-3">
                    {priorities.map((priority) => {
                      const IconComponent = priority.icon;
                      return (
                        <button
                          key={priority.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: priority.id as any })}
                          className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                            formData.priority === priority.id
                              ? `border-${priority.color}-400 bg-${priority.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 mx-auto mb-1 ${
                            formData.priority === priority.id
                              ? `text-${priority.color}-600`
                              : "text-gray-400"
                          }`} />
                          <div className={`text-sm font-medium ${
                            formData.priority === priority.id
                              ? `text-${priority.color}-700`
                              : "text-gray-600"
                          }`}>
                            {priority.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.rating}/5 stars
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please provide detailed information about your feedback..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting || !formData.title.trim() || !formData.description.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search feedback..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-orange-100">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No feedback found</h3>
                  <p className="text-gray-500">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't submitted any feedback yet"
                    }
                  </p>
                </div>
              ) : (
                filteredFeedback.map((item) => {
                  const CategoryIcon = getCategoryIcon(item.category);
                  const categoryColor = getCategoryColor(item.category);
                  const statusColor = getStatusColor(item.status);
                  const priorityColor = getPriorityColor(item.priority);

                  return (
                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-${categoryColor}-100 rounded-xl flex items-center justify-center`}>
                            <CategoryIcon className={`w-6 h-6 text-${categoryColor}-600`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-black mb-1">{item.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="capitalize">{item.category}</span>
                              <span>•</span>
                              <span className="capitalize">{item.priority} priority</span>
                              <span>•</span>
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <p className="text-gray-600 line-clamp-2">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700`}>
                            {item.status.replace('_', ' ')}
                          </span>
                          {item.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{item.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.adminResponse && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-4">
                          <div className="flex items-center gap-2 text-orange-700 mb-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">Admin Response</span>
                            <span className="text-xs text-orange-600">
                              {item.adminResponseDate && formatDate(item.adminResponseDate)}
                            </span>
                          </div>
                          <p className="text-orange-800 text-sm">{item.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
