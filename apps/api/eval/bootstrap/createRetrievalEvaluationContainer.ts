import { EmbeddingIndexer } from "../../src/engines/embeddings/embedding.indexer";
import { RetrievalDependencies } from "../../src/engines/retrieval/factories/retrieval.dependencies";
import { RetrievalTracer } from "../../src/engines/retrieval/observability/retrieval.trace";
import { QueryProcessor } from "../../src/engines/retrieval/query/query.processor";
import { InMemoryBM25Indexer } from "../../src/engines/retrieval/retrievers/bm25/in-memory-bm25.indexer";
import { createEmbeddingProvider } from "../../src/infrastructure/embedding/embedding.factory";
import { MetadataMerger, RecursiveChunker } from "../../src/modules/chunking";
import { createTokenizer, TokenizerType } from "../../src/modules/chunking/tokenizer/tokenizer.factory";
import { KnowledgeIndexer } from "../../src/modules/knowledge/knowledge.indexer";
import { KnowledgeIngestionUseCase } from "../../src/modules/knowledge/knowledge.ingestion.usecase";
import { createNoopReranker } from "../../src/modules/rerankers/reranker.factory";
import { InMemoryChunkStore } from "../../src/storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../../src/storage/documents/in-memory.documents.store";
import { InMemoryEmbeddingStore } from "../../src/storage/embeddings/in-memory.embedding.store";

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
