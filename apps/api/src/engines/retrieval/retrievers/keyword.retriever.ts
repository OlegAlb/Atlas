import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { ChunkStore } from "../../../storage/chunks/chunk.store";
import { DocumentStore } from "../../../storage/documents/document.store";
import { RetrievalContext } from "../pipeline/context";
import { KeywordScorer } from "../scoring/keyword.scorer";
import { Retriever } from "./retriever";

export class KeywordRetriever implements Retriever {
  constructor(
    private readonly chunkStore: ChunkStore,
    private readonly documentStore: DocumentStore,
    private readonly scorer: KeywordScorer,
  ) {}

  async retrieve(context: RetrievalContext, limit = 3) {
    const queryWords = context.queryTokens ?? [];

    const chunks = await this.chunkStore.list();

    const results: KnowledgeSearchResult[] = [];

    for (const chunk of chunks) {
      const document = await this.documentStore.getById(chunk.documentId);

      if (!document) {
        continue;
      }

      const score = this.scorer.score(queryWords, document.title, chunk.text);

      if (score > 0) {
        results.push({
          chunk,
          document,
          score,
          source: "keyword",
        });
      }
    }

    return results
      .filter((item) => item.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
