import { createRetrievalPipeline } from "../pipeline/create-retrieval-pipeline";
import { RetrievalEngine } from "../retrieval.engine";
import { createRetrievers } from "./create-retrievers";
import { RetrievalDependencies } from "./retrieval.dependencies";

export function createHybridRetrievalEngine(deps: RetrievalDependencies) {
  const { hybridRetriever } = createRetrievers(deps);

  return new RetrievalEngine(
    createRetrievalPipeline(hybridRetriever, deps.processor),
  );
}
