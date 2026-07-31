import { BM25Indexer } from "../../application/knowledge/indexing/bm25.indexer";
import { ChunkStore } from "../../infrastructure/storage/chunks/chunk.store";
import { DocumentStore } from "../../infrastructure/storage/documents/document.store";
import { EmbeddingStore } from "../../infrastructure/storage/embeddings/embedding.store";
import { EmbeddingProvider } from "../../providers/embedding/providers/embedding.provider";
import { SearchTracer } from "../observability/search.trace";
import { QueryProcessor } from "../query/query.processor";
import { Reranker } from "../reranking/reranker";

export interface SearchDependencies {
  processor: QueryProcessor;

  tracer: SearchTracer;

  reranker: Reranker;

  documentStore: DocumentStore;

  chunkStore: ChunkStore;

  embeddingProvider: EmbeddingProvider;

  embeddingStore: EmbeddingStore;

  bm25Indexer: BM25Indexer;
}
