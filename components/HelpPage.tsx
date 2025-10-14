"use client";

import { useState, useEffect } from "react";
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Calendar,
  Eye,
  EyeOff,
  Star,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Settings,
  Heart,
  Shield,
  Zap,
  Users,
  BookOpen,
  MessageCircle,
  Headphones,
  LifeBuoy,
  Info,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Bell,
  Flag,
  Award,
  TrendingUp,
  BarChart3,
  Activity
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  adminResponseDate?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

export function HelpPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "complaint" | "contact">("faq");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Form states
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    description: "",
    category: "technical",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general" as "general" | "support" | "business" | "partnership",
  });

  const complaintCategories = [
    { id: "technical", label: "Technical Issue", icon: Bug, color: "red" },
    { id: "billing", label: "Billing Problem", icon: Settings, color: "blue" },
    { id: "account", label: "Account Issue", icon: User, color: "green" },
    { id: "feature", label: "Feature Request", icon: Zap, color: "purple" },
    { id: "privacy", label: "Privacy Concern", icon: Shield, color: "orange" },
    { id: "other", label: "Other", icon: MessageSquare, color: "gray" },
  ];

  const priorities = [
    { id: "low", label: "Low", color: "green", icon: CheckCircle },
    { id: "medium", label: "Medium", color: "yellow", icon: AlertCircle },
    { id: "high", label: "High", color: "orange", icon: AlertTriangle },
    { id: "urgent", label: "Urgent", color: "red", icon: AlertTriangle },
  ];

  const contactTypes = [
    { id: "general", label: "General Inquiry", icon: MessageCircle },
    { id: "support", label: "Technical Support", icon: Headphones },
    { id: "business", label: "Business Inquiry", icon: Users },
    { id: "partnership", label: "Partnership", icon: Award },
  ];

  const faqCategories = [
    { id: "all", label: "All Questions" },
    { id: "getting-started", label: "Getting Started" },
    { id: "account", label: "Account & Profile" },
    { id: "features", label: "Features" },
    { id: "technical", label: "Technical Support" },
    { id: "billing", label: "Billing & Subscription" },
    { id: "privacy", label: "Privacy & Security" },
  ];

  useEffect(() => {
    fetchHelpData();
  }, []);

  const fetchHelpData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      
      // Fetch complaints
      const complaintsResponse = await fetch("/api/help/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json();
        setComplaints(complaintsData.complaints || []);
      }

      // Fetch FAQs
      const faqsResponse = await fetch("/api/help/faqs");
      if (faqsResponse.ok) {
        const faqsData = await faqsResponse.json();
        setFaqs(faqsData.faqs || []);
      }
    } catch (error) {
      console.error("Error fetching help data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.title.trim() || !complaintForm.description.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/help/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(complaintForm),
      });

      if (response.ok) {
        setComplaintForm({
          title: "",
          description: "",
          category: "technical",
          priority: "medium",
        });
        fetchHelpData();
        alert("Complaint submitted successfully! We'll review it and get back to you soon.");
      } else {
        alert("Failed to submit complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/help/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: "",
          type: "general",
        });
        alert("Message sent successfully! We'll get back to you within 24 hours.");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = complaintCategories.find(c => c.id === categoryId);
    return category ? category.icon : MessageSquare;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = complaintCategories.find(c => c.id === categoryId);
    return category ? category.color : "blue";
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

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredComplaints = complaints.filter(complaint => 
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f4ed] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
              <h1 className="text-4xl font-bold text-black mb-2">Help & Support</h1>
              <p className="text-lg text-gray-600">
                Get help, submit complaints, or contact our support team
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("faq")}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === "faq"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab("complaint")}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === "complaint"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                Submit Complaint
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeTab === "contact"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === "faq" && (
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
                    placeholder="Search FAQ..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                >
                  {faqCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-orange-100">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No FAQs found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-black pr-4">{faq.question}</h3>
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6">
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          <div className="flex items-center gap-4 mt-4">
                            <button className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful ({faq.helpful})
                            </button>
                            <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
                              <ThumbsDown className="w-4 h-4" />
                              Not Helpful ({faq.notHelpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "complaint" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submit Complaint Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Submit a Complaint</h2>
                <p className="text-gray-600">
                  Report issues or concerns and we'll address them promptly
                </p>
              </div>

              <form onSubmit={handleComplaintSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                    placeholder="Brief description of your complaint"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {complaintCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setComplaintForm({ ...complaintForm, category: category.id })}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            complaintForm.category === category.id
                              ? `border-${category.color}-400 bg-${category.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                            complaintForm.category === category.id
                              ? `text-${category.color}-600`
                              : "text-gray-400"
                          }`} />
                          <div className={`text-sm font-medium ${
                            complaintForm.category === category.id
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
                          onClick={() => setComplaintForm({ ...complaintForm, priority: priority.id as any })}
                          className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                            complaintForm.priority === priority.id
                              ? `border-${priority.color}-400 bg-${priority.color}-50`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`w-5 h-5 mx-auto mb-1 ${
                            complaintForm.priority === priority.id
                              ? `text-${priority.color}-600`
                              : "text-gray-400"
                          }`} />
                          <div className={`text-sm font-medium ${
                            complaintForm.priority === priority.id
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    placeholder="Please provide detailed information about your complaint..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !complaintForm.title.trim() || !complaintForm.description.trim()}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Complaint History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-xl font-semibold text-black mb-6">Your Complaints</h3>
              <div className="space-y-4">
                {filteredComplaints.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No complaints submitted yet</p>
                  </div>
                ) : (
                  filteredComplaints.map((complaint) => {
                    const CategoryIcon = getCategoryIcon(complaint.category);
                    const categoryColor = getCategoryColor(complaint.category);
                    const priorityColor = getPriorityColor(complaint.priority);

                    return (
                      <div key={complaint.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-${categoryColor}-100 rounded-lg flex items-center justify-center`}>
                              <CategoryIcon className={`w-4 h-4 text-${categoryColor}-600`} />
                            </div>
                            <div>
                              <h4 className="font-medium text-black">{complaint.title}</h4>
                              <p className="text-sm text-gray-500">{formatDate(complaint.createdAt)}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${priorityColor}-100 text-${priorityColor}-700`}>
                            {complaint.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            complaint.status === "open" ? "bg-yellow-100 text-yellow-700" :
                            complaint.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                            complaint.status === "resolved" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {complaint.status.replace('_', ' ')}
                          </span>
                          {complaint.adminResponse && (
                            <span className="text-xs text-green-600">Admin responded</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Contact Us</h2>
                <p className="text-gray-600">
                  Get in touch with our support team
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Brief subject line"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {contactTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setContactForm({ ...contactForm, type: type.id as any })}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            contactForm.type === type.id
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                            contactForm.type === type.id
                              ? "text-orange-600"
                              : "text-gray-400"
                          }`} />
                          <div className={`text-sm font-medium ${
                            contactForm.type === type.id
                              ? "text-orange-700"
                              : "text-gray-600"
                          }`}>
                            {type.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we help you?"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                <h3 className="text-xl font-semibold text-black mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black">Email Support</p>
                      <p className="text-sm text-gray-600">support@dia.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black">Phone Support</p>
                      <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black">Business Hours</p>
                      <p className="text-sm text-gray-600">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black">Office</p>
                      <p className="text-sm text-gray-600">123 Tech Street, San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                <h3 className="text-xl font-semibold text-black mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">User Guide</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Privacy Policy</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">Terms of Service</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <Info className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">About DIA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
