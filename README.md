# 🧠 Sickco AI — AI Sickness Companion

Sickco AI is a web application that allows users to create an account and interact with an AI-powered sickness companion for medical-related queries.  
The app focuses on reliability, thoughtful UX, and real-world application behavior such as authentication, persistent data, async handling, and observability.

👉 Live App: https://sickco.vercel.app  
👉 Repository: https://github.com/Divi202/sickco

---

## Overview

Sickco AI provides a personalized chat experience where users can:
- Sign up and securely log in
- Ask medical-related questions
- View and manage their chat history
- Interact with an AI assistant that responds with appropriate safety disclaimers

The project is designed with a modular architecture and production-style patterns to resemble how real applications are built and maintained.

---

## Key Features

### Authentication & User Management
- User signup and login using **Supabase Auth**
- Protected routes and session handling
- User-specific data isolation

### AI Chat Experience
- Conversational chat interface
- Persistent chat history per user
- Loading and typing indicators
- Clear chat functionality with confirmation
- Welcome message and empty states
- Graceful error handling and retries

### Theme & Accessibility
- Light and Dark mode support
- Theme persistence across sessions
- Designed for readability and reduced eye strain
- Consistent theming across all app states

### Data & Observability
- Chat history stored in **Supabase Database**
- Custom logging for debugging and monitoring
- Defensive handling of API and network failures

### UX & Responsiveness
- Fully responsive layout (mobile & desktop)
- Clear system messages and feedback
- Accessible and readable UI

### Safety
- Medical disclaimer dynamically included alongside AI responses
- App does **not** provide medical advice

---

## Architecture

The project follows a **modular monolith** architecture using a structured file-system approach.

- Clear separation of concerns (auth, chat, UI, utilities)
- Scalable folder structure
- Easy to extend without introducing unnecessary complexity

This approach keeps the codebase maintainable while avoiding premature microservices.

---

## Tech Stack

- **Framework:** React / Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** Supabase
- **AI Provider:** OpenRouter  
  - Model: `GPT-OSS-120B`
- **Deployment:** Vercel

---

## Screenshots

Home Page - Dark Mode
<img width="1920" height="870" alt="Home_Page_Dark" src="https://github.com/user-attachments/assets/2ddd9c88-e1a6-413d-b603-3512baf93506" />

Home Page - Light Mode
<img width="1920" height="870" alt="Home_Page_Light" src="https://github.com/user-attachments/assets/d2e7e39d-d785-4c7f-bc1d-f5b7ca3bbd32" />

Login Page
<img width="1920" height="868" alt="Login_Page" src="https://github.com/user-attachments/assets/20dcf690-c8bd-45c9-b019-f0d87f60d559" />

Signup Page

Dashboard
<img width="1920" height="871" alt="Dashboard_01" src="https://github.com/user-attachments/assets/e60bcdd2-6cba-4e3b-8cdb-9857908f15c4" />
<img width="1920" height="869" alt="Dashboard_02" src="https://github.com/user-attachments/assets/c8da2876-2923-4b5d-9f9e-1bb8261f7ccd" />
<img width="1920" height="868" alt="Clearchat" src="https://github.com/user-attachments/assets/739a9f34-a27c-4ba9-b6a5-836d83db2e4e" />
<img width="1920" height="873" alt="Dashboard_03" src="https://github.com/user-attachments/assets/3eda4150-6c96-4407-a07b-05a0ed6e557a" />



