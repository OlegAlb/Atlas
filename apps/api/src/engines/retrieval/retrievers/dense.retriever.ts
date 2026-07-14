import { EmbeddingProvider } from "../../../infrastructure/embedding/embedding.provider";
import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { ChunkStore } from "../../../storage/chunks/chunk.store";
import { DocumentStore } from "../../../storage/documents/document.store";
import { EmbeddingStore } from "../../../storage/embeddings/embedding.store";
import { Similarity } from "../../embeddings/similarity/similarity";
import { RetrievalContext } from "../pipeline/context";
import { Retriever } from "./retriever";

export class DenseRetriever implements Retriever {
  constructor(
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly embeddingStore: EmbeddingStore,
    private readonly chunkStore: ChunkStore,
    private readonly documentStore: DocumentStore,
    private readonly similarity: Similarity,
  ) {}

  async retrieve(
    context: RetrievalContext,
    limit = 3,
  ): Promise<KnowledgeSearchResult[]> {
    const query = context.rewrittenQuery ?? context.query;

    const queryEmbedding = await this.embeddingProvider.embed(query);

    const embeddings = await this.embeddingStore.getAll();

    const results: KnowledgeSearchResult[] = [];

    for (const item of embeddings) {
      const score = this.similarity.calculate(queryEmbedding, item.embedding);

      const chunk = await this.chunkStore.getById(item.chunkId);

      if (!chunk) {
        continue;
      }

      const document = await this.documentStore.getById(chunk.documentId);

      if (!document) {
        continue;
      }

      results.push({
        chunk,
        document,
        score,
        source: "dense",
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
