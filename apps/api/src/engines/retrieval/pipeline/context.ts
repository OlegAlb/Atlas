import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";

export interface RetrievalContext {
  query: string;

  queryTokens: string[];

  rewrittenQuery?: string;

  results: KnowledgeSearchResult[];
}
