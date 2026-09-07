# 🛡️ AeroShield AI

### AI-Powered Air Writing & Holographic Hand Shield

AeroShield AI is a real-time computer vision project that uses a webcam and hand tracking to create an interactive futuristic interface.

The system detects hand movements and responds with holographic shield effects while also allowing users to write or draw in the air using their fingertip.

---

## 🚀 Features

- 🖐️ Real-time hand tracking
- ✍️ Air writing using the index finger
- 🛡️ One-hand small holographic shield
- 👐 Two-hand large holographic shield
- 🔄 Dynamic shield movement
- 📏 Shield size changes according to hand distance
- ✨ Holographic rings and particle effects
- ⚡ Repulsor-style palm effect
- 🤖 Futuristic HUD interface
- 📷 Webcam-based interaction
- 🎨 Real-time Canvas animations
- 🔊 Optional sound effects

---

## 🧠 How It Works

The webcam captures the user's hands.

text
Webcam
   ↓
MediaPipe Hands
   ↓
Hand Landmark Detection
   ↓
Gesture Detection
   ↓
┌─────────────────────┐
│                     │
│  1 Hand → Small     │
│  2 Hands → Big      │
│  Index → Air Write  │
│                     │
└─────────────────────┘
   ↓
Canvas Effects
   ↓
Holographic Interface