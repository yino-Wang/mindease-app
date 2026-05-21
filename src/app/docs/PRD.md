# 🧘‍♂️ MindEase - AI-Assisted Meditation App PRD

## 1. Product Overview & Vision
### 1.1 Product Positioning
MindEase is an immersive meditation Web App focused on a minimalist zen aesthetic (Vibe) and AI-driven personalization.

### 1.2 Core Values
* **Anxiety De-escalation**: Eliminate cluttered social feeds, leaderboards, and gamified points to focus entirely on a personal, serene mental sanctuary.
* **Intuitive Design**: Utilize a dark-mode, minimalist layout with high white space, low saturation, and subtle micro-interactions to create an instantly calming "ambiance".
* **AI Differentiation**: Provide a highly tailored experience by leveraging Large Language Models (LLMs) to dynamically generate real-time streaming meditation scripts and ambient voices matching the user's current emotional state.

## 2. User Stories
* **US-1 (Autonomous Meditation)**: As an experienced meditator, I want a pure, un-cluttered timer that lets me sit with the sound of rain and concludes with a clear singing bowl chime, so that I can remain undisturbed by complex interfaces.
* **US-2 (Beginner's Journey)**: As a meditation novice, I want a straightforward 3-day introductory course with card-based progress indicators to help me quickly master basic mindfulness breathing techniques.
* **US-3 (Instant Healing)**: As a user experiencing sudden anxiety (e.g., before an interview or during insomnia), I want to state my current condition in one sentence and have the AI instantly generate a dedicated, gentle vocal guide to help me calm down.
* **US-4 (Frictionless Tracking)**: As a habit-forming user, I want to log brief post-session thoughts like a private diary and visualize my consistency through a low-key "glow chart," rather than being confronted by high-pressure numerical leaderboards.

## 3. MVP Functional Requirements
### 3.1 Module 1: Immersive Zen Timer
* **Multi-Track Audio Mixing (Soundscapes)**: The system offers 4 built-in high-quality ambient tracks (*Deep Ocean, Forest Rain, Singing Bowl Spectrum, and Pink Noise*). Independent volume sliders are handled via HTML5 `AudioContext` API.
* **Countdown Mechanism**: Quick-presets (5min / 10min / 20min / Custom) with a wheel picker. Triggers a click-free "Singing Bowl" chime at the start and completion.
* **Distraction-Free Rendering Mode**: 3 seconds after the timer starts, non-essential UI elements fade out. The center renders a subtle breathing bubble animation via `framer-motion` (4s inhale, 4s exhale).

### 3.2 Module 2: Structured Courses & Daily Zen
* **Daily Zen**: Refreshes a 3-5 minute micro-meditation card every morning at 5:00 AM with fixed daily themes.
* **3-Day Mindfulness Course**: Features "visual ambient short videos (muted loop) + therapeutic vocal guidance". Gating mechanism: Day X must be completed to unlock Day X+1.

### 3.3 Module 3: AI Emotional Streaming Guide
* **Mood Input Area**: An elegant text input field supporting preset tags (e.g., `#InterviewAnxiety`, `#LateNightInsomnia`).
* **AI Script & Audio Streaming**: Backend captures the prompt, streams text tokens via Gemini API, pipelines them into Edge TTS, and returns a continuous `ReadableStream` to the frontend Web Audio API for zero-latency playback.

### 3.4 Module 4: Ritual Logs & Zen Journal
* **Zen Calendar (Energy Glow Map)**: A GitHub-like grid using a low-saturation amber glow (`.sacred-glow`), where opacity reflects daily meditation duration.
* **Private Reflection Space (Zen Journal)**: Minimalist post-session text frame strictly capped at 50 characters, encrypted and saved directly to Supabase.

## 4. UI Design & Theme Specifications (Earthy Zen & Amber Glow)
### 4.1 Color Palette & Typography
* **The Shaded Sanctuary (Background)**: Deeply grounded, organic dark hue (Charcoal Black `#0D0E0E` or Deep Moss Jade `#0F110F`).
* **The Sacred Glow (Accent Color)**: Warm, spiritual luminescence using Amber Gold / Antique Brass tones (`amber-500` / `#F59E0B` or Antique Gold `#D97706`).
* **Typography**: Elegant, high-heritage Serif font for headers; warm white (`text-stone-300`) with generous letter-spacing for body copy.

### 4.2 Micro-Interactions
* **The Breathing Cadence**: Highly dampened, long-duration transition (`transition-all duration-700 ease-in-out`).
* **Luminous Glow Effect**: Interactive components utilize Tailwind’s `blur` filters combined with low-opacity amber overlays to replicate an organic oil lamp flicker.

## 5. Tech Stack & Media Constraints
* **Stack**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion, Supabase (Auth/PostgreSQL), Prisma ORM.
* **Constraints**: Strictly NO media assets exceeding 1MB in GitHub. AI content is ephemeral (stream-only, no audio file persistence). Fixed media assets must be hosted on Supabase Storage.

## Appendix A: MVP Static Asset Specification
* **A.1 Ambient Audio**: Sourced from Pixabay/Freesound (CC0). Uploaded to Supabase Storage bucket `meditation-assets`. Wired via `prisma/seed.ts`.
* **A.2 Course Materials**: 10-30s nature loops from Pexels Video (rendered via HTML5 `<video autoplay loop muted playsinline>`). Vocal guidance pre-baked via TTS and stored in Supabase.

## Git Commit Workflow (Strictly Enforced)
1. You must work in "Plan Mode" for any feature implementation. Split the task into tiny, atomic sub-steps.
2. Every time you successfully complete a sub-step or an atomic UI/backend block (e.g., creating a static layout, setting up an API route), you MUST pause and instruct the user to make a Git commit.
3. Provide the exact, structured conventional commit message for the user. Do not proceed to the next step until the user confirms.
4. Example format to output:
   "👉 [STEP COMPLETED] Please run the following commands in your terminal before we proceed:
   git add .
   git commit -m 'feat(timer): init static countdown layout'"