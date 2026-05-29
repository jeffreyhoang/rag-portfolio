# RAG Portfolio Assistant — Claude Code Instructions

A personal AI assistant deployed on my portfolio website. Recruiters and
hiring managers can ask natural language questions and receive grounded,
cited answers pulled from my resume, project writeups, bio, and FAQ
documents. Built to demonstrate real-world RAG engineering skills.

**Stack:** Python 3.11 · FastAPI · LangChain · ChromaDB (dev) / Pinecone (prod)
· OpenAI `text-embedding-3-small` · `gpt-4o-mini` · React 18 · Vite · Tailwind CSS
**Deploy:** Railway (backend) · Vercel (frontend)
**Test runner:** pytest (backend) · Vitest (frontend)

---

## Project structure

```
rag-portfolio/
├── CLAUDE.md
├── .env                        # Never commit — backend secrets only
├── .env.example                # Committed backend template
├── backend/
│   ├── main.py                 # FastAPI app entry point — do not restructure
│   ├── routers/
│   │   └── chat.py             # POST /api/chat and GET /api/health endpoints
│   ├── services/
│   │   ├── chunker.py          # Document loading and chunking logic
│   │   ├── embedder.py         # Embedding model wrapper
│   │   ├── retriever.py        # Vector store query + hybrid search
│   │   ├── reranker.py         # Cross-encoder re-ranking
│   │   └── generator.py        # LLM prompt assembly and generation
│   ├── models/
│   │   └── schemas.py          # Pydantic request/response models
│   ├── ingest.py               # One-shot ingestion script (run manually)
│   ├── eval.py                 # ragas evaluation script (run manually)
│   ├── config.py               # Settings loaded from environment variables
│   └── tests/
│       ├── test_chunker.py
│       ├── test_embedder.py
│       ├── test_retriever.py
│       ├── test_reranker.py
│       ├── test_generator.py
│       └── test_routes.py
├── frontend/
│   ├── .env.local              # Never commit — frontend env only (VITE_API_URL)
│   ├── .env.example            # Committed frontend template
│   ├── index.html              # Vite HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx            # React entry point — mounts App
│       ├── App.jsx             # Root component — assembles all sections
│       ├── index.css           # Global styles and CSS variables
│       ├── assets/
│       │   └── avatar.jpg      # Profile photo — replace with real photo
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx       # Fixed top nav with smooth scroll
│       │   │   └── Footer.jsx       # Script logo, copyright, socials
│       │   ├── sections/
│       │   │   ├── Hero.jsx         # Name, avatar, bio, Resume + Connect btns
│       │   │   ├── Education.jsx    # Education cards
│       │   │   ├── Projects.jsx     # Featured projects grid
│       │   │   └── Connect.jsx      # Contact form + info cards
│       │   ├── chat/
│       │   │   ├── ChatAssistant.jsx  # Floating button + orchestrates chat
│       │   │   ├── ChatWindow.jsx     # Chat overlay window
│       │   │   ├── MessageBubble.jsx  # Single message with citations
│       │   │   ├── CitationCard.jsx   # Source pill component
│       │   │   └── InputBar.jsx       # Text input + send button
│       │   └── ui/
│       │       ├── StarField.jsx      # Animated canvas star background
│       │       ├── SectionTag.jsx     # Reusable "section label" component
│       │       └── Button.jsx         # Reusable button variants
│       ├── hooks/
│       │   ├── useChat.js        # Chat state, session, API calls
│       │   └── useScrollSpy.js   # Highlights active nav link on scroll
│       ├── api/
│       │   └── client.js         # All fetch calls to backend — never inline
│       └── constants/
│           └── content.js        # All static text content — projects, education,
                                  # bio, links. Never hardcode strings in components.
└── data/
    └── documents/              # Source .md, .pdf, .txt files for ingestion
```

---

## Frontend folder responsibilities

**`components/layout/`** — persistent UI that wraps every page: Navbar
and Footer. These never change between sections.

**`components/sections/`** — the four visible page sections in order:
Hero, Education, Projects, Connect. Each is a self-contained section
that reads its content from `constants/content.js`.

