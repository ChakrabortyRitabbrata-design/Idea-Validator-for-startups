# 🚀 ValidatorOS: Startup Idea Evaluator Pro
**The Ruthless AI Co-founder for 2026**

ValidatorOS is a full-stack AI application that uses **RAG (Retrieval-Augmented Generation)** to provide brutal, honest, and data-driven feedback on startup viability. It doesn't just chat; it analyzes market fit, risks, and execution strategies using a curated knowledge base.

🔗 **Live Demo:** https://idea-validator-for-startups.vercel.app/

---

## 🧠 Key Features
* **Ruthless Analysis:** Powered by **gemini-3-flash-preview** for high-speed, logical evaluation.
* **RAG Integration:** Consults a `data/` folder of PDFs/Market reports for grounded advice.
* **Evaluation History:** Persistent storage of past ideas using **Neon PostgreSQL**.
* **Linear-Inspired UI:** A clean, dark-mode professional interface built with **Next.js 15**.
* **Full-Stack Deployment:** Seamless communication between Vercel (Frontend) and Render (Backend).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (Modern Dark Theme)
- **Icons:** Lucide React
- **State Management:** Zustand
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI (Python 3.11)
- **AI Model:** gemini-3-flash-preview
- **Database ORM:** SQLAlchemy
- **Deployment:** Render

### Database & Storage
- **Primary DB:** Neon Tech (Serverless PostgreSQL)
- **Knowledge Base:** Local PDF/Text ingestion via RAG pipeline

