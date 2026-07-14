import { createRetrievalPipeline } from "../pipeline/create-retrieval-pipeline";
import { RetrievalEngine } from "../retrieval.engine";
import { createRetrievers } from "./create-retrievers";
import { RetrievalDependencies } from "./retrieval.dependencies";

export function createDenseRetrievalEngine(deps: RetrievalDependencies) {
  const { denseRetriever } = createRetrievers(deps);

  return new RetrievalEngine(
    createRetrievalPipeline(
      denseRetriever,
      deps.reranker,
      deps.processor,
      deps.tracer,
    ),
  );
}
