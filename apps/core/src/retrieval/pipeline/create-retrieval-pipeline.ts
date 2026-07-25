import { Reranker } from "../../../modules/rerankers/reranker";
import { RetrievalTracer } from "../observability/retrieval.trace";
import { QueryProcessor } from "../query/query.processor";
import { Retriever } from "../retrievers/retriever";
import { RetrievalPipeline } from "./pipeline";
import { QueryExpansionStep } from "./steps/query-expansion.step";
import { RerankerStep } from "./steps/reranker.step";
import { RetrieverStep } from "./steps/retriever.step";

export function createRetrievalPipeline(
  retriever: Retriever,
  reranker: Reranker,
  processor: QueryProcessor,
  tracer: RetrievalTracer,
) {
  const queryExpansionStep = new QueryExpansionStep(processor);

  const retrieverStep = new RetrieverStep(retriever, tracer);

  const rerankerStep = new RerankerStep(reranker, tracer);

  return new RetrievalPipeline([
    queryExpansionStep,
    retrieverStep,
    rerankerStep,
  ]);
}