**`components/chat/`** — everything related to the AI assistant. Kept
separate from sections because the chat is a floating overlay, not a
page section. ChatAssistant is the parent that manages open/close state.
ChatWindow renders the conversation. MessageBubble renders one message.
CitationCard renders one source pill. InputBar renders the text input.

**`components/ui/`** — small, reusable primitive components used across
multiple sections. StarField, SectionTag, and Button belong here because
they are shared building blocks, not section-specific.

**`hooks/`** — custom React hooks only. No component logic here.
useChat owns all chat state, session ID, and API calls. useScrollSpy
tracks which section is visible to highlight the correct nav link.

**`api/client.js`** — the only file allowed to make fetch calls. All
components call functions exported from here. Never import fetch or
axios anywhere else.

**`constants/content.js`** — all static data: project names, descriptions,
tags, education details, bio text, links, social URLs. Components import
from here and never hardcode strings inline. This makes content updates
a single-file change.

---

## Python conventions

- **Type hints on every function signature** — parameters and return types.
- **Docstrings on every public function** — one-line summary minimum.
- Follow PEP 8. Max line length 88 characters (Black-compatible).
- Use `async def` for all FastAPI route handlers and any function that
  calls an external API (OpenAI, Pinecone).
- Use `httpx.AsyncClient` for any outbound HTTP — never `requests`.
- Use `loguru` for logging. Never use `print()` in non-script files.
- All settings (API keys, model names, chunk sizes, top-k values) are
  loaded via `config.py` using `pydantic-settings`. Never hardcode them.

---

## JavaScript / React conventions

- All components are functional with hooks — no class components.
- All files use `.jsx` for components and `.js` for hooks, utils, and
  non-component files. No TypeScript.
- Component files use PascalCase (`ChatWindow.jsx`).
- Hook files use camelCase prefixed with `use` (`useChat.js`).
- All static content (text, links, project data) lives in
  `constants/content.js` — never hardcode strings in components.
- All fetch / API calls go through `src/api/client.js` — never inline
  fetch calls inside components or hooks directly.
- Use Tailwind utility classes for layout and spacing. Use CSS variables
  defined in `index.css` for colors, fonts, and theme values.
- PropTypes are not required but document props with JSDoc comments on
  each component.
- No `var` — use `const` and `let` only.
- Use named exports for all components. No default exports except
  in `App.jsx` and `main.jsx`.

---

## Security rules — non-negotiable

- **Never hardcode API keys, tokens, or secrets anywhere** — not in
  source files, not in tests, not in comments.
- Backend secrets live in `.env` only. Never prefix them with VITE_.
- Frontend env variables live in `frontend/.env.local` only and must
  be prefixed with `VITE_` to be accessible in the browser.
- Both `.env` and `frontend/.env.local` are in `.gitignore`.
- `.env.example` and `frontend/.env.example` contain only placeholders.

---

## Testing rules

- Every new Python module in `services/` gets a corresponding test file
  in `backend/tests/`. Ask me if you are unsure what to test.
- Tests use `pytest` with `pytest-asyncio` for async functions.
- Mock all external API calls in tests — never make real OpenAI or
  Pinecone calls in the test suite. Use `pytest-mock` / `unittest.mock`.
- Frontend tests use Vitest + React Testing Library.
- Test file names mirror source file names: `chunker.py` →
  `test_chunker.py`.

---

## Error handling rules

- All calls to the OpenAI API must be wrapped in `try/except` with:
  - Specific exception catching (`openai.RateLimitError`,
    `openai.APIError`, etc.)
  - Logging the error with `loguru`
  - A graceful fallback or re-raise with a user-friendly message
- FastAPI route handlers must never let an unhandled exception reach
  the client — use `HTTPException` with appropriate status codes.
- The frontend must handle network errors and show a user-facing
  error state — never a blank screen or unformatted stack trace.

---

## LLM and RAG-specific rules

- The system prompt for the generator is defined in `generator.py`.
  Do not duplicate or inline it elsewhere.
