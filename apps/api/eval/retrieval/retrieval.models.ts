import { RetrievalTrace } from "../../src/engines/retrieval/observability/retrieval.trace";

export interface RetrievedDocument {
  id: string;
  score: number;
}

export interface RetrievalCase {
  id: string;
  query: string;
  relevantDocuments: string[];
}

export interface RetrievalResult {
  caseId: string;

  query: string;

  relevantDocuments: string[];

  retrievedDocuments: RetrievedDocument[];
}
