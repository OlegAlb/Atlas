# Atlas Current State

## Overview

Atlas is a knowledge engine for company information.
The goal is to ingest various sources of company knowledge, index them,
and provide accurate answers using RAG.

Current version target: v0.1

---

# Completed

## Document Pipeline

Status: completed

Implemented:

- SourceDocument abstraction
- Document loaders
- Document parsers
- KnowledgeDocument model
- TextPiece model
- RecursiveChunker
- ChunkCandidate generation
- Document ingestion flow
- Document eval pipeline

Pipeline:

SourceDocument
|
v
DocumentLoader
|
v
DocumentParser
|
v
KnowledgeDocument
|
v
Chunker
|
v
KnowledgeChunk
|
v
Indexer

---

## Chunking

Status: completed

Implemented:

- RecursiveChunker
- CharacterTokenizer
- TokenChunkSizer
- Metadata propagation
- Chunk eval cases

Current approach:

- recursive splitting
- separator based chunking
- overlap support

---

## SearchEngine

Status: partially completed

Implemented:

- Dense retrieval abstraction
- BM25 retrieval
- Hybrid retrieval
- Fusion strategies
- SearchEngine pipeline
- Query processing
- Reranker abstraction

Not completed:

- production vector storage
- cross encoder implementation
- retrieval evaluation
- production tuning

---

# Current limitations

- Storage is mostly in-memory
- Embeddings are not persisted in pgvector
- No production document formats except plain text

# Evaluation

Retrieval quality is measured on two datasets (see `README.md` for the numbers):

- `regression` — 30 support articles in Russian, 51 queries, hand-labeled
- `hard` — NFCorpus test split: 3,633 abstracts, 323 labeled queries

Run `npm run eval` for the free noop configuration, or pass `--reranker=jina`
and set `EMBEDDING_PROVIDER=jina` for the real providers.
