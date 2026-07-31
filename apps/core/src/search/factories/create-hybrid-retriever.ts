import { RRFFusion } from "../fusion/rrf.fusion";
import { HybridRetriever } from "../retrievers/hybrid.retriever";
import { createBM25Retriever } from "./create-bm25-retriever";
import { createDenseRetriever } from "./create-dense-retriever";
import { SearchDependencies } from "./search.dependencies";

export function createHybridRetriever(dependencies: SearchDependencies) {
  const bm25Retriever = createBM25Retriever(dependencies);

  const denseRetriever = createDenseRetriever(dependencies);

  return new HybridRetriever(
    [
      {
        name: "bm25",
        retriever: bm25Retriever,
      },
      {
        name: "dense",
        retriever: denseRetriever,
      },
    ],
    new RRFFusion(),
    dependencies.tracer,
  );
}
