# Nexora Full-Stack Application - Project Documentation & System Architecture

This document provides a comprehensive technical overview of the **Nexora** mobile and web-enabled student platform. It details the system architecture, core technologies, database and auth configuration, screen-by-screen feature breakdowns, step-by-step student onboarding and routing flows, and unique technical innovations implemented in the app.

---

## 1. Executive Summary & Project Overview

**Nexora** is an interactive career mapping and academic college selection hub designed for students. The application bridges the gap between educational choices (traditional intermediate schooling, technical diplomas, and vocational ITI trades) and professional career targets (engineering branches, medical lines, start-up/business fields, etc.).

### Core Deliverables
- **Seamless Cross-Platform Target**: Configured for Android, iOS, and Web deployment via React Native Web.
- **Supabase Cloud Synchronization**: Instant read/write flows for user profile dossiers and live college list databases.
- **Personalized Logic**: Weighted skill-matching metrics determining student alignment with university missions.
- **Premium Aesthetics**: Cyberpunk/neon-themed interface featuring breathing logo sequences, rotating halo card borders, and smooth spring-animated navigation elements.

---

## 2. Technical Stack & Core Dependencies

The application code is structured in [TypeScript](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/tsconfig.json) and packaged via [package.json](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/package.json):

- **Core Framework**: React Native (v0.81.5) with Expo (v54.0.35) for universal mobile build workflows.
- **Web Interface**: React Native Web (v0.21.0) and Expo Metro Runtime for browser compilation and deployment.
- **Database & Identity Manager**: Supabase JS Client (v2.101.1) mapping remote PostgreSQL tables.
- **Navigation Hub**: React Navigation bottom-tabs (v6.x) and native-stack (v6.x) for seamless page transitions.
- **Visuals & Assets**: Expo Linear Gradient (v15.0.8) and Expo Vector Icons (v15.0.3) for layout themes and graphics.

---

## 3. System Architecture & Component Mapping

The application follows a clean directory structure separating state, configuration, helper libraries, and UI screens:

- [App.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/App.tsx): Root application entry point controlling authentication state changes and defining the main stack/tab structure.
- [src/lib/supabase.ts](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/lib/supabase.ts): Initializer configuring project credentials (`SUPABASE_URL` and `SUPABASE_ANON_KEY`) and exporting the client.
- [src/screens/](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/): Directory holding UI screens and screen-specific styling sheets.

---

## 4. Student Onboarding & Navigation Flow

To ensure a structured and engaging user experience, the application utilizes a specific state-driven onboarding and routing lifecycle. Below is the step-by-step progression of how a student navigates from initial launch to the main dashboard:

1. **Session Verification (App.tsx)**:
   - On launch, the root component queries `supabase.auth.getSession()` and registers a state listener via `supabase.auth.onAuthStateChange()`.
   - If no valid session exists, the navigator locks the user inside the `AuthScreen` (`Auth` Stack route).
   - Once a user signs in, signs up, or authenticates via Google OAuth, the `session` state updates, triggering the router to unmount `Auth` and mount the authenticated `Stack.Group`.

2. **Onboarding Gate / Command Hub Selection (SectorSelectionScreen.tsx)**:
   - Upon mounting the authenticated stack, the app defaults to the `Selection` route, loading the `SectorSelectionScreen`.
   - On load, a sequential typing animation flashes `"NEXORA"` followed by `"CHOOSE PATH"`.
   - The user is presented with 14 interactive career sector pods (Engineering, Skilled Trades, Computers, etc.) rendered in a custom grid.
   - **Direct Navigation (Direct Path)**: Selecting any sector *other* than `"ENGINEERING"` immediately calls `navigation.replace('Home')`, bypassing any secondary questionnaires and landing the student directly on the main dashboard (`TabNavigator` Hub).
   - **Guided Navigation (Guided Path)**: Selecting the `"ENGINEERING"` sector triggers `navigation.navigate('EngineeringPath')` to run a specialized branching analysis.

3. **Career Branching Tree (EngineeringPathScreen.tsx)**:
   - In this screen, the student progresses through a hierarchical questionnaire mapping their academic foundation (Intermediate, Diploma, or ITI) and core stream selection (Science, Commerce, or Arts).
   - Descriptive information slides pop up to clarify educational domains (e.g. Commerce or Arts opportunities).
   - The final questionnaire leaf nodes narrow the selection down to specific engineering branches (Civil, Mechanical, Computer Engineering) or technical vocational trades (Electrician, Fitter, Turner, Machinist, COPA).

4. **Pathway Synchronization & Main Hub Redirect**:
   - Once the user selects their terminal branch, the screen flashes a `"MISSION STATUS: Pathway Synchronized"` confirmation.
   - After a `2000ms` animated timeout delay, the app calls `navigation.replace('Home')`.
   - The stack router replaces the onboarding screens, landing the user on the primary bottom-tab navigation hub (`TabNavigator` Hub). The layout defaults to the `HomeScreen` dashboard.

---

## 5. Screen-by-Screen Feature Specifications

