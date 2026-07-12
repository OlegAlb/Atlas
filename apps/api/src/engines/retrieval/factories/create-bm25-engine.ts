import { createRetrievalPipeline } from "../pipeline/create-retrieval-pipeline";
import { RetrievalEngine } from "../retrieval.engine";
import { createRetrievers } from "./create-retrievers";
import { RetrievalDependencies } from "./retrieval.dependencies";

export function createBM25RetrievalEngine(deps: RetrievalDependencies) {
  const { bm25Retriever } = createRetrievers(deps);

  return new RetrievalEngine(
    createRetrievalPipeline(bm25Retriever, deps.processor),
  );
}
