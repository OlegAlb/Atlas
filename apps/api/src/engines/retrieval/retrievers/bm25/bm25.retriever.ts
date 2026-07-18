import { KnowledgeSearchResult } from "../../../../modules/knowledge/models/knowledge-search-result";
import { ChunkStore } from "../../../../storage/chunks/chunk.store";
import { DocumentStore } from "../../../../storage/documents/documents.store";
import { RetrievalContext } from "../../pipeline/context";
import { Retriever } from "../retriever";
import { BM25Indexer } from "./bm25.indexer";
import { BM25Scorer } from "./bm25.scorer";
import { tokenize } from "./bm25.utils";

export class BM25Retriever implements Retriever {
  constructor(
    private readonly chunkStore: ChunkStore,
    private readonly documentStore: DocumentStore,
    private readonly index: BM25Indexer,
    private readonly scorer: BM25Scorer,
  ) {}

  async retrieve(context: RetrievalContext, limit = 3) {
    const query = context.queryTokens?.length
      ? context.queryTokens
      : tokenize(context.query);

    const results: KnowledgeSearchResult[] = [];

    const index = this.index.getIndex();

    for (const item of index.documents) {
      const score = this.scorer.score(query, item, index);

      if (score <= 0) {
        continue;
      }

      const chunk = await this.chunkStore.getById(item.id);

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
        source: "bm25",
      });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }
}
