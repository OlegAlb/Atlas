import { createSearchPipeline } from "../pipeline/create-search-pipeline";
import { SearchEngine } from "../search.engine";
import { createDenseRetriever } from "./create-dense-retriever";
import { SearchDependencies } from "./search.dependencies";

export function createDenseSearchEngine(deps: SearchDependencies) {
  return new SearchEngine(
    createSearchPipeline(
      createDenseRetriever(deps),
      deps.reranker,
      deps.processor,
      deps.tracer,
    ),
  );
}
