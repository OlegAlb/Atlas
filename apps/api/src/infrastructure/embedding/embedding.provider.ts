export interface Embedding {
  values: number[];
  model?: string;
  dimensions?: number;
}

export interface EmbeddingProvider {
  embed(text: string): Promise<Embedding>;

  embedMany(texts: string[]): Promise<Embedding[]>;
}
