import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";

export interface RetrievalContext {
  query: string;

  keywordResults: KnowledgeSearchResult[];

  finalResults: KnowledgeSearchResult[];
}
