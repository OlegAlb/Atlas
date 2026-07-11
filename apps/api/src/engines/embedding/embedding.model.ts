import { Embedding } from "./embedding";

export interface EmbeddingModel {
  embed(text: string): Promise<Embedding>;
}
