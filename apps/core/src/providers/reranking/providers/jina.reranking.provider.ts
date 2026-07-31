import axios from "axios";
import {
  RerankingProvider,
  RerankingRequest,
  RerankingResponse,
} from "./reranking.provider";

interface JinaRerankResponse {
  results: Array<{
    index: number;
    relevance_score: number;
  }>;
}

export class JinaRerankingProvider implements RerankingProvider {
  constructor(
    private readonly config: {
      apiKey: string;
      model: string;
    },
  ) {}

  async rerank({
    query,
    documents,
    limit,
  }: RerankingRequest): Promise<RerankingResponse> {
    try {
      const { data } = await axios.post<JinaRerankResponse>(
        "https://api.jina.ai/v1/rerank",
        {
          model: this.config.model,
          query,
          top_n: limit,
          documents: documents.map((document) => document.text),
          return_documents: false,
          max_doc_length: 2048,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        results: data.results.map((result) => ({
          index: result.index,
          score: result.relevance_score,
        })),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Jina status:", error.response?.status);
        console.error("Jina response:", error.response?.data);
      }

      throw error;
    }
  }
}
