import { EmbeddingIndexer } from "../../src/infrastructure/embedding/embedding.indexer";

import { KnowledgeIngestionUseCase } from "../../src/application/knowledge/knowledge.ingestion.usecase";
import { RetrievalDependencies } from "../../src/retrieval/factories/retrieval.dependencies";
import { InMemoryDocumentStore } from "../../src/infrastructure/storage/documents/in-memory.document.store";
import { InMemoryChunkStore } from "../../src/infrastructure/storage/chunks/in-memory.chunk.store";
import { QueryProcessor } from "../../src/retrieval/query/query.processor";
import { RetrievalTracer } from "../../src/retrieval/observability/retrieval.trace";
import { createNoopReranker } from "../../src/infrastructure/rerankers/reranker.factory";
import { createEmbeddingProvider } from "../../src/infrastructure/embedding/embedding.factory";
import { InMemoryEmbeddingStore } from "../../src/infrastructure/storage/embeddings/in-memory.embedding.store";
import { InMemoryBM25Indexer } from "../../src/retrieval/retrievers/bm25/in-memory-bm25.indexer";
import { createTokenizer, TokenizerType } from "../../src/chunking/tokenizer/tokenizer.factory";
import { MetadataMerger, RecursiveChunker } from "../../src/chunking";
import { KnowledgeIndexer } from "../../src/application/knowledge/knowledge.indexer";

export interface RetrievalEvaluationContainer {
  knowledgeIngestionUseCase: KnowledgeIngestionUseCase;
  retrievalDependencies: RetrievalDependencies;
}

export function createRetrievalEvaluationContainer(): RetrievalEvaluationContainer {
  const documentStore = new InMemoryDocumentStore();

  const chunkStore = new InMemoryChunkStore();

  const processor = new QueryProcessor();

  const tracer = new RetrievalTracer();

  const reranker = createNoopReranker();

  const embeddingProvider = createEmbeddingProvider();

  const embeddingStore = new InMemoryEmbeddingStore();

  const bm25Indexer = new InMemoryBM25Indexer();

  const tokenizer = createTokenizer(TokenizerType.GPT);

  const metadataMerger = new MetadataMerger();

  const chunker = new RecursiveChunker(tokenizer, metadataMerger);

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
    embeddingStore
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
