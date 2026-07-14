import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { RetrievalTrace } from "../observability/retrieval.trace";

export interface RetrievalContext {
  query: string;
  queryTokens: string[];
  results: KnowledgeSearchResult[];
  trace: RetrievalTrace;

  rewrittenQuery?: string;

}
