import { KnowledgeSearchResult } from "../../../modules/knowledge/knowledge.types";

export interface Retriever {
  retrieve(query: string, limit?: number): Promise<KnowledgeSearchResult[]>;
}
