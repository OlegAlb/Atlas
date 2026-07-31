import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import { SearchTrace } from "../observability/search.trace";

export interface SearchContext {
  query: string;
  queryTokens: string[];
  results: KnowledgeSearchResult[];
  trace: SearchTrace;

  rewrittenQuery?: string;
}
