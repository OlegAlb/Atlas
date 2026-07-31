import { Embedding } from "../models/embedding.model";
import { EmbeddingCache } from "./embedding.cache";

export class InMemoryEmbeddingCache implements EmbeddingCache {
  private cache = new Map<string, Embedding>();

  async get(text: string) {
    return this.cache.get(text) ?? null;
  }

  async set(text: string, embedding: Embedding) {
    this.cache.set(text, embedding);
  }

  async getMany(texts: string[]) {
    return texts.map((t) => this.cache.get(t) ?? null);
  }

  async setMany(items: { text: string; embedding: Embedding }[]) {
    for (const item of items) {
      this.cache.set(item.text, item.embedding);
    }
  }
}
