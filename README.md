## Project info.

**🩺 HealVision — AI-Powered Health Companion**
Overview

HealVision is a full-stack AI health assistant that leverages Google Gemini 2.0 Flash to analyze medical symptoms, interpret images (like X-rays), and provide structured, safe, non-diagnostic health insights.
It combines multimodal AI capabilities with a modern user interface for intuitive, responsible healthcare assistance.

**Key Features**

Symptom Analysis:
Input age, gender, allergies, and symptoms for AI-generated summaries, possible causes, red flags, and self-care tips.

Image Analysis:
Upload medical images (X-rays, scans, etc.) for AI-based interpretation.

AI Doctor Chat:
Real-time conversation with an AI health assistant. Includes MindCare mode for emotional wellness support.

Health Reports:
Each analysis is automatically saved locally and can be revisited in a dedicated Health Reports dashboard.

**Technology Stack**
Layer	Technology
Frontend	React (Vite + TypeScript), Tailwind CSS, shadcn/ui, Framer Motion
Backend	Node.js, Express.js
AI Integration	Google Gemini 2.0 Flash (Generative Language API)
Data Storage	Browser LocalStorage (for reports)
Image Handling	Multer (memory-based uploads)
Environment	dotenv
