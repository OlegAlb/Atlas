import { RerankerType } from "../../../eval/search/models/evaluation-search-config.model";
import { env } from "../../config/env";
import { NoopRerankingProvider } from "../../providers/reranking/providers/noop.reranking.provider";
import { JinaRerankingProvider } from "../../providers/reranking/providers/jina.reranking.provider";
import { ProviderReranker } from "./provider.reranker";
import { Reranker } from "./reranker";
import { ReverseRerankingProvider } from "../../providers/reranking/providers/reverse.reranking.provider";

export function createReranker(
  type: RerankerType = env.RERANKING_PROVIDER,
): Reranker {
  switch (type) {
    case "jina":
      return new ProviderReranker(
        new JinaRerankingProvider({
          apiKey: env.RERANKING_API_KEY,
          model: env.RERANKING_MODEL,
        }),
      );

    case "reverse":
      return new ProviderReranker(new ReverseRerankingProvider());

    case "noop":
      return new ProviderReranker(new NoopRerankingProvider());

    default:
      throw new Error(`Unsupported reranker: ${type}`);
  }
}