### A. Authentication Gate
- **File**: [AuthScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/AuthScreen.tsx)
- **Features**:
  - Dual Mode Login: Email/Password inputs alongside a Google OAuth Gateway.
  - Verification & Utility: Built-in reset security key (Forgot password), OTP (One-Time Password) logins, and email activation screens.
  - Web Redirect Handling: Utilizes `WebBrowser.openAuthSessionAsync` and custom parsing of query hashes (access tokens and codes) for desktop browsers.
  - Mobile Redirect Handling: Utilizes `Linking.createURL('auth-callback')` for deep linking back from mobile browsers.
  - Micro-Animations: Floating neon tracer border rotation and breathing logo animation.

### B. Sector Selection Screen
- **File**: [SectorSelectionScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/SectorSelectionScreen.tsx)
- **Features**:
  - Typewriter Greeting: Runs sequential typing animations rendering `"NEXORA"` then `"CHOOSE PATH"` on load.
  - 14 Career Sector Pods: Grid containing icons for Engineering, Skilled Trades, Computers, Medical Support, Merchant Navy, Fashion & Design, Media, Agriculture, etc.
  - Spring-Scaling Effects: Hovering or pressing a pod triggers scaling up (1.25x) and reveals a glowing halo outline matching the sector color.

### C. Career Decision Tree
- **File**: [EngineeringPathScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/EngineeringPathScreen.tsx)
- **Features**:
  - Guided Questionnaire: Multi-level path selector mapping baseline credentials (Intermediate vs. Diploma vs. ITI).
  - Stream Resolution: Bridges choices to science, commerce, and art fields, providing text manuals on why those fields matter.
  - Trade & Branch Selection: Resolves choices into mechanical, computer, electrical branches, or machinist/electrician vocational trades.
  - Progress tracker: A horizontal pulsing bar highlighting path depth.
  - Card transitions: Horizontal slide translation on selecting options.

### D. Student Dashboard
- **File**: [HomeScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/HomeScreen.tsx)
- **Features**:
  - Exit Portal: Sign-out button linked to the Supabase security state.
  - Match HUD Indicator: Animates a pulsing circular progress gauge reflecting career matching statistics (e.g. 84% matched).
  - Opportunity scroll: Horizontal list detailing ongoing applications (Global STEM, Google Career, resume bots).
  - Interactive grid: Modular tiles linking to Scholarships, Resume Lab, Community chats, and Career quizzes.
  - Calendar row: Lists dates and subtitles of upcoming campus events.

### E. College Directory Hub
- **File**: [CollegeScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/CollegeScreen.tsx)
- **Features**:
  - Search & Filters: Sub-headers categorizing colleges by sector and a search bar scanning location, names, and campus missions.
  - Network Indicator: Displays a badge showing `"ONLINE SYNCED"` when connected to Supabase database tables, or `"CACHE SYNCED"` when operating offline with cache datasets.
  - Admissions Gateway: Clicking `"APPLY GATEWAY"` triggers a simulated submission to college portals, generating a unique token (e.g. `NEX-128479`).
  - Mission Brief Modal: Details college descriptors, eligibility metrics, financial scholarship structures, and matched skills.

### F. Student Profile Dossier
- **File**: [ProfileScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/ProfileScreen.tsx)
- **Features**:
  - LinkedIn Theme Header: Gradient banner displaying a floating user avatar with camera upload portal hooks.
  - Cloud Synchronization: Saves full name, username/ID, Bio, LinkedIn URLs, High School, College, Phone, and Address details to the `profiles` table.
  - Skill Badging: Interactively add/remove skills (e.g., Kotlin, CAD, Python) which update as chip nodes.

### G. Secondary Screens
- **AI Screen ([AIScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/AIScreen.tsx))**: An active S-Node welcoming speech-to-text or typed student queries.
- **Notification Screen ([NotificationScreen.tsx](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/src/screens/NotificationScreen.tsx))**: Visual log showing sync status.

---

## 6. Core Algorithmic & Resiliency Systems

### Skill-to-College Matching Engine
```typescript
const getAdjustedMatch = (college: College) => {
  if (!profile || !profile.skills || profile.skills.length === 0) {
    return college.matchRate;
  }
  
  let matchCount = 0;
  const lowerMission = college.mission.toLowerCase();
  const lowerPerks = college.perks.join(' ').toLowerCase();
  const lowerDesc = college.description.toLowerCase();

  profile.skills.forEach((skill: string) => {
    const lowerSkill = skill.toLowerCase();
    if (lowerMission.includes(lowerSkill) || lowerPerks.includes(lowerSkill) || lowerDesc.includes(lowerSkill)) {
      matchCount += 3; // Boost score for every matching skill
    }
  });

  return Math.min(100, college.matchRate + matchCount);
};
```
This engine parses word overlaps between the user's active Profile skills array and college missions, adapting the match score in real time.

### Network Resiliency Fallback
If the client fails to fetch data from Supabase (`colleges` table) due to offline environments, the app catches the query exception, prompts the UI to display a warning status badge (`CACHE SYNCED` instead of `ONLINE SYNCED`), and loads the mock dataset `MOCK_COLLEGES` from memory.

---

## 7. Generated Artifacts
For convenience, the documentation has been rendered as a professional multi-page PDF document available in your workspace root:
- **PDF File**: [Nexora_App_Documentation.pdf](file:///c:/Users/user/Desktop/Nexora%20Main%20Folder/Nexora_App_Documentation.pdf) (generated via `fpdf2` engine).
