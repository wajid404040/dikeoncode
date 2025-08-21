# 🚀 **Quick Setup Guide - Get DIA Working in 5 Minutes!**

## ⚡ **Step 1: Get Your Hume AI API Key (FREE!)**

1. **Go to [Hume AI](https://hume.ai/)**
2. **Click "Sign Up"** (it's completely free)
3. **Create your account** with email
4. **Go to "API Keys"** in your dashboard
5. **Copy your API key** (looks like: `hume_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## ⚡ **Step 2: Create Environment File**

1. **In the `fiber talking avatar` folder**, create a new file called `.env.local`
2. **Add this line** (replace with your actual API key):

```bash
HUME_API_KEY=hume_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ⚡ **Step 3: Install & Run**

```bash
# Install everything
npm install

# Start the app
npm run dev

# Open in browser
http://localhost:3000
```

## ⚡ **Step 4: Test Emotional Monitoring**

1. **Click "Monitoring ON"** button (top-right)
2. **Allow camera access** when prompted
3. **Position your face** in the camera view
4. **Make different expressions** - smile, frown, look sad
5. **Watch emotions appear** in real-time!

## 🔧 **If Something's Not Working**

### **Camera Issues?**

- **Check browser permissions** - make sure camera is allowed
- **Try refreshing** the page
- **Use Chrome or Firefox** (best compatibility)

### **No Emotions Detected?**

- **Good lighting** - make sure your face is well-lit
- **Face clearly visible** - stay 1-3 feet from camera
- **Check console** - press F12 and look for errors

### **API Connection Failed?**

- **Verify API key** - make sure it's correct in `.env.local`
- **Check internet** - ensure you have a stable connection
- **Restart app** - stop and run `npm run dev` again

## 🎯 **What You Should See**

✅ **Working System:**

- Camera feed shows your face
- Emotions appear with confidence scores
- Avatar responds to your emotional state
- Real-time updates every second

❌ **Not Working:**

- Camera shows error message
- No emotions detected
- API connection failed errors

## 🆘 **Still Having Issues?**

1. **Check the browser console** (F12 → Console tab)
2. **Look for error messages** and copy them
3. **Verify your API key** is correct
4. **Try a different browser** (Chrome recommended)

## 🎉 **Success!**

Once you see emotions being detected in real-time, you're all set! The system will:

- **Monitor your emotions** continuously
- **Detect negative emotions** automatically
- **Trigger interventions** when needed
- **Provide emotional support** through the avatar

---

**💡 Pro Tip:** Try making different facial expressions to test the system:

- 😊 **Smile** → Should detect "Joy" or "Amusement"
- 😔 **Frown** → Should detect "Sadness" or "Disgust"
- 😠 **Angry face** → Should detect "Anger"
- 😨 **Surprised** → Should detect "Surprise"

**🎯 The system works best with clear, exaggerated expressions!**
