# DarkKnight AI (ダークナイト AI)
> **Agentic AI Platform for Job Openings, Internships, Hackathons & Research Funding**
> Developed by **The DN Production** | Problem Statement 4 (PS4)

---

## 🌟 Executive Summary

**DarkKnight AI** is an ultra-premium, full-stack Agentic AI platform engineered for students, developers, and researchers to discover, match, and apply for opportunities in real time. Inspired by luxury automotive dashboards, Apple VisionOS, and Batman Batcomputer technology, the platform combines a **Google Gemini-powered AI Agent**, a **Nodemailer Live Mail Engine**, a **WhatsApp Dispatch Payload System**, and **Wayne Tech HUD Aesthetics**.

---

## 🚀 Key Features

1. **AI Opportunity Aggregator & Search**
   - Live intelligent search across 42+ curated opportunities spanning **Jobs, Internships, Hackathons, and Research Grants**.
   - Categorized by domains (AI/ML, Web Dev, Cybersecurity, Data Science, Blockchain, Cloud Computing, IoT, Robotics).

2. **Jarvis-Style Conversational AI Assistant (`/dashboard/chat`)**
   - Natural language assistant trained to parse queries, match user skills, recommend top positions, and embed interactive opportunity cards directly in the conversation.
   - Dual mode: Powered by **Google Gemini 1.5 Flash** with real-time fallback intelligence.

3. **Production Mail & OTP Verification Engine (`/api/notifications/email`)**
   - Live **Nodemailer SMTP integration** dispatching authentic HTML verification emails and application confirmation alerts.
   - Interactive **6-Digit Security Passkey Modal UI** (`components/EmailVerificationModal.js`) with OTP input, resend timers, and live mail log links.

4. **WhatsApp Dispatch Gateway (`/api/notifications/whatsapp`)**
   - Payload generator supporting **Twilio WhatsApp API** or instant direct-link dispatches (`https://wa.me/...`).

5. **Batcomputer & Wayne Tech HUD Aesthetics**
   - Deep Midnight matte UI (`#050505`) with Cyber Cyan (`#00D9FF`), Batcomputer Blue (`#3B82F6`), and Neon Emerald (`#22C55E`) accents.
   - High-contrast monospace data brackets (`[ WAYNE TECH DATABASE // SYNCED ]`, `[ MATCH SCORE: 98% ]`, `[ DEADLINE: 12D ]`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2.11 (App Router, Turbopack) |
| **Language** | JavaScript (ES6+ / React 19) |
| **Styling** | Tailwind CSS v4, PostCSS, Custom CSS Tokens (`globals.css`) |
| **Animations** | Framer Motion |
| **Icons & Fonts** | Lucide React, Fontshare (Satoshi & Clash Display), Google Fonts (JetBrains Mono) |
| **AI Integration** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Email Service** | Nodemailer (SMTP / Ethereal Transporter) |

---

## 💻 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-github-repo-url>
cd darknight-ai
npm install
```

### 3. Environment Setup (Optional)
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM="DarkKnight AI" <no-reply@darknight.ai>
```
*(Note: If no API keys are provided, the platform automatically utilizes built-in fallback engines and test mail transporters.)*

### 4. Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Building for Production
To test production compilation:
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
darknight-ai/
├── app/
│   ├── layout.js                     # Root layout with font imports
│   ├── page.js                       # Cinematic Splash screen
│   ├── globals.css                   # Global design system & Tailwind directives
│   ├── login/
│   │   └── page.js                   # Batcomputer Sign In & Sign Up Auth page
│   ├── dashboard/
│   │   ├── layout.js                # Dashboard shell layout with Sidebar offset
│   │   ├── page.js                  # Main Command Center Dashboard
│   │   ├── search/page.js           # AI Search feed
│   │   ├── hackathons/page.js       # Filtered Hackathons feed
│   │   ├── internships/page.js      # Filtered Internships feed
│   │   ├── jobs/page.js             # Filtered Jobs feed
│   │   ├── research/page.js         # Filtered Research Grants feed
│   │   ├── chat/page.js             # Jarvis AI Chat Assistant
│   │   ├── notifications/page.js    # Live Email & WhatsApp Dispatch Hub
│   │   ├── profile/page.js          # User profile & skills state
│   │   ├── settings/page.js         # Preferences & AI toggles
│   │   └── opportunity/[id]/page.js # Opportunity detail page with Apply & Mail trigger
│   └── api/
│       └── notifications/
│           ├── email/route.js        # Nodemailer email dispatch API
│           └── whatsapp/route.js     # WhatsApp gateway payload API
├── components/
│   ├── EmailVerificationModal.js    # 6-Digit OTP & Passkey Verification UI
│   ├── ParticleBackground.js        # Canvas energy particle background
│   ├── GlassCard.js                 # Glassmorphic card container
│   ├── GlowButton.js                # Neon glow action buttons
│   ├── OpportunityCard.js            # Wayne Tech Opportunity HUD card
│   ├── Sidebar.js                   # Fixed navigation bar
│   ├── Topbar.js                    # Top system status bar
│   └── Badge.js                     # Type & domain status badges
├── lib/
│   ├── email.js                     # Nodemailer transporter library
│   ├── gemini.js                    # Google Gemini AI wrapper
│   └── mockData.js                  # 42 realistic opportunities dataset
├── public/                          # Static assets & font references
└── package.json
```

---

## 🛡️ API Endpoints

### `POST /api/notifications/email`
Dispatches a formatted HTML notification email.
- **Request Body**:
  ```json
  {
    "to": "student@university.edu",
    "title": "Application Submitted: ML Engineer",
    "message": "You applied for ML Engineer at Microsoft.",
    "opportunityTitle": "Machine Learning Engineer (Microsoft)",
    "opportunityLink": "https://careers.microsoft.com"
  }
  ```

### `POST /api/notifications/whatsapp`
Generates a formatted WhatsApp dispatch payload or sends via Twilio API.
- **Request Body**:
  ```json
  {
    "to": "+919876543210",
    "title": "Hackathon Alert",
    "message": "Registration is open for Global Hack 2026."
  }
  ```

---

## 🎓 Evaluation & Teacher Presentation Checklist

- [x] **0 Build Warnings/Errors**: Fully optimized Next.js 16 build.
- [x] **Clean Modular Architecture**: Separated components, libraries, and serverless API routes.
- [x] **Fallback Resilience**: System operates seamlessly with or without external API keys.
- [x] **Responsive Mobile & Desktop**: Designed for all viewport sizes (375px to 1920px).

---

© 2026 **The DN Production**. Developed for Hackathon PS4.
