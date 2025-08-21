export interface EmotionalIntervention {
  severity: "low" | "medium" | "high";
  dominantEmotion: string;
  response: string;
  urgency: "immediate" | "moderate" | "gentle";
  followUpActions: string[];
}

export class EmotionalInterventionService {
  private static instance: EmotionalInterventionService;
  private interventionHistory: Array<{ timestamp: number; intervention: EmotionalIntervention }> = [];

  static getInstance(): EmotionalInterventionService {
    if (!EmotionalInterventionService.instance) {
      EmotionalInterventionService.instance = new EmotionalInterventionService();
    }
    return EmotionalInterventionService.instance;
  }

  // Get appropriate intervention response based on emotion and severity
  getIntervention(emotions: any[], severity: "low" | "medium" | "high"): EmotionalIntervention {
    const dominantEmotion = this.getDominantEmotion(emotions);

    switch (severity) {
      case "high":
        return this.getHighSeverityIntervention(dominantEmotion);
      case "medium":
        return this.getMediumSeverityIntervention(dominantEmotion);
      case "low":
        return this.getLowSeverityIntervention(dominantEmotion);
      default:
        return this.getDefaultIntervention(dominantEmotion);
    }
  }

  private getDominantEmotion(emotions: any[]): string {
    if (!emotions || emotions.length === 0) return "unknown";

    let maxScore = 0;
    let dominant = "unknown";

    emotions.forEach((emotion) => {
      if (emotion.score > maxScore) {
        maxScore = emotion.score;
        dominant = emotion.name;
      }
    });

    return dominant;
  }

  private getHighSeverityIntervention(emotion: string): EmotionalIntervention {
    const interventions: { [key: string]: EmotionalIntervention } = {
      Anger: {
        severity: "high",
        dominantEmotion: "Anger",
        response:
          "I can see you're very upset right now. Please take a deep breath. I'm here to help you calm down. Would you like to talk about what's bothering you?",
        urgency: "immediate",
        followUpActions: [
          "Take 3 deep breaths together",
          "Count to 10 slowly",
          "Identify the source of anger",
          "Practice calming techniques",
        ],
      },
      Fear: {
        severity: "high",
        dominantEmotion: "Fear",
        response:
          "I sense you're feeling very afraid. You're safe here with me. Let's work through this together. Can you tell me what's making you feel this way?",
        urgency: "immediate",
        followUpActions: [
          "Assess safety situation",
          "Practice grounding techniques",
          "Identify fear triggers",
          "Create safety plan",
        ],
      },
      Sadness: {
        severity: "high",
        dominantEmotion: "Sadness",
        response:
          "I can feel your deep sadness, and I want you to know that it's okay to feel this way. You're not alone. I'm here to listen and support you.",
        urgency: "immediate",
        followUpActions: [
          "Express feelings openly",
          "Practice self-compassion",
          "Identify support systems",
          "Consider professional help",
        ],
      },
      Horror: {
        severity: "high",
        dominantEmotion: "Horror",
        response:
          "I can see you're experiencing intense distress. This is a very difficult moment, but I'm here with you. Let's focus on getting you to a calmer state.",
        urgency: "immediate",
        followUpActions: [
          "Immediate calming techniques",
          "Remove from triggering situation",
          "Professional intervention needed",
          "Safety assessment required",
        ],
      },
    };

    return interventions[emotion] || this.getDefaultHighIntervention(emotion);
  }

  private getMediumSeverityIntervention(emotion: string): EmotionalIntervention {
    const interventions: { [key: string]: EmotionalIntervention } = {
      Anger: {
        severity: "medium",
        dominantEmotion: "Anger",
        response:
          "I notice you're feeling frustrated. Let's take a moment to pause and reflect. What would help you feel better right now?",
        urgency: "moderate",
        followUpActions: [
          "Take a short break",
          "Express feelings constructively",
          "Practice stress relief",
          "Identify solutions",
        ],
      },
      Confusion: {
        severity: "medium",
        dominantEmotion: "Confusion",
        response:
          "I can see you're feeling a bit confused. That's completely normal when things are unclear. Let me help you work through this step by step.",
        urgency: "moderate",
        followUpActions: [
          "Break down the problem",
          "Ask clarifying questions",
          "Take notes",
          "Seek additional information",
        ],
      },
      Stress: {
        severity: "medium",
        dominantEmotion: "Stress",
        response:
          "I can sense you're under some stress. Let's take a moment to help you feel more centered. What's the most pressing concern right now?",
        urgency: "moderate",
        followUpActions: ["Prioritize tasks", "Practice stress management", "Set boundaries", "Seek support"],
      },
    };

    return interventions[emotion] || this.getDefaultMediumIntervention(emotion);
  }

