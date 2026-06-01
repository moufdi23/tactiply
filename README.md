# 🎯 Tactiply

### *Your AI marketing strategist — built for real small businesses, not Fortune 500s.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-tactiply.com-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://tactiply.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude%20AI-7C3AED?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🚀 What Is Tactiply?

Tactiply is a full-stack web app that generates a **complete, personalized marketing strategy** for any small business — in under 60 seconds, powered by Claude AI.

A small business owner answers **5 smart, business-specific questions** in a conversational flow, and Tactiply builds them a strategy across 7 professional sections: social media, content calendars, email templates, ad copy, SEO keywords, a marketing score with actionable quick wins, and more.

**Who is it for?** The local salon owner, the freelance photographer, the new gym, the contractor who has no time or budget for a marketing agency — but still needs a real marketing plan.

No fluff. No generic advice. Just a strategy that actually fits *your* business.

---

## 🌐 Live Demo

**[→ Try it at tactiply.com](https://tactiply.com)**

Or click **"See a Sample"** on the landing page to explore a full strategy without signing up.

---

## 📸 Screenshots

> _Screenshots coming soon — see the live demo for the full experience._

| Landing Page | Conversation Flow |
|---|---|
| `[screenshot-landing.png]` | `[screenshot-questions.png]` |

| Strategy Results | Marketing Score |
|---|---|
| `[screenshot-results.png]` | `[screenshot-score.png]` |

| Competitor Analysis | PDF Export |
|---|---|
| `[screenshot-competitor.png]` | `[screenshot-pdf.png]` |

---

## ✨ Features

### 🧠 Intelligent Question Flow
- **Business-specific questions** — Claude generates 5 custom questions based on your business description, not a generic form
- **Conversational UI** with typewriter effect (character-by-character animation)
- **Edit any previous answer in place** — click the pencil icon to revise without starting over; your other answers stay untouched
- **Progress indicator** — "Question X of 5" header + animated progress bar
- **Hints and placeholders** on every question to help users give better answers

### ⚡ Real-Time Strategy Streaming
- Strategies stream to the page live using **Server-Sent Events (SSE)**
- Results appear section by section as Claude generates them — no waiting for a full response
- Uses `useTransition()` for smooth, non-blocking incremental renders
- Falls back gracefully to a blocking request if streaming fails

### 📋 7 Strategy Sections
Every generated strategy covers:

| # | Section | What's Inside |
|---|---|---|
| 1 | **Target Audience** | Demographics, psychographics, pain points, buying triggers |
| 2 | **Social Media Strategy** | Separate strategies for Instagram, Facebook & TikTok with 5 content ideas each |
| 3 | **30-Day Content Calendar** | Week-by-week posting schedule across all platforms |
| 4 | **Email Marketing Templates** | Welcome, Promotional, and Re-engagement email templates |
| 5 | **Ad Copy** | Google Search Ads (headlines + descriptions) + Facebook/Instagram Ad copy |
| 6 | **SEO Keywords** | Primary, Secondary, and Long-tail keyword phrases |
| 7 | **Marketing Score** | Score /100 with 5-category breakdown + 7 actionable Quick Wins |

### 🕵️ Competitor Analysis _(Pro)_
- Enter any competitor's name and get a live AI analysis
- Covers: Strengths, Weaknesses & Gaps, Your Advantages, Positioning Strategy, and 5 Tactics to Win
- Regenerable on demand

### 🔁 Section Regeneration _(Pro)_
- Regenerate any individual section without re-running the full strategy
- Useful for iterating on ad copy, email subject lines, or social ideas

### 📄 PDF Export _(Pro)_
- One-click export of the full strategy to a polished PDF
- A4 format with branded emerald accent bar, cover page, section headers, and page numbers
- Proper markdown → PDF formatting (bold, bullets, numbered lists, tables)
- Filename: `Tactiply-Strategy-[your-business]-[date].pdf`

### 💳 Free vs. Pro Plan
| Feature | Free | Pro |
|---|---|---|
| Strategies per week | 1 (resets Monday) | Unlimited |
| Target Audience | ✅ Full | ✅ Full |
| Social Media Strategy | ✅ Full | ✅ Full |
| 30-Day Content Calendar | ✅ Full | ✅ Full |
| Email Templates | 1 of 3 | ✅ All 3 |
| Marketing Score | Number only | ✅ Full breakdown + Quick Wins |
| Ad Copy | 🔒 Locked | ✅ Full |
| SEO Keywords | 🔒 Locked | ✅ Full |
| Competitor Analysis | 🔒 Locked | ✅ Unlimited |
| Regenerate Sections | 🔒 Locked | ✅ All sections |
| PDF Export | 🔒 Locked | ✅ Full export |

### 📬 Pro Waitlist via Supabase
- Waitlist signup modal appears on locked Pro features
- Name + email captured and stored in **Supabase PostgreSQL**
- Handles duplicate signups gracefully with friendly messaging
- Graceful degradation if Supabase is unavailable

### ☕ Buy Me a Coffee
- A subtle support card appears after strategy generation (once per browser session)
- Dismissible and stored in localStorage — never shown again after dismissed
- Links to the [Tactiply Buy Me a Coffee page](https://buymeacoffee.com/tactiply)

### 🛠️ Founder Mode
- Press `Ctrl + Shift + F` anywhere in the app
- Bypasses the weekly free strategy limit for testing and demos
- Session-only — clears when the tab closes, never stored in the database
- Shows a persistent "Founder Mode Active" badge

### 🎨 UI Polish
- Animated marketing score ring (counts up from 0 to final score)
- Staggered progress bars for each score category
- Copy buttons with 2-second "Copied!" confirmation
- Quick Wins checklist with strikethrough animation
- Scroll-triggered reveal animations on landing page
- Fully responsive, mobile-first design

### 🔒 Security & Input Validation
- Input sanitization on both frontend and backend
- Prompt injection pattern stripping on all user inputs
- Max 2000 character limit per input field
- Sanitized error responses — no internal stack traces exposed

---

## 🛠️ Tech Stack

**Frontend**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) — component-based UI with fast dev builds
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling, mobile-first
- [Lucide React](https://lucide.dev/) — clean, consistent icon library
- [jsPDF](https://github.com/parallax/jsPDF) — client-side PDF generation

**Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) — REST API + SSE streaming server
- [Anthropic Claude API](https://www.anthropic.com/) — `claude-sonnet-4-6` for all AI tasks (questions, strategy, competitor analysis, regeneration)
- [Supabase](https://supabase.com/) — PostgreSQL database for waitlist email capture

**Infrastructure**
- [Vercel](https://vercel.com/) — frontend hosting and deployment
- [Railway](https://railway.app/) — backend Node.js server hosting

---

## 🖥️ Run It Locally

### Prerequisites
- Node.js v18+
- npm or yarn
- An [Anthropic API key](https://console.anthropic.com/)
- A [Supabase](https://supabase.com/) project with a `waitlist` table

### 1. Clone the repo

```bash
git clone https://github.com/moufdi23/tactiply.git
cd tactiply
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
```

Start the backend server:

```bash
npm start
```

The API will be running at `http://localhost:3001`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the frontend dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com/) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `PORT` | Port for the Express server (default: `3001`) |

### Frontend (`/frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of your backend server |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

---

## 💰 Monetization Model

Tactiply uses a hybrid monetization approach:

| Stream | Details |
|---|---|
| **Free Tier** | 1 strategy per week with partial access — lowers the barrier to entry |
| **Pro Plan** | $19/month — currently on waitlist, collecting signups via Supabase |
| **Buy Me a Coffee** | Optional tip jar for free users who find the tool valuable |
| **Affiliate Links** | Planned: relevant tool recommendations inside strategy outputs |

The goal is to keep the core tool genuinely free and useful, and let Pro revenue cover AI API costs and server costs as the user base grows.

---

## 🗂️ Project Structure

```
tactiply/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # UI components (StrategyResults, WaitlistModal, etc.)
│   │   ├── pages/          # Landing page, App page
│   │   ├── plan.js         # Free/Pro plan logic + usage tracking
│   │   └── main.jsx        # App entry point
│   └── public/
├── backend/                # Node.js + Express API
│   ├── routes/
│   │   └── api.js          # All API routes
│   ├── claude.js           # Claude API integration + prompts
│   └── server.js           # Express server setup
└── README.md
```

---

## 👨‍💻 About the Developer

**Built by [Moufdi Ben Saadoune](https://github.com/moufdi23)**

I'm a junior full-stack developer who built Tactiply from scratch — frontend, backend, AI integration, and deployment — as a real product, not just a portfolio piece.

I genuinely believe that small business owners deserve access to the same quality of marketing thinking that big brands pay agencies thousands for. Tactiply is my attempt to close that gap.

**Certifications & Education:**
- 🎓 Certified Full Stack Web Developer — [4Geeks Academy](https://4geeksacademy.com/)
- 📊 Google Digital Marketing & E-commerce Certificate — Google
- 🤖 Actively working toward the **Claude Certified Architect (CCA)** certification by Anthropic

I'm open to junior full-stack or frontend roles. If you like what you see here, let's connect!

📧 [moufdibensaadoune1@gmail.com](mailto:moufdibensaadoune1@gmail.com)
🐙 [github.com/moufdi23](https://github.com/moufdi23)

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com/) — for building Claude and making the API accessible to indie developers
- [Supabase](https://supabase.com/) — for making a real database backend incredibly easy to set up
- [Vercel](https://vercel.com/) & [Railway](https://railway.app/) — for making deployment feel like it should
- Every small business owner who tested this and gave feedback along the way ☕

---

<p align="center">
  Made with lots of ☕ by <strong>Moufdi Ben Saadoune</strong> with the assistance of Claude Code
  <br/>
  <a href="https://tactiply.com">tactiply.com</a> · <a href="https://buymeacoffee.com/tactiply">Buy me a coffee</a>
</p>
