import {
  RerankingProvider,
  RerankingRequest,
  RerankingResponse,
} from "./reranking.provider";

export class NoopRerankingProvider implements RerankingProvider {
  async rerank({
    documents,
    limit,
  }: RerankingRequest): Promise<RerankingResponse> {
    return {
      results: documents.slice(0, limit).map((_, index) => ({
        index,
        score: 1,
      })),
    };
  }
}
