import { Embedding } from "../models/embedding.model";
import { EmbeddingProvider } from "./embedding.provider";

interface JinaEmbeddingProviderConfig {
  apiKey: string;
  model: string;
}

interface JinaEmbeddingResponse {
  data: {
    index: number;
    embedding: number[];
  }[];
}

export class JinaEmbeddingProvider implements EmbeddingProvider {
  constructor(private readonly config: JinaEmbeddingProviderConfig) {}

  async embed(text: string): Promise<Embedding> {
    const embeddings = await this.embedMany([text]);

    return embeddings[0];
  }

  async embedMany(texts: string[]): Promise<Embedding[]> {
    const response = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",

      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: this.config.model,
        input: texts,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Jina embedding failed: ${response.status} ${await response.text()}`,
      );
    }

    const data = (await response.json()) as JinaEmbeddingResponse;

    return data.data
      .sort((a, b) => a.index - b.index)
      .map((item) => ({
        values: item.embedding,
        model: this.config.model,
      }));
  }
}
