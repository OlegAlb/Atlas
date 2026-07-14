import { EmbeddingProvider } from "../../../infrastructure/embedding/embedding.provider";
import { Reranker } from "../../../modules/rerankers/reranker";
import { ChunkStore } from "../../../storage/chunks/chunk.store";
import { DocumentStore } from "../../../storage/documents/document.store";
import { EmbeddingStore } from "../../../storage/embeddings/embedding.store";
import { RetrievalTracer } from "../observability/retrieval.trace";
import { QueryProcessor } from "../query/query.processor";
import { BM25Indexer } from "../retrievers/bm25/bm25.indexer";

export interface RetrievalDependencies {
  processor: QueryProcessor;

  tracer: RetrievalTracer;

  reranker: Reranker;

  documentStore: DocumentStore;

  chunkStore: ChunkStore;

  embeddingProvider: EmbeddingProvider;

  embeddingStore: EmbeddingStore;

  bm25Indexer: BM25Indexer;
}
