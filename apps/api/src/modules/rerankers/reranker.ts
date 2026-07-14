import { KnowledgeSearchResult } from "../knowledge/knowledge.types";

export interface Reranker {
  rerank(
    query: string,
    results: KnowledgeSearchResult[],
    limit?: number,
  ): Promise<KnowledgeSearchResult[]>;
}
