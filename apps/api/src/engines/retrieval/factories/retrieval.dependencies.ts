import { EmbeddingProvider } from "../../../infrastructure/embedding/embedding.provider";
import { ChunkStore } from "../../../storage/chunks/chunk.store";
import { DocumentStore } from "../../../storage/documents/document.store";
import { EmbeddingStore } from "../../../storage/embeddings/embedding.store";
import { Similarity } from "../../embeddings/similarity/similarity";
import { FusionStrategy } from "../fusion/fusion.strategy";
import { QueryProcessor } from "../query/query.processor";
import { BM25Indexer } from "../retrievers/bm25/bm25.indexer";
import { BM25Scorer } from "../retrievers/bm25/bm25.scorer";

export interface RetrievalDependencies {
  processor: QueryProcessor;

  documentStore: DocumentStore;
  chunkStore: ChunkStore;

  embeddingProvider: EmbeddingProvider;
  embeddingStore: EmbeddingStore;

  bm25Indexer: BM25Indexer;

  similarity: Similarity;
  fusion: FusionStrategy;
  bm25Scorer: BM25Scorer;
}
