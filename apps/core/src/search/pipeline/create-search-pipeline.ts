import { SearchTracer } from "../observability/search.trace";
import { QueryProcessor } from "../query/query.processor";
import { Reranker } from "../reranking/reranker";
import { Retriever } from "../retrievers/retriever";
import { SearchPipeline } from "./pipeline";
import { QueryExpansionStep } from "./steps/query-expansion.step";
import { RerankerStep } from "./steps/reranker.step";
import { RetrieverStep } from "./steps/retriever.step";

export function createSearchPipeline(
  retriever: Retriever,
  reranker: Reranker,
  processor: QueryProcessor,
  tracer: SearchTracer,
) {
  const queryExpansionStep = new QueryExpansionStep(processor);

  const retrieverStep = new RetrieverStep(retriever, tracer);

  const rerankerStep = new RerankerStep(reranker, tracer);

  return new SearchPipeline([queryExpansionStep, retrieverStep, rerankerStep]);
}
