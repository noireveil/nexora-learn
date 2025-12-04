#  Nexora Learn

**Next-Era Adaptive Coding Education Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19_RC-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.22-orange?logo=tensorflow)](https://www.tensorflow.org/js)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

> Nexora Learn is an **Offline-First** coding education platform utilizing **On-Device Machine Learning** to personalize learning experiences in real-time, directly in the browser (Client-Side).

---

## 🏗️ System Architecture

This project employs a **Clean Architecture** separating UI, Logic, and Data Layers, built on top of the latest **React 19** features.

* **`src/app`**: Routing & Pages (Next.js 15 App Router).
* **`src/components`**: UI Components (Visual only, React Server Components where applicable).
* **`src/hooks`**: React State & Lifecycle Logic (Controller).
* **`src/services`**: Database & Business Logic (Model).
* **`src/ml`**: Machine Learning Engine (TFJS WebGL Backend).
* **`src/workers`**: Background Threads for secure code execution.

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
    *Local database (IndexedDB) will automatically seed with dummy data on first load.*

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

- [x] Monaco Editor Integration
- [x] **Code Execution Engine**: Run user JS in Web Worker (Sandboxed)
- [x] **Test Runner**: Validate outputs against Test Cases
- [x] **Data Seeder**: Automated initial data population
- [x] Local Data Sync (Export/Import JSON)

### 🟢 Phase 3: AI & Content (In Progress)
**Goal:** Active AI Engine and comprehensive content.

- [x] **Engine Upgrade**: TensorFlow.js 4.22 (WebGL Backend optimized for React 19)
- [x] ML Modular Structure (`src/ml`)
- [ ] **Feature Engineering**: User data to Tensor conversion logic (`extractor.ts`)
- [ ] **Anti-Cheat Engine**: Levenshtein algorithm implementation (`antiCheatService.ts`)
- [ ] **Model Integration**: Load actual `.json` model file
- [ ] **Content Production**: Write 50+ coding challenges (`seeder.ts`)

### 🔵 Phase 4: Gamification & Polish (Next Up)
**Goal:** User engagement and security.

- [x] Basic XP & Leveling Logic (`src/lib/gamification`)
- [x] Dashboard Stats Visualization
- [x] **Performance**: React Compiler & Turbopack Integration
- [ ] **PWA Optimization**: Service Worker configuration for offline caching

---

## 🧠 ML & Content Engineer Guide

### 1. Machine Learning Tasks (Folder: `src/ml`)
* **Feature Engineering (`features/extractor.ts`)**:
    * Implement math logic to calculate `accuracyRate`, `avgTime`, and `streakImpact`.
    * Implement `convertToTensor` to format data for the model.
* **Anti-Cheat (`services/antiCheatService.ts`)**:
    * Implement **Levenshtein Distance** algorithm.
    * Define threshold logic in `checkPlagiarism` (e.g., >85% similarity).
* **Prediction (`services/difficultyPredictor.ts`)**:
    * Train model in Colab/Python and place output (`model.json` + `.bin`) in `public/models/`.
    * Uncomment model loading code and connect with input tensor.

### 2. Content Creation Tasks (File: `src/lib/db/seeder.ts`)
* **Challenge Database**:
    * Replace the dummy data in the `seedDatabase` function.
    * Write **50+ unique coding challenges** covering topics like Variables, Loops, Functions, and Arrays.
    * Ensure each challenge has valid `testCases` (Input/Output) for the Test Runner.