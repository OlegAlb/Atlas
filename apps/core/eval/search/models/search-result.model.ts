import { RetrievedDocument } from "./retrieved-document.model";

export interface SearchResult {
  caseId: string;

  query: string;

  relevantDocuments: string[];

  retrievedDocuments: RetrievedDocument[];
}
