import { Embedding } from "../../engines/embedding/embedding";

export interface StoredEmbedding {
  chunkId: string;
  embedding: Embedding;
}

export interface EmbeddingStore {
  save(chunkId: string, embedding: Embedding): Promise<void>;

  getByChunkId(chunkId: string): Promise<Embedding | null>;

  getAll(): Promise<StoredEmbedding[]>;
}
