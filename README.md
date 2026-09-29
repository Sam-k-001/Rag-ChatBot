# 🏎️ F1 RAG ChatBot

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Astra DB](https://img.shields.io/badge/DataStax_AstraDB-Vector-orange?style=for-the-badge)](https://astra.datastax.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An end-to-end Retrieval-Augmented Generation (RAG) chatbot application built with **Next.js (App Router)**, **TypeScript**, and **Astra DB Vector Database**. The system retrieves context-specific Formula 1 knowledge from web-scraped embeddings and streams answers in real-time.

---

## 📌 Architecture & Workflow

1. **Ingestion & Seeding:** Web pages are scraped, cleaned, and split into overlapping 512-character semantic chunks using LangChain text splitters.
2. **Vector Embeddings:** Each chunk is converted into high-dimensional vector embeddings using OpenAI (`text-embedding-3-small`) and indexed into DataStax Astra DB.
3. **Retrieval & RAG Pipeline:** Incoming user queries are embedded on demand and matched against indexed chunks using vector similarity (`dot_product` / cosine).
4. **Streaming Inference:** Relevant context chunks are combined with system prompts and streamed word-by-word back to the client interface using the Vercel AI SDK data-stream protocol.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Vector Database:** DataStax Astra DB (Serverless Vector Search)
- **Embeddings & LLM:** OpenAI API (`text-embedding-3-small`, `gpt-4`) / Compatible with Groq & LLaMA 3
- **Streaming & Client State:** Vercel AI SDK (`ai/react`, `useChat`)
- **Scraping & Preprocessing:** Custom text scrapers & LangChain Recursive Character Text Splitter

---

## 📂 Project Structure

\`\`\`text
Rag-ChatBot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Streaming POST endpoint & vector lookup logic
│   ├── assets/                   # Logos, static icons, and graphics
│   ├── components/               # Modular UI components
│   │   ├── Bubble.tsx            # Chat message bubble (User / Assistant styling)
│   │   ├── LoadingBubble.tsx     # Animated streaming typing indicator
│   │   ├── PromptSuggestionButton.tsx
│   │   └── PromptSuggestionsRow.tsx
│   ├── global.css                # Base styling & animations
│   ├── layout.tsx                # Next.js Root Layout & metadata
│   └── page.tsx                  # Main chat view & useChat hook logic
├── scripts/
│   └── loadDb.ts                 # Database seeding & vector ingestion script
├── .env.example                  # Environment configuration template
├── package.json
└── tsconfig.json
\`\`\`

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

\`\`\`bash
git clone https://github.com/Sam-k-001/Rag-ChatBot.git
cd Rag-ChatBot
npm install --legacy-peer-deps
\`\`\`

### 2. Environment Configuration

Copy the example environment configuration:

\`\`\`bash
cp .env.example .env
\`\`\`

Populate `.env` with your Astra DB credentials and API keys.

### 3. Seed the Vector Database

Run the ingestion script to scrape target URLs, generate vector embeddings, and store them in Astra DB:

\`\`\`bash
npm run seed
\`\`\`

### 4. Start the Application

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.
