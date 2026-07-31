import { createBM25Retriever } from "../../src/search/factories/create-bm25-retriever";
import { createDenseRetriever } from "../../src/search/factories/create-dense-retriever";
import { createHybridRetriever } from "../../src/search/factories/create-hybrid-retriever";
import { SearchDependencies } from "../../src/search/factories/search.dependencies";
import { createSearchPipeline } from "../../src/search/pipeline/create-search-pipeline";
import { createReranker } from "../../src/search/reranking/create-reranker";
import { SearchEngine } from "../../src/search/search.engine";
import { EvaluationSearchConfig } from "./models/evaluation-search-config.model";

export function createEvaluationSearchEngine(
  config: EvaluationSearchConfig,
  deps: SearchDependencies,
) {
  const retrievers = {
    bm25: createBM25Retriever(deps),
    dense: createDenseRetriever(deps),
    hybrid: createHybridRetriever(deps),
  };

  const retriever = retrievers[config.search];

  const reranker = createReranker(config.reranker);

  return new SearchEngine(
    createSearchPipeline(retriever, reranker, deps.processor, deps.tracer),
  );
}
