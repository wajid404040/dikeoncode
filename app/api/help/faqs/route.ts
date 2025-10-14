import { NextRequest, NextResponse } from "next/server";

// Sample FAQ data - in a real app, this would come from a database
const faqs = [
  {
    id: "1",
    question: "How do I get started with DIA?",
    answer: "Getting started with DIA is easy! Simply sign up for an account, complete your profile setup, and you'll be guided through the personalization process where you can choose your avatar and voice preferences.",
    category: "getting-started",
    helpful: 45,
    notHelpful: 2,
  },
  {
    id: "2",
    question: "What is DIA and how does it work?",
    answer: "DIA is an AI emotional support assistant that provides 24/7 companionship and emotional support. It uses advanced AI technology to understand your emotions and provide personalized responses through voice and text interactions.",
    category: "getting-started",
    helpful: 38,
    notHelpful: 1,
  },
  {
    id: "3",
    question: "How do I change my avatar?",
    answer: "You can change your avatar by going to Settings > Profile > Avatar Selection. Choose from our collection of diverse avatars that represent different personalities and styles.",
    category: "account",
    helpful: 32,
    notHelpful: 3,
  },
  {
    id: "4",
    question: "Can I customize DIA's voice?",
    answer: "Yes! DIA offers multiple voice options and settings. Go to Settings > Voice Preferences to select from different voice types, adjust speech rate, and customize the emotional tone.",
    category: "features",
    helpful: 28,
    notHelpful: 2,
  },
  {
    id: "5",
    question: "How does the mood tracking feature work?",
    answer: "DIA's mood tracking allows you to log your daily emotional state. Simply go to the Mood section, select how you're feeling, add optional notes, and DIA will help you track patterns and provide insights over time.",
    category: "features",
    helpful: 41,
    notHelpful: 1,
  },
  {
    id: "6",
    question: "Is my data secure and private?",
    answer: "Absolutely. We take privacy seriously. All your conversations and personal data are encrypted and stored securely. We never share your personal information with third parties without your explicit consent.",
    category: "privacy",
    helpful: 52,
    notHelpful: 0,
  },
  {
    id: "7",
    question: "How do I add friends on DIA?",
    answer: "To add friends, go to the Friends section and click 'Add Friend'. Enter their email address to send a friend request. Once they accept, you can chat and provide emotional support to each other.",
    category: "features",
    helpful: 35,
    notHelpful: 2,
  },
  {
    id: "8",
    question: "What should I do if DIA isn't responding?",
    answer: "If DIA isn't responding, try refreshing the page or restarting the app. Check your internet connection and make sure you're logged in. If the issue persists, contact our support team.",
    category: "technical",
    helpful: 29,
    notHelpful: 4,
  },
  {
    id: "9",
    question: "How do I cancel my subscription?",
    answer: "To cancel your subscription, go to Settings > Subscription > Manage Subscription. You can cancel anytime and will continue to have access until the end of your current billing period.",
    category: "billing",
    helpful: 24,
    notHelpful: 1,
  },
  {
    id: "10",
    question: "Can I use DIA on multiple devices?",
    answer: "Yes! DIA syncs across all your devices. Simply log in with your account on any device and your conversations, mood data, and preferences will be available everywhere.",
    category: "account",
    helpful: 31,
    notHelpful: 1,
  },
  {
    id: "11",
    question: "How do I report a bug or issue?",
    answer: "You can report bugs by going to Help > Submit Complaint and selecting 'Technical Issue' as the category. Provide as much detail as possible about what happened and when.",
    category: "technical",
    helpful: 18,
    notHelpful: 0,
  },
  {
    id: "12",
    question: "What languages does DIA support?",
    answer: "Currently, DIA supports English with plans to add more languages in the future. You can change the language in Settings > Preferences > Language.",
    category: "features",
    helpful: 22,
    notHelpful: 3,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let filteredFaqs = faqs;

    if (category && category !== "all") {
      filteredFaqs = filteredFaqs.filter(faq => faq.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredFaqs = filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      faqs: filteredFaqs,
      total: filteredFaqs.length,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
