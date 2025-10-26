# ⚡ Offline-Aware Experiment Platform (Frontend)

A responsive and resilient frontend built with **React**, **Axios**, and **Sonner Toasts**, designed to gracefully handle **offline submissions**, **network recovery**, and **rate-limited API requests**.  
This project ensures a smooth user experience even when the user temporarily loses connectivity or exceeds request limits.

---

## 🧭 Overview

Users can create and interact with AI-driven "experiments" in real-time.  
When network connectivity is lost, requests are **queued locally** and automatically retried once the connection is restored — all with clear user feedback.

This project emphasizes:
- **Offline-first UX**
- **Request queue and retry logic**
- **Rate-limiting protection**
- **Clear toast-based status indicators**
- **Modular architecture with maintainable separation of concerns**

---

## 🏗️ Architecture

### **Core Structure**
```
src/
├── components/        # Reusable UI components (toasts, buttons, tabs)
├── hooks/             # Custom React hooks for API logic and network status
├── lib/               # Utilities (axios instance, rate limiter, helpers)
├── context/           # Global context providers (ExperimentsContext)
├── pages/ or app/     # Main entry points and routes
└── styles/            # Global and modular CSS/Tailwind
```

### **Data Flow**
1. **User Interaction**  
   User types a message or creates an experiment → triggers `handleSubmit()`

2. **Network Check**  
   A hook (`useOnlineStatus`) checks `navigator.onLine`.  
   - If **offline**:  
     A persistent toast displays, and the request is **queued** in memory.
   - If **online**:  
     The request is sent immediately to the backend.

3. **Request Handling**  
   The `axiosInstance` uses interceptors:
   - Queues failed requests when offline
   - Retries them when `window.online` event fires
   - Displays Sonner toasts for rate limits, retries, and successes

4. **Rate Limiting**  
   If backend returns HTTP **429**, a single toast (non-duplicating) shows:  
   “Too many experiments created, please slow down.”

5. **Experiment Updates**  
   Results are added to the `useExperiments` context and rendered instantly, maintaining UX continuity.

---

## ⚙️ Key Features

- **Axios Offline Queue:**  
  Stores pending requests while offline and retries automatically on reconnection.

- **Rate Limiting:**  
  Prevents flooding the backend with excessive experiment requests.

- **Sonner Toast Feedback:**  
  - Persistent toast for offline state  
  - Dismisses only when reconnected  
  - Retry action buttons for manual control

- **React Query / Custom Hooks Integration:**  
  Fetch and update data with intelligent caching and state synchronization.

- **Framer Motion Animations:**  
  Smooth transitions and status animations for UI feedback.

---

## 🌐 Environment Variables

Create a `.env` file at the root:

```bash
NEXT_PUBLIC_BASE_URL=https://your-api-url.com
```

> ⚠️ Ensure `NEXT_PUBLIC_` prefix for all frontend-exposed variables.

---

## 🚀 Running the App

### **Development**
```bash
npm install
npm run dev
```
App will be available at `http://localhost:3000`

### **Build for Production**
```bash
npm run build
npm start
```

---

## 🧠 Design Philosophy

1. **Resilience by Default:**  
   Network failures shouldn’t break UX. The app queues requests silently.

2. **Transparency:**  
   Users always know what’s happening — through toasts, retry prompts, and state indicators.

3. **Modularity:**  
   API logic, UI components, and business logic are isolated for easy testing and scalability.

4. **Serverless-Aware Logging:**  
   Vercel deployments skip file logging, using console output instead.

---

## 🧩 Technologies

| Layer | Tech |
|-------|------|
| Framework | React + Vite / Next.js (depending on setup) |
| Styling | TailwindCSS |
| Animations | Framer Motion |
| Networking | Axios with Interceptors |
| State Management | React Context + Hooks |
| Notifications | Sonner Toast |
| Rate Limiting | Custom axios rate limiter wrapper |

---

## 🔬 Testing

Use Jest or Vitest for testing hooks and axios behaviors.

Example:
```bash
npm run test
```

Focus on:
- Offline retry behavior
- Duplicate toast prevention
- Rate-limit handling (HTTP 429)

---

## 🧱 Future Enhancements

- Persistent local queue using IndexedDB (for full offline PWA mode)
- Background Sync API integration
- Analytics for retry success rate
- Sentry or Logtail integration for remote error logging

---

## 👥 Contributors

**Frontend Lead:** Malikberry  
**Mentorship / Architecture Guidance:** ChatGPT (AI System)

---

> “A resilient frontend isn’t just about uptime — it’s about user trust when things *don’t* go right.”
