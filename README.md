# 🧠 Nexora Learn

**Next-Era Adaptive Coding Education Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19_RC-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-orange?logo=tensorflow)](https://www.tensorflow.org/js)
![Status](https://img.shields.io/badge/Status-Public%20Beta-success)

> Nexora Learn is an **Offline-First** coding education platform utilizing **On-Device Machine Learning** to personalize learning experiences in real-time, directly in the browser (Client-Side).

---

## 🏗️ System Architecture

This project employs a **Clean Architecture** separating UI, Logic, and Data Layers, built on top of the latest **React 19** features.

* **`src/app`**: Routing & Pages (Next.js 15 App Router).
* **`src/components`**: UI Components (Visual only, React Server Components where applicable).
* **`src/hooks`**: React State & Lifecycle Logic (Controller).
* **`src/services`**: Database & Business Logic (Model).
* **`src/ml`**: Machine Learning Engine (TFJS WebGL Backend).
* **`src/workers`**: Background Threads for secure code execution (JS & Python).

---

## 📦 Getting Started

Ensure Node.js (v18+) is installed.

1.  **Clone Repository**
    ```bash
    git clone https://github.com/noireveil/nexora-learn.git
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    Uses **Turbopack** for instant HMR.
    ```bash
    npm run dev
    ```

4.  **Open Application**
    Visit [http://localhost:3000](http://localhost:3000).  
    *Local database (IndexedDB) will automatically seed with curriculum data on first load.*

---

## 📊 Development Progress

### 🔴 Phase 1: Foundation & UI Skeleton (Completed)
**Goal:** Setup project structure, Database, and Base Pages.

- [x] Setup Next.js 15 + Tailwind + shadcn/ui
- [x] Implement Clean Architecture (`hooks`, `services`, `components`)
- [x] Setup IndexedDB Schema (`Dexie.js`)
- [x] Basic Routing & Layout (Dashboard, Learn Path, Profile)
- [x] UI Prototype (Hero Section, Course Cards, Stats Overview)

### 🟡 Phase 2: Core Engine (Completed)
**Goal:** Functional Code Editor and Execution System.

- [x] Monaco Editor Integration (VS Code experience)
- [x] **Code Execution Engine**: Run user JS in Web Worker (Sandboxed)
- [x] **Python Support**: Full Python runtime via WebAssembly (Pyodide)
- [x] **Test Runner**: Validate outputs against Test Cases
- [x] **Data Seeder**: Automated initial data population
- [x] Local Data Sync (Export/Import JSON)

### 🟢 Phase 3: AI & Content (Completed)
**Goal:** Active AI Engine and comprehensive content.

- [x] **Engine Upgrade**: TensorFlow.js 4.22 (WebGL Backend optimized for React 19)
- [x] ML Modular Structure (`src/ml`)
- [x] **Feature Engineering**: Real-time user skill vector calculation (`extractor.ts`)
- [x] **Anti-Cheat Engine**: Behavioral analysis & Anti-Paste Integrity System
- [x] **Model Integration**: Adaptive difficulty prediction based on performance
- [x] **Content Production**: 50+ unique coding challenges (JS & Python)

### 🔵 Phase 4: Gamification & Polish (Completed)
**Goal:** User engagement and security.

- [x] Basic XP & Leveling Logic (`src/lib/gamification`)
- [x] Dashboard Stats Visualization & Activity Chart
- [x] **Performance**: React Compiler & Turbopack Integration
- [x] **Offline Ready**: Architecture supports full offline usage (Local DB + Assets)

---

## 🧠 Key Features Implemented

### 1. Adaptive Learning (TensorFlow.js)
The platform analyzes user performance in real-time to adjust the difficulty of subsequent challenges.
* **Input Features:** Accuracy Rate, Average Time, Streak Impact, Hint Usage.
* **Output:** Recommended Difficulty (Easy, Medium, Hard).

### 2. Anti-Paste Integrity
To ensure authentic learning and muscle memory development:
* **Behavioral Analysis:** Detects impossible typing speeds (e.g., pasting 50 lines in 10ms).
* **Shared Device Protection:** Detects plagiarism against local history to prevent cheating on shared school computers.

### 3. True Offline-First
* **Database:** Uses **IndexedDB** (via Dexie.js) to store all user progress, code history, and achievements locally.
* **Python Runtime:** Python engine (Pyodide) can be cached for offline execution without server dependency.

### 4. Polyglot Code Runner
* **JavaScript:** Secure `new Function` sandbox in Web Worker.
* **Python:** WebAssembly-based Python environment running entirely in the browser.