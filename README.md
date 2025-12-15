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

> *(Add screenshots here)*

```text
Light Mode – Chat Dashboard
Dark Mode – Chat Dashboard
Authentication Flow
Error & Empty States
