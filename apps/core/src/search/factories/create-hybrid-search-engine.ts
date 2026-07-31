import { createSearchPipeline } from "../pipeline/create-search-pipeline";
import { SearchEngine } from "../search.engine";
import { createHybridRetriever } from "./create-hybrid-retriever";
import { SearchDependencies } from "./search.dependencies";

export function createHybridSearchEngine(deps: SearchDependencies) {
  return new SearchEngine(
    createSearchPipeline(
      createHybridRetriever(deps),
      deps.reranker,
      deps.processor,
      deps.tracer,
    ),
  );
}
