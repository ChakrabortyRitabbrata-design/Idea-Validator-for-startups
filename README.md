# 🚀 Ruthless AI Startup Validator

An **Agentic RAG (Retrieval-Augmented Generation)** platform designed to provide brutal, data-driven feedback on startup ideas. Unlike standard LLMs, this engine performs **live market research** using the Tavily Search API to identify real competitors, current market trends (CAGR), and execution risks specific to 2026.

![Next.js](https://img.shields.io/badge/frontend-Next.js%2014-black)
![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)
![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue)
![Tavily](https://img.shields.io/badge/Search-Tavily%20AI-orange)

---

## 🧠 The "Agentic" Difference
Standard AI models are frozen in time. This validator acts as an **AI Agent**:
1. **Research Phase**: Upon receiving an idea, it queries the **Tavily Search API** for real-time market data.
2. **Context Injection**: It cleans and feeds that live data into **Gemini 1.5 Flash**.
3. **Ruthless Persona**: The AI assumes the role of a cynical VC/Co-founder to find "fatal flaws" in the business model.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (for smooth UI transitions)
- **State Management**: Zustand
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: SQLAlchemy
- **Search Engine**: Tavily AI (Agentic Search)
- **LLM**: Google Gemini 1.5 Flash
- **Deployment**: Render

---

