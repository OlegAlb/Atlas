import { KnowledgeSearchResult } from "../../domain/knowledge/models/knowledge-search-result";

export interface Reranker {
  rerank(
    query: string,
    results: KnowledgeSearchResult[],
    limit?: number,
  ): Promise<KnowledgeSearchResult[]>;
}
