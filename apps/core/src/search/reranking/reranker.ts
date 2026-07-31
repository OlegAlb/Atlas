import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";

export interface Reranker {
  rerank(
    query: string,
    results: KnowledgeSearchResult[],
    limit?: number,
  ): Promise<KnowledgeSearchResult[]>;
}
