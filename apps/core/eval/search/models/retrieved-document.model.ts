export interface RetrievedDocument {
  id: string;

  title: string;

  score: number;

  metadata?: {
    retrieverScore?: number;
    rerankerScore?: number;
  };
}
