# RAG Portfolio Assistant — Claude Code Instructions

A personal AI assistant deployed on my portfolio website. Recruiters and
hiring managers can ask natural language questions and receive grounded,
cited answers pulled from my resume, project writeups, bio, and FAQ
documents. Built to demonstrate real-world RAG engineering skills.

**Stack:** Python 3.11 · FastAPI · LangChain · ChromaDB (dev) / Pinecone (prod)
· OpenAI `text-embedding-3-small` · `gpt-4o-mini` · React 18 · Tailwind CSS
**Deploy:** Railway (backend) · Vercel (frontend)
**Test runner:** pytest (backend) · Vitest (frontend)

---

## Project structure

```
rag-portfolio/
├── CLAUDE.md
├── .env                   # Never commit — all secrets live here
├── .env.example           # Committed template with placeholder values
├── backend/
│   ├── main.py            # FastAPI app entry point — do not restructure
│   ├── routers/
│   │   └── chat.py        # POST /chat and GET /health endpoints
│   ├── services/
│   │   ├── chunker.py     # Document loading and chunking logic
│   │   ├── embedder.py    # Embedding model wrapper
│   │   ├── retriever.py   # Vector store query + hybrid search
│   │   ├── reranker.py    # Cross-encoder re-ranking
│   │   └── generator.py   # LLM prompt assembly and generation
│   ├── models/
│   │   └── schemas.py     # Pydantic request/response models
│   ├── ingest.py          # One-shot ingestion script (run manually)
│   ├── config.py          # Settings loaded from environment variables
│   └── tests/
│       ├── test_chunker.py
│       ├── test_embedder.py
│       ├── test_retriever.py
│       ├── test_reranker.py
│       ├── test_generator.py
│       └── test_routes.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/    # One file per component
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── CitationCard.tsx
│   │   │   └── InputBar.tsx
│   │   ├── hooks/
│   │   │   └── useChat.ts
│   │   └── api/
│   │       └── client.ts  # All fetch calls to backend go here
│   └── tests/
└── data/
    └── documents/         # Source .md, .pdf, .txt files for ingestion
```

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

## TypeScript / React conventions

- All components are functional with hooks — no class components.
- Props interfaces are defined with TypeScript `interface`, not `type`.
- Component files use PascalCase (`ChatWindow.tsx`).
- Hook files use camelCase prefixed with `use` (`useChat.ts`).
- All `fetch` / API calls go through `src/api/client.ts` — never
  inline fetch calls inside components.
- Use Tailwind utility classes for styling — no separate CSS files
  unless absolutely necessary.
- No `any` types. Use `unknown` and narrow properly if needed.

---

## Security rules — non-negotiable

- **Never hardcode API keys, tokens, or secrets anywhere** — not in
  source files, not in tests, not in comments.
- All secrets are loaded from environment variables. Reference
  `config.py` for the canonical names.
- The `.env` file is in `.gitignore`. Never remove it from `.gitignore`.
- `.env.example` contains only placeholder strings like
  `OPENAI_API_KEY=your-key-here`. Keep it updated when adding new vars.

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
  error state, never a blank screen or unformatted stack trace.

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
- **`backend/ingest.py`** — only modify when explicitly asked. Running
  it re-embeds all documents and is not reversible without
  deleting the vector store.
- **`.gitignore`** — do not modify without asking.
- **`frontend/src/api/client.ts`** — all API wiring goes here. Do not
  add fetch calls elsewhere.

---

## Dependency rules

- Do not install new Python packages without asking first.
- Do not install new npm packages without asking first.
- If a new dependency is needed, explain why and wait for approval
  before running `pip install` or `npm install`.
- All Python dependencies are tracked in `requirements.txt` (not
  `pyproject.toml` for now). Update it after any install.

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

```
OPENAI_API_KEY=
PINECONE_API_KEY=           # Only needed in production
PINECONE_INDEX_NAME=
CHROMA_PERSIST_DIR=./chroma_db
EMBEDDING_MODEL=text-embedding-3-small
GENERATION_MODEL=gpt-4o-mini
CHUNK_SIZE=512
CHUNK_OVERLAP=50
TOP_K_RETRIEVAL=10
TOP_K_RERANK=3
CORS_ORIGINS=http://localhost:5173
```

---

## Development roadmap

### Phase 1 — Core backend pipeline (weeks 1–2)
Build and test each service in isolation before wiring anything together.
No API routes, no frontend yet.

- [ ] `chunker.py` — document loading (PDF, .md, .txt) + recursive character splitting
- [ ] `test_chunker.py`
- [ ] `embedder.py` — OpenAI embedding wrapper with batching
- [ ] `test_embedder.py`
- [ ] `retriever.py` — ChromaDB vector store, cosine similarity top-k retrieval
- [ ] `test_retriever.py`
- [ ] `reranker.py` — cross-encoder re-ranking (ms-marco-MiniLM-L-6-v2)
- [ ] `test_reranker.py`
- [ ] `generator.py` — prompt assembly, LLM call, citation formatting
- [ ] `test_generator.py`
- [ ] `ingest.py` — one-shot script to chunk, embed, and store all documents

### Phase 2 — Quality improvements (week 3)
Improve retrieval quality. All changes are in the service layer — no
new API routes needed.

- [ ] Hybrid search in `retriever.py` — add BM25 (rank-bm25) alongside
      dense retrieval, merge results with Reciprocal Rank Fusion
- [ ] Multi-turn memory — add `ConversationBufferWindowMemory` to
      `generator.py` so follow-up questions work correctly
- [ ] Query rewriting — before retrieval, ask the LLM to rephrase
      ambiguous questions into explicit search queries
- [ ] Eval script — `eval.py` runs 20 test questions through the full
      pipeline and reports ragas metrics (faithfulness, answer relevancy,
      context precision, context recall)

### Phase 3 — API layer and frontend (week 4)
Wire the services into a working application with a deployable UI.

- [ ] `routers/chat.py` — `POST /chat` (query endpoint) and
      `GET /health` (returns vector store document count)
- [ ] `test_routes.py` — integration tests for both endpoints
- [ ] React frontend — `ChatWindow`, `MessageBubble`, `CitationCard`,
      `InputBar` components + `useChat` hook + `api/client.ts`
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Connect custom domain on portfolio site

### Phase 4 — Polish and resume differentiation (ongoing)
These additions make the project stand out beyond a tutorial clone.

- [ ] LangSmith tracing — instrument every retrieval and generation step,
      screenshot the trace dashboard for the portfolio README
- [ ] Chunking ablation — run an experiment comparing chunk sizes
      (256 / 512 / 1024 tokens), document results in README as a table
- [ ] Anonymous query logging — log questions (no PII) to measure
      engagement; display a query count on the portfolio page
- [ ] Technical blog post — 500-word write-up on the hybrid search
      decision, published on personal site or Medium

---

## Current status

**Active phase:** Phase 1
**Completed:** chunker.py, embedder.py, retriever.py, reranker.py, generator.py
and all their tests
**In progress:** ingest.py