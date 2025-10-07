# Dikeon MVP: Empathic Reality – The Emotional Nervous System of the Internet

> **Mission**: Create an emotional nervous system for the internet that detects subtle emotional signals from users and translates them into actionable cues to enhance human connection online.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [Technology Stack](#-technology-stack)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Development Workflow](#-development-workflow)
- [Team Collaboration Guidelines](#-team-collaboration-guidelines)
- [Code Standards](#-code-standards)
- [Testing Guidelines](#-testing-guidelines)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## 🎯 Project Overview

Dikeon is an AI-powered MVP that senses and interprets human emotions from video, audio, and text in real time, providing actionable insights and alerts to foster empathy and connection online. The system addresses emotional disconnection in the digital world by creating an "emotional nervous system" for the internet.

### Key Value Propositions
- **Real-time Emotion Detection**: Instantly analyzes facial expressions, voice tone, and text sentiment
- **Multi-modal Processing**: Combines video, audio, and text for comprehensive emotional understanding
- **Proactive Alerts**: Notifies users of emotional changes in their connections
- **Enhanced Digital Communication**: Restores emotional nuance to online interactions
- **Mental Health Support**: Helps prevent burnout and improve well-being in digital environments

## 🌟 Core Features

### 🔐 **Authentication System**
- User registration and login with JWT tokens
- **Waitlist System**: New users require admin approval before access
- Secure password hashing with bcrypt
- MongoDB database integration with Prisma ORM

### 🎤 **Advanced Voice System**
- **OpenAI TTS Integration**: 6 premium AI voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- **Speech Recognition**: Real-time voice input processing
- **Voice Customization**: Speed, pitch, and volume controls
- **Voice Selection**: Users can choose their preferred AI voice during signup

### 😊 **Emotional Intelligence (Hume AI Integration)**
- **Real-time Video Emotion Detection**: Facial analysis using Hume AI Expression Measurement API
- **Voice Emotion Analysis**: Speech tone and emotion detection
- **Text Sentiment Analysis**: NLP-based emotion understanding
- **Multi-modal Aggregation**: Combines all three modalities for comprehensive emotional insights
- **Proactive Emotional Support**: Intelligent alerting and intervention
- **Support for 20+ emotions** with confidence scoring

### 🎭 **3D Avatar Interface**
- Interactive 3D avatar with lip-sync
- Real-time emotional response visualization
- Professional-grade animations and interactions

### 📊 **Real-time Dashboard**
- Live emotion monitoring and visualization
- Historical emotion trends and analytics
- Alert system for emotional changes
- Multi-modal data processing and display

## 🛠 Technology Stack

### **Frontend**
- **Next.js 14**: App Router with TypeScript
- **React 18**: Modern React with hooks and concurrent features
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Advanced animations and transitions
- **Three.js**: 3D avatar rendering and interactions
- **WebRTC**: Real-time video/audio capture
- **WebSocket**: Real-time communication

### **Backend**
- **Next.js API Routes**: Serverless API endpoints
- **FastAPI** (Python): AI processing microservice
- **JWT Authentication**: Secure token-based authentication
- **MongoDB**: Flexible document database
- **Prisma ORM**: Type-safe database operations
- **bcrypt**: Secure password hashing

### **AI Services**
- **Hume AI**: Expression Measurement API for emotion detection
  - Voice emotion analysis
  - Facial emotion detection
  - Text sentiment analysis
- **OpenAI TTS**: High-quality speech synthesis
- **OpenAI Whisper**: Advanced speech recognition

### **Development Tools**
- **TypeScript**: Type-safe development
- **ESLint + Prettier**: Code quality and formatting
- **Jest + Testing Library**: Testing framework
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline

## 🚀 Development Setup

### **Prerequisites**
- Node.js 18+ 
- Python 3.9+
- MongoDB (local or cloud)
- Git

### **1. Environment Setup**

Copy the environment file and configure your API keys:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# OpenAI API Key (Required)
OPENAI_API_KEY=your-openai-api-key-here
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key-here

# Database (Required)
DATABASE_URL="mongodb://localhost:27017/dikeon_emotional_support"

# JWT Secret (Required)
JWT_SECRET="your-super-secret-jwt-key"

# Hume AI (Required for emotion detection)
HUME_API_KEY="your-hume-ai-api-key"
NEXT_PUBLIC_HUME_API_KEY="your-hume-ai-api-key"

# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **2. Install Dependencies**

```bash
# Frontend dependencies
npm install

# Python backend dependencies (if using FastAPI)
cd backend
pip install -r requirements.txt
```

### **3. Database Setup**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open database studio
npm run db:studio
```

### **4. Run Development Server**

```bash
# Frontend (Next.js)
npm run dev

# Backend (FastAPI) - if using separate backend
cd backend
uvicorn main:app --reload --port 8000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
dikeon/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication pages
│   ├── (dashboard)/             # Dashboard pages
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── emotion/            # Emotion detection endpoints
│   │   └── voice/               # Voice processing endpoints
│   ├── components/              # Reusable components
│   │   ├── ui/                 # Basic UI components
│   │   ├── emotion/            # Emotion-related components
│   │   ├── voice/              # Voice system components
│   │   └── avatar/             # 3D avatar components
│   ├── lib/                     # Utility functions
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript type definitions
├── backend/                      # Python FastAPI backend (optional)
│   ├── api/                     # API endpoints
│   ├── services/                # Business logic
│   ├── models/                  # Data models
│   └── utils/                   # Utility functions
├── prisma/                       # Database schema
├── public/                       # Static assets
├── tests/                        # Test files
├── docs/                         # Documentation
└── scripts/                      # Build and deployment scripts
```

## 🔌 API Integration

### **Hume AI Expression Measurement API**

The core of our emotion detection system. Integrates three modalities:

#### **1. Voice Emotion Analysis**
```typescript
// Example: Voice emotion detection
const analyzeVoice = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('file', audioBlob);
  
  const response = await fetch('/api/emotion/voice', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

#### **2. Facial Emotion Detection**
```typescript
// Example: Video emotion detection
const analyzeVideo = async (videoBlob: Blob) => {
  const formData = new FormData();
  formData.append('file', videoBlob);
  
  const response = await fetch('/api/emotion/video', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

#### **3. Text Sentiment Analysis**
```typescript
// Example: Text emotion detection
const analyzeText = async (text: string) => {
  const response = await fetch('/api/emotion/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  
  return response.json();
};
```

### **Real-time WebSocket Integration**
```typescript
// Real-time emotion streaming
const useEmotionStream = () => {
  const [emotions, setEmotions] = useState<EmotionData[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws/emotion');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEmotions(prev => [...prev, data]);
    };
    
    return () => ws.close();
  }, []);
  
  return emotions;
};
```

## 🎯 Voice System Features

### **Available AI Voices**
- **Alloy**: Warm, friendly voice - perfect for emotional support
- **Echo**: Clear, confident voice - great for guidance
- **Fable**: Gentle, storytelling voice - ideal for comfort
- **Onyx**: Deep, authoritative voice - for serious conversations
- **Nova**: Bright, energetic voice - for motivation
- **Shimmer**: Soft, soothing voice - for relaxation

### **Voice Customization**
- **Speed Control**: 0.25x to 4.0x playback speed
- **Pitch Adjustment**: -20 to +20 semitones
- **Volume Control**: 0% to 100% volume levels

## 👥 Team Collaboration Guidelines

### **Git Workflow**

#### **Branch Naming Convention**
```bash
# Feature branches
feature/emotion-detection
feature/voice-integration
feature/dashboard-ui

# Bug fixes
bugfix/auth-token-expiry
bugfix/emotion-api-error

# Hotfixes
hotfix/security-vulnerability

# Release branches
release/v1.0.0
```

#### **Commit Message Format**
```bash
# Format: type(scope): description
feat(emotion): add real-time facial emotion detection
fix(auth): resolve JWT token expiration issue
docs(readme): update API integration examples
test(voice): add unit tests for TTS integration
refactor(components): optimize emotion visualization
```

#### **Pull Request Process**
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Make Changes**: Implement your feature with tests
3. **Commit Changes**: Use conventional commit format
4. **Push Branch**: `git push origin feature/your-feature-name`
5. **Create Pull Request**: Use the PR template
6. **Code Review**: At least 2 reviewers required
7. **Merge**: Squash and merge after approval

### **Code Review Guidelines**

#### **Review Checklist**
- [ ] Code follows TypeScript/JavaScript best practices
- [ ] Components are properly typed with TypeScript
- [ ] Tests are included for new features
- [ ] API endpoints have proper error handling
- [ ] Security considerations are addressed
- [ ] Performance implications are considered
- [ ] Documentation is updated if needed

#### **Review Process**
1. **Self-Review**: Review your own code before requesting review
2. **Automated Checks**: Ensure all CI/CD checks pass
3. **Peer Review**: Request review from team members
4. **Address Feedback**: Make requested changes
5. **Final Approval**: Get approval from reviewers
6. **Merge**: Merge after all checks pass

### **Communication Guidelines**

#### **Daily Standups**
- **Time**: 9:00 AM EST (adjust for timezone)
- **Duration**: 15 minutes max
- **Format**: What did you do yesterday? What will you do today? Any blockers?

#### **Communication Channels**
- **Slack/Discord**: General communication and quick questions
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Technical discussions and RFCs
- **Email**: Important announcements and external communication

#### **Meeting Schedule**
- **Daily Standup**: 9:00 AM EST
- **Weekly Sprint Planning**: Mondays 10:00 AM EST
- **Weekly Retrospective**: Fridays 4:00 PM EST
- **Code Review Sessions**: As needed

## 🔄 Development Workflow

### **Sprint Planning (2-week sprints)**

#### **Sprint Planning Process**
1. **Backlog Review**: Review and prioritize backlog items
2. **Capacity Planning**: Estimate team capacity for the sprint
3. **Story Selection**: Select user stories for the sprint
4. **Task Breakdown**: Break down stories into tasks
5. **Assignment**: Assign tasks to team members
6. **Sprint Goal**: Define the sprint goal

#### **Sprint Structure**
- **Week 1**: Development and testing
- **Week 2**: Integration, testing, and deployment preparation
- **Sprint Review**: Demo completed features
- **Retrospective**: Review process and improvements

### **Development Process**

#### **Feature Development**
1. **Create Issue**: Create GitHub issue with detailed description
2. **Assign**: Assign to team member
3. **Branch**: Create feature branch from main
4. **Develop**: Implement feature with tests
5. **Test**: Run tests and ensure quality
6. **Review**: Submit PR for code review
7. **Merge**: Merge after approval
8. **Deploy**: Deploy to staging/production

#### **Bug Fix Process**
1. **Report**: Create bug report with reproduction steps
2. **Prioritize**: Assign priority (Critical, High, Medium, Low)
3. **Assign**: Assign to developer
4. **Fix**: Implement fix with tests
5. **Verify**: Verify fix resolves the issue
6. **Deploy**: Deploy fix to production

## 📝 Code Standards

### **TypeScript Guidelines**

#### **Type Definitions**
```typescript
// Define interfaces for API responses
interface EmotionData {
  emotion: string;
  confidence: number;
  timestamp: Date;
  modality: 'voice' | 'video' | 'text';
}

// Use enums for constants
enum EmotionType {
  JOY = 'joy',
  SADNESS = 'sadness',
  ANGER = 'anger',
  FEAR = 'fear',
  SURPRISE = 'surprise',
  DISGUST = 'disgust'
}
```

#### **Component Structure**
```typescript
// Use functional components with hooks
interface EmotionDisplayProps {
  emotion: EmotionData;
  onEmotionChange: (emotion: EmotionData) => void;
}

const EmotionDisplay: React.FC<EmotionDisplayProps> = ({ 
  emotion, 
  onEmotionChange 
}) => {
  // Component logic
  return (
    <div className="emotion-display">
      {/* JSX content */}
    </div>
  );
};
```

### **API Design Standards**

#### **RESTful API Design**
```typescript
// API endpoint structure
POST /api/emotion/voice     // Voice emotion analysis
POST /api/emotion/video     // Video emotion analysis
POST /api/emotion/text      // Text emotion analysis
GET  /api/emotion/history   // Get emotion history
WS   /ws/emotion            // Real-time emotion stream
```

#### **Error Handling**
```typescript
// Standardized error responses
interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// Error handling in components
const handleApiError = (error: ApiError) => {
  console.error('API Error:', error);
  // Show user-friendly error message
  toast.error(error.message);
};
```

### **Testing Standards**

#### **Unit Testing**
```typescript
// Test file structure
describe('EmotionDetection', () => {
  it('should detect joy emotion from text', async () => {
    const result = await analyzeText('I am so happy today!');
    expect(result.emotion).toBe('joy');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

#### **Integration Testing**
```typescript
// API integration tests
describe('Emotion API', () => {
  it('should process voice emotion analysis', async () => {
    const response = await request(app)
      .post('/api/emotion/voice')
      .attach('file', 'test-audio.wav')
      .expect(200);
    
    expect(response.body.emotion).toBeDefined();
  });
});
```

## 🧪 Testing Guidelines

### **Testing Strategy**

#### **Test Types**
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Test system performance under load

#### **Testing Tools**
- **Jest**: Unit and integration testing
- **Testing Library**: React component testing
- **Playwright**: End-to-end testing
- **Artillery**: Performance testing

### **Test Coverage Requirements**
- **Minimum Coverage**: 80% code coverage
- **Critical Paths**: 100% coverage for authentication and emotion detection
- **API Endpoints**: All endpoints must have tests
- **Components**: All reusable components must have tests

## 🚀 Deployment

### **Environment Setup**

#### **Development Environment**
```bash
# Local development
npm run dev
npm run test
npm run lint
```

#### **Staging Environment**
```bash
# Staging deployment
npm run build:staging
npm run deploy:staging
```

#### **Production Environment**
```bash
# Production deployment
npm run build:production
npm run deploy:production
```

### **Deployment Process**

#### **Automated Deployment**
1. **Push to Main**: Merge PR to main branch
2. **CI/CD Pipeline**: Automated tests and builds
3. **Staging Deploy**: Deploy to staging environment
4. **Testing**: Run integration tests on staging
5. **Production Deploy**: Deploy to production after approval

#### **Manual Deployment**
1. **Build**: `npm run build`
2. **Test**: `npm run test`
3. **Deploy**: `npm run deploy`
4. **Verify**: Verify deployment success
5. **Monitor**: Monitor application health

## 🔧 Technical Architecture

### **Frontend Architecture**
- **Next.js 14**: App Router with TypeScript
- **React 18**: Modern React with hooks and concurrent features
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Advanced animations and transitions
- **Three.js**: 3D avatar rendering and interactions
- **WebRTC**: Real-time video/audio capture
- **WebSocket**: Real-time communication

### **Backend Architecture**
- **Next.js API Routes**: Serverless API endpoints
- **FastAPI** (Python): AI processing microservice
- **JWT Authentication**: Secure token-based authentication
- **MongoDB**: Flexible document database
- **Prisma ORM**: Type-safe database operations
- **bcrypt**: Secure password hashing

### **AI Services Integration**
- **Hume AI**: Expression Measurement API for emotion detection
- **OpenAI TTS**: High-quality speech synthesis
- **OpenAI Whisper**: Advanced speech recognition

## 📱 User Experience

### **Signup Flow**
1. User enters basic personal information (name, email, password)
2. Account creation with secure authentication
3. **Waitlist Status**: Account placed in approval queue
4. **Admin Approval**: Admin reviews and approves/rejects account
5. **Personalization Flow**: Choose avatar and voice preferences (after approval)
6. Access to personalized AI companion

### **Personalization Flow**
1. **Avatar Selection**: Choose from 4 unique AI companions
2. **Voice Selection**: Select from 6 premium OpenAI voices
3. **Customization**: Adjust voice speed, pitch, and volume
4. **Skip Option**: Users can personalize later if desired

### **Admin System**
- **Waitlist Management**: View and manage pending user approvals
- **User Approval/Rejection**: Approve or reject new user accounts
- **Real-time Updates**: Live waitlist status and user management
- **Admin Dashboard**: Beautiful interface for managing user access

### **Daily Interaction**
1. **Emotion Monitoring**: Continuous facial analysis
2. **Proactive Support**: AI detects negative emotions
3. **Voice Interaction**: Natural conversation with chosen voice
4. **Emotional Healing**: Personalized support responses

## 🛡️ Security Features

- **JWT Tokens**: Secure authentication with expiration
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Secure API endpoints
- **Environment Variables**: Secure API key management
- **Rate Limiting**: API rate limiting for security
- **Data Encryption**: End-to-end encryption for sensitive data

## 🔍 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

### **Emotion Detection**
- `POST /api/emotion/voice` - Voice emotion analysis
- `POST /api/emotion/video` - Video emotion analysis
- `POST /api/emotion/text` - Text emotion analysis
- `GET /api/emotion/history` - Get emotion history
- `WS /ws/emotion` - Real-time emotion stream

### **Voice System**
- `POST /api/voice/synthesize` - Text-to-speech synthesis
- `POST /api/voice/recognize` - Speech recognition
- `GET /api/voice/voices` - Available voices
- `POST /api/voice/customize` - Voice customization

### **User Management**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/emotions` - Get user emotion data
- `POST /api/users/preferences` - Update user preferences

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npm run build
vercel --prod
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Variables**
```env
# Production environment variables
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
OPENAI_API_KEY=your-openai-api-key
HUME_API_KEY=your-hume-api-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔧 Troubleshooting

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check MongoDB connection
npm run db:status

# Reset database
npm run db:reset

# Check Prisma client
npm run db:generate
```

#### **API Key Issues**
```bash
# Verify environment variables
npm run env:check

# Test API connections
npm run test:api
```

#### **Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Run linting
npm run lint
```

#### **Emotion Detection Issues**
- **Camera Access**: Ensure camera permissions are granted
- **Microphone Access**: Ensure microphone permissions are granted
- **API Limits**: Check Hume AI API usage limits
- **Network Issues**: Verify internet connection for API calls

### **Performance Issues**

#### **Slow Emotion Detection**
- Check API response times
- Implement caching for repeated requests
- Optimize video/audio processing
- Use WebSocket for real-time updates

#### **Memory Leaks**
- Monitor WebSocket connections
- Clean up event listeners
- Optimize component re-renders
- Use React.memo for expensive components

### **Debugging Tools**

#### **Development Tools**
```bash
# Enable debug mode
DEBUG=dikeon:* npm run dev

# Run with verbose logging
npm run dev -- --verbose

# Check bundle size
npm run analyze
```

#### **Production Monitoring**
- Set up error tracking (Sentry)
- Monitor API performance
- Track user interactions
- Monitor emotion detection accuracy

## 🤝 Contributing

### **Getting Started**
1. **Fork the Repository**: Fork the repository on GitHub
2. **Clone Your Fork**: `git clone https://github.com/your-username/dikeon.git`
3. **Create Branch**: `git checkout -b feature/your-feature-name`
4. **Install Dependencies**: `npm install`
5. **Make Changes**: Implement your feature
6. **Test Changes**: `npm run test`
7. **Commit Changes**: Use conventional commit format
8. **Push Changes**: `git push origin feature/your-feature-name`
9. **Create Pull Request**: Submit PR with detailed description

### **Contribution Guidelines**

#### **Code Quality**
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the established code style

#### **Pull Request Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### **Issue Guidelines**

#### **Bug Reports**
- Use the bug report template
- Provide reproduction steps
- Include error messages and logs
- Specify environment details

#### **Feature Requests**
- Use the feature request template
- Describe the problem and solution
- Provide use cases and examples
- Consider implementation complexity

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### **Getting Help**
- **GitHub Issues**: Create an issue for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check the docs folder for detailed guides
- **Email**: Contact the team for urgent issues

### **Resources**
- [Hume AI Documentation](https://dev.hume.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### **Community**
- Join our Discord server for real-time discussions
- Follow us on Twitter for updates
- Star the repository to show support

---

**Built with ❤️ for emotional well-being and AI companionship**

*Dikeon MVP: Creating the emotional nervous system of the internet*
