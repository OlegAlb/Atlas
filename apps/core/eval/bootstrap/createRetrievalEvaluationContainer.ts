import { EmbeddingIndexer } from "../../src/application/knowledge/indexing/embedding.indexer";

import { KnowledgeIndexer } from "../../src/application/knowledge/indexing/knowledge.indexer";
import { KnowledgeIngestionUseCase } from "../../src/application/knowledge/knowledge.ingestion.usecase";
import { MetadataMerger, RecursiveChunker } from "../../src/chunking";
import {
  createTokenizer,
  TokenizerType,
} from "../../src/chunking/tokenizer/tokenizer.factory";
import { InMemoryChunkStore } from "../../src/infrastructure/storage/chunks/in-memory.chunk.store";
import { InMemoryDocumentStore } from "../../src/infrastructure/storage/documents/in-memory.document.store";
import { InMemoryEmbeddingStore } from "../../src/infrastructure/storage/embeddings/in-memory.embedding.store";
import { InMemoryEmbeddingCache } from "../../src/providers/embedding/cache/in-memory.embedding.cache";
import { createEmbeddingProvider } from "../../src/providers/embedding/embedding.factory";
import { SearchDependencies } from "../../src/search/factories/search.dependencies";
import { SearchTracer } from "../../src/search/observability/search.trace";
import { QueryProcessor } from "../../src/search/query/query.processor";
import { createReranker } from "../../src/search/reranking/create-reranker";
import { InMemoryBM25Indexer } from "../../src/search/retrievers/bm25/in-memory-bm25.indexer";
import { EvaluationSearchConfig } from "../search/models/evaluation-search-config.model";

export interface RetrievalEvaluationContainer {
  knowledgeIngestionUseCase: KnowledgeIngestionUseCase;
  searchDependencies: SearchDependencies;
}

export function createRetrievalEvaluationContainer(
  config: EvaluationSearchConfig,
): RetrievalEvaluationContainer {
  const documentStore = new InMemoryDocumentStore();

  const chunkStore = new InMemoryChunkStore();

  const processor = new QueryProcessor();

  const tracer = new SearchTracer();

  const embeddingProvider =
    config.search === "bm25"
      ? createEmbeddingProvider("noop")
      : createEmbeddingProvider();

  const embeddingStore = new InMemoryEmbeddingStore();

  const bm25Indexer = new InMemoryBM25Indexer();

  const tokenizer = createTokenizer(TokenizerType.GPT);

  const metadataMerger = new MetadataMerger();

  const chunker = new RecursiveChunker(tokenizer, metadataMerger);

  const embeddingCache = new InMemoryEmbeddingCache();

  const embeddingIndexer = new EmbeddingIndexer(
    embeddingProvider,
    embeddingStore,
    embeddingCache,
  );

  const knowledgeIndexer = new KnowledgeIndexer(embeddingIndexer, bm25Indexer);

  const knowledgeIngestionUseCase = new KnowledgeIngestionUseCase(
    documentStore,
    chunkStore,
    chunker,
    knowledgeIndexer,
  );

  const reranker = createReranker(config.reranker);

  return {
    knowledgeIngestionUseCase,

    searchDependencies: {
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
