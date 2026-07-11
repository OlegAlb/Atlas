import { EmbeddingStore } from "../../storage/embeddings/embedding.store";
import { EmbeddingModel } from "./embedding.model";

export interface EmbeddingIndexItem {
  id: string;
  text: string;
}

export class EmbeddingIndexService {
  constructor(
    private embeddingModel: EmbeddingModel,
    private embeddingStore: EmbeddingStore,
  ) {}

  async index(items: EmbeddingIndexItem[]) {
    for (const chunk of items) {
      const embedding = await this.embeddingModel.embed(chunk.text);

      await this.embeddingStore.save(chunk.id, embedding);
    }
  }
}
