import { KnowledgeSearchResult } from "../knowledge/knowledge.types";
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
