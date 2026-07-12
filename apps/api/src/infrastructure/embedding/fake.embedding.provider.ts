import { Embedding, EmbeddingProvider } from "./embedding.provider";

export class FakeEmbeddingProvider implements EmbeddingProvider {
  constructor(private readonly dimensions = 128) {}

  async embed(text: string): Promise<Embedding> {
    const values = new Array(this.dimensions).fill(0);

    for (const word of text.toLowerCase().split(/\s+/)) {
      const index = this.hash(word) % this.dimensions;

      values[index]++;
    }

    return {
      values,
    };
  }

  async embedMany(texts: string[]) {
    return Promise.all(texts.map((text) => this.embed(text)));
  }

  private hash(text: string): number {
    let hash = 0;

    for (const char of text) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }

    return hash;
  }
}
