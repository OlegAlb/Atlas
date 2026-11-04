import { KnowledgeSearchResult } from "../../domain/search/models/knowledge-search-result";
import { RerankingProvider } from "../../providers/reranking/providers/reranking.provider";
import { Reranker } from "./reranker";

export class ProviderReranker implements Reranker {
  constructor(private readonly provider: RerankingProvider) {}

  async rerank(query: string, results: KnowledgeSearchResult[], limit = 5) {
    if (results.length === 0) {
      return [];
    }

    const response = await this.provider.rerank({
      query,
      limit,
      documents: results.map((result) => ({
        id: result.chunk.id,
        text: result.chunk.text,
      })),
    });

    return response.results.map((result) => results[result.index]);
  }
}
