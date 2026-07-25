import { KnowledgeSearchResult } from "../../domain/knowledge/models/knowledge-search-result";
import { RetrievalTrace } from "../observability/retrieval.trace";

export interface RetrievalContext {
  query: string;
  queryTokens: string[];
  results: KnowledgeSearchResult[];
  trace: RetrievalTrace;

  rewrittenQuery?: string;
}
