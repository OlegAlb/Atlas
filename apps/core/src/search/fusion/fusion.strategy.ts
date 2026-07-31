import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";

export interface FusionStrategy {
  fuse(
    results: KnowledgeSearchResult[][],
    limit?: number,
  ): KnowledgeSearchResult[];
}
