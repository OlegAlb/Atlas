import {
  RerankingProvider,
  RerankingRequest,
  RerankingResponse,
} from "./reranking.provider";

export class ReverseRerankingProvider implements RerankingProvider {
  async rerank({ documents }: RerankingRequest): Promise<RerankingResponse> {
    return {
      results: documents
        .map((_, index) => ({
          index,
          score: index,
        }))
        .reverse(),
    };
  }
}
