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

## Retrieval Engine

Status: partially completed

Implemented:

- Dense retrieval abstraction
- BM25 retrieval
- Hybrid retrieval
- Fusion strategies
- Retrieval pipeline
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
- No retrieval quality metrics