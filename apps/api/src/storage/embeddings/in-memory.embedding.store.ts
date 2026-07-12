import { Embedding } from "../../engines/embedding/embedding";
import { EmbeddingStore } from "./embedding.store";

export class InMemoryEmbeddingStore implements EmbeddingStore {
  private readonly embeddings = new Map<string, Embedding>();

  async save(chunkId: string, embedding: Embedding) {
    this.embeddings.set(chunkId, embedding);
  }

  async getByChunkId(chunkId: string) {
    return this.embeddings.get(chunkId) ?? null;
  }

  async getAll() {
    return [...this.embeddings.entries()].map(([chunkId, embedding]) => ({
      chunkId,
      embedding,
    }));
  }
}
