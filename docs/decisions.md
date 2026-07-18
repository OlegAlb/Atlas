# Architecture Decisions

## ADR-001

Date:

Decision:

Documents are separated into SourceDocument and KnowledgeDocument.

Reason:

SourceDocument represents raw input.
KnowledgeDocument represents parsed internal representation.

---

## ADR-002

Decision:

Chunking is separated from document parsing.

Reason:

Different formats require different parsing,
but chunking operates on normalized text pieces.

---

## ADR-003

Decision:

RepositoryLoader, EmailLoader and ChatLoader are postponed until v0.2.

Reason:

First production version focuses on file/url based knowledge ingestion.

---

## ADR-004

Decision:

Cross encoder reranking is postponed.

Reason:

Need retrieval evaluation before adding expensive ranking stage.

---

## ADR-005

Decision:

Hybrid retrieval is preferred over vector-only retrieval.

Reason:

Corporate knowledge contains identifiers,
names and exact matches where BM25 performs better.
