import { env } from "../../config/env";
import { EmbeddingProvider } from "./providers/embedding.provider";
import { FakeEmbeddingProvider } from "./providers/fake.embedding.provider";
import { JinaEmbeddingProvider } from "./providers/jina.embedding.provider";

type EmbeddingProviderType = "jina" | "noop";

export function createEmbeddingProvider(
  type: EmbeddingProviderType = env.EMBEDDING_PROVIDER,
): EmbeddingProvider {
  switch (type) {
    case "jina":
      if (!env.EMBEDDING_API_KEY) {
        throw new Error("Jina API key is required");
      }

      return new JinaEmbeddingProvider({
        apiKey: env.EMBEDDING_API_KEY,
        model: env.EMBEDDING_MODEL,
      });

    case "noop":
      return new FakeEmbeddingProvider();

    default:
      throw new Error(
        `Unsupported embedding provider: ${env.EMBEDDING_PROVIDER}`,
      );
  }
}
