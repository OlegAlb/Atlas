import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";
import { RetrievalContext } from "../pipeline/context";

export interface NamedRetriever {
  name: string;
  retriever: Retriever;
}

export interface Retriever {
  retrieve(
    context: RetrievalContext,
    limit?: number,
  ): Promise<KnowledgeSearchResult[]>;
}
