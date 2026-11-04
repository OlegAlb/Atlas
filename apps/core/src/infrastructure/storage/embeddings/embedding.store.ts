import { Embedding } from "../../../providers/embedding/models/embedding.model";

export interface StoredEmbedding {
  chunkId: string;
  embedding: Embedding;
}

export interface EmbeddingStore {
  save(embedding: StoredEmbedding): Promise<void>;

  saveMany(embeddings: StoredEmbedding[]): Promise<void>;

  getByChunkId(chunkId: string): Promise<Embedding | null>;

  getAll(): Promise<StoredEmbedding[]>;
}
