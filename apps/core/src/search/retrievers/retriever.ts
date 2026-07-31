import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import { SearchContext } from "../pipeline/context";

export interface NamedRetriever {
  name: string;
  retriever: Retriever;
}

export interface Retriever {
  retrieve(
    context: SearchContext,
    limit?: number,
  ): Promise<KnowledgeSearchResult[]>;
}
