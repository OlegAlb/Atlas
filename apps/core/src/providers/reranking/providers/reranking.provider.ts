export interface RerankingResult {
  index: number;
  score: number;
}

export interface RerankingDocument {
  id: string;
  text: string;
}

export interface RerankingRequest {
  query: string;
  documents: RerankingDocument[];
  limit?: number;
}

export interface RerankingResponse {
  results: RerankingResult[];
}

export interface RerankingProvider {
  rerank(request: RerankingRequest): Promise<RerankingResponse>;
}
