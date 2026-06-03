# RAG Portfolio Assistant

A production-deployed AI assistant that lives on my portfolio website. Recruiters and hiring managers can ask natural language questions and receive grounded, cited answers pulled directly from my resume, project writeups, and bio documents. Built end-to-end to demonstrate real-world RAG engineering — from document ingestion to deployed API to React frontend.

**Stack:** Python · FastAPI · LangChain · ChromaDB · Pinecone · OpenAI API · React · Tailwind CSS  
**Deploy:** Railway (backend) · Vercel (frontend)

---

## How It Works

### Ingestion Pipeline
Documents in `data/documents/` are loaded, chunked, embedded, and stored in a vector database once — before the app runs.

```
data/documents/
    ├── projects/*.md
    ├── experience/*.md
    └── faq.md
         │
         ▼
   DocumentLoader          loads .pdf, .md, .txt files
         │
         ▼
    TextChunker             splits into 512-token chunks with 50-token overlap
         │
         ▼
     Embedder               converts each chunk → vector via text-embedding-3-small
         │
         ▼
    VectorStore             stores chunks + vectors in ChromaDB (dev) / Pinecone (prod)
```

Run once with:
```bash
python -m backend.ingest
```

---

### Retrieval & Generation Pipeline
Every time a user sends a message, the full pipeline runs:

```
User Query
    │
    ▼
Query Rewriter              rephrases vague questions into precise search queries (gpt-4o-mini)
    │
    ▼
Retriever                   embeds the rewritten query, fetches top-10 similar chunks from vector store
    │
    ▼
Reranker                    cross-encoder (ms-marco-MiniLM-L-6-v2) rescores and keeps top-3 chunks
    │
    ▼
Generator                   assembles chunks + conversation history → grounded prompt → gpt-4o-mini
    │
    ▼
Response { answer, sources }
```

The generator is instructed to answer **only** from retrieved context and cite sources inline. If the answer isn't in the context, it responds with "I don't have that information" rather than fabricating.

Multi-turn memory is maintained via a sliding window of the last 10 conversation turns, passed to the generator on each request.

---

## Project Structure

```
rag-portfolio/
├── backend/
│   ├── main.py                 # FastAPI app — registers router with /api prefix
│   ├── config.py               # All settings loaded from .env via pydantic-settings
│   ├── ingest.py               # One-shot ingestion script — run manually
│   ├── routers/
│   │   └── chat.py             # POST /api/chat and GET /api/health endpoints
│   ├── services/
│   │   ├── chunker.py          # Document loading and recursive character splitting
│   │   ├── embedder.py         # Batched OpenAI embedding wrapper
│   │   ├── retriever.py        # ChromaDB / Pinecone vector store query
│   │   ├── reranker.py         # Cross-encoder reranking with sentence-transformers
│   │   └── generator.py        # Query rewriting, prompt assembly, LLM generation, memory
│   ├── models/
│   │   └── schemas.py          # Pydantic request/response models
│   └── tests/                  # pytest test suite — all external calls mocked
│
├── frontend/
│   └── src/
│       ├── App.jsx             # Root component — assembles all sections
│       ├── api/
│       │   └── client.js       # All fetch calls to backend live here
│       ├── hooks/
│       │   └── useChat.js      # Chat state, session ID, send/receive logic
│       ├── components/
│       │   ├── chat/           # ChatAssistant, ChatWindow, MessageBubble, InputBar, CitationCard
│       │   ├── pages/          # Hero, Education, Skills, Projects, Connect, Footer
│       │   └── ui/             # Reusable primitives — Button, SectionTitle, Sparkles
│       └── constants/
│           └── content.js      # All static text content — never hardcoded in components
│
└── data/
    └── documents/              # Source files for ingestion — resume, projects, experience, faq
```

---

## Running Locally

**Backend**
```bash
# 1. Create and activate virtual environment
python -m venv .venv && source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and fill in environment variables
cp .env.example .env

# 4. Ingest documents into ChromaDB
python -m backend.ingest

# 5. Start the API server
uvicorn backend.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local   # set VITE_API_URL=http://localhost:8000
npm run dev
```

---

## Live Demo

[View Portfolio →](#) *(link coming soon)*
