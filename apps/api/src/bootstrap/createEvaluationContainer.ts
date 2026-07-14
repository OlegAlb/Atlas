import { FixedSizeChunker } from "../modules/chunking/fixed-size.chunker";
import { KnowledgeIngestionUseCase } from "../modules/knowledge/knowledge.ingestion.usecase";

import { EmbeddingIndexer } from "../engines/embeddings/embedding.indexer";
import { RetrievalDependencies } from "../engines/retrieval/factories/retrieval.dependencies";
import { RetrievalTracer } from "../engines/retrieval/observability/retrieval.trace";
import { QueryProcessor } from "../engines/retrieval/query/query.processor";
import { InMemoryBM25Indexer } from "../engines/retrieval/retrievers/bm25/in-memory-bm25.indexer";
import { createEmbeddingProvider } from "../infrastructure/embedding/embedding.factory";
import { KnowledgeIndexer } from "../modules/knowledge/knowledge.indexer";
import { InMemoryChunkStore } from "../storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../storage/documents/in-memory.document.store";
import { InMemoryEmbeddingStore } from "../storage/embeddings/in-memory.embedding.store";
import { NoopReranker } from "../modules/rerankers/noop.reranker";
import { createNoopReranker } from "../modules/rerankers/reranker.factory";

export interface EvaluationContainer {
  knowledgeIngestionUseCase: KnowledgeIngestionUseCase;
  retrievalDependencies: RetrievalDependencies;
}

export function createEvaluationContainer(): EvaluationContainer {
  const documentStore = new InMemoryDocumentStore();

  const chunkStore = new InMemoryChunkStore();

  const processor = new QueryProcessor();

  const tracer = new RetrievalTracer();

  const reranker = createNoopReranker();

  const embeddingProvider = createEmbeddingProvider();

  const embeddingStore = new InMemoryEmbeddingStore();

  const bm25Indexer = new InMemoryBM25Indexer();

  const chunker = new FixedSizeChunker();

  const embeddingIndexer = new EmbeddingIndexer(
    embeddingProvider,
    embeddingStore,
  );

  const knowledgeIndexer = new KnowledgeIndexer(embeddingIndexer, bm25Indexer);

  const knowledgeIngestionUseCase = new KnowledgeIngestionUseCase(
    documentStore,
    chunkStore,
    chunker,
    knowledgeIndexer,
  );

  return {
    knowledgeIngestionUseCase,

    retrievalDependencies: {
      processor,
      tracer,
      reranker,

      documentStore,
      chunkStore,

      embeddingProvider,
      embeddingStore,

      bm25Indexer,
    },
  };
}
