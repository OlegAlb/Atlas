import { EmbeddingStore } from "../../storage/embeddings/embedding.store";
import { EmbeddingProvider } from "../../infrastructure/embedding/embedding.provider";
import { KnowledgeChunk } from "../../modules/knowledge/models/knowledge-chunk";

export class EmbeddingIndexer {
  constructor(
    private embeddingProvider: EmbeddingProvider,
    private embeddingStore: EmbeddingStore,
  ) {}

  async index(items: KnowledgeChunk[]) {
    const embeddings = await this.embeddingProvider.embedMany(
      items.map((item) => item.text),
    );

    const stored = items.map((item, index) => ({
      chunkId: item.id,
      embedding: embeddings[index],
    }));

    await this.embeddingStore.saveMany(stored);
  }
}
