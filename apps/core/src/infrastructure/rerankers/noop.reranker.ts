import { KnowledgeSearchResult } from "../../domain/knowledge/models/knowledge-search-result";
import { Reranker } from "./reranker";

export class NoopReranker implements Reranker {
  async rerank(
    query: string,
    results: KnowledgeSearchResult[],
    limit = results.length,
  ) {
    return results.slice(0, limit);
  }
}
