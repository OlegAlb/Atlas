export interface RetrievedDocument {
  id: string;
  title: string;
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
