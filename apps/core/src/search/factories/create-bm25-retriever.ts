import { BM25Retriever } from "../retrievers/bm25/bm25.retriever";
import { BM25Scorer } from "../retrievers/bm25/bm25.scorer";
import { SearchDependencies } from "./search.dependencies";

export function createBM25Retriever(dependencies: SearchDependencies) {
  return new BM25Retriever(
    dependencies.chunkStore,
    dependencies.documentStore,
    dependencies.bm25Indexer,
    new BM25Scorer(),
  );
}
