import { env } from "../../config/env";
import { EmbeddingProvider } from "./provider/embedding.provider";
import { FakeEmbeddingProvider } from "./provider/fake.embedding.provider";
import { JinaEmbeddingProvider } from "./provider/jina.embedding.provider";

export function createEmbeddingProvider(): EmbeddingProvider {
  switch (env.EMBEDDING_PROVIDER) {
    case "jina":
      if (!env.EMBEDDING_API_KEY) {
        throw new Error("Jina API key is required");
      }

      return new JinaEmbeddingProvider({
        apiKey: env.EMBEDDING_API_KEY,
        model: env.EMBEDDING_MODEL,
      });

    case "fake":
      return new FakeEmbeddingProvider();

    default:
      throw new Error(
        `Unsupported embedding provider: ${env.EMBEDDING_PROVIDER}`,
      );
  }
}
