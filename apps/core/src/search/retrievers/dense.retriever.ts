import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import { ChunkStore } from "../../infrastructure/storage/chunks/chunk.store";
import { DocumentStore } from "../../infrastructure/storage/documents/document.store";
import { EmbeddingStore } from "../../infrastructure/storage/embeddings/embedding.store";
import { EmbeddingProvider } from "../../providers/embedding/providers/embedding.provider";
import { Similarity } from "../../providers/embedding/similarity/similarity";
import { SearchContext } from "../pipeline/context";
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
    context: SearchContext,
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

    // console.table(
    //   results
    //     .sort((a, b) => b.score - a.score)
    //     .slice(0, 10)
    //     .map((item) => ({
    //       title: item.document.title,
    //       score: item.score,
    //       cosine: item.score,
    //       text: item.chunk.text.substring(0, 60),
    //     })),
    // );

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
