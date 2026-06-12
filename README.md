Deck.

"Locking in. Drop your drafts, notes, or tasks here and let’s get it done."

Deck. is a premium, dark-mode, server-first workspace utility engineered using React + Tailwind CSS. Designed as an elite, high-end, corporate Gen-Z SaaS productivity environment, Deck. corrects the design mismatches of typical AI assistants. It replaces rigid layouts with a fluid, side-by-side "Twin-Pod" glassmorphic geometry that keeps modern knowledge workers organized and highly focused.

This workspace has been fully published and deployed live natively via Lovable, with automated deployment syncs running directly to GitHub.

>> Live Deployment & Sync Engine

Deck. is continuously deployed and optimized.

 Deployed with Lovable: Built, optimized, and natively hosted using Lovable’s global edge network.

Automatic GitHub Sync: Any changes pushed to our linked GitHub repository instantly trigger a production build, ensuring zero downtime and effortless visual upgrades.

🔗 Live Application: https://hello-sunbeam-beam.lovable.app/

>> The Design System & Aesthetic DNA

Deck. is built to look rich, expensive, and deeply atmospheric—completely steering clear of flat, solid black interfaces.

The Palette: A deep, matte midnight blue background (#0b1329) bathed in an elegant, soft ambient radial glow of turquoise neon fog (filter: blur(80px); opacity: 0.15) centered behind the interaction cards.

Twin-Pod Geometry: Side-by-side floating frosted-glass pods (rgba(15, 23, 42, 0.65) with backdrop-filter: blur(12px)) aligned with matching, sweeping rounded corners (border-radius: 24px) and highlighted by crisp, razor-thin borders (1px solid rgba(34, 211, 238, 0.15)).

The Typography Contrast: Editorial serif headers using 'Playfair Display' juxtaposed with clean, high-gravity corporate sans-serif 'IBM Plex Sans' for inputs, forms, and code readouts.

The Tactile AI Emblem: A vintage-modern branding asset styled like a piece of rich, cream-colored parchment paper (#f4eae1) featuring a breathing, pulsing turquoise shadow animation that physically floats off the frosted glass.

---Core Feature Modules---

Navigate through your daily office queue instantly via the dedicated navigation sidebar:

1. Pre-Auth Gateway (Login Card)

An elegant, unauthenticated gatekeeper layout that secures active workspace routes.

Displays a beautiful central glassmorphic card: "Welcome to Deck. Let's clear your queue." with minimalist inputs and glowing turquoise active focus borders.

2. Dashboard Chat

The primary landing experience featuring a warm, high-gravity greeting and an instant conversational input field.

Includes interactive prompt chips with a smooth hover transition (micro-lift translateY(-2px) and border glow highlights) for quick action injections.

3. Email Generator

A clean form taking recipient parameters, purpose, and specific tone instructions.

Outputs structured Markdown copy blocks separated dynamically into [Subject Line] and [Email Body] complete with a one-click clipboard copy callback.

4. Meeting Sync Summarizer

Accepts raw spoken transcripts, messy conversation notes, or chat dumps.

Engineers a highly scannable, structured Markdown document breaking down Key Decisions, Action Items, and highlighting specific task owners in bold text.

5. Task Timeline Architect

A chronological schedule layout planner.

Structures random tasks, assigns estimated durations, and visually maps out a timeline while dynamically applying high-urgency badges to critical deadline priorities.

6. "Previous Decks" Historical Feed

A dedicated, scrollable sidebar feed utilizing React state hooked to browser localStorage variables.

Every successfully completed generation is cached dynamically. Users can click any historical block in the sidebar to load the payload back into the primary workspace immediately.

---Tech Stack & API Security---

Framework: React (Vite-optimized deployment)

Styling: Tailwind CSS + Custom Backdrop CSS utilities

AI Engine: Google Gemini Client (gemini-2.5-flash model templates)

Deployment: Lovable Edge Network

Whenever queries are fetching, the interface displays an overlaying, high-contrast Teal Shimmer State over the active card to prevent layout shifts and provide sleek visual feedback.

---Local Development Setup---

If you want to clone this repository and run the workspace copy locally:

1. Clone the repository

git clone https://github.com/your-username/deck.git
cd deck


2. Install dependencies

npm install


3. Add environment parameters

Create a .env file in your root folder and define your Google Gemini credentials:

VITE_GEMINI_API_KEY=your_gemini_api_key_here


4. Boot the dev environment

npm run dev

