import { Embedding } from "../models/embedding.model";

export interface EmbeddingProvider {
  embed(text: string): Promise<Embedding>;

  embedMany(texts: string[]): Promise<Embedding[]>;
}