- The generator must instruct the model to answer **only** from the
  provided context chunks, cite sources, and say "I don't have that
  information" if the answer isn't in context — never fabricate.
- Chunk size (default 512 tokens) and overlap (default 50 tokens) are
  config values in `config.py`, not magic numbers in `chunker.py`.
- Top-k retrieval count (default 10) and re-rank keep count (default 3)
  are also config values.
- The embedding model name (`text-embedding-3-small`) is a config value.
  Never hardcode model strings in service files.

---

## Files and folders that are off-limits

- **`backend/main.py`** — do not restructure or rename. Add routers
  by importing them, not by adding routes directly.
- **`data/documents/`** — read-only at runtime. The ingestion script
  reads from here; nothing writes to it programmatically.
- **`backend/ingest.py`** — only modify when explicitly asked.
- **`backend/eval.py`** — only modify when explicitly asked.
- **`.gitignore`** — do not modify without asking.
- **`frontend/src/api/client.js`** — all API wiring goes here. Do not
  add fetch calls elsewhere.
- **`frontend/src/constants/content.js`** — all static content goes
  here. Do not hardcode strings in components.

---

## Dependency rules

- Do not install new Python packages without asking first.
- Do not install new npm packages without asking first.
- If a new dependency is needed, explain why and wait for approval
  before running `pip install` or `npm install`.
- All Python dependencies are tracked in `requirements.txt`.
- All frontend dependencies are tracked in `frontend/package.json`.

---

## Commit message style

Use conventional commits:
- `feat: add hybrid BM25 + dense retrieval to retriever`
- `fix: handle empty context gracefully in generator`
- `chore: update requirements.txt`
- `test: add unit tests for chunker overlap logic`
- `refactor: extract re-ranking into standalone service`

---

## Environment variables reference

### Backend (.env)
```
OPENAI_API_KEY=
PINECONE_API_KEY=           # Only needed in production
PINECONE_INDEX_NAME=
CHROMA_PERSIST_DIR=./chroma_db
CHROMA_COLLECTION_NAME=portfolio
BM25_INDEX_PATH=./bm25_index.pkl
EMBEDDING_MODEL=text-embedding-3-small
GENERATION_MODEL=gpt-4o-mini
CHUNK_SIZE=512
CHUNK_OVERLAP=50
TOP_K_RETRIEVAL=10
TOP_K_RERANK=3
MEMORY_WINDOW_SIZE=10
EMBEDDING_BATCH_SIZE=100
CORS_ORIGINS=http://localhost:5173
```

### Frontend (frontend/.env.local)
```
VITE_API_URL=http://localhost:8000
```

---

## Development roadmap

### Phase 1 — Core backend pipeline ✅
- [x] `chunker.py` + `test_chunker.py`
- [x] `embedder.py` + `test_embedder.py`
- [x] `retriever.py` + `test_retriever.py`
- [x] `reranker.py` + `test_reranker.py`
- [x] `generator.py` + `test_generator.py`
- [x] `ingest.py` — documents ingested into ChromaDB

### Phase 2 — Quality improvements ✅
- [x] Multi-turn memory — ConversationMemory in generator.py
- [x] Query rewriting — rewrite_query() in generator.py
- [x] Eval script — eval.py with ragas metrics
- [ ] Hybrid search — deferred to Phase 4

### Phase 3 — API layer and frontend (current)
- [x] `routers/chat.py` + `test_routes.py`
- [ ] React frontend — all components, hooks, and API client
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Connect custom domain on portfolio site

### Phase 4 — Polish and resume differentiation (ongoing)
- [ ] Hybrid search — BM25 + dense retrieval + Reciprocal Rank Fusion
- [ ] LangSmith tracing — instrument pipeline, screenshot dashboard
- [ ] Chunking ablation — compare 256/512/1024 token chunk sizes
- [ ] Anonymous query logging — log questions, display query count
- [ ] Technical blog post — hybrid search write-up on personal site

---

## Current status

**Active phase:** Phase 3
**Completed:** Phase 1, Phase 2, routers/chat.py
**In progress:** React frontend
**Next:** Deploy to Railway + Vercel