  private getLowSeverityIntervention(emotion: string): EmotionalIntervention {
    const interventions: { [key: string]: EmotionalIntervention } = {
      Confusion: {
        severity: "low",
        dominantEmotion: "Confusion",
        response:
          "I notice you might be feeling a little uncertain. That's perfectly okay! Sometimes things take time to become clear. How can I help clarify things for you?",
        urgency: "gentle",
        followUpActions: ["Ask questions", "Take your time", "Break things down", "Practice patience"],
      },
      Disgust: {
        severity: "low",
        dominantEmotion: "Disgust",
        response:
          "I can see something is bothering you. It's okay to feel that way. Would you like to talk about what's on your mind?",
        urgency: "gentle",
        followUpActions: ["Identify the source", "Express feelings", "Find alternatives", "Practice acceptance"],
      },
    };

    return interventions[emotion] || this.getDefaultLowIntervention(emotion);
  }

  private getDefaultHighIntervention(emotion: string): EmotionalIntervention {
    return {
      severity: "high",
      dominantEmotion: emotion,
      response: `I can sense you're experiencing intense ${emotion.toLowerCase()} right now. This is a difficult moment, but I'm here with you. Let's work through this together. What would be most helpful right now?`,
      urgency: "immediate",
      followUpActions: ["Take deep breaths", "Express feelings", "Identify triggers", "Seek support"],
    };
  }

  private getDefaultMediumIntervention(emotion: string): EmotionalIntervention {
    return {
      severity: "medium",
      dominantEmotion: emotion,
      response: `I notice you're feeling ${emotion.toLowerCase()}. That's a valid emotion, and I'm here to help. What would make you feel better right now?`,
      urgency: "moderate",
      followUpActions: ["Acknowledge feelings", "Practice self-care", "Identify solutions", "Seek support if needed"],
    };
  }

  private getDefaultLowIntervention(emotion: string): EmotionalIntervention {
    return {
      severity: "low",
      dominantEmotion: emotion,
      response: `I can see you're experiencing some ${emotion.toLowerCase()}. That's completely normal. How can I help you feel more comfortable?`,
      urgency: "gentle",
      followUpActions: ["Acknowledge feelings", "Practice self-compassion", "Take your time", "Ask for help if needed"],
    };
  }

  private getDefaultIntervention(emotion: string): EmotionalIntervention {
    return {
      severity: "low",
      dominantEmotion: emotion,
      response: `I notice you're feeling ${emotion.toLowerCase()}. I'm here to listen and support you. What's on your mind?`,
      urgency: "gentle",
      followUpActions: ["Express feelings", "Practice self-care", "Seek support", "Take time to process"],
    };
  }

  // Get follow-up questions based on the intervention
  getFollowUpQuestions(intervention: EmotionalIntervention): string[] {
    const questions: { [key: string]: string[] } = {
      Anger: [
        "What triggered this feeling?",
        "What would help you feel calmer?",
        "Is there something specific you'd like to address?",
      ],
      Fear: [
        "What are you afraid of right now?",
        "What would make you feel safer?",
        "How can I help you feel more secure?",
      ],
      Sadness: [
        "What's weighing on your heart?",
        "What would bring you comfort right now?",
        "How can I best support you?",
      ],
      Confusion: [
        "What part feels unclear to you?",
        "What would help you understand better?",
        "How can I clarify things for you?",
      ],
      Stress: [
        "What's causing you the most stress?",
        "What would help you feel more relaxed?",
        "How can I help you manage this?",
      ],
    };

    return (
      questions[intervention.dominantEmotion] || [
        "How are you feeling now?",
        "What would be most helpful?",
        "Is there anything else you'd like to discuss?",
      ]
    );
  }

  // Record intervention for tracking
  recordIntervention(intervention: EmotionalIntervention): void {
    this.interventionHistory.push({
      timestamp: Date.now(),
      intervention,
    });

    // Keep only last 100 interventions
    if (this.interventionHistory.length > 100) {
      this.interventionHistory = this.interventionHistory.slice(-100);
    }
  }

  // Get intervention history
  getInterventionHistory(): Array<{ timestamp: number; intervention: EmotionalIntervention }> {
    return [...this.interventionHistory];
  }

  // Get recent interventions (last 24 hours)
  getRecentInterventions(): Array<{ timestamp: number; intervention: EmotionalIntervention }> {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return this.interventionHistory.filter((item) => item.timestamp > oneDayAgo);
  }

  // Clear intervention history
  clearHistory(): void {
    this.interventionHistory = [];
  }
}

export default EmotionalInterventionService;
