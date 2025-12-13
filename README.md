# 🧠 Nexora Learn

**Next-Era Adaptive Coding Education Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19_RC-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-orange?logo=tensorflow)](https://www.tensorflow.org/js)
[![Pyodide](https://img.shields.io/badge/Pyodide-WASM-gold?logo=python)](https://pyodide.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()

> **Nexora Learn** is an **Offline-First** coding education platform utilizing **On-Device Machine Learning** to personalize learning experiences in real-time. Built to run entirely on the client-side without server dependency, ensuring privacy and accessibility anywhere.

---

## ✨ Key Features

### 🚀 1. Adaptive AI Engine (TensorFlow.js)
Unlike static learning platforms, Nexora adapts to you. The system calculates a **User Skill Vector** in real-time based on:
* **Accuracy Rate & Hint Usage**
* **Time Complexity & Execution Speed**
* **Consistency (Streak Impact)**

The on-device Neural Network (WebGL backend) predicts the optimal difficulty for your next challenge (Easy/Medium/Hard) to keep you in the "Flow State".

### 🔒 2. Anti-Cheat & Integrity System
Designed to build real muscle memory, not just copy-pasting skills.
* **Anti-Paste Protection:** The editor detects large text insertions and blocks submission, encouraging manual typing.
* **Plagiarism Detection:** Uses Levenshtein Distance algorithms to detect code similarity against local history, preventing cheating on shared devices.

### ⚡ 3. Polyglot Code Execution
Run code securely in the browser using sandboxed Web Workers and WebAssembly:
* **JavaScript:** Secure `new Function` sandbox with constraints.
* **Python:** Full Python runtime powered by **Pyodide (WASM)**, capable of running logic, math, and data structure operations offline.
* **Web (HTML/CSS):** Real-time DOM rendering with "Space-Insensitive" Regex validation for flexible grading.

### 🌐 4. True Offline-First Architecture
* **No Server Required:** All progress, code history, and gamification data are stored in **IndexedDB** (via Dexie.js).
* **PWA Support:** Installable as a native-like app on Desktop and Mobile.
* **Data Sync:** Export/Import your progress via JSON to sync between devices manually.

---

## 🏗️ System Architecture

This project employs a **Clean Architecture** separating UI, Logic, and Data Layers, optimized for **React 19** performance.

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **UI Layer** | **Tailwind CSS + Framer Motion** | Responsive, animated components with Shadcn/UI patterns. |
| **Logic Layer** | **React Hooks + Web Workers** | State management and off-main-thread code execution. |
| **Data Layer** | **Dexie.js (IndexedDB)** | High-performance local database for persistence. |
| **AI Layer** | **TensorFlow.js** | Client-side inference and model management. |

### Directory Structure
```
src/
├── app/         # Next.js 15 App Router (Pages)
├── components/  # Reusable UI Components
├── data/        # Curriculum & Challenge JSONs
├── hooks/       # React Custom Hooks (Controllers)
├── lib/         # Utilities (DB Schema, Gamification Logic)
├── ml/          # Machine Learning Models & Feature Extractor
├── services/    # Business Logic (User, Course, Progress)
└── workers/     # Background Threads (Code Executor)
```

---

## 📦 Getting Started

Ensure you have **Node.js (v18+)** installed.

### 1. Clone Repository
```bash
git clone https://github.com/noireveil/nexora-learn.git
cd nexora-learn
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
Uses Turbopack for instant Hot Module Replacement (HMR).
```bash
npm run dev
```

### 4. Open Application
Visit [http://localhost:3000](http://localhost:3000).

*Note: On the first load, the local database will automatically seed with the latest curriculum data.*

---

## 📚 Curriculum Paths

Nexora Learn currently offers three comprehensive learning paths with Project-Based Learning:

1. **JavaScript Mastery**: From Variables to Functional Programming & Higher Order Functions.
2. **Python for Data Science**: Syntax, Structures, Modules, and Data Processing logic.
3. **Web Foundation**: HTML5 Semantics, CSS3 Styling, Flexbox/Grid, and Responsive Layouts.

*Advanced users are fast-tracked to Level 20 (Guru Badge) and Final Projects via the "Warm Start" algorithm.*

---

## 🚀 Build & Deploy

### Production Build
```bash
npm run build
```

### Run Production Server
```bash
npm start
```
