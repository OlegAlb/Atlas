import { RetrievalTracer } from "../observability/retrieval.trace";
import { createRetrievalPipeline } from "../pipeline/create-retrieval-pipeline";
import { RetrievalEngine } from "../retrieval.engine";
import { createRetrievers } from "./create-retrievers";
import { RetrievalDependencies } from "./retrieval.dependencies";

export function createHybridRetrievalEngine(deps: RetrievalDependencies) {
  const { hybridRetriever } = createRetrievers(deps);

  const tracer = new RetrievalTracer();

  const pipeline = createRetrievalPipeline(
    hybridRetriever,
    deps.reranker,
    deps.processor,
    tracer,
  );

  return new RetrievalEngine(pipeline);
}
