import { createSearchPipeline } from "../pipeline/create-search-pipeline";
import { SearchEngine } from "../search.engine";
import { createBM25Retriever } from "./create-bm25-retriever";
import { SearchDependencies } from "./search.dependencies";

export function createBM25SearchEngine(deps: SearchDependencies) {
  return new SearchEngine(
    createSearchPipeline(
      createBM25Retriever(deps),
      deps.reranker,
      deps.processor,
      deps.tracer,
    ),
  );
}
