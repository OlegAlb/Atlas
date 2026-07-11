import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";

export interface RetrievalContext {
  query: string;

  transformedQuery: string;

  queryTokens: string[];

  keywordResults: KnowledgeSearchResult[];

  denseResults: KnowledgeSearchResult[];

  finalResults: KnowledgeSearchResult[];
}
