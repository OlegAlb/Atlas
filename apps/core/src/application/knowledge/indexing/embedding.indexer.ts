import { KnowledgeChunk } from "../../../chunking/models/knowledge-chunk";
import { EmbeddingStore } from "../../../infrastructure/storage/embeddings/embedding.store";
import { EmbeddingCache } from "../../../providers/embedding/cache/embedding.cache";
import { EmbeddingProvider } from "../../../providers/embedding/providers/embedding.provider";

export class EmbeddingIndexer {
  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly embeddingStore: EmbeddingStore,
    private readonly embeddingCache: EmbeddingCache,
  ) {}

  async index(items: KnowledgeChunk[]) {
    const texts = items.map((item) => item.text);

    const cachedEmbeddings = await this.embeddingCache.getMany(texts);

    const missing = cachedEmbeddings
      .map((embedding, index) => ({
        index,
        text: texts[index],
        embedding,
      }))
      .filter((item) => item.embedding == null);

    if (missing.length > 0) {
      const generated = await this.embeddingProvider.embedMany(
        missing.map((m) => m.text),
      );

      if (generated.length !== missing.length) {
        throw new Error(
          `Embedding provider returned ${generated.length} embeddings, expected ${missing.length}`,
        );
      }

      await this.embeddingCache.setMany(
        missing.map((m, index) => ({
          text: m.text,
          embedding: generated[index],
        })),
      );

      missing.forEach((m, index) => {
        cachedEmbeddings[m.index] = generated[index];
      });
    }

    const stored = items.map((item, index) => {
      const embedding = cachedEmbeddings[index];

      if (!embedding) {
        throw new Error(`Embedding for chunk "${item.id}" is missing.`);
      }

      return {
        chunkId: item.id,
        embedding,
      };
    });

    await this.embeddingStore.saveMany(stored);
  }
}
