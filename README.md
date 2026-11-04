# Atlas

[![CI](https://github.com/OlegAlb/Atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/OlegAlb/Atlas/actions/workflows/ci.yml)

**English** · [Русский](README.ru.md)

A small RAG knowledge engine: ingest company documents, chunk them, index them
with BM25 and embeddings, retrieve with a hybrid pipeline, rerank the candidates,
and answer questions with an LLM.

The interesting part is not the LLM call — it is the retrieval layer and the
evaluation harness around it.

> **Status: experimental, not maintained.**
> Development stopped in August 2026. The RAG knowledge-base market turned out to
> be crowded with much stronger products, and I could not find a niche where this
> would be viable. The code is published as a reference implementation of a
> retrieval pipeline and its benchmark, not as a product.

## What is implemented

- **Ingestion** — source document → loader → parser → `KnowledgeDocument` → chunker → indexer
- **Chunking** — recursive splitter with separator hierarchy, token-based sizing (tiktoken) and overlap
- **Retrieval** — BM25 (in-memory), dense (cosine over embeddings), hybrid with RRF fusion
- **Reranking** — provider abstraction with `noop`, `reverse` and Jina reranker
- **Providers** — LLM (Groq), embeddings (Jina), reranking (Jina), each behind an interface
- **API** — Fastify: `GET /health`, `POST/GET /knowledge/documents`, `POST /chat`
- **Evaluation** — recall@k, MRR, nDCG on two labeled datasets, plus an ingestion eval

## Architecture

```
Documents
    │
    ▼
DocumentLoader → DocumentParser → KnowledgeDocument
    │
    ▼
RecursiveChunker → KnowledgeChunk[]
    │
    ├──► BM25Indexer      (in-memory inverted index)
    └──► EmbeddingIndexer (Jina / noop, cached)
    │
    ▼
SearchPipeline
    query expansion → retriever (bm25 | dense | hybrid+RRF) → reranker
    │
    ▼
ChatUseCase → LLM (Groq)
```

Layers follow one direction: `api → application → domain`, with infrastructure
and providers injected through `apps/core/src/bootstrap/createContainer.ts`.
No framework magic, no decorators — just constructors.

## Quick start

Works without any API keys: embeddings and reranking default to deterministic
`noop` providers, so ingestion, retrieval and the whole evaluation run locally
and for free.

```bash
npm install
cp .env.example .env      # optional, defaults are key-free

npm run dev               # http://localhost:3000
curl http://localhost:3000/health
```

Ingest a document and search it:

```bash
curl -X POST http://localhost:3000/knowledge/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Оплата заказа","content":"Оплатить заказ можно картой, через СБП или наличными при получении."}'

curl http://localhost:3000/knowledge/documents
```

`POST /chat` additionally needs an LLM key (`LLM_API_KEY` in `.env`); the LLM
provider has no `noop` mode.

### Real providers

Set in `.env`:

| Provider     | Model                        | Env                                    |
| ------------ | ---------------------------- | -------------------------------------- |
| Embeddings   | `jina-embeddings-v5-text-small` | `EMBEDDING_PROVIDER=jina` + `EMBEDDING_API_KEY` |
| Reranking    | `jina-reranker-v3`           | `RERANKING_PROVIDER=jina` + `RERANKING_API_KEY` |
| LLM          | `openai/gpt-oss-120b` (Groq) | `LLM_API_KEY`                          |

## Evaluation

Metrics at **k = 5**. The NFCorpus benchmark data is not stored in the repository
— download it once into a gitignored file:

```bash
npm run fetch:data    # downloads NFCorpus test split, ~6 MB, verifies the labels

npm run eval          # ingestion + retrieval, noop providers, no keys needed
npm run eval:bm25     # BM25 only
npm run eval:jina     # with the Jina reranker (needs RERANKING_API_KEY)
```

Without `fetch:data` the `regression` dataset still works; only `hard` needs it,
and the runner tells you so explicitly.

### `regression` — 30 support articles (Russian), 51 hand-labeled queries

| Retrieval      | Reranker           | Recall@5 | MRR   | nDCG@5 |
| -------------- | ------------------ | -------- | ----- | ------ |
| BM25           | noop               | 0.510    | 0.438 | 0.457  |
| dense          | noop               | 0.941    | 0.840 | 0.866  |
| hybrid (RRF)   | noop               | 0.941    | 0.656 | 0.727  |
| BM25           | jina-reranker-v3   | 0.510    | 0.454 | 0.468  |
| hybrid (RRF)   | jina-reranker-v3   | 0.961    | 0.824 | 0.859  |
| dense          | jina-reranker-v3   | 0.941    | 0.830 | 0.859  |

### `hard` — NFCorpus test split, 3,633 abstracts, 323 labeled queries

| Retrieval | Reranker | Recall@5 | MRR   | nDCG@5 |
| --------- | -------- | -------- | ----- | ------ |
| BM25      | noop     | 0.554    | 0.475 | 0.271  |

What the numbers say:

- BM25 alone is weak on Russian: no stemming or language-aware tokenization, so
  exact-form matching only. Dense retrieval nearly doubles recall.
- Hybrid RRF improves recall but **hurts MRR** (0.656 vs 0.840 for dense alone):
  fusing two rankers without reranking pulls weak BM25 hits up the list.
- A cross-encoder reranker repairs that — hybrid goes 0.656 → 0.824 MRR — but it
  costs an API round-trip per query.
- On NFCorpus, nDCG@5 = 0.271 is in the expected range for a plain BM25
  baseline (published NFCorpus BM25 nDCG@10 ≈ 0.325).

> Note: an earlier version of the evaluator had a `break` in its case loop, so
> every config reported a perfect `1.000` computed on a single query. The numbers
> above are from the fixed evaluator over the full query set.

## Tests

```bash
npm test
```

38 unit tests, about a second, no network and no API keys:

- **metrics** — nDCG / recall@k / MRR on empty results, `k` beyond the list,
  unreachable relevant documents, cases without judgments
- **chunker** — word preservation, original boundaries, sequential order, and
  the actual overlap contract between neighbouring chunks
- **BM25** — document frequency and average length after incremental updates,
  scoring direction, and that rebuilding really resets the index
- **reranker** — an empty candidate list must not reach the provider (a real
  crash: the API rejected an empty `documents` array with 422)
- **evaluator** — must score every case, not the first one (regression test for
  the bug described above)

Unit tests and benchmarks answer different questions: the benchmark says whether
retrieval got better or worse, the tests say whether the pieces still behave as
contracted. The `break` bug lived *inside* the benchmark — it happily reported a
perfect score, and no evaluation run could have caught it.

## Known limitations

- Storage is in-memory: restart loses documents, chunks and indexes
- PostgreSQL/pgvector persistence was never implemented — the stub files were removed
- Only plain-text ingestion; no PDF/DOCX/HTML
- No auth, no rate limiting, no request validation error mapping
- No end-to-end test of the HTTP layer or of the real provider clients

## Stack

TypeScript, Node.js, Fastify, Zod, tiktoken, Vitest, BM25, RRF, Jina, Groq.

## License

MIT
