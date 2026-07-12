import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";

export interface FusionStrategy {
  fuse(results: KnowledgeSearchResult[][]): KnowledgeSearchResult[];
}
