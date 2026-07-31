import { Embedding } from "../models/embedding.model";

export interface EmbeddingCache {
  get(text: string): Promise<Embedding | null>;

  set(text: string, embedding: Embedding): Promise<void>;

  getMany(texts: string[]): Promise<(Embedding | null)[]>;

  setMany(
    items: {
      text: string;
      embedding: Embedding;
    }[],
  ): Promise<void>;
}
