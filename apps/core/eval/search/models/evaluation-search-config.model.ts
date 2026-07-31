export type SearchType = "hybrid" | "dense" | "bm25";

export type RerankerType = "noop" | "jina" | "reverse";

export interface EvaluationSearchConfig {
  search: SearchType;

  reranker: RerankerType;
}
