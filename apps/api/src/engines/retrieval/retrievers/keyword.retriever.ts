import { DocumentStore } from "../../../storage/documents/document.store";
import { Retriever } from "./retriever";
import { QueryProcessor } from "../query/query.processor";
import { KeywordScorer } from "../scoring/keyword.scorer";
import { ChunkStore } from "../../../storage/chunks/chunk.store";
import { RetrievalContext } from "../pipeline/context";

export class KeywordRetriever implements Retriever {
  constructor(
    private readonly chunkStore: ChunkStore,
    private readonly documentStore: DocumentStore,
    private readonly processor: QueryProcessor,
    private readonly scorer: KeywordScorer,
  ) {}

  async retrieve(context: RetrievalContext, limit = 3) {
    const chunks = await this.chunkStore.list();

    const results = [];

    for (const chunk of chunks) {
      const document = await this.documentStore.getById(chunk.documentId);

      if (!document) {
        continue;
      }

      const score = this.scorer.score(
        context.queryTokens,
        document.title,
        chunk.text,
      );

      if (score > 0) {
        results.push({
          chunk,
          document,
          score,
        });
      }
    }

    return results
      .filter((item) => item.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
