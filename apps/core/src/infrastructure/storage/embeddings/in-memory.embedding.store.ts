import { Embedding } from "../../../providers/embedding/models/embedding.model";
import { EmbeddingStore } from "./embedding.store";

export interface StoredEmbedding {
  chunkId: string;
  embedding: Embedding;
}

export class InMemoryEmbeddingStore implements EmbeddingStore {
  private embeddings = new Map<string, Embedding>();

  async save(item: StoredEmbedding) {
    this.embeddings.set(item.chunkId, item.embedding);
  }

  async saveMany(items: StoredEmbedding[]): Promise<void> {
    for (const item of items) {
      this.embeddings.set(item.chunkId, item.embedding);
    }
  }

  async getByChunkId(chunkId: string): Promise<Embedding | null> {
    return this.embeddings.get(chunkId) ?? null;
  }

  async getAll(): Promise<StoredEmbedding[]> {
    return Array.from(this.embeddings.entries()).map(
      ([chunkId, embedding]) => ({
        chunkId,
        embedding,
      }),
    );
  }
}
