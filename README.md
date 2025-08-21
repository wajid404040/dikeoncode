# DIA - AI Emotional Support Assistant

A comprehensive AI emotional support system that combines real-time emotion detection with human-like voice interaction using OpenAI's advanced speech synthesis and recognition capabilities.

## 🌟 Features

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

### 😊 **Emotional Intelligence**

- Real-time facial emotion detection using Hume AI
- Proactive emotional support and intervention
- Continuous monitoring with intelligent alerting
- Support for 20+ emotions with confidence scoring

### 🎭 **3D Avatar Interface**

- Interactive 3D avatar with lip-sync
- Real-time emotional response visualization
- Professional-grade animations and interactions

## 🚀 Quick Start

### 1. **Environment Setup**

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
DATABASE_URL="mongodb://localhost:27017/dia_emotional_support"

# JWT Secret (Required)
JWT_SECRET="your-super-secret-jwt-key"

# Hume AI (Optional - for emotion detection)
HUME_API_KEY="your-hume-ai-api-key"
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Database Setup**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open database studio
npm run db:studio
```

### 4. **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 **Voice System Features**

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

## 🔧 **Technical Architecture**

### **Frontend**

- **Next.js 14**: App Router with TypeScript
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first styling
- **Prisma**: Type-safe database operations

### **Backend**

- **API Routes**: Next.js API endpoints
- **JWT Authentication**: Secure token-based auth
- **MongoDB**: Flexible document database
- **bcrypt**: Secure password hashing

### **AI Services**

- **OpenAI TTS**: High-quality speech synthesis
- **OpenAI Whisper**: Advanced speech recognition
- **Hume AI**: Real-time emotion detection

## 📱 **User Experience**

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

## 🛡️ **Security Features**

- **JWT Tokens**: Secure authentication with expiration
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Secure API endpoints
- **Environment Variables**: Secure API key management

## 🔍 **API Endpoints**

### **Authentication**

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### **Voice System**

- OpenAI TTS integration for speech synthesis
- Web Speech API for voice recognition
- Real-time voice processing and playback

## 🚀 **Deployment**

### **Vercel (Recommended)**

```bash
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

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for emotional well-being and AI companionship**
